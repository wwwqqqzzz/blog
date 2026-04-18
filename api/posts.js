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

  const token = process.env.GITHUB_TOKEN
  if (!token) {
    return res.status(500).json({ error: 'GITHUB_TOKEN 环境变量未配置' })
  }

  const adminToken = process.env.ADMIN_TOKEN || 'blog-admin-2024'
  const authHeader = req.headers.authorization
  const authToken = authHeader?.replace('Bearer ', '') || req.query?.token
  const bodyToken = req.body?.token

  // 验证管理员权限
  if (req.method !== 'GET' || req.query.action === 'list') {
    if (authToken !== adminToken && bodyToken !== adminToken) {
      return res.status(403).json({ error: '无效的管理令牌' })
    }
  }

  const headers = {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'blog-cms',
  }

  // GET
  if (req.method === 'GET') {
    const { action, path } = req.query

    // list all posts
    if (action === 'list') {
      return listPosts(res, headers)
    }

    // get single post content
    if (path) {
      return getPostContent(res, headers, path)
    }

    // default: list all posts (public)
    return listPosts(res, headers)
  }

  // POST — create or rebuild
  if (req.method === 'POST') {
    const { action } = req.body || {}
    if (action === 'rebuild') {
      return triggerRebuild(res, token)
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

async function listPosts(res, headers) {
  try {
    const allPosts = []

    for (const category of VALID_CATEGORIES) {
      try {
        const response = await githubRequest(
          `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/blog/${category}`,
          headers
        )

        if (!response.ok) continue

        const contents = await response.json()

      // Filter for .md files and directories
      for (const item of Array.isArray(contents) ? contents : []) {
        if (item.type === 'file' && item.name.endsWith('.md')) {
          allPosts.push({
            name: item.name,
            path: item.path,
            category,
            sha: item.sha,
            size: item.size,
            url: item.download_url,
          })
        } else if (item.type === 'dir') {
          // Check for index.md in subdirectory
          const subResponse = await githubRequest(
            `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${item.path}`,
            headers
          )
          if (subResponse.ok) {
            const subContents = await subResponse.json()
            const indexFile = (Array.isArray(subContents) ? subContents : []).find(
              f => f.type === 'file' && f.name === 'index.md'
            )
            if (indexFile) {
              allPosts.push({
                name: item.name,
                path: `${item.path}/index.md`,
                category,
                sha: indexFile.sha,
                size: indexFile.size,
                url: indexFile.download_url,
              })
            }
          }
        }
      }
    }

    return res.status(200).json({ posts: allPosts })
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

async function deletePost(res, headers, body) {
  const { path, sha, commitMessage } = body || {}

  if (!path) {
    return res.status(400).json({ error: 'path 为必填项' })
  }

  // Get SHA if not provided
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

  const message = commitMessage || `docs: 删除文章 ${path.split('/').pop()}`

  try {
    const response = await githubRequest(
      `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`,
      headers,
      'DELETE',
      {
        message,
        sha: fileSha,
        branch: GITHUB_BRANCH,
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json({ error: '删除文章失败', details: data.message })
    }

    return res.status(200).json({
      message: '文章删除成功，网站将在几分钟后自动更新',
    })
  } catch (error) {
    console.error('Delete post error:', error)
    return res.status(500).json({ error: '删除文章失败', details: error.message })
  }
}

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
        message: '网站将通过 GitHub push 自动重建，
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