import React from 'react'
import Layout from '@theme/Layout'
import { usePluginData } from '@docusaurus/useGlobalData'
import { extractCollections } from '@site/src/utils/blog'
import type { BlogPostData, BlogCollection } from '@site/src/types/blog'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import Link from '@docusaurus/Link'
import { cn } from '@site/src/lib/utils'
import { useLocation } from '@docusaurus/router'
import NotFound from '@theme/NotFound'
import { getCollectionData, defaultCollectionImage, defaultCollectionDescription } from '@site/data/collections'

/**
 * 博客系列详情页面
 * 展示特定系列的所有文章
 */
export default function CollectionDetailPage(): JSX.Element {
  const location = useLocation()
  
  // 从URL查询参数中获取集合名称
  const searchParams = new URLSearchParams(location.search)
  const collectionName = searchParams.get('name') || ''
  
  console.log('CollectionDetailPage: 当前查找的系列名称', collectionName)
  
  if (!collectionName) {
    console.log('CollectionDetailPage: 未提供系列名称，显示404页面')
    return <NotFound />
  }

  // 获取所有博客文章数据
  const blogData = usePluginData('docusaurus-plugin-content-blog') as {
    blogPosts?: any[]
  } | undefined

  // 转换为统一格式
  const allPosts: BlogPostData[] = React.useMemo(() => {
    if (!blogData?.blogPosts || !Array.isArray(blogData.blogPosts)) {
      console.log('CollectionDetailPage: 没有找到博客文章数据')
      return []
    }

    console.log('CollectionDetailPage: 原始博客文章数量', blogData.blogPosts.length)

    // 修改数据转换方式，直接使用metadata而不是通过content
    return blogData.blogPosts.map((post) => {
      if (!post.metadata) {
        console.log('CollectionDetailPage: 文章缺少元数据', post.id)
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
        console.log(`CollectionDetailPage: 文章 "${title}" 的系列信息:`, {
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
    // 检查文章中是否有系列信息
    const postsWithCollection = allPosts.filter(post => post.collection)
    console.log('CollectionDetailPage: 带有系列信息的文章数量', postsWithCollection.length)

    if (postsWithCollection.length > 0) {
      console.log('CollectionDetailPage: 系列文章示例', postsWithCollection.slice(0, 3).map(post => ({
        title: post.title,
        collection: post.collection,
        collectionOrder: post.collectionOrder,
      })))
    }

    // 提取所有系列
    const extractedCollections = extractCollections(allPosts)
    console.log('CollectionDetailPage: 提取到的系列数量', extractedCollections.length)

    if (extractedCollections.length > 0) {
      console.log('CollectionDetailPage: 系列示例', extractedCollections.map(c => ({
        id: c.id,
        name: c.name,
        postsCount: c.posts?.length || 0,
      })))
    }

    return extractedCollections
  }, [allPosts])

  // 查找当前系列
  let currentCollection = collections.find(c => c.id === collectionName)

  // 如果找不到当前系列，尝试创建一个临时系列
  if (!currentCollection) {
    console.log('CollectionDetailPage: 未找到匹配的系列，尝试创建临时系列')

    // 查找所有匹配的文章
    const seriesPosts = allPosts.filter(post => post.collection === collectionName)
    console.log('CollectionDetailPage: 找到匹配的文章数量', seriesPosts.length)

    if (seriesPosts.length > 0) {
      console.log('CollectionDetailPage: 创建临时系列', collectionName)

      // 创建临时系列
      const tempCollection = {
        id: collectionName,
        name: collectionName,
        description: `${collectionName}系列文章`,
        posts: seriesPosts,
        path: `/blog/collections/detail?name=${encodeURIComponent(collectionName)}`,
        slug: collectionName.toLowerCase().replace(/\s+/g, '-'),
        encodedSlug: encodeURIComponent(collectionName),
        image: seriesPosts[0]?.image || '',
      }

      // 获取集合数据
      const collectionData = getCollectionData(collectionName)
      if (collectionData) {
        console.log('CollectionDetailPage: 找到集合数据', collectionData)
        tempCollection.description = collectionData.description || tempCollection.description
        tempCollection.image = collectionData.image || tempCollection.image
      }

      currentCollection = tempCollection
    }
    else {
      console.log('CollectionDetailPage: 未找到匹配的文章，显示404页面')
      // 如果没有找到匹配的文章，显示404页面
      return <NotFound />
    }
  }

  const { name, description, posts, image } = currentCollection

  // 获取增强的集合数据
  const collectionData = getCollectionData(currentCollection.id)

  // 使用集合数据中的图片和描述，如果没有则使用默认值
  const enhancedImage = collectionData?.image || image || defaultCollectionImage
  const enhancedDescription = collectionData?.description || description || defaultCollectionDescription

  // 确保posts是一个数组
  let postsArray = posts;

  if (posts && !Array.isArray(posts)) {
    currentCollection.posts = Array.from(posts || []);
    postsArray = currentCollection.posts;
  }
  else if (!posts || posts.length === 0) {
    // 尝试从所有文章中查找属于该系列的文章
    const matchingPosts = allPosts.filter(post => post.collection === name);
    console.log('CollectionDetailPage: 找到匹配的文章数量', matchingPosts.length);

    if (matchingPosts.length > 0) {
      // 如果找到了匹配的文章，但系列中没有文章，说明系列提取逻辑有问题
      // 直接使用匹配的文章
      currentCollection.posts = matchingPosts;
      postsArray = matchingPosts;
      console.log('CollectionDetailPage: 使用匹配的文章替换空集合');
    }
  } else {
    postsArray = posts;
  }

  // 确保文章按照顺序排序
  if (postsArray && postsArray.length > 0) {
    console.log('CollectionDetailPage: 对文章进行排序和验证，文章数量', postsArray.length);

    // 检查文章数据的完整性
    const validPosts = postsArray.filter((post: BlogPostData) => post && post.title);
    if (validPosts.length !== postsArray.length) {
      console.log('CollectionDetailPage: 过滤掉无效文章，有效文章数量', validPosts.length);
      currentCollection.posts = validPosts;
      postsArray = validPosts;
    }

    // 对文章进行排序
    try {
      // 创建一个副本进行排序，避免直接修改原数组
      const sortedPosts = [...postsArray].sort((a: BlogPostData, b: BlogPostData) => {
        // 首先按照 collectionOrder 排序
        const orderA = typeof a.collectionOrder === 'number' ? a.collectionOrder : 9999;
        const orderB = typeof b.collectionOrder === 'number' ? b.collectionOrder : 9999;

        if (orderA !== orderB) {
          return orderA - orderB;
        }

        // 如果 collectionOrder 相同，按照日期排序
        try {
          const dateA = new Date(a.date || '').getTime();
          const dateB = new Date(b.date || '').getTime();
          return dateB - dateA;
        }
        catch (e) {
          return 0;
        }
      });

      // 更新排序后的文章列表
      currentCollection.posts = sortedPosts;
      postsArray = sortedPosts;
      console.log('CollectionDetailPage: 文章排序完成');
    }
    catch (error) {
      console.error('CollectionDetailPage: 文章排序失败', error);
    }

    // 确保每篇文章都有必要的字段
    postsArray.forEach((post: BlogPostData) => {
      if (!post.title) post.title = '无标题';
      if (!post.link) post.link = '#';
      if (!post.description) post.description = '';
    });
  }

  // 最后的安全检查
  if (!postsArray || !Array.isArray(postsArray) || postsArray.length === 0) {
    console.log('CollectionDetailPage: 最后安全检查 - 文章数组为空或无效');

    // 尝试从所有文章中查找属于该系列的文章
    const matchingPosts = allPosts.filter(post => post.collection === name);
    console.log('CollectionDetailPage: 最后安全检查 - 找到匹配的文章数量', matchingPosts.length);

    if (matchingPosts.length > 0) {
      currentCollection.posts = matchingPosts;
      postsArray = matchingPosts;
      console.log('CollectionDetailPage: 最后安全检查 - 使用匹配的文章');
    } else {
      // 如果仍然找不到文章，确保posts数组至少是空数组而不是null或undefined
      currentCollection.posts = [];
      postsArray = [];
    }
  }

  // 确保我们有一个可用的posts数组
  const safePostsArray = Array.isArray(currentCollection.posts) ? currentCollection.posts : [];
  console.log('CollectionDetailPage: 最终文章数量', safePostsArray.length);

  return (
    <Layout
      title={`${name} - 博客系列`}
      description={enhancedDescription}
    >
      <div>
        {/* 系列封面 */}
        <div className="relative">
          <div className="h-64 w-full overflow-hidden md:h-80">
            <img
              src={enhancedImage}
              alt={name}
              className="size-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full p-6 md:p-8">
            <div className="container">
              <div className="flex items-center text-white/80">
                <Link to="/blog/collections" className="hover:text-white">
                  博客系列
                </Link>
                <Icon icon="ri:arrow-right-s-line" className="mx-1" />
                <span>{name}</span>
              </div>
              <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">{name}</h1>
              <p className="mt-2 max-w-3xl text-white/90 md:text-lg">{enhancedDescription}</p>
              <div className="mt-4 flex items-center text-white/80">
                <Icon icon="ri:article-line" className="mr-2" />
                <span>
                  {safePostsArray.length}
                  {' '}
                  篇文章
                </span>
                {safePostsArray.length > 0 && (
                  <>
                    <span className="mx-2">•</span>
                    <span>
                      最近更新:
                      {new Date(safePostsArray[0]?.date || new Date()).toLocaleDateString()}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 系列文章列表 */}
        <div className="container py-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-2xl font-bold">系列文章</h2>

            <div className="space-y-6">
              {safePostsArray.length > 0
                ? (
                    <>
                      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                        共找到
                        {' '}
                        {safePostsArray.length}
                        {' '}
                        篇文章，按照系列顺序排列
                      </div>

                      {/* 文章列表渲染 */}
                      <div className="mt-8">
                        {safePostsArray.map((post: BlogPostData, index: number) => (
                          <div
                            key={index}
                            className="relative mb-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                            style={{ display: 'block', visibility: 'visible' }}
                          >
                            <div className="flex items-center">
                              <div className="mr-4 flex size-8 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                                {index + 1}
                              </div>
                              <h3 className="text-xl font-bold">
                                <a
                                  href={post.link}
                                  className="text-gray-900 hover:text-primary-600 hover:no-underline dark:text-gray-100 dark:hover:text-primary-400"
                                >
                                  {post.title}
                                </a>
                              </h3>
                            </div>

                            <div className="ml-12 mt-2">
                              <p className="mb-4 text-gray-600 dark:text-gray-400">
                                {post.description}
                              </p>

                              <div className="flex items-center justify-between">
                                <a
                                  href={post.link}
                                  className="flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                                >
                                  阅读文章
                                  <Icon icon="ri:arrow-right-s-line" className="ml-1" />
                                </a>

                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                  {post.date && (
                                    <span>{new Date(post.date).toLocaleDateString()}</span>
                                  )}
                                  {post.collectionOrder !== undefined && (
                                    <span className="ml-2 rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                                      顺序:
                                      {' '}
                                      {post.collectionOrder}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )
                : (
                    <div className="p-8 text-center">
                      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">暂无文章</h3>
                      <p className="mt-2 text-gray-600 dark:text-gray-400">
                        该系列目前没有文章，请稍后再来查看。
                      </p>
                      <div className="mt-4">
                        <button
                          onClick={() => window.location.reload()}
                          className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
                        >
                          刷新页面
                        </button>
                      </div>
                    </div>
                  )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
