/**
 * 极简评论 API — 直接用 fetch 调用 Upstash REST API，无需 SDK
 * GET  `/api/comments?slug=<path>` — 获取评论列表
 * POST `/api/comments` body: { slug, content, nickname } — 提交评论
 * GET  `/api/comments?action=list` — 管理员：列出所有 slug
 * DELETE `/api/comments` body: { token, slug, id? } — 管理员：删除评论
 */

const memoryStore = new Map()

const MAX_CONTENT_LENGTH = 2000
const MAX_NICKNAME_LENGTH = 20
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_S = 60
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'blog-admin-2024'

function getRedisConfig() {
  // 优先用 Vercel Upstash Integration 自动创建的变量名
  const url =
    process.env.UPSTASH_REDIS_REST_URL_KV_REST_API_URL ||
    process.env.KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL

  const token =
    process.env.UPSTASH_REDIS_REST_URL_KV_REST_API_TOKEN ||
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN

  return url && token ? { url, token } : null
}

async function redisCmd(...args) {
  const config = getRedisConfig()
  if (!config) {
    console.error('Redis config not found. Available env vars:', Object.keys(process.env).filter(k => k.includes('REDIS') || k.includes('KV') || k.includes('UPSTASH')).join(', '))
    return null
  }

  try {
    const apiUrl = config.url.endsWith('/') ? config.url.slice(0, -1) : config.url
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(args),
    })
    if (!res.ok) {
      const errText = await res.text()
      console.error('Redis REST error:', res.status, errText)
      return null
    }
    const data = await res.json()
    return data.result
  } catch (err) {
    console.error('Redis fetch error:', err)
    return null
  }
}

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
  const result = await redisCmd('LRANGE', `comments:${slug}`, 0, -1)
  if (!result) return memoryStore.get(slug) || []
  return (Array.isArray(result) ? result : []).map((i) => (typeof i === 'string' ? JSON.parse(i) : i))
}

async function addComment(slug, comment) {
  const result = await redisCmd('RPUSH', `comments:${slug}`, JSON.stringify(comment))
  if (result === null) {
    const list = memoryStore.get(slug) || []
    list.push(comment)
    memoryStore.set(slug, list)
  }
}

async function deleteComment(slug, id) {
  const result = await redisCmd('LRANGE', `comments:${slug}`, 0, -1)
  const items = result !== null
    ? (Array.isArray(result) ? result : []).map((i) => (typeof i === 'string' ? JSON.parse(i) : i))
    : (memoryStore.get(slug) || [])
  const filtered = items.filter((c) => c.id !== id)
  if (result !== null) {
    await redisCmd('DEL', `comments:${slug}`)
    if (filtered.length > 0) {
      for (const c of filtered) {
        await redisCmd('RPUSH', `comments:${slug}`, JSON.stringify(c))
      }
    }
  } else {
    memoryStore.set(slug, filtered)
  }
}

async function deleteAllComments(slug) {
  const result = await redisCmd('DEL', `comments:${slug}`)
  if (result === null) {
    memoryStore.delete(slug)
  }
}

async function listAllSlugs() {
  const result = await redisCmd('KEYS', 'comments:*')
  if (!result) {
    const slugs = []
    for (const [slug, list] of memoryStore.entries()) {
      slugs.push({ slug, count: list.length })
    }
    return slugs
  }
  const keys = Array.isArray(result) ? result : []
  const slugs = []
  for (const k of keys) {
    const slug = k.replace('comments:', '')
    const count = await redisCmd('LLEN', k)
    slugs.push({ slug, count: count || 0 })
  }
  return slugs
}

async function checkRateLimit(ip) {
  const key = `ratelimit:${ip}`
  const result = await redisCmd('INCR', key)
  if (result === null) {
    const now = Date.now()
    const entry = memoryStore.get(key)
    if (!entry || now - entry.time > RATE_LIMIT_WINDOW_S * 1000) {
      memoryStore.set(key, { time: now, count: 1 })
      return true
    }
    entry.count++
    return entry.count <= RATE_LIMIT_MAX
  }
  if (result === 1) {
    await redisCmd('EXPIRE', key, RATE_LIMIT_WINDOW_S)
  }
  return result <= RATE_LIMIT_MAX
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

    // 调试端点：查看环境变量是否可用
    if (action === 'debug') {
      const config = getRedisConfig()
      const envKeys = Object.keys(process.env).filter(k => k.includes('REDIS') || k.includes('KV') || k.includes('UPSTASH'))
      return res.status(200).json({
        hasConfig: !!config,
        configUrl: config ? config.url?.slice(0, 30) + '...' : null,
        hasToken: config ? !!config.token : false,
        relevantEnvVars: envKeys,
      })
    }

    if (action === 'list') {
      const authHeader = req.headers.authorization
      const token = authHeader?.replace('Bearer ', '') || req.query.token
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