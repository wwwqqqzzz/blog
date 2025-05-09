/**
 * 文章阅读追踪工具
 * 用于跟踪文章的阅读次数，并将数据存储在localStorage中
 */

const STORAGE_KEY = 'article-views'
const MAX_TRACKED_ARTICLES = 100 // 最多跟踪的文章数量

/**
 * 获取文章阅读数据
 * @returns 文章阅读数据对象 {[文章链接]: 阅读次数}
 */
export function getArticleViewData(): Record<string, number> {
  if (typeof localStorage === 'undefined') return {}

  try {
    const storedData = localStorage.getItem(STORAGE_KEY)
    return storedData ? JSON.parse(storedData) : {}
  }
  catch (error) {
    console.error('无法解析文章阅读数据', error)
    return {}
  }
}

/**
 * 保存文章阅读数据
 * @param data 文章阅读数据对象 {[文章链接]: 阅读次数}
 */
function saveArticleViewData(data: Record<string, number>): void {
  if (typeof localStorage === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }
  catch (error) {
    console.error('无法保存文章阅读数据', error)
  }
}

/**
 * 限制追踪的文章数量
 * 如果超过最大数量，删除阅读次数最少的文章
 * @param data 文章阅读数据对象
 * @returns 清理后的阅读数据对象
 */
function limitTrackedArticles(data: Record<string, number>): Record<string, number> {
  const entries = Object.entries(data)

  if (entries.length <= MAX_TRACKED_ARTICLES) {
    return data
  }

  // 按阅读次数排序，保留阅读次数最多的文章
  const sortedEntries = entries.sort((a, b) => b[1] - a[1])
  const limitedEntries = sortedEntries.slice(0, MAX_TRACKED_ARTICLES)

  return Object.fromEntries(limitedEntries)
}

/**
 * 记录文章阅读
 * @param articleUrl 文章URL
 */
export function trackArticleView(articleUrl: string): void {
  if (!articleUrl || typeof localStorage === 'undefined') return

  // 获取当前数据
  const viewData = getArticleViewData()

  // 更新阅读次数
  viewData[articleUrl] = (viewData[articleUrl] || 0) + 1

  // 限制文章数量并保存
  const limitedData = limitTrackedArticles(viewData)
  saveArticleViewData(limitedData)
}

/**
 * 获取特定文章的阅读次数
 * @param articleUrl 文章URL
 * @returns 阅读次数
 */
export function getArticleViewCount(articleUrl: string): number {
  const viewData = getArticleViewData()
  return viewData[articleUrl] || 0
}

/**
 * 获取最受欢迎的文章URL列表
 * @param limit 限制数量
 * @returns 按阅读次数排序的文章URL数组
 */
export function getPopularArticleUrls(limit = 10): string[] {
  const viewData = getArticleViewData()

  return Object.entries(viewData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([url]) => url)
}
