import type { Props as BlogPostItemsProps } from '@theme/BlogPostItems'
import type { BlogTag, BlogPostData, ExtendedBlogPostFrontMatter } from '../types/blog'

/**
 * 将BlogPostContent转换为自定义的BlogPostData格式
 */
export function transformBlogItems(items: BlogPostItemsProps['items']): BlogPostData[] {
  if (!items || !Array.isArray(items)) {
    console.log('transformBlogItems: 无效的输入数据')
    return []
  }

  console.log(`transformBlogItems: 处理 ${items.length} 篇文章`)

  return items.map((item, index) => {
    // Check if content exists
    if (!item || !item.content) {
      console.log(`transformBlogItems: 文章 #${index} 缺少内容`)
      return {
        title: '',
        link: '',
        tags: [],
        date: '',
        description: '',
        sticky: 0,
        featured: false,
        image: '',
      }
    }

    const BlogPostContent = item.content

    // Check if metadata and frontMatter exist
    if (!BlogPostContent.metadata || !BlogPostContent.frontMatter) {
      console.log(`transformBlogItems: 文章 #${index} 缺少元数据或前置数据`)
      return {
        title: '',
        link: '',
        tags: [],
        date: '',
        description: '',
        sticky: 0,
        featured: false,
        image: '',
      }
    }

    const { metadata, frontMatter } = BlogPostContent
    const {
      title = '',
      sticky = 0,
      featured = false,
      pinned = false,
      image = '',
      collection = '',
      collection_order = 0,
      collection_description = '',
    } = frontMatter as ExtendedBlogPostFrontMatter
    const { permalink = '', date = new Date().toISOString(), tags = [], description = '' } = metadata

    // 调试信息
    if (index < 5) { // 只打印前几篇文章的详细信息，避免日志过多
      console.log(`transformBlogItems: 处理文章 "${title}"`)
      console.log('- 链接:', permalink)
      console.log('- 描述:', description)
      console.log('- 标签:', JSON.stringify(tags))
      console.log('- 系列:', collection)
      console.log('- 系列顺序:', collection_order)
      console.log('- 系列描述:', collection_description)
      console.log('- 原始frontMatter:', JSON.stringify(frontMatter, null, 2))

      // 检查 source 字段
      console.log('- 原始 source:', metadata.source ? '存在' : '不存在')
      if (metadata.source) {
        console.log('- source 示例:', metadata.source.substring(0, 100) + '...')
      }
    }

    // Safely create date string
    let dateString = ''
    try {
      const dateObj = new Date(date)
      dateString = `${dateObj.getFullYear()}-${`0${dateObj.getMonth() + 1}`.slice(
        -2,
      )}-${`0${dateObj.getDate()}`.slice(-2)}`
    }
    catch (e) {
      console.error('Error parsing date:', e)
      dateString = ''
    }

    // 为标签添加count初始值，真实值会在extractAllTags中计算
    const tagsWithCount = tags
      ? tags.map((tag: any) => {
          // 检查标签格式
          if (typeof tag === 'string') {
            // 如果标签是字符串，转换为对象格式
            return {
              label: tag,
              permalink: `/blog/tags/${encodeURIComponent(tag.toLowerCase())}`,
              count: 1,
            }
          }
          else if (tag && typeof tag === 'object') {
            // 如果标签已经是对象，确保它有所有必要的字段
            return {
              ...tag,
              count: 1, // 初始值会在extractAllTags中被重新计算
            }
          }
          else {
            // 无效标签
            console.warn('transformBlogItems: 发现无效标签格式', tag)
            return {
              label: '未知标签',
              permalink: '#',
              count: 1,
            }
          }
        })
      : []

    // 构建最终的博客文章数据对象
    const blogPostData = {
      title: title || '',
      link: permalink || '',
      tags: tagsWithCount,
      date: dateString,
      description: description || '',
      sticky,
      featured,
      pinned,
      image,
      // 添加原始内容引用，用于全文搜索
      source: metadata.source || metadata.description || '',
      // 添加系列相关信息
      collection: collection || '',
      collectionOrder: typeof collection_order === 'number' ? collection_order : 0,
      collectionDescription: collection_description || '',
    }

    // 额外调试信息
    if (collection) {
      console.log(`文章 "${title}" 属于系列 "${collection}", 顺序: ${blogPostData.collectionOrder}`)
    }

    // 调试信息
    if (index < 3) {
      console.log(`transformBlogItems: 文章 "${title}" 转换完成`)
    }

    return blogPostData
  })
}

/**
 * 从博客文章数据中提取所有标签
 */
export function extractAllTags(items: BlogPostData[]): BlogTag[] {
  if (!items || !Array.isArray(items)) {
    return []
  }

  const tagsMap = new Map<string, { tag: BlogTag, count: number }>()

  items.forEach((item) => {
    if (!item || !item.tags) return

    item.tags.forEach((tag) => {
      if (!tag || !tag.label) return

      if (!tagsMap.has(tag.label)) {
        tagsMap.set(tag.label, {
          tag: {
            ...tag,
            count: 1,
          },
          count: 1,
        })
      }
      else {
        const existingEntry = tagsMap.get(tag.label)
        if (existingEntry) {
          existingEntry.count += 1
          existingEntry.tag.count = existingEntry.count
        }
      }
    })
  })

  return Array.from(tagsMap.values()).map(entry => entry.tag)
}

/**
 * 根据标签筛选博客文章
 */
export function filterPostsByTag(items: BlogPostData[], tagName: string): BlogPostData[] {
  if (!items || !Array.isArray(items)) {
    return []
  }

  if (!tagName) return items

  return items.filter((item) => {
    if (!item || !item.tags || !Array.isArray(item.tags)) {
      return false
    }
    return item.tags.some(tag => tag && tag.label === tagName)
  })
}

/**
 * 从博客文章中提取系列/集合信息
 */
export function extractCollections(items: BlogPostData[]): BlogCollection[] {
  if (!items || !Array.isArray(items)) {
    console.warn('extractCollections: 输入的文章数组无效')
    return []
  }

  // 创建系列映射
  const collectionsMap = new Map<string, BlogCollection>()

  // 调试信息
  console.log('extractCollections: 处理文章数量', items.length)

  // 检查文章中是否有系列信息
  const postsWithCollection = items.filter(post => post && post.collection)
  console.log('extractCollections: 带有系列信息的文章数量', postsWithCollection.length)

  if (postsWithCollection.length === 0) {
    console.warn('extractCollections: 没有找到带有系列信息的文章')
    console.log('extractCollections: 文章示例', items.slice(0, 3).map(post => ({
      title: post.title,
      collection: post.collection || '无系列',
      frontMatter: post.collection ? '有系列' : '无系列',
    })))
  }

  // 遍历所有文章，按系列分组
  items.forEach((post) => {
    // 跳过没有系列信息的文章
    if (!post || !post.collection) {
      return
    }

    console.log(`处理系列文章: "${post.title}", 系列: "${post.collection}", 顺序: ${post.collectionOrder}`)

    // 如果系列不存在，创建新系列
    if (!collectionsMap.has(post.collection)) {
      // 简化系列路径生成逻辑
      // 1. 使用原始系列名称作为唯一标识符
      const collectionId = post.collection

      // 2. 生成简单的slug（只用于显示，不用于匹配）
      const slug = post.collection.toLowerCase().replace(/\s+/g, '-')

      // 3. 生成URL安全的编码版本
      const encodedSlug = encodeURIComponent(post.collection)

      // 4. 生成完整路径 - 使用查询参数方式
      const collectionPath = `/blog/collections/detail?name=${encodedSlug}`

      console.log(`创建新系列: "${post.collection}", 路径: "${collectionPath}", slug: "${slug}"`)

      collectionsMap.set(post.collection, {
        name: post.collection, // 原始系列名称（显示用）
        id: collectionId, // 系列唯一标识符（匹配用）
        description: post.collectionDescription || `${post.collection}系列文章`,
        posts: [],
        path: collectionPath, // 完整URL路径
        slug: slug, // URL友好的slug（显示用）
        encodedSlug: encodedSlug, // URL编码后的系列名（URL用）
        image: post.image || '', // 如果文章有图片，使用它作为初始系列图片
      })
    }

    // 将文章添加到对应的系列中
    const collection = collectionsMap.get(post.collection)
    if (collection) {
      // 检查文章是否已经在系列中
      const existingPost = collection.posts.find((p: BlogPostData) => p.title === post.title)
      if (!existingPost) {
        // 确保文章对象是完整的
        const validPost = {
          ...post,
          title: post.title || '无标题',
          link: post.link || '#',
          description: post.description || '',
          date: post.date || new Date().toISOString(),
          collectionOrder: typeof post.collectionOrder === 'number' ? post.collectionOrder : 0,
        }

        collection.posts.push(validPost)
        console.log(`添加文章 "${validPost.title}" 到系列 "${post.collection}", 当前文章数: ${collection.posts.length}`)
      }
      else {
        console.log(`文章 "${post.title}" 已经在系列 "${post.collection}" 中，跳过添加`)
      }

      // 如果文章有系列描述且系列描述为空或是默认描述，使用该文章的系列描述
      if (post.collectionDescription
        && (!collection.description || collection.description === `${post.collection}系列文章`)) {
        collection.description = post.collectionDescription
        console.log(`更新系列 "${post.collection}" 描述: "${post.collectionDescription}"`)
      }

      // 如果文章有图片且系列图片为空，使用该文章的图片作为系列图片
      if (post.image && !collection.image) {
        collection.image = post.image
        console.log(`更新系列 "${post.collection}" 图片: "${post.image}"`)
      }
    }
    else {
      console.error(`错误: 无法找到系列 "${post.collection}" 的映射，无法添加文章 "${post.title}"`)
    }
  })

  // 对每个系列中的文章按照顺序排序
  const collections = Array.from(collectionsMap.values())

  console.log(`提取到 ${collections.length} 个系列`)

  collections.forEach((collection) => {
    console.log(`系列 "${collection.name}" 包含 ${collection.posts.length} 篇文章`)

    // 确保文章数组不为空
    if (!collection.posts || collection.posts.length === 0) {
      console.warn(`警告: 系列 "${collection.name}" 没有文章`)
      return
    }

    collection.posts.sort((a: BlogPostData, b: BlogPostData) => {
      // 首先按照 collectionOrder 排序
      const orderA = typeof a.collectionOrder === 'number' ? a.collectionOrder : 9999
      const orderB = typeof b.collectionOrder === 'number' ? b.collectionOrder : 9999

      if (orderA !== orderB) {
        return orderA - orderB
      }

      // 如果 collectionOrder 相同，按照日期排序
      try {
        const dateA = new Date(a.date).getTime()
        const dateB = new Date(b.date).getTime()
        return dateB - dateA
      }
      catch (e) {
        console.warn('排序时日期解析错误:', e)
        return 0
      }
    })

    console.log(`系列 "${collection.name}" 排序后:`,
      collection.posts.map((p: BlogPostData) => ({ title: p.title, order: p.collectionOrder })))
  })

  // 如果没有系列，打印警告
  if (collections.length === 0) {
    console.warn('警告: 没有找到任何系列/集合')
  }

  return collections
}
