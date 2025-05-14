import React from 'react'
import Layout from '@theme/Layout'
import { usePluginData } from '@docusaurus/useGlobalData'
import { transformBlogItems, extractCollections } from '@site/src/utils/blog'
import type { BlogPostData, BlogCollection } from '@site/src/types/blog'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import Link from '@docusaurus/Link'
import { cn } from '@site/src/lib/utils'
import Image from '@theme/IdealImage'

/**
 * 博客系列列表页面
 * 展示所有可用的博客系列/集合
 */
export default function CollectionsPage(): React.ReactNode {
  // 获取所有博客文章数据
  const blogData = usePluginData('docusaurus-plugin-content-blog') as {
    blogPosts?: any[]
  } | undefined

  // 转换为统一格式
  const allPosts: BlogPostData[] = React.useMemo(() => {
    if (!blogData?.blogPosts || !Array.isArray(blogData.blogPosts)) {
      console.log('CollectionsPage: 没有找到博客文章数据')
      return []
    }

    console.log('CollectionsPage: 原始博客文章数量', blogData.blogPosts.length)

    // 检查数据结构
    const firstPost = blogData.blogPosts[0]
    console.log('CollectionsPage: 第一篇文章数据结构:', JSON.stringify(Object.keys(firstPost || {})))

    // 直接检查文章的元数据，不通过content属性
    const firstPostMetadata = firstPost?.metadata
    console.log('CollectionsPage: 第一篇文章元数据:',
      firstPostMetadata
        ? JSON.stringify({
            title: firstPostMetadata.title,
            frontMatter: Object.keys(firstPostMetadata.frontMatter || {}),
          })
        : '无元数据')

    // 检查原始数据中是否有系列信息
    const hasSeries = blogData.blogPosts.some(post =>
      post.metadata?.frontMatter?.collection,
    )
    console.log('CollectionsPage: 原始数据中是否有系列信息', hasSeries)

    if (hasSeries) {
      const seriesExamples = blogData.blogPosts
        .filter(post => post.metadata?.frontMatter?.collection)
        .slice(0, 3)
        .map(post => ({
          title: post.metadata.title,
          collection: post.metadata.frontMatter.collection,
          order: post.metadata.frontMatter.collection_order,
        }))
      console.log('CollectionsPage: 原始系列文章示例', seriesExamples)
    }

    // 修改数据转换方式，直接使用metadata而不是通过content
    return blogData.blogPosts.map((post) => {
      if (!post.metadata) {
        console.log('CollectionsPage: 文章缺少元数据', post.id)
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

      const { metadata } = post
      const {
        title = '',
        permalink = '',
        date = '',
        description = '',
        tags = [],
      } = metadata

      // 确保从frontMatter中获取系列信息
      const frontMatter = metadata.frontMatter || {}

      // 打印原始frontMatter以便调试
      if (frontMatter.collection) {
        console.log(`CollectionsPage: 文章 "${title}" 的系列信息:`, {
          collection: frontMatter.collection,
          order: frontMatter.collection_order,
          description: frontMatter.collection_description,
        })
      }

      const {
        sticky = 0,
        featured = false,
        pinned = false,
        image = '',
        collection = '',
        collection_order = 0,
        collection_description = '',
      } = frontMatter

      // 如果有系列信息，打印出来
      if (collection) {
        console.log(`CollectionsPage: 文章 "${title}" 属于系列 "${collection}", 顺序: ${collection_order}`)
      }

      return {
        title,
        link: permalink,
        tags: tags.map(tag => ({
          label: typeof tag === 'string' ? tag : tag.label,
          permalink: `/blog/tags/${encodeURIComponent((typeof tag === 'string' ? tag : tag.label).toLowerCase())}`,
          count: 1,
        })),
        date: date,
        description: description || '',
        sticky,
        featured,
        pinned,
        image,
        collection: collection || '',
        collectionOrder: typeof collection_order === 'number' ? collection_order : 0,
        collectionDescription: collection_description || '',
      }
    })
  }, [blogData?.blogPosts])

  // 提取所有系列
  const collections: BlogCollection[] = React.useMemo(() => {
    // 添加调试信息
    console.log('CollectionsPage: 所有文章数量', allPosts.length)

    // 检查文章中是否有系列信息
    const postsWithCollection = allPosts.filter(post => post.collection)
    console.log('CollectionsPage: 带有系列信息的文章数量', postsWithCollection.length)

    if (postsWithCollection.length > 0) {
      console.log('CollectionsPage: 系列文章示例', postsWithCollection.slice(0, 3).map(post => ({
        title: post.title,
        collection: post.collection,
        collectionOrder: post.collectionOrder,
      })))
    }
    else {
      console.error('CollectionsPage: 没有找到带有系列信息的文章!')
      console.log('CollectionsPage: 文章示例', allPosts.slice(0, 3).map(post => ({
        title: post.title,
        frontMatter: post.collection ? '有系列' : '无系列',
      })))
    }

    const extractedCollections = extractCollections(allPosts)
    console.log('CollectionsPage: 提取的系列数量', extractedCollections.length)
    if (extractedCollections.length > 0) {
      console.log('CollectionsPage: 系列示例', {
        name: extractedCollections[0].name,
        postsCount: extractedCollections[0].posts.length,
        firstPost: extractedCollections[0].posts.length > 0 ? extractedCollections[0].posts[0].title : '无文章',
      })
    }

    return extractedCollections
  }, [allPosts])

  return (
    <Layout
      title="博客系列"
      description="探索我们的博客系列，系统化学习各种主题"
    >
      <div className="margin-vert--lg container">
        <header className="margin-bottom--lg text-center">
          <h1 className="mb-2">博客系列</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            探索我们的博客系列，系统化学习各种主题
          </p>
        </header>

        {collections.length === 0
          ? (
              <div className="margin-vert--lg text-center">
                <h2>暂无博客系列</h2>
                <p>我们正在努力创建更多系列内容，敬请期待！</p>
              </div>
            )
          : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {collections.map((collection, index) => (
                  <CollectionCard key={collection.name} collection={collection} index={index} />
                ))}
              </div>
            )}
      </div>
    </Layout>
  )
}

interface CollectionCardProps {
  collection: BlogCollection
  index: number
}

/**
 * 博客系列卡片组件
 */
function CollectionCard({ collection, index }: CollectionCardProps): React.ReactNode {
  const { id, name, description, posts, path, encodedSlug, image } = collection

  // 使用编码后的原始系列名称作为URL参数
  const safePath = `/blog/collections/${encodedSlug}`

  console.log(`CollectionCard: 渲染系列 "${name}", ID: "${id}", 路径: "${safePath}"`)

  // 默认封面图
  const defaultImage = 'https://source.unsplash.com/random/800x600/?book'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-all hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
    >
      <Link
        to={safePath}
        className="block hover:no-underline"
        onClick={() => {
          console.log(`点击系列卡片: "${name}", 路径: "${safePath}", 文章数: ${posts.length}`)
        }}
      >
        <div className="relative h-48 w-full overflow-hidden">
          {image
            ? (
                <img
                  src={image}
                  alt={name}
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )
            : (
                <img
                  src={defaultImage}
                  alt={name}
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4">
            <h2 className="text-xl font-bold text-white">{name}</h2>
            <div className="mt-1 flex items-center text-sm text-white/80">
              <Icon icon="ri:article-line" className="mr-1" />
              {posts.length}
              {' '}
              篇文章
            </div>
          </div>
        </div>
        <div className="p-4">
          <p className="mb-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
              查看系列
              <Icon icon="ri:arrow-right-s-line" className="ml-1 inline" />
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              最近更新:
              {' '}
              {new Date(posts[0].date).toLocaleDateString()}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
