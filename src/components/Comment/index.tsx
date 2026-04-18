import React, { useCallback, useEffect, useRef, useState } from 'react'
import BrowserOnly from '@docusaurus/BrowserOnly'
import { useColorMode } from '@docusaurus/theme-common'
import { cn } from '@site/src/lib/utils'

interface CommentItem {
  id: string
  slug: string
  content: string
  nickname: string
  timestamp: number
}

function formatTime(ts: number): string {
  const diff = Date.now() - ts
  if (diff < 60_000) return '刚刚'
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} 分钟前`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} 小时前`
  if (diff < 2_592_000_000) return `${Math.floor(diff / 86_400_000)} 天前`
  return new Date(ts).toLocaleDateString('zh-CN')
}

function sanitize(str: string): string {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\n/g, '<br/>')
}

const STORAGE_KEY = 'blog_comments'

function isLocalDev(): boolean {
  if (typeof window === 'undefined') return false
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
}

function loadLocalComments(): Record<string, CommentItem[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveLocalComments(data: Record<string, CommentItem[]>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

async function fetchCommentsAPI(slug: string): Promise<CommentItem[]> {
  const res = await fetch(`/api/comments?slug=${encodeURIComponent(slug)}`)
  if (!res.ok) return []
  const data = await res.json()
  return data.comments || []
}

function fetchCommentsLocal(slug: string): CommentItem[] {
  return loadLocalComments()[slug] || []
}

async function submitCommentAPI(slug: string, content: string, nickname: string): Promise<{ ok: boolean; comment?: CommentItem; error?: string }> {
  const res = await fetch('/api/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug, content, nickname }),
  })
  const data = await res.json()
  if (!res.ok) return { ok: false, error: data.error || '评论失败' }
  return { ok: true, comment: data.comment }
}

function submitCommentLocal(slug: string, content: string, nickname: string): { ok: boolean; comment: CommentItem } {
  const comment: CommentItem = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    slug,
    content: sanitize(content),
    nickname: sanitize(nickname || '').slice(0, 20) || '匿名',
    timestamp: Date.now(),
  }
  const all = loadLocalComments()
  const list = all[slug] || []
  list.push(comment)
  all[slug] = list
  saveLocalComments(all)
  return { ok: true, comment }
}

export default function Comment(): JSX.Element {
  return (
    <BrowserOnly fallback={<div className="comment-section"><p className="comment-loading">加载评论中...</p></div>}>
      {() => <CommentSection />}
    </BrowserOnly>
  )
}

function CommentSection(): JSX.Element {
  const { colorMode } = useColorMode()
  const isDark = colorMode === 'dark'
  const isDev = isLocalDev()

  const slug = typeof window !== 'undefined'
    ? window.location.pathname.replace(/\/$/, '')
    : ''

  const [comments, setComments] = useState<CommentItem[]>([])
  const [content, setContent] = useState('')
  const [nickname, setNickname] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const fetchComments = useCallback(async () => {
    try {
      if (isDev) {
        setComments(fetchCommentsLocal(slug))
      } else {
        const items = await fetchCommentsAPI(slug)
        setComments(items)
      }
    } catch {
      // silently fail
    }
  }, [slug, isDev])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || submitting) return

    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      let result: { ok: boolean; comment?: CommentItem; error?: string }

      if (isDev) {
        result = submitCommentLocal(slug, content.trim(), nickname.trim())
      } else {
        result = await submitCommentAPI(slug, content.trim(), nickname.trim())
      }

      if (!result.ok) {
        setError(result.error || '评论失败，请稍后再试')
        return
      }

      setContent('')
      setNickname('')
      setSuccess('评论成功！')
      if (result.comment) {
        setComments(prev => [...prev, result.comment!])
      }

      setTimeout(() => setSuccess(''), 3000)

      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    } catch {
      setError('网络错误，请稍后再试')
    } finally {
      setSubmitting(false)
    }
  }

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px'
  }

  return (
    <div className={cn('comment-section', isDark && 'comment-section--dark')}>
      <h3 className="comment-title">
        评论
        {isDev && <span className="comment-dev-badge">本地模式</span>}
      </h3>

      <form className="comment-form" onSubmit={handleSubmit}>
        <div className="comment-form-row">
          <input
            type="text"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            placeholder="昵称（选填，默认匿名）"
            maxLength={20}
            className="comment-nickname-input"
          />
        </div>
        <div className="comment-form-row">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleTextareaInput}
            placeholder="说点什么..."
            maxLength={2000}
            required
            className="comment-textarea"
            rows={3}
          />
        </div>
        <div className="comment-form-actions">
          <span className="comment-char-count">
            {content.length}/2000
          </span>
          <button
            type="submit"
            disabled={submitting || !content.trim()}
            className="comment-submit-btn"
          >
            {submitting ? '提交中...' : '发送'}
          </button>
        </div>
        {error && <p className="comment-error">{error}</p>}
        {success && <p className="comment-success">{success}</p>}
      </form>

      <div className="comment-list">
        {comments.length === 0 && (
          <p className="comment-empty">还没有评论，来做第一个吧 ✌️</p>
        )}
        {comments.map(c => (
          <div key={c.id} className="comment-item">
            <div className="comment-item-header">
              <span className="comment-item-nickname">{c.nickname}</span>
              <span className="comment-item-time">{formatTime(c.timestamp)}</span>
            </div>
            <div
              className="comment-item-content"
              dangerouslySetInnerHTML={{ __html: c.content }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}