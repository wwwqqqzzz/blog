/**
 * 文章管理 API — 通过 GitHub API 操作仓库文件
 *
 * GET    `/api/posts`                    — 列出所有文章
 * GET    `/api/posts?path=<path>`        — 获取单篇文章内容
 * POST   `/api/posts`                    — 创建文章
 * PUT    `/api/posts`                    — 更新文章
 * DELETE `/api/posts`                    — 删除文章
 * POST   `/api/posts?action=rebuild`     — 触发 Vercel 重新构建
 *
 * 需要 GITHUB_TOKEN 环境变量（GitHub Personal Access Token，需 repo 权限）
 */

const GITHUB_OWNER = 'wwwqqqzzz'
const GITHUB_REPO = 'blog'
const GITHUB_BRANCH = 'main'
const GITHUB_API = 'https://api.github.com'
const VALID_CATEGORIES = ['ai', 'develop', 'program', 'project', 'lifestyle', 'trade', 'reference']

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Vercel 有时不自动解析 body，手动处理
  if (req.method !== 'GET' && req.method !== 'HEAD' && !req.body) {
    try {
      const chunks = []
      for await (const chunk of req) {
        chunks.push(chunk)
      }
      req.body = JSON.parse(Buffer.concat(chunks).toString())
    } catch {
      req.body = {}
    }
  }

  const token = process.env.GITHUB_TOKEN
  if (!token) {
    return res.status(500).json({ error: 'GITHUB_TOKEN 环境变量未配置' })
  }

  const adminToken = process.env.ADMIN_TOKEN || 'blog-admin-2024'
  const authHeader = req.headers.authorization
  const authToken = authHeader?.replace('Bearer ', '') || req.query?.token
  const bodyToken = req.body?.token

  // 验证管理员权限：所有请求都需要 admin token
  if (authToken !== adminToken && bodyToken !== adminToken) {
    return res.status(403).json({ error: '无效的管理令牌', debug: { authToken: authToken?.slice(0,6), bodyToken: bodyToken?.slice(0,6), adminToken: adminToken?.slice(0,6) } })
  }

  const headers = {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'blog-cms',
  }

  // GET
  if (req.method === 'GET') {
    const { action, path, search, category } = req.query

    // debug: test GitHub API access
    if (action === 'debug') {
      try {
        const response = await githubRequest(
          `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/blog/develop`,
          headers
        )
        const data = await response.json()
        return res.status(200).json({
          status: response.status,
          ok: response.ok,
          hasToken: !!process.env.GITHUB_TOKEN,
          tokenPrefix: process.env.GITHUB_TOKEN?.slice(0, 6),
          result: Array.isArray(data) ? `${data.length} files found` : data,
        })
      } catch (err) {
        return res.status(500).json({ error: err.message })
      }
    }

    // list all posts
    if (action === 'list') {
      return listPosts(res, headers)
    }

    // list trash
    if (action === 'list_trash') {
      return listTrash(res, headers)
    }

    // get single post content
    if (path) {
      return getPostContent(res, headers, path)
    }

    // default: list all posts (with optional search filter)
    return listPosts(res, headers, String(search || ''), String(category || ''))
  }

  // POST — create, restore, restore, or batch
  if (req.method === 'POST') {
    const { action } = req.body || {}
    if (action === 'rebuild') {
      return triggerRebuild(res, token)
    }
    if (action === 'restore') {
      return restorePost(res, headers, req.body)
    }
    if (action === 'batch_delete') {
      return batchDelete(res, headers, req.body)
    }
    if (action === 'batch_move') {
      return batchMove(res, headers, req.body)
    }
    return createPost(res, headers, req.body)
  }

  // PUT — update
  if (req.method === 'PUT') {
    return updatePost(res, headers, req.body)
  }

  // DELETE
  if (req.method === 'DELETE') {
    return deletePost(res, headers, req.body)
  }

  // GET — list trash
  if (req.method === 'GET' && req.query.action === 'list_trash') {
    return listTrash(res, headers)
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

async function githubRequest(path, headers, method = 'GET', body = null) {
  const opts = { method, headers }
  if (body) {
    opts.headers['Content-Type'] = 'application/json'
    opts.body = JSON.stringify(body)
  }
  const response = await fetch(`${GITHUB_API}${path}`, opts)
  return response
}

async function listPosts(res, headers, search = '', category = '') {
  try {
    const allPosts = []

    async function scanDirectory(dirPath, cat) {
      try {
        const response = await githubRequest(
          `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${dirPath}`,
          headers
        )
        if (!response.ok) return
        const contents = await response.json()

        for (const item of Array.isArray(contents) ? contents : []) {
          if (item.type === 'file' && item.name.endsWith('.md')) {
            allPosts.push({
              name: item.name,
              path: item.path,
              category: cat,
              sha: item.sha,
              size: item.size,
              date: '',
            })
          } else if (item.type === 'dir' && item.name !== 'assets' && item.name !== '_trash') {
            await scanDirectory(item.path, cat)
          }
        }
      } catch { }
    }

    for (const category of VALID_CATEGORIES) {
      await scanDirectory(`blog/${category}`, category)
    }

    // 逐个读取 front matter 提取 date、title、tags（并发，5个一组避免速率限制）
    const batchSize = 5
    for (let i = 0; i < allPosts.length; i += batchSize) {
      const batch = allPosts.slice(i, i + batchSize)
      await Promise.allSettled(
        batch.map(async (post) => {
          try {
            const fileRes = await githubRequest(
              `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${post.path}`,
              headers
            )
            if (!fileRes.ok) return
            const fileData = await fileRes.json()
            const content = Buffer.from(fileData.content, 'base64').toString('utf-8')
            const dateMatch = content.match(/^---[\s\S]*?date:\s*['"]?(\d{4}[-/]\d{2}[-/]\d{2})/)
            const titleMatch = content.match(/^---[\s\S]*?title:\s*['"]?([^\n'"]+)/)
            const tagsMatch = content.match(/^---[\s\S]*?tags:\s*\[([^\]]+)\]/m) || content.match(/^---[\s\S]*?tags:\s*['"]([^'"]+)['"]/m)
            if (dateMatch) post.date = dateMatch[1].replace(/\//g, '-')
            if (titleMatch) post.title = titleMatch[1].trim()
            if (tagsMatch) post.tags = tagsMatch[1].split(',').map(t => t.trim().replace(/['"]/g, ''))
          } catch { }
        })
      )
    }

    // 按 date 倒序（最新在前），无日期的排最后
    allPosts.sort((a, b) => (b.date || '').localeCompare(a.date || ''))

    // 过滤
    let filtered = allPosts
    if (category) {
      filtered = filtered.filter(p => p.category === category)
    }
    if (search) {
      const q = search.toLowerCase()
      filtered = filtered.filter(p =>
        (p.title || p.name).toLowerCase().includes(q) ||
        (p.tags || []).some(t => t.toLowerCase().includes(q))
      )
    }

    return res.status(200).json({ posts: filtered, total: allPosts.length })
  } catch (error) {
    console.error('List posts error:', error)
    return res.status(500).json({ error: '获取文章列表失败', details: error.message })
  }
}

async function getPostContent(res, headers, path) {
  try {
    const response = await githubRequest(
      `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`,
      headers
    )

    if (!response.ok) {
      const data = await response.json()
      return res.status(response.status).json({ error: '获取文章内容失败', details: data.message })
    }

    const data = await response.json()
    const content = Buffer.from(data.content, 'base64').toString('utf-8')

    return res.status(200).json({
      path: data.path,
      sha: data.sha,
      content,
      size: data.size,
    })
  } catch (error) {
    console.error('Get post error:', error)
    return res.status(500).json({ error: '获取文章内容失败', details: error.message })
  }
}

async function createPost(res, headers, body) {
  const { category, filename, content, commitMessage } = body || {}

  if (!category || !filename || !content) {
    return res.status(400).json({ error: 'category, filename, content 为必填项' })
  }

  if (!VALID_CATEGORIES.includes(category)) {
    return res.status(400).json({ error: `分类必须是: ${VALID_CATEGORIES.join(', ')}` })
  }

  const filePath = `blog/${category}/${filename}`
  const message = commitMessage || `docs: 新增文章 ${filename}`
  const contentBase64 = Buffer.from(content, 'utf-8').toString('base64')

  try {
    const response = await githubRequest(
      `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`,
      headers,
      'PUT',
      {
        message,
        content: contentBase64,
        branch: GITHUB_BRANCH,
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json({ error: '创建文章失败', details: data.message })
    }

    return res.status(201).json({
      path: data.content?.path || filePath,
      sha: data.content?.sha,
      message: '文章创建成功，网站将在几分钟后自动更新',
    })
  } catch (error) {
    console.error('Create post error:', error)
    return res.status(500).json({ error: '创建文章失败', details: error.message })
  }
}

async function updatePost(res, headers, body) {
  const { path, content, sha, commitMessage } = body || {}

  if (!path || !content) {
    return res.status(400).json({ error: 'path 和 content 为必填项' })
  }

  // If no SHA provided, get it first
  let fileSha = sha
  if (!fileSha) {
    const getResponse = await githubRequest(
      `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`,
      headers
    )
    if (!getResponse.ok) {
      const data = await getResponse.json()
      return res.status(getResponse.status).json({ error: '获取文件SHA失败', details: data.message })
    }
    const getData = await getResponse.json()
    fileSha = getData.sha
  }

  const message = commitMessage || `docs: 更新文章 ${path.split('/').pop()}`
  const contentBase64 = Buffer.from(content, 'utf-8').toString('base64')

  try {
    const response = await githubRequest(
      `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`,
      headers,
      'PUT',
      {
        message,
        content: contentBase64,
        sha: fileSha,
        branch: GITHUB_BRANCH,
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json({ error: '更新文章失败', details: data.message })
    }

    return res.status(200).json({
      path: data.content?.path || path,
      sha: data.content?.sha,
      message: '文章更新成功，网站将在几分钟后自动更新',
    })
  } catch (error) {
    console.error('Update post error:', error)
    return res.status(500).json({ error: '更新文章失败', details: error.message })
  }
}

async function getDeletedList(headers) {
  try {
    const res = await githubRequest(
      `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/blog/_deleted.json`,
      headers
    )
    if (!res.ok) return { list: [], sha: null }
    const data = await res.json()
    return { list: JSON.parse(Buffer.from(data.content, 'base64').toString('utf-8')), sha: data.sha }
  } catch {
    return { list: [], sha: null }
  }
}

async function saveDeletedList(headers, list, sha) {
  const content = Buffer.from(JSON.stringify(list, null, 2)).toString('base64')
  const body = { message: 'docs: 更新回收站列表', content, branch: GITHUB_BRANCH }
  if (sha) body.sha = sha
  const res = await githubRequest(
    `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/blog/_deleted.json`,
    headers,
    'PUT',
    body
  )
  return res
}

async function deletePost(res, headers, body) {
  const { path, permanent } = body || {}
  if (!path) return res.status(400).json({ error: 'path 为必填项' })
  const fileName = path.split('/').pop()

  try {
    if (permanent) {
      // 真正删除：先从 _deleted.json 移除，再删除文件
      const { list, sha } = await getDeletedList(headers)
      const newList = list.filter(p => p.path !== path)
      await saveDeletedList(headers, newList, sha)

      const getRes = await githubRequest(`/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`, headers)
      if (!getRes.ok) return res.status(getRes.status).json({ error: '获取文件失败' })
      const fileData = await getRes.json()
      await githubRequest(`/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`, headers, 'DELETE', {
        message: `docs: 永久删除文章 ${fileName}`, sha: fileData.sha, branch: GITHUB_BRANCH
      })
      return res.status(200).json({ message: '文章已永久删除' })
    } else {
      // 软删除：只往 _deleted.json 加一条记录，不动文章
      const { list, sha } = await getDeletedList(headers)
      if (list.some(p => p.path === path)) {
        return res.status(200).json({ message: '文章已在回收站中' })
      }
      list.push({ path, deletedAt: Date.now() })
      const saveRes = await saveDeletedList(headers, list, sha)
      if (!saveRes.ok) {
        const data = await saveRes.json()
        return res.status(saveRes.status).json({ error: '标记删除失败', details: data.message })
      }
      return res.status(200).json({ message: '文章已移入回收站' })
    }
  } catch (error) {
    console.error('Delete error:', error)
    return res.status(500).json({ error: '删除失败', details: error.message })
  }
}

async function listTrash(res, headers) {
  try {
    const { list } = await getDeletedList(headers)
    if (!list.length) return res.status(200).json({ posts: [] })

    // 批量取文章元数据
    const posts = []
    const batchSize = 5
    for (let i = 0; i < list.length; i += batchSize) {
      const batch = list.slice(i, i + batchSize)
      await Promise.allSettled(batch.map(async (item) => {
        try {
          const fileRes = await githubRequest(
            `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${item.path}`,
            headers
          )
          if (!fileRes.ok) return
          const fileData = await fileRes.json()
          const content = Buffer.from(fileData.content, 'base64').toString('utf-8')
          const titleMatch = content.match(/^---[\s\S]*?title:\s*['"]?([^\n'"]+)/)
          const dateMatch = content.match(/^---[\s\S]*?date:\s*['"]?(\d{4}[-/]\d{2}[-/]\d{2})/)
          const cat = item.path.split('/')[1] || ''
          posts.push({
            name: item.path.split('/').pop(),
            path: item.path,
            category: cat,
            title: titleMatch ? titleMatch[1].trim() : item.path.split('/').pop(),
            date: dateMatch ? dateMatch[1].replace(/\//g, '-') : '',
            deletedAt: item.deletedAt,
          })
        } catch { }
      }))
    }

    posts.sort((a, b) => (b.deletedAt || 0) - (a.deletedAt || 0))
    return res.status(200).json({ posts })
  } catch {
    return res.status(200).json({ posts: [] })
  }
}

async function restorePost(res, headers, body) {
  const { path } = body || {}
  if (!path) return res.status(400).json({ error: 'path 为必填项' })

  try {
    const { list, sha } = await getDeletedList(headers)
    const newList = list.filter(p => p.path !== path)
    if (newList.length === list.length) {
      return res.status(200).json({ message: '文章不在回收站中' })
    }
    const saveRes = await saveDeletedList(headers, newList, sha)
    if (!saveRes.ok) {
      const data = await saveRes.json()
      return res.status(saveRes.status).json({ error: '恢复失败', details: data.message })
    }
    return res.status(200).json({ message: '文章已恢复' })
  } catch (error) {
    console.error('Restore error:', error)
    return res.status(500).json({ error: '恢复失败', details: error.message })
  }
}

async function batchDelete(res, headers, body) {
  const { paths, permanent } = body || {}
  if (!paths || !Array.isArray(paths) || paths.length === 0) {
    return res.status(400).json({ error: 'paths 为必填数组' })
  }

  const results = []
  if (permanent) {
    for (const p of paths) {
      try {
        const path = p.path || p
        const fileName = path.split('/').pop()
        const getRes = await githubRequest(`/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`, headers)
        if (getRes.ok) {
          const data = await getRes.json()
          await githubRequest(`/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`, headers, 'DELETE', { message: `docs: 批量永久删除 ${fileName}`, sha: data.sha, branch: GITHUB_BRANCH })
          results.push(fileName)
        }
      } catch { }
    }
  } else {
    const { list, sha } = await getDeletedList(headers)
    for (const p of paths) {
      const path = p.path || p
      if (!list.some(item => item.path === path)) {
        list.push({ path, deletedAt: Date.now() })
        results.push(path.split('/').pop())
      }
    }
    if (results.length) await saveDeletedList(headers, list, sha)
  }

  return res.status(200).json({ message: `已删除 ${results.length} 篇文章`, deleted: results })
}

async function batchMove(res, headers, body) {
  const { paths, targetCategory } = body || {}
  if (!paths || !Array.isArray(paths) || paths.length === 0) {
    return res.status(400).json({ error: 'paths 为必填数组' })
  }
  if (!targetCategory || !VALID_CATEGORIES.includes(targetCategory)) {
    return res.status(400).json({ error: 'targetCategory 无效' })
  }

  const results = []

  for (const p of paths) {
    try {
      const path = p.path || p
      const fileName = path.split('/').pop()
      const targetPath = `blog/${targetCategory}/${fileName}`
      const getRes = await githubRequest(`/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`, headers)
      if (getRes.ok) {
        const data = await getRes.json()
        const content = Buffer.from(data.content, 'base64').toString('utf-8')
        await githubRequest(`/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${targetPath}`, headers, 'PUT', { message: `docs: 批量移动 ${fileName} 到 ${targetCategory}`, content: Buffer.from(content).toString('base64'), branch: GITHUB_BRANCH })
        await githubRequest(`/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`, headers, 'DELETE', { message: `docs: 移动后删除原文件 ${fileName}`, sha: data.sha, branch: GITHUB_BRANCH })
        results.push(fileName)
      }
    } catch { }
  }

  return res.status(200).json({ message: `已移动 ${results.length} 篇文章到 ${CATEGORY_LABELS[targetCategory]}`, moved: results })
}

const CATEGORY_LABELS = { ai: 'AI / 人工智能', develop: '开发笔记', program: '编程技术', project: '项目分享', lifestyle: '生活随笔', trade: '交易理财', reference: '参考资料' }

async function triggerRebuild(res, token) {
  // Trigger Vercel redeploy via Vercel API
  const vercelToken = process.env.VERCEL_TOKEN

  if (!vercelToken) {
    return res.status(200).json({
      message: 'VERCEL_TOKEN 未配置，请推送到 GitHub 后等待自动构建',
      manual: true,
    })
  }

  try {
    // Use Vercel API to trigger redeploy
    const response = await fetch('https://api.vercel.com/v13/deployments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${vercelToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gitSource: {
          type: 'github',
          owner: GITHUB_OWNER,
          ref: GITHUB_BRANCH,
          repoId: GITHUB_REPO,
        },
      }),
    })

    if (!response.ok) {
      const data = await response.json()
      return res.status(200).json({
        message: '网站将通过 GitHub push 自动重建',
        auto: true,
      })
    }

    return res.status(200).json({
      message: '已触发重建，网站将在几分钟后更新',
      auto: true,
    })
  } catch {
    return res.status(200).json({
      message: 'GitHub push 已触发，网站将自动重建',
      auto: true,
    })
  }
}