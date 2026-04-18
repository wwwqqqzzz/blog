/**
 * 极简评论 API
 * GET  `/api/comments?slug=<path>` — 获取评论列表
 * POST `/api/comments` body: { slug, content, nickname } — 提交评论
 * GET  `/api/comments?action=list` — 管理员：列出所有 slug
 * DELETE `/api/comments` body: { token, slug, id? } — 管理员：删除评论
 *
 * 存储使用 Upstash Redis (REST API)，通过 UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN 连接
 * 本地开发时若未配置则降级为内存存储
 */

import { Redis } from '@upstash/redis'

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null

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
  if (redis) {
    const items = await redis.lrange(`comments:${slug}`, 0, -1)
    return items.map((i) => (typeof i === 'string' ? JSON.parse(i) : i))
  }
  return memoryStore.get(slug) || []
}

async function addComment(slug, comment) {
  if (redis) {
    await redis.rpush(`comments:${slug}`, JSON.stringify(comment))
    return
  }
  const list = memoryStore.get(slug) || []
  list.push(comment)
  memoryStore.set(slug, list)
}

async function deleteComment(slug, id) {
  if (redis) {
    const items = await redis.lrange(`comments:${slug}`, 0, -1)
    const parsed = items.map((i) => (typeof i === 'string' ? JSON.parse(i) : i))
    const filtered = parsed.filter((c) => c.id !== id)
    if (filtered.length === 0) {
      await redis.del(`comments:${slug}`)
    } else {
      await redis.del(`comments:${slug}`)
      await redis.rpush(`comments:${slug}`, ...filtered.map((c) => JSON.stringify(c)))
    }
    return true
  }
  const list = memoryStore.get(slug) || []
  memoryStore.set(slug, list.filter((c) => c.id !== id))
  return true
}

async function deleteAllComments(slug) {
  if (redis) {
    await redis.del(`comments:${slug}`)
    return
  }
  memoryStore.delete(slug)
}

async function listAllSlugs() {
  if (redis) {
    const keys = await redis.keys('comments:*')
    const slugs = keys.map((k) => k.replace('comments:', ''))
    const result = []
    for (const slug of slugs) {
      const count = await redis.llen(`comments:${slug}`)
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

  if (req.method === 'DELETE') {
    const { token, slug, id } = req.body || {}
    if (!verifyAdmin(token)) return res.status(403).json({ error: '无效的管理令牌' })
    if (!slug) return res.status(400).json({ error: 'Missing slug' })
    if (id) {
      await deleteComment(slug, id)
      return res.status(200).json({ success: true, message: '评论已删除' })
    }
    await deleteAllComments(slug)
    return res.status(200).json({ success: true, message: '该页面所有评论已删除' })
  }

  if (req.method === 'GET') {
    const { slug, action } = req.query
    if (action === 'list') {
      const authHeader = req.headers.authorization
      const token = authHeader?.replace('Bearer ', '')
      if (!verifyAdmin(token)) return res.status(403).json({ error: '无效的管理令牌' })
      if (slug) {
        const comments = await getComments(slug)
        return res.status(200).json({ slug, comments })
      }
      const slugs = await listAllSlugs()
      return res.status(200).json({ slugs })
    }
    if (!slug) return res.status(400).json({ error: 'Missing slug' })
    const comments = await getComments(slug)
    return res.status(200).json({ comments })
  }

  if (req.method === 'POST') {
    const ip =
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.headers['x-real-ip'] ||
      'unknown'
    const allowed = await checkRateLimit(ip)
    if (!allowed) return res.status(429).json({ error: '操作太频繁，请稍后再试' })
    const { slug, content, nickname } = req.body || {}
    if (!slug || !content || !content.trim()) return res.status(400).json({ error: 'Slug and content are required' })
    if (content.length > MAX_CONTENT_LENGTH) return res.status(400).json({ error: `内容不能超过 ${MAX_CONTENT_LENGTH} 字` })
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