/**
 * 极简评论 API
 * GET  `/api/comments?slug=<path>` — 获取评论列表
 * POST `/api/comments` body: { slug, content, nickname } — 提交评论
 * GET  `/api/comments?action=list` — 管理员：列出所有 slug 及评论数
 * GET  `/api/comments?action=list&slug=<path>` — 管理员：获取某页评论
 * DELETE `/api/comments` body: { token, slug, id? } — 管理员：删除评论
 *
 * 存储使用 Redis (node-redis)，通过 REDIS_URL 环境变量连接
 * 本地开发时若未配置 REDIS_URL 则降级为内存存储
 */

import { createClient } from 'redis'

let redisClient = null
let redisReady = false

async function getRedis() {
  if (redisReady && redisClient) return redisClient
  if (!process.env.REDIS_URL) return null

  try {
    redisClient = createClient({ url: process.env.REDIS_URL })
    redisClient.on('error', (err) => {
      console.error('Redis connection error:', err)
      redisReady = false
    })
    await redisClient.connect()
    redisReady = true
    return redisClient
  } catch (err) {
    console.error('Redis init error:', err)
    redisReady = false
    return null
  }
}

const memoryStore = new Map()

const MAX_CONTENT_LENGTH = 2000
const MAX_NICKNAME_LENGTH = 20
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_S = 60
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'blog-admin-2024'

function sanitize(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\n/g, '<br/>')
}

async function getComments(slug) {
  const redis = await getRedis()
  if (redis) {
    const items = await redis.lRange(`comments:${slug}`, 0, -1)
    return items.map((i) => (typeof i === 'string' ? JSON.parse(i) : i))
  }
  return memoryStore.get(slug) || []
}

async function addComment(slug, comment) {
  const redis = await getRedis()
  if (redis) {
    await redis.rPush(`comments:${slug}`, JSON.stringify(comment))
    return
  }
  const list = memoryStore.get(slug) || []
  list.push(comment)
  memoryStore.set(slug, list)
}

async function deleteComment(slug, id) {
  const redis = await getRedis()
  if (redis) {
    const items = await redis.lRange(`comments:${slug}`, 0, -1)
    const parsed = items.map((i) => (typeof i === 'string' ? JSON.parse(i) : i))
    const filtered = parsed.filter((c) => c.id !== id)
    if (filtered.length === 0) {
      await redis.del(`comments:${slug}`)
    } else {
      await redis.del(`comments:${slug}`)
      await redis.rPush(`comments:${slug}`, ...filtered.map((c) => JSON.stringify(c)))
    }
    return true
  }
  const list = memoryStore.get(slug) || []
  memoryStore.set(slug, list.filter((c) => c.id !== id))
  return true
}

async function deleteAllComments(slug) {
  const redis = await getRedis()
  if (redis) {
    await redis.del(`comments:${slug}`)
    return
  }
  memoryStore.delete(slug)
}

async function listAllSlugs() {
  const redis = await getRedis()
  if (redis) {
    const keys = await redis.keys('comments:*')
    const slugs = keys.map((k) => k.replace('comments:', ''))
    const result = []
    for (const slug of slugs) {
      const count = await redis.lLen(`comments:${slug}`)
      result.push({ slug, count })
    }
    return result
  }
  const result = []
  for (const [slug, list] of memoryStore.entries()) {
    result.push({ slug, count: list.length })
  }
  return result
}

async function checkRateLimit(ip) {
  const key = `ratelimit:${ip}`
  const redis = await getRedis()
  if (redis) {
    const count = await redis.incr(key)
    if (count === 1) {
      await redis.expire(key, RATE_LIMIT_WINDOW_S)
    }
    return count <= RATE_LIMIT_MAX
  }
  const now = Date.now()
  const entry = memoryStore.get(key)
  if (!entry || now - entry.time > RATE_LIMIT_WINDOW_S * 1000) {
    memoryStore.set(key, { time: now, count: 1 })
    return true
  }
  entry.count++
  return entry.count <= RATE_LIMIT_MAX
}

function verifyAdmin(token) {
  return token === ADMIN_TOKEN
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // DELETE - 管理员删除评论
  if (req.method === 'DELETE') {
    const { token, slug, id } = req.body || {}

    if (!verifyAdmin(token)) {
      return res.status(403).json({ error: '无效的管理令牌' })
    }

    if (!slug) {
      return res.status(400).json({ error: 'Missing slug' })
    }

    if (id) {
      await deleteComment(slug, id)
      return res.status(200).json({ success: true, message: '评论已删除' })
    } else {
      await deleteAllComments(slug)
      return res.status(200).json({ success: true, message: '该页面所有评论已删除' })
    }
  }

  // GET
  if (req.method === 'GET') {
    const { slug, action } = req.query

    // 管理模式
    if (action === 'list') {
      const authHeader = req.headers.authorization
      const token = authHeader?.replace('Bearer ', '')
      if (!verifyAdmin(token)) {
        return res.status(403).json({ error: '无效的管理令牌' })
      }

      if (slug) {
        const comments = await getComments(slug)
        return res.status(200).json({ slug, comments })
      }
      const slugs = await listAllSlugs()
      return res.status(200).json({ slugs })
    }

    // 普通模式
    if (!slug) {
      return res.status(400).json({ error: 'Missing slug' })
    }
    const comments = await getComments(slug)
    return res.status(200).json({ comments })
  }

  // POST - 提交评论
  if (req.method === 'POST') {
    const ip =
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.headers['x-real-ip'] ||
      'unknown'

    const allowed = await checkRateLimit(ip)
    if (!allowed) {
      return res.status(429).json({ error: '操作太频繁，请稍后再试' })
    }

    const { slug, content, nickname } = req.body || {}

    if (!slug || !content || !content.trim()) {
      return res.status(400).json({ error: 'Slug and content are required' })
    }

    if (content.length > MAX_CONTENT_LENGTH) {
      return res.status(400).json({ error: `内容不能超过 ${MAX_CONTENT_LENGTH} 字` })
    }

    const comment = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      slug,
      content: sanitize(content.trim()),
      nickname: sanitize((nickname || '').trim().slice(0, MAX_NICKNAME_LENGTH)) || '匿名',
      timestamp: Date.now(),
    }

    await addComment(slug, comment)

    return res.status(201).json({ comment })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}