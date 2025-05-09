import React, { useState, useMemo } from 'react'
import Layout from '@theme/Layout'
import Link from '@docusaurus/Link'
import { Icon } from '@iconify/react'
import { Fade } from 'react-awesome-reveal'
import styles from './styles.module.css'

import { Friend, Friends, FriendCategory } from '@site/data/friends'

const TITLE = '友链'
const DESCRIPTION = '志同道合，携手共进，让思想在交流中绽放'
const SUBTITLE = '「独行快，众行远」结交良友，共同成长'
const FRIEND_EMAIL = '1@20030727.xyz'
const FRIEND_DEFAULT = {
  title: '',
  description: '',
  website: '',
  avatar: '',
  category: 'tech' as FriendCategory,
  tags: [] as string[],
}

// 友链分类数据
interface CategoryItem {
  id: string
  name: string
  icon: string
}

const CATEGORIES: CategoryItem[] = [
  { id: 'all', name: '全部', icon: 'carbon:earth-filled' },
  { id: 'tech', name: '技术达人', icon: 'carbon:application-web' },
  { id: 'personal', name: '生活智慧', icon: 'carbon:idea' },
  { id: 'design', name: '设计灵感', icon: 'carbon:paint-brush' },
  { id: 'other', name: '知识宝库', icon: 'carbon:book' },
]

// 默认标签映射
const DEFAULT_TAGS: Record<FriendCategory, string[]> = {
  tech: ['技术交流', '学习资源', '开发经验'],
  personal: ['成长思考', '生活智慧', '积极向上'],
  design: ['设计之美', '创意灵感', '美学探索'],
  other: ['知识分享', '启迪思考', '见解独到'],
}

// 正能量名言 - 使用具体的字符串数组类型
const POSITIVE_QUOTES = [
  '分享知识，收获友谊',
  '优秀的人也是优秀的学习者',
  '见贤思齐，互相成就',
  '学海无涯，互帮互助',
  '积极交流，共同成长',
]

// 获取随机名言
const getRandomQuote = (): string => {
  const randomIndex = Math.floor(Math.random() * POSITIVE_QUOTES.length)
  // 确保明确返回字符串
  return POSITIVE_QUOTES[randomIndex] || '积极交流，共同成长'
}

// 根据分类推断标签
const inferTags = (friend: Friend): string[] => {
  if (friend.tags && friend.tags.length > 0) {
    return friend.tags
  }

  if (friend.category) {
    const category = friend.category
    // 确保返回有效的标签
    const tags = DEFAULT_TAGS[category]
    const firstTag = tags[0] // 尝试获取第一个标签
    return firstTag ? [firstTag] : ['友情链接'] // 如果没有标签，返回默认标签
  }

  return ['友情链接']
}

// 页面标题区域组件
interface FriendHeaderProps {
  onOpenApplyModal: () => void
}

const FriendHeader: React.FC<FriendHeaderProps> = ({ onOpenApplyModal }) => {
  return (
    <header className={styles.header}>
      <Fade direction="up" triggerOnce>
        <h1 className={styles.headerTitle}>{TITLE}</h1>
        <p className={styles.headerSubtitle}>{DESCRIPTION}</p>
        <p className={styles.headerQuote}>{SUBTITLE}</p>
        <div className={styles.headerActions}>
          <button onClick={onOpenApplyModal} className={styles.addFriendButton}>
            <Icon icon="carbon:add-filled" width={20} height={20} />
            申请友链
          </button>
        </div>
      </Fade>
    </header>
  )
}

// 分类选择器组件
interface CategorySelectorProps {
  activeCategory: string
  onChange: (category: string) => void
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ activeCategory, onChange }) => {
  return (
    <div className={styles.categories}>
      {CATEGORIES.map((category) => {
        return (
          <button
            key={category.id}
            className={`${styles.categoryButton} ${
              activeCategory === category.id ? styles.categoryButtonActive : ''
            }`}
            onClick={() => onChange(category.id)}
          >
            <Icon icon={category.icon} width={20} height={20} />
            {category.name}
          </button>
        )
      })}
    </div>
  )
}

// 友链卡片组件
interface FriendCardProps {
  friend: Friend
}

const FriendCard: React.FC<FriendCardProps> = ({ friend }) => {
  const tags = inferTags(friend)
  const quote = getRandomQuote()

  return (
    <Fade direction="up" triggerOnce>
      <div className={styles.friendCard}>
        <div className={styles.cardHeader}>
          <img
            src={friend.avatar || '/img/default-avatar.png'}
            alt={friend.title}
            className={styles.avatar}
            onError={(e) => {
              e.currentTarget.src = '/img/default-avatar.png'
            }}
          />
          <div className={styles.titleInfo}>
            <h3 className={styles.friendTitle}>
              <Link to={friend.website} className={styles.friendLink} target="_blank" rel="noreferrer">
                {friend.title}
              </Link>
            </h3>
            <div className={styles.quoteTag}>
              <Icon icon="carbon:quote" width={16} height={16} />
              <span>{quote}</span>
            </div>
          </div>
        </div>

        <div className={styles.cardContent}>
          <p className={styles.description}>{friend.description}</p>

          <div className={styles.tagsList}>
            {tags.map((tag, index) => (
              <span key={index} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.cardFooter}>
          <div className={styles.socialLinks}>
            {friend.socialLinks?.github && (
              <a href={friend.socialLinks.github} target="_blank" rel="noreferrer">
                <Icon icon="carbon:logo-github" className={styles.socialIcon} width={20} height={20} />
              </a>
            )}
            {friend.socialLinks?.twitter && (
              <a href={friend.socialLinks.twitter} target="_blank" rel="noreferrer">
                <Icon icon="carbon:logo-twitter" className={styles.socialIcon} width={20} height={20} />
              </a>
            )}
            {friend.socialLinks?.juejin && (
              <a href={friend.socialLinks.juejin} target="_blank" rel="noreferrer">
                <Icon icon="simple-icons:juejin" className={styles.socialIcon} width={20} height={20} />
              </a>
            )}
          </div>

          <Link to={friend.website} className={styles.visitButton} target="_blank" rel="noreferrer">
            访问
          </Link>
        </div>
      </div>
    </Fade>
  )
}

// 空状态组件
const EmptyState: React.FC = () => {
  return (
    <div className={styles.emptyState}>
      <Icon icon="carbon:no-content" className={styles.emptyStateIcon} />
      <p className={styles.emptyStateText}>暂无相关友链</p>
    </div>
  )
}

// 友链申请表单组件
interface ApplyFriendModalProps {
  onClose: () => void
}

// 友链申请预览模态窗口
const ApplyFriendModal: React.FC<ApplyFriendModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState(FRIEND_DEFAULT)
  const [activeTab, setActiveTab] = useState('form') // 'form' 或 'guide'

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
    setFormData(prev => ({
      ...prev,
      tags,
    }))
  }

  const copyEmailTemplate = () => {
    const template = `title: '${formData.title}'
description: '${formData.description}'
website: '${formData.website}'
avatar: '${formData.avatar}'
category: '${formData.category}'
${formData.tags.length > 0 ? `tags: [${formData.tags.map(tag => `'${tag}'`).join(', ')}]` : ''}`

    navigator.clipboard.writeText(template)
    alert('已复制到剪贴板！请发送到邮箱：' + FRIEND_EMAIL)
  }

  return (
    <div
      className={styles.modalOverlay}
      onClick={(e) => {
      // 点击背景关闭模态窗口
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTabs}>
            <button
              className={`${styles.modalTab} ${activeTab === 'form' ? styles.modalTabActive : ''}`}
              onClick={() => setActiveTab('form')}
            >
              <Icon icon="carbon:document" width={18} height={18} />
              申请表单
            </button>
            <button
              className={`${styles.modalTab} ${activeTab === 'guide' ? styles.modalTabActive : ''}`}
              onClick={() => setActiveTab('guide')}
            >
              <Icon icon="carbon:information" width={18} height={18} />
              申请指南
            </button>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <Icon icon="carbon:close" width={20} height={20} />
          </button>
        </div>

        <div className={styles.modalBody}>
          {activeTab === 'form'
            ? (
                <div className={styles.formContainer}>
                  <div className={styles.formSection}>
                    <h3>填写友链信息</h3>
                    <div className={styles.formGroup}>
                      <label>网站名称 *</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="您的网站名称"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>网站描述 *</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="一句话介绍您的网站（30字以内）"
                        maxLength={30}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>网站地址 *</label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        placeholder="https://example.com"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>头像链接 *</label>
                      <input
                        type="url"
                        name="avatar"
                        value={formData.avatar}
                        onChange={handleInputChange}
                        placeholder="https://example.com/avatar.png"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>网站分类</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                      >
                        <option value="tech">技术博客</option>
                        <option value="personal">个人网站</option>
                        <option value="design">设计相关</option>
                        <option value="other">其他</option>
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label>标签（用逗号分隔，最多3个）</label>
                      <input
                        type="text"
                        value={formData.tags.join(', ')}
                        onChange={handleTagsChange}
                        placeholder="前端, React, 博客"
                      />
                    </div>

                    <div className={styles.formActions}>
                      <button onClick={copyEmailTemplate} className={styles.submitButton}>
                        <Icon icon="carbon:email" width={18} height={18} />
                        生成邮件模板
                      </button>
                      <a
                        href={`mailto:${FRIEND_EMAIL}?subject=友链申请&body=请将以下信息填入邮件正文：%0A%0A`}
                        className={styles.emailLink}
                      >
                        <Icon icon="carbon:send" width={18} height={18} />
                        发送邮件申请
                      </a>
                    </div>
                  </div>

                  <div className={styles.previewSection}>
                    <h3>预览效果</h3>
                    <div className={styles.previewCard}>
                      {formData.avatar
                        ? (
                            <img
                              src={formData.avatar}
                              alt="预览头像"
                              className={styles.previewAvatar}
                              onError={(e) => {
                                e.currentTarget.src = '/img/default-avatar.png'
                              }}
                            />
                          )
                        : (
                            <div className={styles.previewAvatarPlaceholder}>
                              <Icon icon="carbon:user-avatar" width={40} height={40} />
                            </div>
                          )}

                      <h4 className={styles.previewTitle}>{formData.title || '网站名称'}</h4>
                      <p className={styles.previewDescription}>
                        {formData.description || '网站描述...'}
                      </p>

                      <div className={styles.previewTags}>
                        {formData.tags.length > 0
                          ? (
                              formData.tags.slice(0, 3).map((tag, index) => (
                                <span key={index} className={styles.previewTag}>{tag}</span>
                              ))
                            )
                          : (
                              <span className={styles.previewTagPlaceholder}>标签</span>
                            )}
                      </div>

                      <div className={styles.previewLink}>
                        <Icon icon="carbon:launch" width={16} height={16} />
                        {formData.website ? formData.website : 'https://...'}
                      </div>
                    </div>

                    <div className={styles.previewNote}>
                      <Icon icon="carbon:information" width={16} height={16} />
                      <span>请确保所填信息真实有效，审核通过后将显示在友链页面</span>
                    </div>
                  </div>
                </div>
              )
            : (
                <div className={styles.guideContent}>
                  <div className={styles.guideSection}>
                    <h4>
                      <Icon icon="carbon:checkmark-filled" width={16} height={16} />
                      {' '}
                      申请条件
                    </h4>
                    <ul>
                      <li>网站内容健康积极，无不良信息</li>
                      <li>网站已稳定运行3个月以上</li>
                      <li>网站有原创内容且定期更新</li>
                      <li>已在您的网站添加本站友链</li>
                    </ul>
                  </div>

                  <div className={styles.guideSection}>
                    <h4>
                      <Icon icon="carbon:warning-filled" width={16} height={16} />
                      {' '}
                      注意事项
                    </h4>
                    <ul>
                      <li>申请前请先添加本站友链</li>
                      <li>邮件主题请标明"友链申请"</li>
                      <li>长期无法访问的友链将被移除</li>
                      <li>含有不适当内容的网站将被拒绝</li>
                    </ul>
                  </div>

                  <div className={styles.guideSection}>
                    <h4>
                      <Icon icon="carbon:template" width={16} height={16} />
                      {' '}
                      本站信息
                    </h4>
                    <div className={styles.codeWrapper}>
                      <pre className={styles.codeBlock}>
                        <code>
                          {`title: '王起哲'
description: '技术探索之路'
website: 'https://wangqizhe.cn'
avatar: 'https://wangqizhe.cn/img/logo.png'`}
                        </code>
                      </pre>
                    </div>
                  </div>
                </div>
              )}
        </div>
      </div>
    </div>
  )
}

// 主页面组件
const FriendsPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all')
  const [showApplyModal, setShowApplyModal] = useState(false)

  // 根据分类筛选友链
  const filteredFriends = useMemo(() => {
    if (activeCategory === 'all') {
      return Friends
    }
    return Friends.filter(friend => friend.category === activeCategory)
  }, [activeCategory])

  return (
    <>
      <Layout title={TITLE} description={DESCRIPTION}>
        <main className={`container ${styles.friendsPage}`}>
          <FriendHeader onOpenApplyModal={() => setShowApplyModal(true)} />

          <Fade direction="up" triggerOnce>
            <CategorySelector activeCategory={activeCategory} onChange={setActiveCategory} />
          </Fade>

          {filteredFriends.length > 0
            ? (
                <div className={styles.friendsGrid}>
                  {filteredFriends.map((friend, index) => (
                    <FriendCard key={index} friend={friend} />
                  ))}
                </div>
              )
            : (
                <EmptyState />
              )}
        </main>
      </Layout>

      {/* 申请友链模态窗口，独立于页面布局之外 */}
      {showApplyModal && (
        <ApplyFriendModal onClose={() => setShowApplyModal(false)} />
      )}
    </>
  )
}

export default FriendsPage
