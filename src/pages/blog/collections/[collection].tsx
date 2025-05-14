import React from 'react'
import Layout from '@theme/Layout'
import { usePluginData } from '@docusaurus/useGlobalData'
import { transformBlogItems, extractCollections } from '@site/src/utils/blog'
import type { BlogPostData, BlogCollection } from '@site/src/types/blog'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import Link from '@docusaurus/Link'
import { cn } from '@site/src/lib/utils'
import { useLocation } from '@docusaurus/router'
import NotFound from '@theme/NotFound'

/**
 * 博客系列详情页面
 * 展示特定系列的所有文章
 */
export default function CollectionDetailPage(): React.ReactNode {
  const location = useLocation()

  // 从URL路径中提取系列名称
  const pathParts = location.pathname.split('/');
  let encodedCollectionName = pathParts[pathParts.length - 1] || '';

  // 解码URL参数，得到原始系列名称
  let collectionName;
  try {
    collectionName = decodeURIComponent(encodedCollectionName);
    console.log('CollectionDetailPage: 成功解码URL参数', collectionName);
  } catch (e) {
    console.error('CollectionDetailPage: URL解码失败', e);
    collectionName = encodedCollectionName; // 解码失败时使用原始值
  }

  // 特殊处理Git教程系列
  const isGitTutorial =
    collectionName === 'Git教程' ||
    collectionName === 'git教程' ||
    collectionName.toLowerCase().includes('git');

  if (isGitTutorial) {
    console.log('CollectionDetailPage: 检测到Git教程系列URL');
    // 标准化Git教程的名称
    collectionName = 'Git教程';
  }

  console.log('CollectionDetailPage: 当前URL路径', location.pathname);
  console.log('CollectionDetailPage: 提取的系列名称', collectionName);

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
    return blogData.blogPosts.map(post => {
      if (!post.metadata) {
        console.log('CollectionDetailPage: 文章缺少元数据', post.id);
        return {
          title: '',
          link: '',
          tags: [],
          date: '',
          description: '',
          sticky: 0,
          featured: false,
          image: '',
        };
      }

      const { metadata } = post;
      const {
        title = '',
        permalink = '',
        date = '',
        description = '',
        tags = [],
      } = metadata;

      // 确保从frontMatter中获取系列信息
      const frontMatter = metadata.frontMatter || {};

      // 打印原始frontMatter以便调试
      if (frontMatter.collection) {
        console.log(`CollectionDetailPage: 文章 "${title}" 的系列信息:`, {
          collection: frontMatter.collection,
          order: frontMatter.collection_order,
          description: frontMatter.collection_description
        });
      }

      const {
        sticky = 0,
        featured = false,
        pinned = false,
        image = '',
        collection = '',
        collection_order = 0,
        collection_description = ''
      } = frontMatter;

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
      };
    });
  }, [blogData?.blogPosts])

  // 提取所有系列
  const collections: BlogCollection[] = React.useMemo(() => {
    // 检查文章中是否有系列信息
    const postsWithCollection = allPosts.filter(post => post.collection);
    console.log('CollectionDetailPage: 带有系列信息的文章数量', postsWithCollection.length);

    if (postsWithCollection.length > 0) {
      console.log('CollectionDetailPage: 系列文章示例', postsWithCollection.slice(0, 3).map(post => ({
        title: post.title,
        collection: post.collection,
        collectionOrder: post.collectionOrder
      })));
    } else {
      console.error('CollectionDetailPage: 没有找到带有系列信息的文章!');
    }

    const extractedCollections = extractCollections(allPosts);
    console.log('CollectionDetailPage: 提取的系列数量', extractedCollections.length);

    // 检查每个系列中的文章数量
    extractedCollections.forEach(collection => {
      console.log(`CollectionDetailPage: 系列 "${collection.name}" 包含 ${collection.posts.length} 篇文章`);
    });

    return extractedCollections;
  }, [allPosts])

  // 查找当前系列
  console.log('CollectionDetailPage: 当前系列名称', collectionName);
  console.log('CollectionDetailPage: 所有系列', collections.map(c => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    postsCount: c.posts.length,
    posts: c.posts.map(p => p.title)
  })));

  // 打印所有可用的系列，帮助调试
  console.log('CollectionDetailPage: 所有可用系列:', collections.map(c => ({
    id: c.id,
    name: c.name,
    postsCount: c.posts.length
  })));

  // 简化匹配逻辑：直接使用系列名称匹配
  const currentCollection = collections.find(c => c.id === collectionName);

  console.log('CollectionDetailPage: 匹配结果:', currentCollection ? {
    id: currentCollection.id,
    name: currentCollection.name,
    postsCount: currentCollection.posts.length
  } : '未找到匹配系列');

  // 特殊处理Git教程系列
  if (!currentCollection && isGitTutorial) {
    console.log('CollectionDetailPage: 尝试特殊匹配Git教程系列');
    const gitCollection = collections.find(c =>
      c.id === 'Git教程' ||
      c.name === 'Git教程'
    );

    if (gitCollection) {
      console.log('CollectionDetailPage: 找到Git教程系列');
      return (
        <Layout title="Git教程 - 博客系列" description="Git版本控制系统教程系列文章">
          <div className="container py-8">
            <div className="mx-auto max-w-4xl">
              <h1 className="mb-6 text-3xl font-bold">Git教程系列</h1>
              <p className="mb-8 text-gray-600 dark:text-gray-400">
                Git版本控制系统教程系列文章，从基础到高级，全面介绍Git的使用方法和最佳实践。
              </p>

              {/* 直接显示Git教程系列的文章 */}
              <div className="space-y-6">
                {gitCollection.posts.map((post, index) => (
                  <div key={index} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <h2 className="mb-2 text-xl font-bold">
                      <a href={post.link} className="text-gray-900 hover:text-primary-600 dark:text-gray-100 dark:hover:text-primary-400">
                        {post.title}
                      </a>
                    </h2>
                    <p className="mb-4 text-gray-600 dark:text-gray-400">{post.description}</p>
                    <div className="flex items-center justify-between">
                      <a href={post.link} className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                        阅读文章 →
                      </a>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(post.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Layout>
      );
    }
  }

  // 如果找不到当前系列，尝试创建一个临时系列
  if (!currentCollection) {
    console.error('CollectionDetailPage: 找不到匹配的系列', collectionName);

    // 尝试从所有文章中直接查找属于特定系列的文章
    console.log(`CollectionDetailPage: 尝试直接查找属于 "${collectionName}" 系列的文章`);

    // 查找所有匹配的文章
    const seriesPosts = allPosts.filter(post => post.collection === collectionName);

    console.log(`CollectionDetailPage: 找到 ${seriesPosts.length} 篇属于 "${collectionName}" 系列的文章`);

    if (seriesPosts.length > 0) {
      // 创建临时系列
      const tempCollection = {
        id: collectionName,
        name: collectionName,
        description: `${collectionName}系列文章`,
        posts: seriesPosts,
        path: `/blog/collections/${encodeURIComponent(collectionName)}`,
        slug: collectionName.toLowerCase().replace(/\s+/g, '-'),
        encodedSlug: encodeURIComponent(collectionName),
        image: seriesPosts[0].image || '',
      };

      console.log('CollectionDetailPage: 使用临时系列继续渲染');
      currentCollection = tempCollection;
    } else {
      // 如果没有找到匹配的文章，显示404页面
      return <NotFound />
    }
  }

  const { name, description, posts, image } = currentCollection

  // 打印系列文章信息
  console.log(`CollectionDetailPage: 系列 "${name}" 包含 ${posts.length} 篇文章`);
  if (posts && posts.length > 0) {
    console.log('CollectionDetailPage: 系列文章列表:', posts.map(post => ({
      title: post.title,
      link: post.link,
      order: post.collectionOrder
    })));

    // 详细检查每篇文章的数据结构
    console.log('CollectionDetailPage: 第一篇文章的完整数据:', JSON.stringify(posts[0], null, 2));

    // 检查文章数组是否是可迭代的
    console.log('CollectionDetailPage: posts是否为数组:', Array.isArray(posts));
    console.log('CollectionDetailPage: posts的类型:', Object.prototype.toString.call(posts));

    // 确保posts是一个数组
    if (!Array.isArray(posts)) {
      console.error('CollectionDetailPage: posts不是数组，尝试转换');
      currentCollection.posts = Array.from(posts || []);
    }
  } else {
    console.error('CollectionDetailPage: 系列中没有文章!');

    // 尝试从所有文章中查找属于该系列的文章
    const matchingPosts = allPosts.filter(post => post.collection === name);
    console.log(`CollectionDetailPage: 在所有文章中找到 ${matchingPosts.length} 篇属于系列 "${name}" 的文章`);

    if (matchingPosts.length > 0) {
      console.log('CollectionDetailPage: 匹配的文章:', matchingPosts.map(post => ({
        title: post.title,
        collection: post.collection,
        order: post.collectionOrder
      })));

      // 如果找到了匹配的文章，但系列中没有文章，说明系列提取逻辑有问题
      // 直接使用匹配的文章
      currentCollection.posts = matchingPosts;

      // 更新posts变量
      posts = matchingPosts;
    }
  }

  // 确保文章按照顺序排序
  if (posts && posts.length > 0) {
    // 检查文章数据的完整性
    const validPosts = posts.filter(post => post && post.title);
    if (validPosts.length !== posts.length) {
      console.warn(`CollectionDetailPage: 发现 ${posts.length - validPosts.length} 篇无效文章，已过滤`);
      currentCollection.posts = validPosts;
    }

    // 对文章进行排序
    try {
      posts.sort((a, b) => {
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
        } catch (e) {
          console.warn('排序时日期解析错误:', e);
          return 0;
        }
      });

      console.log('CollectionDetailPage: 排序后的文章顺序:', posts.map(post => ({
        title: post.title,
        order: post.collectionOrder
      })));
    } catch (error) {
      console.error('CollectionDetailPage: 文章排序出错:', error);
    }

    // 确保每篇文章都有必要的字段
    posts.forEach(post => {
      if (!post.title) post.title = '无标题';
      if (!post.link) post.link = '#';
      if (!post.description) post.description = '';
    });
  }

  // 默认封面图
  const defaultImage = 'https://source.unsplash.com/random/1200x400/?book'

  // 确保文章按照顺序排序
  if (posts && posts.length > 0) {
    try {
      posts.sort((a, b) => {
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
        } catch (e) {
          console.warn('排序时日期解析错误:', e);
          return 0;
        }
      });

      console.log('CollectionDetailPage: 排序后的文章顺序:', posts.map(post => ({
        title: post.title,
        order: post.collectionOrder
      })));
    } catch (error) {
      console.error('CollectionDetailPage: 文章排序出错:', error);
    }
  }

  // 最后的安全检查
  if (!posts || !Array.isArray(posts)) {
    console.error('CollectionDetailPage: posts不是数组或为空，尝试修复');
    currentCollection.posts = [];

    // 尝试从所有文章中查找属于该系列的文章
    const matchingPosts = allPosts.filter(post => post.collection === name);
    if (matchingPosts.length > 0) {
      console.log(`CollectionDetailPage: 最后尝试 - 找到 ${matchingPosts.length} 篇属于系列 "${name}" 的文章`);
      currentCollection.posts = matchingPosts;
    }
  }

  // 确保我们有一个可用的posts数组
  const safePostsArray = Array.isArray(currentCollection.posts) ? currentCollection.posts : [];

  return (
    <Layout
      title={`${name} - 博客系列`}
      description={description}
    >
      <div>
        {/* 系列封面 */}
        <div className="relative">
          <div className="h-64 w-full overflow-hidden md:h-80">
            <img
              src={image || defaultImage}
              alt={name}
              className="h-full w-full object-cover"
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
              <p className="mt-2 max-w-2xl text-white/90 md:text-lg">{description}</p>
              <div className="mt-4 flex items-center text-white/80">
                <Icon icon="ri:article-line" className="mr-2" />
                <span>{safePostsArray.length} 篇文章</span>
                {safePostsArray.length > 0 && (
                  <>
                    <span className="mx-2">•</span>
                    <span>最近更新: {new Date(safePostsArray[0].date).toLocaleDateString()}</span>
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
              {/* 添加一个直接的文章列表，不依赖于posts变量 */}
              <div className="mb-8 border border-blue-300 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
                <h3 className="text-lg font-bold text-blue-700 dark:text-blue-400 mb-2">直接文章列表</h3>
                <p className="text-blue-600 dark:text-blue-300 mb-2">
                  系列 "{name}" 包含 {safePostsArray.length} 篇文章
                </p>
                <div className="space-y-4">
                  {safePostsArray.map((post, idx) => (
                    <div key={idx} className="p-4 border border-gray-200 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700">
                      <h4 className="text-lg font-bold mb-2">
                        <a href={post.link} className="text-blue-600 hover:underline dark:text-blue-400">
                          {post.title || '无标题'}
                        </a>
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">{post.description || '无描述'}</p>
                      <div className="flex justify-between items-center">
                        <a href={post.link} className="text-blue-600 hover:underline dark:text-blue-400">阅读文章</a>
                        <span className="text-gray-500 dark:text-gray-400 text-sm">
                          {post.date ? new Date(post.date).toLocaleDateString() : '未知日期'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {safePostsArray.length > 0 ? (
                <>
                  <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                    共找到 {safePostsArray.length} 篇文章，按照系列顺序排列
                  </div>

                  {/* 超简化的文章列表渲染 - 确保能显示 */}
                  <div className="border border-red-300 p-4 mb-8 rounded-lg bg-red-50 dark:bg-red-900/20 dark:border-red-800">
                    <h3 className="text-lg font-bold text-red-700 dark:text-red-400 mb-2">调试信息</h3>
                    <p className="text-red-600 dark:text-red-300 mb-2">
                      系列 "{name}" 包含 {safePostsArray.length} 篇文章
                    </p>
                    <div className="text-sm text-red-600 dark:text-red-300">
                      {safePostsArray.map((post, idx) => (
                        <div key={idx} className="mb-1">
                          {idx + 1}. {post.title} (顺序: {post.collectionOrder})
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 使用最简单的HTML结构渲染文章列表 */}
                  <div className="space-y-4 border border-green-300 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 dark:border-green-800">
                    <h3 className="text-lg font-bold text-green-700 dark:text-green-400 mb-2">简化文章列表</h3>
                    {safePostsArray.map((post, idx) => (
                      <div key={idx} className="p-4 border border-gray-200 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700">
                        <h4 className="text-lg font-bold mb-2">
                          <a href={post.link} className="text-blue-600 hover:underline dark:text-blue-400">
                            {post.title || '无标题'}
                          </a>
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 mb-2">{post.description || '无描述'}</p>
                        <div className="flex justify-between items-center">
                          <a href={post.link} className="text-blue-600 hover:underline dark:text-blue-400">阅读文章</a>
                          <span className="text-gray-500 dark:text-gray-400 text-sm">
                            {post.date ? new Date(post.date).toLocaleDateString() : '未知日期'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 原始文章列表渲染 */}
                  <div className="mt-8">
                    <h3 className="text-lg font-bold mb-4">原始文章列表</h3>
                    {safePostsArray.map((post, index) => (
                      <div
                        key={index}
                        className="relative rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 mb-4"
                        style={{ display: 'block', visibility: 'visible' }}
                      >
                        <div className="flex items-center">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 mr-4">
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

                        <div className="mt-2 ml-12">
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
                                  顺序: {post.collectionOrder}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
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
  )
}

interface CollectionPostItemProps {
  post: BlogPostData
  index: number
  totalPosts: number
}

/**
 * 系列文章项组件
 */
function CollectionPostItem({ post, index, totalPosts }: CollectionPostItemProps): React.ReactNode {
  // 添加更多调试信息
  console.log(`CollectionPostItem: 开始渲染文章 #${index}, 完整post对象:`, post);

  // 防止空对象导致错误
  if (!post) {
    console.error('CollectionPostItem: 收到空的post对象');
    return (
      <div className="p-4 rounded-lg border border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400">
        错误：文章数据为空
      </div>
    );
  }

  const {
    title = '无标题',
    description = '',
    link = '#',
    date = new Date().toISOString(),
    image = '',
    collectionOrder = 0
  } = post;

  // 调试信息
  console.log(`CollectionPostItem: 渲染文章 "${title}", 链接: "${link}", 索引: ${index}, 顺序: ${collectionOrder}`);

  // 确保日期是有效的
  let formattedDate = '';
  try {
    formattedDate = new Date(date).toLocaleDateString();
  } catch (e) {
    console.warn(`CollectionPostItem: 无效的日期 "${date}" 用于文章 "${title}"`);
    formattedDate = '未知日期';
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
      style={{ display: 'block', visibility: 'visible', minHeight: '150px' }} // 确保卡片可见
    >
      <div className="absolute left-0 top-0 flex h-full items-center">
        <div className="flex h-full flex-col items-center px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
            {index + 1}
          </div>
          {index < totalPosts - 1 && (
            <div className="mt-2 h-full w-0.5 flex-1 bg-gray-200 dark:bg-gray-700" />
          )}
        </div>
      </div>

      <div className="ml-12">
        <Link
          to={link}
          className="mb-2 block text-xl font-bold text-gray-900 hover:text-primary-600 hover:no-underline dark:text-gray-100 dark:hover:text-primary-400"
        >
          {title}
        </Link>

        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>

        <div className="flex items-center justify-between">
          <Link
            to={link}
            className="flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            阅读文章
            <Icon icon="ri:arrow-right-s-line" className="ml-1" />
          </Link>

          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formattedDate}
            {collectionOrder !== undefined && (
              <span className="ml-2 rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                顺序: {collectionOrder}
              </span>
            )}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
