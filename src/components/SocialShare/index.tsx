import { useBlogPost } from '@docusaurus/plugin-content-blog/client'
import { useBaseUrlUtils } from '@docusaurus/useBaseUrl'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { Icon } from '@iconify/react'
import React from 'react'
import { cn } from '@site/src/lib/utils'
import { motion } from 'framer-motion'

interface SocialShareProps {
  className?: string
}

interface SharePlatform {
  id: string
  name: string
  icon: string
  color: string
  getUrl: (url: string, title: string, summary?: string, image?: string) => string
}

export default function SocialShare({ className }: SocialShareProps): React.ReactNode {
  const { siteConfig } = useDocusaurusContext()
  const { withBaseUrl } = useBaseUrlUtils()
  const { metadata, frontMatter } = useBlogPost()
  const { title, description, permalink } = metadata
  const image = frontMatter.image

  // 获取完整URL
  const siteUrl = siteConfig.url
  const fullUrl = `${siteUrl}${permalink}`
  const imageUrl = image ? withBaseUrl(image, { absolute: true }) : ''

  // 定义分享平台
  const platforms: SharePlatform[] = [
    {
      id: 'weibo',
      name: '微博',
      icon: 'ri:weibo-fill',
      color: 'bg-[#E6162D] hover:bg-[#FF4D4F]',
      getUrl: (url, title, summary, image) => {
        const params = new URLSearchParams({
          url,
          title: `${title} - ${siteConfig.title}`,
        })
        if (image) params.append('pic', image)
        return `https://service.weibo.com/share/share.php?${params.toString()}`
      },
    },
    {
      id: 'wechat',
      name: '微信',
      icon: 'ri:wechat-fill',
      color: 'bg-[#07C160] hover:bg-[#2FCE75]',
      getUrl: () => '#wechat-qrcode',
    },
    {
      id: 'qq',
      name: 'QQ',
      icon: 'ri:qq-fill',
      color: 'bg-[#12B7F5] hover:bg-[#45C5F7]',
      getUrl: (url, title, summary) => {
        const params = new URLSearchParams({
          url,
          title: `${title} - ${siteConfig.title}`,
          desc: summary || description,
          summary: summary || description,
        })
        return `https://connect.qq.com/widget/shareqq/index.html?${params.toString()}`
      },
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: 'ri:twitter-x-fill',
      color: 'bg-black hover:bg-gray-800',
      getUrl: (url, title) => {
        const params = new URLSearchParams({
          url,
          text: `${title} - ${siteConfig.title}`,
        })
        return `https://twitter.com/intent/tweet?${params.toString()}`
      },
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: 'ri:facebook-fill',
      color: 'bg-[#1877F2] hover:bg-[#4293F7]',
      getUrl: (url) => {
        const params = new URLSearchParams({
          u: url,
        })
        return `https://www.facebook.com/sharer/sharer.php?${params.toString()}`
      },
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: 'ri:linkedin-fill',
      color: 'bg-[#0077B5] hover:bg-[#0E94DD]',
      getUrl: (url, title, summary) => {
        const params = new URLSearchParams({
          url,
          title: `${title} - ${siteConfig.title}`,
          summary: summary || description,
        })
        return `https://www.linkedin.com/shareArticle?mini=true&${params.toString()}`
      },
    },
  ]

  const handleShare = (platform: SharePlatform) => {
    if (platform.id === 'wechat') {
      // 显示二维码弹窗
      // TODO: 实现二维码显示
      alert('请截图后，使用微信扫一扫分享')
      return
    }

    const url = platform.getUrl(fullUrl, title, description, imageUrl)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  // 复制链接到剪贴板
  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullUrl).then(
      () => {
        alert('链接已复制')
      },
      (err) => {
        console.error('复制失败: ', err)
      },
    )
  }

  return (
    <div className={cn('my-8', className)}>
      <div className="mb-4 text-center text-sm font-medium text-gray-700 dark:text-gray-300">
        分享这篇文章
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {platforms.map((platform, index) => (
          <motion.button
            key={platform.id}
            className={cn(
              'flex size-10 items-center justify-center rounded-full text-white shadow-sm transition-transform',
              platform.color,
              'md:size-11',
            )}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.07 }}
            onClick={() => handleShare(platform)}
            aria-label={`分享到${platform.name}`}
            title={`分享到${platform.name}`}
          >
            <Icon icon={platform.icon} className="text-xl md:text-2xl" />
          </motion.button>
        ))}

        {/* 复制链接按钮 */}
        <motion.button
          className="flex size-10 items-center justify-center rounded-full bg-gray-200 text-gray-700 shadow-sm transition-transform hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 md:size-11"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: platforms.length * 0.07 }}
          onClick={copyToClipboard}
          aria-label="复制链接"
          title="复制链接"
        >
          <Icon icon="ri:link" className="text-xl md:text-2xl" />
        </motion.button>
      </div>
    </div>
  )
}
