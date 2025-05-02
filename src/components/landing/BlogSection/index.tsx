import Link from '@docusaurus/Link'
import Translate from '@docusaurus/Translate'
import type { BlogPost } from '@docusaurus/plugin-content-blog'
import { usePluginData } from '@docusaurus/useGlobalData'
import { cn } from '@site/src/lib/utils'
import Image from '@theme/IdealImage'
import { motion } from 'framer-motion'
import React, { useState } from 'react'
import { Section } from '../Section'
import { Icon } from '@iconify/react'

// Swiper 组件和模块
// @ts-expect-error - Swiper 类型未在项目中定义
import { Swiper, SwiperSlide } from 'swiper/react'
// @ts-expect-error - Swiper 模块类型未在项目中定义
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

const BLOG_POSTS_COUNT = 6

// 特色博客组件 - 左侧大图
export function FeaturedBlogItem({ post }: { post: BlogPost }) {
  const {
    metadata: { permalink, frontMatter, title, description },
  } = post

  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="relative size-full overflow-hidden rounded-xl shadow-lg"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1, transition: { duration: 0.5 } }}
      viewport={{ once: true }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* 博客图片 */}
      <div className="relative size-full min-h-[480px] overflow-hidden">
        {frontMatter.image && (
          <div className="absolute inset-0">
            <Image
              src={frontMatter?.image}
              alt={title}
              img=""
              className="size-full object-cover transition-transform duration-500 ease-in-out"
              style={{
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              }}
            />
            {/* 黑色半透明遮罩 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
          </div>
        )}

        {/* 文章内容 */}
        <div className="absolute inset-x-0 bottom-0 p-6 text-white">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="mb-4 flex gap-2"
          >
            {frontMatter.tags?.slice(0, 2).map((tag, idx) => (
              <span
                key={idx}
                className="bg-primary/80 rounded-full px-3 py-1 text-xs font-medium text-white"
              >
                {typeof tag === 'string' ? tag : (tag as any).label}
              </span>
            ))}
          </motion.div>

          <h3 className="mb-3 text-2xl font-bold tracking-tight text-white">
            {title}
          </h3>

          <p className="mb-4 line-clamp-2 text-gray-200">
            {description}
          </p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link
              href={permalink}
              className="hover:bg-primary/80 inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors"
            >
              阅读全文
              <Icon icon="ri:arrow-right-s-line" className="ml-1" />
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

// 轮播博客卡片 - 右侧轮播
export function CarouselBlogItem({ post }: { post: BlogPost }) {
  const {
    metadata: { permalink, frontMatter, title, description },
  } = post

  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="h-full overflow-hidden rounded-lg bg-card shadow-sm"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* 博客图片 */}
      <div className="relative h-32 w-full overflow-hidden">
        {frontMatter.image && (
          <>
            <Image
              src={frontMatter?.image}
              alt={title}
              img=""
              className="size-full object-cover transition-transform duration-300 ease-in-out"
              style={{
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </>
        )}
      </div>

      {/* 文章内容 */}
      <div className="p-4">
        <div className="mb-2 flex gap-2">
          {frontMatter.tags?.slice(0, 1).map((tag, idx) => (
            <span
              key={idx}
              className="bg-primary/10 rounded-full px-2 py-0.5 text-xs font-medium text-primary"
            >
              {typeof tag === 'string' ? tag : (tag as any).label}
            </span>
          ))}
        </div>

        <h4 className="mb-2 line-clamp-1 text-base font-medium">
          <Link href={permalink} className="text-card-foreground hover:no-underline">
            {title}
          </Link>
        </h4>

        <p className="text-muted-foreground line-clamp-2 text-sm">
          {description}
        </p>

        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: isHovered ? 0 : 10, opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="mt-3 text-right"
        >
          <Link
            href={permalink}
            className="text-xs font-medium text-primary hover:underline"
          >
            阅读全文
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default function BlogSection(): React.ReactNode {
  const blogData = usePluginData('docusaurus-plugin-content-blog') as {
    posts: BlogPost[]
    postNum: number
    tagNum: number
  }

  // 获取要展示的博客文章
  const featuredPost = blogData.posts[0] // 第一篇作为特色文章
  const carouselPosts = blogData.posts.slice(1, BLOG_POSTS_COUNT) // 其余5篇用于轮播

  if (blogData.postNum === 0) {
    return <>作者还没开始写博文哦...</>
  }

  if (!featuredPost) {
    return <>加载博客中...</>
  }

  return (
    <Section title={<Translate id="homepage.blog.title">近期博客</Translate>} icon="ri:quill-pen-line" href="/blog">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* 左侧特色博客 */}
        <div className="lg:col-span-7">
          <FeaturedBlogItem post={featuredPost} />
        </div>

        {/* 右侧博客轮播 */}
        <div className="lg:col-span-5">
          <Swiper
            spaceBetween={20}
            slidesPerView={1}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              bulletClass: 'swiper-pagination-bullet !bg-primary/50 !opacity-100',
              bulletActiveClass: 'swiper-pagination-bullet-active !bg-primary',
            }}
            modules={[Autoplay, Pagination, Navigation]}
            className="h-full rounded-xl"
            breakpoints={{
              640: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 1,
              },
            }}
          >
            {carouselPosts.map(post => (
              <SwiperSlide key={post.id} className="py-8">
                <CarouselBlogItem post={post} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </Section>
  )
}
