import React, { useCallback, useEffect, useRef, useState } from 'react'
import BrowserOnly from '@docusaurus/BrowserOnly'
import Layout from '@theme/Layout'
import Head from '@docusaurus/Head'

/* ===== Types ===== */
interface CommentItem {
  id: string
  slug: string
  content: string
  nickname: string
  timestamp: number
}

interface SlugInfo {
  slug: string
  count: number
}

interface PostInfo {
  name: string
  path: string
  category: string
  sha: string
  size: number
}

/* ===== Constants ===== */
const ADMIN_TOKEN_KEY = 'blog_admin_token'
const COMMENTS_STORAGE_KEY = 'blog_comments'
const CATEGORIES = ['ai', 'develop', 'program', 'project', 'lifestyle', 'trade', 'reference']
const CATEGORY_LABELS: Record<string, string> = {
  ai: 'AI / 人工智能',
  develop: '开发笔记',
  program: '编程技术',
  project: '项目分享',
  lifestyle: '生活随笔',
  trade: '交易理财',
  reference: '参考资料',
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts
  if (diff < 60_000) return '刚刚'
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} 分钟前`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} 小时前`
  if (diff < 2_592_000_000) return `${Math.floor(diff / 86_400_000)} 天前`
  return new Date(ts).toLocaleDateString('zh-CN')
}

function isLocalDev(): boolean {
  if (typeof window === 'undefined') return false
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
}

function loadLocalComments(): Record<string, CommentItem[]> {
  try {
    const raw = localStorage.getItem(COMMENTS_STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveLocalComments(data: Record<string, CommentItem[]>): void {
  localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(data))
}

function parseFrontMatter(content: string): Record<string, any> {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return {}
  const fm: Record<string, any> = {}
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    let val: any = line.slice(idx + 1).trim()
    // Try parse arrays like [a, b, c]
    if (val.startsWith('[') && val.endsWith(']')) {
      try { val = JSON.parse(val.replace(/'/g, '"')) } catch { /* keep as string */ }
    }
    fm[key] = val
  }
  return fm
}

function stringifyFrontMatter(fm: Record<string, any>): string {
  let out = '---\n'
  const keys = ['slug', 'title', 'date', 'authors', 'tags', 'keywords', 'description', 'image', 'collection', 'collection_order', 'collection_description', 'hide_comment', 'hide_related_articles', 'hide_social_share', 'private', 'password']
  for (const k of keys) {
    if (fm[k] !== undefined && fm[k] !== '') {
      if (Array.isArray(fm[k])) {
        out += `${k}: [${fm[k].join(', ')}]\n`
      } else {
        out += `${k}: ${fm[k]}\n`
      }
    }
  }
  // Write any extra keys not in the list
  for (const k of Object.keys(fm)) {
    if (!keys.includes(k) && fm[k] !== undefined && fm[k] !== '') {
      if (Array.isArray(fm[k])) {
        out += `${k}: [${fm[k].join(', ')}]\n`
      } else {
        out += `${k}: ${fm[k]}\n`
      }
    }
  }
  out += '---\n'
  return out
}

/* ===== Main Page ===== */
export default function AdminPage(): JSX.Element {
  return (
    <Layout title="管理后台" description="博客管理后台">
      <Head>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <BrowserOnly fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>加载中...</div>}>
        {() => <AdminPanel />}
      </BrowserOnly>
    </Layout>
  )
}

type Tab = 'comments' | 'posts'

function AdminPanel(): JSX.Element {
  const isDev = isLocalDev()
  const [token, setToken] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('comments')

  useEffect(() => {
    const saved = localStorage.getItem(ADMIN_TOKEN_KEY)
    if (saved) {
      setToken(saved)
      setAuthenticated(true)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!token.trim()) return
    localStorage.setItem(ADMIN_TOKEN_KEY, token.trim())
    setAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY)
    setToken('')
    setAuthenticated(false)
  }

  if (!authenticated) {
    return (
      <div className="admin-container">
        <div className="admin-login-card">
          <h2>🔒 管理员登录</h2>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={token}
              onChange={e => setToken(e.target.value)}
              placeholder="输入管理令牌"
              className="admin-input"
            />
            <button type="submit" className="admin-btn admin-btn-primary">登录</button>
          </form>
          <p className="admin-hint">访问此页面需要管理令牌</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>
          管理后台
          {isDev && <span className="comment-dev-badge">本地模式</span>}
        </h2>
        <button onClick={handleLogout} className="admin-btn admin-btn-sm">退出登录</button>
      </div>

      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === 'comments' ? 'active' : ''}`}
          onClick={() => setActiveTab('comments')}
        >
          💬 评论管理
        </button>
        <button
          className={`admin-tab ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          📝 文章管理
        </button>
      </div>

      {activeTab === 'comments' ? <CommentManager token={token} isDev={isDev} /> : <PostManager token={token} isDev={isDev} />}
    </div>
  )
}

/* ===== Comment Manager ===== */
function CommentManager({ token, isDev }: { token: string; isDev: boolean }): JSX.Element {
  const [slugs, setSlugs] = useState<SlugInfo[]>([])
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const [comments, setComments] = useState<CommentItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchSlugs = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      if (isDev) {
        const all = loadLocalComments()
        setSlugs(Object.entries(all).map(([slug, list]) => ({ slug, count: list.length })))
        return
      }
      const res = await fetch(`/api/comments?action=list&token=${encodeURIComponent(token)}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) { setError('获取失败'); return }
      const data = await res.json()
      setSlugs(data.slugs || [])
    } catch { setError('网络错误') }
    finally { setLoading(false) }
  }, [token, isDev])

  const fetchComments = useCallback(async (slug: string) => {
    setLoading(true)
    setError('')
    try {
      if (isDev) {
        setComments(loadLocalComments()[slug] || [])
        return
      }
      const res = await fetch(`/api/comments?action=list&slug=${encodeURIComponent(slug)}&token=${encodeURIComponent(token)}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) { setError('获取失败'); return }
      const data = await res.json()
      setComments(data.comments || [])
    } catch { setError('网络错误') }
    finally { setLoading(false) }
  }, [token, isDev])

  useEffect(() => { fetchSlugs() }, [fetchSlugs])

  const handleSelectSlug = (slug: string) => {
    setSelectedSlug(slug)
    fetchComments(slug)
  }

  const handleDeleteComment = async (slug: string, id: string) => {
    if (!confirm('确定删除这条评论吗？')) return
    if (isDev) {
      const all = loadLocalComments()
      const list = all[slug] || []
      all[slug] = list.filter(c => c.id !== id)
      if (all[slug].length === 0) delete all[slug]
      saveLocalComments(all)
      setComments(prev => prev.filter(c => c.id !== id))
      setSlugs(prev => { const u = prev.map(s => s.slug === slug ? { ...s, count: s.count - 1 } : s); return u.filter(s => s.count > 0) })
      return
    }
    try {
      const res = await fetch('/api/comments', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, slug, id }),
      })
      if (!res.ok) { const data = await res.json(); alert(data.error || '删除失败'); return }
      setComments(prev => prev.filter(c => c.id !== id))
      setSlugs(prev => prev.map(s => s.slug === slug ? { ...s, count: s.count - 1 } : s))
    } catch { alert('网络错误') }
  }

  const handleDeleteAll = async (slug: string) => {
    if (!confirm(`确定清空 ${slug} 下所有评论吗？`)) return
    if (isDev) {
      const all = loadLocalComments(); delete all[slug]; saveLocalComments(all)
      setComments([]); setSlugs(prev => prev.filter(s => s.slug !== slug)); setSelectedSlug(null)
      return
    }
    try {
      const res = await fetch('/api/comments', {
        method: 'DELETE', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, slug }),
      })
      if (!res.ok) { const data = await res.json(); alert(data.error || '删除失败'); return }
      setComments([]); setSlugs(prev => prev.filter(s => s.slug !== slug)); setSelectedSlug(null)
    } catch { alert('网络错误') }
  }

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <h3>页面列表</h3>
        {loading && !slugs.length ? <p className="admin-hint">加载中...</p>
          : slugs.length === 0 ? <p className="admin-hint">暂无评论数据</p>
            : <ul className="admin-slug-list">
                {slugs.map(s => (
                  <li key={s.slug} className={selectedSlug === s.slug ? 'active' : ''} onClick={() => handleSelectSlug(s.slug)}>
                    <span className="admin-slug-name">{s.slug}</span>
                    <span className="admin-slug-count">{s.count}</span>
                  </li>
                ))}
              </ul>
        }
      </div>
      <div className="admin-main">
        {selectedSlug ? (
          <>
            <div className="admin-comment-header">
              <h3>{selectedSlug}</h3>
              <button onClick={() => handleDeleteAll(selectedSlug)} className="admin-btn admin-btn-danger admin-btn-sm">清空全部</button>
            </div>
            {loading ? <p className="admin-hint">加载中...</p>
              : comments.length === 0 ? <p className="admin-hint">该页面暂无评论</p>
                : <div className="admin-comment-list">
                    {comments.map(c => (
                      <div key={c.id} className="admin-comment-card">
                        <div className="admin-comment-meta">
                          <span className="admin-comment-nickname">{c.nickname}</span>
                          <span className="admin-comment-time">{timeAgo(c.timestamp)}</span>
                          <button onClick={() => handleDeleteComment(selectedSlug, c.id)} className="admin-btn admin-btn-xs">删除</button>
                        </div>
                        <div className="admin-comment-content" dangerouslySetInnerHTML={{ __html: c.content }} />
                      </div>
                    ))}
                  </div>
            }
          </>
        ) : <p className="admin-hint">← 选择左侧页面查看评论</p>}
      </div>
    </div>
  )
}

/* ===== Post Manager ===== */
type PostView = 'list' | 'edit' | 'create'

function PostManager({ token, isDev }: { token: string; isDev: boolean }): JSX.Element {
  const [view, setView] = useState<PostView>('list')
  const [posts, setPosts] = useState<PostInfo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')

  // Editor state
  const [editPath, setEditPath] = useState('')
  const [editSha, setEditSha] = useState('')
  const [editContent, setEditContent] = useState('')
  const [editTitle, setEditTitle] = useState('')
  const [editSlug, setEditSlug] = useState('')
  const [editDate, setEditDate] = useState('')
  const [editTags, setEditTags] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editCategory, setEditCategory] = useState('develop')
  const [editBody, setEditBody] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/posts?action=list', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) { const data = await res.json(); setError(data.error || '获取失败'); return }
      const data = await res.json()
      setPosts(data.posts || [])
    } catch { setError('网络错误 - 文章管理仅在线上环境可用') }
    finally { setLoading(false) }
  }, [token])

  useEffect(() => { if (!isDev) fetchPosts() }, [fetchPosts, isDev])

  const handleCreate = () => {
    setEditPath('')
    setEditSha('')
    setEditTitle('')
    setEditSlug('')
    setEditDate(new Date().toISOString().split('T')[0])
    setEditTags('')
    setEditDescription('')
    setEditCategory('develop')
    setEditBody('')
    setView('create')
  }

  const handleEdit = async (post: PostInfo) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/posts?path=${encodeURIComponent(post.path)}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) { setError('获取文章内容失败'); return }
      const data = await res.json()
      const fm = parseFrontMatter(data.content)
      const bodyMatch = data.content.match(/^---\n[\s\S]*?\n---\n([\s\S]*)/)
      const body = bodyMatch ? bodyMatch[1] : data.content

      setEditPath(data.path)
      setEditSha(data.sha)
      setEditTitle(fm.title || '')
      setEditSlug(fm.slug || '')
      setEditDate(fm.date || '')
      setEditTags(Array.isArray(fm.tags) ? fm.tags.join(', ') : (fm.tags || ''))
      setEditDescription(fm.description || '')
      setEditCategory(post.category)
      setEditBody(body)
      setView('edit')
    } catch { setError('网络错误') }
    finally { setLoading(false) }
  }

  const handleDelete = async (post: PostInfo) => {
    if (!confirm(`确定删除文章 ${post.name} 吗？此操作将删除 GitHub 仓库中的文件。`)) return
    setLoading(true)
    try {
      const res = await fetch('/api/posts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, path: post.path, sha: post.sha }),
      })
      if (!res.ok) { const data = await res.json(); setError(data.error || '删除失败'); return }
      setMsg('文章已删除，网站将在几分钟后更新')
      fetchPosts()
    } catch { setError('网络错误') }
    finally { setLoading(false) }
  }

  const handleSave = async () => {
    if (!editTitle.trim()) { setError('标题不能为空'); return }
    setSaving(true)
    setError('')

    const slug = editSlug.trim() || editTitle.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u4e00-\u9fa5-]/g, '')
    const filename = editPath ? editPath.split('/').pop() : `${slug}.md`
    const tags = editTags.split(',').map(t => t.trim()).filter(Boolean)

    const fm = {
      slug: slug || undefined,
      title: editTitle.trim(),
      date: editDate || new Date().toISOString().split('T')[0],
      authors: 'wqz',
      ...(tags.length ? { tags } : {}),
      ...(editDescription.trim() ? { description: editDescription.trim() } : {}),
    }

    const fullContent = stringifyFrontMatter(fm) + '\n' + editBody

    try {
      if (view === 'create') {
        const res = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token,
            category: editCategory,
            filename,
            content: fullContent,
          }),
        })
        const data = await res.json()
        if (!res.ok) { setError(data.error || data.details || '创建失败'); return }
        setMsg('文章创建成功！网站将在几分钟后更新')
        setView('list')
        fetchPosts()
      } else {
        const res = await fetch('/api/posts', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token,
            path: editPath,
            content: fullContent,
            sha: editSha,
          }),
        })
        const data = await res.json()
        if (!res.ok) { setError(data.error || data.details || '更新失败'); return }
        setMsg('文章更新成功！网站将在几分钟后更新')
        setView('list')
        fetchPosts()
      }
    } catch { setError('网络错误') }
    finally { setSaving(false) }
  }

  if (isDev) {
    return <div className="admin-main"><p className="admin-hint">⚠️ 文章管理仅在线上环境可用（需要 GitHub API）<br />请部署后访问此页面</p></div>
  }

  return (
    <div className="admin-main" style={{ maxWidth: '100%' }}>
      {error && <div className="admin-error">{error}</div>}
      {msg && <div className="admin-success-msg" onClick={() => setMsg('')}>{msg} ✕</div>}

      {view === 'list' && (
        <>
          <div className="admin-post-header">
            <h3>全部文章 ({posts.length})</h3>
            <button onClick={handleCreate} className="admin-btn admin-btn-primary">+ 新建文章</button>
          </div>
          {loading && !posts.length ? <p className="admin-hint">加载中...</p>
            : posts.length === 0 ? <p className="admin-hint">暂无文章</p>
              : <div className="admin-post-list">
                  {posts.map(p => (
                    <div key={p.path} className="admin-post-item">
                      <div className="admin-post-info">
                        <span className="admin-post-category">{CATEGORY_LABELS[p.category] || p.category}</span>
                        <span className="admin-post-name">{p.name}</span>
                        <span className="admin-post-size">{(p.size / 1024).toFixed(1)} KB</span>
                      </div>
                      <div className="admin-post-actions">
                        <button onClick={() => handleEdit(p)} className="admin-btn admin-btn-edit">编辑</button>
                        <button onClick={() => handleDelete(p)} className="admin-btn admin-btn-xs">删除</button>
                      </div>
                    </div>
                  ))}
                </div>
          }
        </>
      )}

      {(view === 'edit' || view === 'create') && (
        <div className="admin-editor">
          <div className="admin-editor-header">
            <button onClick={() => { setView('list'); setError(''); setMsg('') }} className="admin-btn admin-btn-sm">← 返回列表</button>
            <h3>{view === 'create' ? '新建文章' : '编辑文章'}</h3>
          </div>

          <div className="admin-editor-form">
            {view === 'create' && (
              <div className="admin-form-row">
                <label>分类</label>
                <select value={editCategory} onChange={e => setEditCategory(e.target.value)} className="admin-input">
                  {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
                </select>
              </div>
            )}
            <div className="admin-form-row">
              <label>标题 *</label>
              <input value={editTitle} onChange={e => setEditTitle(e.target.value)} placeholder="文章标题" className="admin-input" />
            </div>
            <div className="admin-form-row admin-form-row-half">
              <div>
                <label>Slug（留空自动生成）</label>
                <input value={editSlug} onChange={e => setEditSlug(e.target.value)} placeholder="my-post-slug" className="admin-input" />
              </div>
              <div>
                <label>日期</label>
                <input type="date" value={editDate} onChange={e => setEditDate(e.target.value)} className="admin-input" />
              </div>
            </div>
            <div className="admin-form-row">
              <label>标签（逗号分隔）</label>
              <input value={editTags} onChange={e => setEditTags(e.target.value)} placeholder="前端, React, TypeScript" className="admin-input" />
            </div>
            <div className="admin-form-row">
              <label>描述</label>
              <input value={editDescription} onChange={e => setEditDescription(e.target.value)} placeholder="文章简短描述" className="admin-input" />
            </div>
            <div className="admin-form-row admin-form-grow">
              <label>正文（Markdown）</label>
              <textarea
                value={editBody}
                onChange={e => setEditBody(e.target.value)}
                placeholder="在这里写 Markdown 内容..."
                className="admin-textarea"
              />
            </div>
          </div>

          <div className="admin-editor-footer">
            <button onClick={handleSave} disabled={saving || !editTitle.trim()} className="admin-btn admin-btn-primary">
              {saving ? '保存中...' : view === 'create' ? '发布文章' : '保存修改'}
            </button>
            <p className="admin-hint">保存后网站将在 3-5 分钟内自动重建</p>
          </div>
        </div>
      )}
    </div>
  )
}