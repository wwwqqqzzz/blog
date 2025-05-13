import Link from '@docusaurus/Link'
import type { BlogPost } from '@docusaurus/plugin-content-blog'
import { motion } from 'framer-motion'
import React, { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'
import { fetchWeatherData, fetchLocationData, fetchDailyQuote } from '../../../utils/api-helpers'

// 简化版侧边栏组件
export function ModernSidebar({
  filteredPosts,
}: {
  filteredPosts: BlogPost[]
}) {
  // 定义类型
  interface WeatherData {
    temp: string
    condition: string
    icon: string
    location: string
    loading: boolean
  }

  interface LocationData {
    city: string
    region: string
    country: string
    latitude: number
    longitude: number
  }

  interface QuoteData {
    content: string
    translation: string
    author: string
    picture?: string
    loading: boolean
  }

  // 时间和日期状态
  const [currentTime, setCurrentTime] = useState(new Date())
  const [weather, setWeather] = useState<WeatherData>({
    temp: '23°C',
    condition: '晴朗',
    icon: 'ri:sun-line',
    location: '北京',
    loading: true,
  })

  // 每日一句状态
  const [quote, setQuote] = useState<QuoteData>({
    content: 'Coding is not just about code, it\'s a way of thinking.',
    translation: '编程不仅仅是代码，更是一种思维方式。',
    author: 'Unknown',
    loading: true,
  })

  // 更新时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // 使用和风天气API获取实时天气数据
  useEffect(() => {
    const getWeatherData = async () => {
      try {
        // 设置加载状态
        setWeather(prev => ({ ...prev, loading: true }))

        // 获取天气数据
        const data = await fetchWeatherData()

        if (data.code === '200' && data.now) {
          // 获取天气图标
          const getWeatherIcon = (iconCode: string): string => {
            switch (iconCode) {
              case '100': return 'ri:sun-line' // 晴
              case '101': return 'ri:sun-cloudy-line' // 多云
              case '102': return 'ri:cloudy-line' // 少云
              case '103': return 'ri:cloudy-line' // 晴间多云
              case '104': return 'ri:cloudy-2-line' // 阴
              case '300': return 'ri:drizzle-line' // 阵雨
              case '301': return 'ri:rainy-line' // 强阵雨
              case '302': return 'ri:thunderstorms-line' // 雷阵雨
              case '303': return 'ri:thunderstorms-line' // 强雷阵雨
              case '304': return 'ri:hail-line' // 雷阵雨伴有冰雹
              case '305': return 'ri:rainy-line' // 小雨
              case '306': return 'ri:rainy-line' // 中雨
              case '307': return 'ri:heavy-showers-line' // 大雨
              case '308': return 'ri:heavy-showers-line' // 极端降雨
              case '309': return 'ri:drizzle-line' // 毛毛雨/细雨
              case '310': return 'ri:rainy-line' // 暴雨
              case '311': return 'ri:heavy-showers-line' // 大暴雨
              case '312': return 'ri:heavy-showers-line' // 特大暴雨
              case '313': return 'ri:snowy-line' // 冻雨
              case '314': return 'ri:rainy-line' // 小到中雨
              case '315': return 'ri:rainy-line' // 中到大雨
              case '316': return 'ri:heavy-showers-line' // 大到暴雨
              case '317': return 'ri:heavy-showers-line' // 暴雨到大暴雨
              case '318': return 'ri:heavy-showers-line' // 大暴雨到特大暴雨
              case '399': return 'ri:rainy-line' // 雨
              case '400': return 'ri:snowy-line' // 小雪
              case '401': return 'ri:snowy-line' // 中雪
              case '402': return 'ri:heavy-snow-line' // 大雪
              case '403': return 'ri:heavy-snow-line' // 暴雪
              case '404': return 'ri:snowy-line' // 雨夹雪
              case '405': return 'ri:snowy-line' // 雨雪天气
              case '406': return 'ri:snowy-line' // 阵雨夹雪
              case '407': return 'ri:snowy-line' // 阵雪
              case '408': return 'ri:snowy-line' // 小到中雪
              case '409': return 'ri:heavy-snow-line' // 中到大雪
              case '410': return 'ri:heavy-snow-line' // 大到暴雪
              case '499': return 'ri:snowy-line' // 雪
              case '500': return 'ri:mist-line' // 薄雾
              case '501': return 'ri:mist-line' // 雾
              case '502': return 'ri:haze-line' // 霾
              case '503': return 'ri:haze-line' // 扬沙
              case '504': return 'ri:haze-line' // 浮尘
              case '507': return 'ri:haze-line' // 沙尘暴
              case '508': return 'ri:haze-line' // 强沙尘暴
              case '509': return 'ri:haze-line' // 浓雾
              case '510': return 'ri:haze-line' // 强浓雾
              case '511': return 'ri:haze-line' // 中度霾
              case '512': return 'ri:haze-line' // 重度霾
              case '513': return 'ri:haze-line' // 严重霾
              case '514': return 'ri:mist-line' // 大雾
              case '515': return 'ri:mist-line' // 特强浓雾
              case '900': return 'ri:sun-line' // 热
              case '901': return 'ri:snowy-line' // 冷
              default: return 'ri:question-line' // 未知
            }
          }

          // 获取城市名称
          let locationName = '未知位置'
          try {
            const locationData = await fetchLocationData()
            if (locationData && locationData.city) {
              locationName = locationData.city
            }
          }
          catch (locationError) {
            console.error('获取位置信息失败:', locationError)
          }

          // 更新天气状态
          const weatherIcon = data.now.icon ? getWeatherIcon(data.now.icon) : 'ri:question-line'
          setWeather({
            temp: `${data.now.temp}°C`,
            condition: data.now.text,
            icon: weatherIcon,
            location: locationName,
            loading: false,
          })
        }
        else {
          throw new Error('天气数据格式错误')
        }
      }
      catch (error) {
        console.error('获取天气数据失败:', error)
        // 出错时使用默认数据
        setWeather({
          temp: '23°C',
          condition: '晴朗',
          icon: 'ri:sun-line',
          location: '北京',
          loading: false,
        })
      }
    }

    // 调用天气API
    getWeatherData()
  }, [])

  // 使用金山词霸每日一句API
  useEffect(() => {
    const getQuoteData = async () => {
      try {
        // 设置加载状态
        setQuote(prev => ({ ...prev, loading: true }))

        // 获取每日一句数据
        const data = await fetchDailyQuote()

        if (data && data.content) {
          // 更新每日一句状态
          setQuote({
            content: data.content,
            translation: data.translation,
            author: data.author || 'Daily English',
            picture: data.picture,
            loading: false,
          })
        }
        else {
          throw new Error('每日一句数据格式错误')
        }
      }
      catch (error) {
        console.error('获取每日一句失败:', error)

        // 出错时使用默认数据
        const fallbackQuotes: QuoteData[] = [
          {
            content: 'The best way to predict the future is to invent it.',
            translation: '预测未来的最好方法就是创造未来。',
            author: 'Alan Kay',
            loading: false,
          },
          {
            content: 'Life is 10% what happens to you and 90% how you react to it.',
            translation: '生活中10%是发生在你身上的事，90%是你对此的反应。',
            author: 'Charles R. Swindoll',
            loading: false,
          },
          {
            content: 'The only limit to our realization of tomorrow will be our doubts of today.',
            translation: '实现明天理想的唯一障碍是今天的疑虑。',
            author: 'Franklin D. Roosevelt',
            loading: false,
          },
          {
            content: 'The greatest glory in living lies not in never falling, but in rising every time we fall.',
            translation: '生活中最大的荣耀不在于永不跌倒，而在于每次跌倒后都能爬起来。',
            author: 'Nelson Mandela',
            loading: false,
          },
          {
            content: 'Success is not final, failure is not fatal: It is the courage to continue that counts.',
            translation: '成功不是终点，失败也不是致命的：重要的是继续前进的勇气。',
            author: 'Winston Churchill',
            loading: false,
          },
        ]

        // 随机选择一条备用每日一句
        const randomIndex = Math.floor(Math.random() * fallbackQuotes.length)
        setQuote(fallbackQuotes[randomIndex]!)
      }
    }

    // 调用每日一句API
    getQuoteData()
  }, [])

  // 格式化时间和日期
  const formattedTime = currentTime.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  const formattedDate = currentTime.toLocaleDateString('zh-CN', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <motion.div
      className="flex h-full flex-col gap-5 rounded-xl sm:gap-3 md:gap-4 lg:gap-5"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      {/* 1. 图片展示区 - 移动端优化 */}
      <div className="overflow-hidden rounded-xl shadow-md sm:max-h-[120px] md:max-h-[150px] lg:max-h-none">
        <img
          src="https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/1747142036772-a21c8a72400e04f4d03d63bf48f59951.gif"
          alt="动态展示"
          className="h-auto w-full object-cover sm:object-contain md:object-cover"
          loading="lazy"
        />
      </div>

      {/* 2. 日期和天气卡片 - 移动端优化 */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 p-4 text-white shadow-md backdrop-blur-sm sm:p-3 md:p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold tracking-tight sm:text-2xl md:text-3xl">{formattedTime}</div>
            <div className="mt-1 text-sm text-white/80 sm:text-xs md:text-sm">{formattedDate}</div>
          </div>
          <div className="flex flex-col items-center rounded-lg bg-white/10 p-2 backdrop-blur-sm sm:p-1.5 md:p-2">
            <div className="flex items-center gap-1">
              <Icon icon="ri:map-pin-line" className="text-xs text-white/80" />
              <span className="text-xs text-white/80 sm:text-[10px] md:text-xs">{weather.location}</span>
            </div>
            <Icon icon={weather.icon} className="mt-1 text-2xl sm:text-xl md:text-2xl" />
            <div className="mt-1 text-sm font-medium sm:mt-0.5 sm:text-xs md:mt-1 md:text-sm">{weather.temp}</div>
            <div className="text-xs text-white/80 sm:text-[10px] md:text-xs">{weather.condition}</div>
          </div>
        </div>

        {/* 装饰元素 - 在小屏幕上缩小或隐藏 */}
        <div className="absolute -right-4 -top-4 size-16 rounded-full bg-white/10 sm:size-12 md:size-14 lg:size-16"></div>
        <div className="absolute -bottom-4 -left-4 size-16 rounded-full bg-white/10 sm:size-12 md:size-14 lg:size-16"></div>
      </div>

      {/* 3. 每日英语区块 - 移动端优化 */}
      <div className="rounded-xl bg-card p-4 shadow-sm sm:p-3 md:p-4">
        <h3 className="text-card-foreground mb-3 flex items-center text-sm font-medium sm:mb-2 sm:text-xs md:mb-3 md:text-sm">
          <Icon icon="ri:english-input" className="mr-1.5" />
          每日英语
        </h3>
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 p-4 dark:from-gray-800 dark:to-gray-700 sm:p-3 md:p-4">
          {quote.loading
            ? (
                <div className="flex h-24 items-center justify-center sm:h-16 md:h-20 lg:h-24">
                  <div className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent sm:size-4 md:size-5"></div>
                </div>
              )
            : (
                <>
                  <div className="absolute -right-4 -top-4 text-6xl text-gray-200 opacity-30 dark:text-gray-600 sm:text-4xl md:text-5xl lg:text-6xl">
                    <Icon icon="ri:double-quotes-r" />
                  </div>
                  <blockquote className="relative z-10">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 sm:text-xs md:text-sm">
                      "
                      {quote.content}
                      "
                    </p>
                    <p className="mt-2 text-sm italic text-gray-600 dark:text-gray-400 sm:mt-1 sm:text-xs md:mt-2 md:text-sm">
                      {quote.translation}
                    </p>
                    <footer className="mt-3 flex items-center justify-between sm:mt-2 md:mt-3">
                      <div className="flex items-center">
                        <Icon
                          icon="ri:volume-up-line"
                          className="mr-1 cursor-pointer text-primary hover:text-primary/80"
                          onClick={() => {
                            const utterance = new SpeechSynthesisUtterance(quote.content)
                            utterance.lang = 'en-US'
                            window.speechSynthesis.speak(utterance)
                          }}
                        />
                        <span className="text-xs text-gray-500 sm:text-[10px] md:text-xs">朗读</span>
                      </div>
                      <span className="text-right text-xs font-medium text-gray-500 dark:text-gray-400 sm:text-[10px] md:text-xs">
                        —
                        {' '}
                        {quote.author}
                      </span>
                    </footer>
                  </blockquote>
                </>
              )}
        </div>
      </div>

      {/* 4. 推荐工具区域 (实际是广告) - 移动端优化 */}
      <div className="rounded-xl bg-card p-4 shadow-sm sm:p-3 md:p-4">
        <h3 className="text-card-foreground mb-3 flex items-center text-sm font-medium sm:mb-2 sm:text-xs md:mb-3 md:text-sm">
          <Icon icon="ri:tools-line" className="mr-1.5" />
          开发者工具推荐
        </h3>
        <div className="overflow-hidden rounded-lg">
          {/* 这里是广告占位区域，但设计成推荐工具的样式 */}
          <div className="relative">
            {/* 实际使用时这里放广告代码 */}
            <div className="flex flex-col gap-3 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 p-4 dark:from-gray-800 dark:to-gray-700 sm:gap-2 sm:p-3 md:gap-3 md:p-4">
              <div className="flex items-center gap-3 sm:gap-2 md:gap-3">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 sm:size-10 md:size-12">
                  <Icon icon="ri:code-box-line" className="text-2xl sm:text-xl md:text-2xl" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 sm:text-xs md:text-sm">VSCode AI 助手</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 sm:text-[10px] md:text-xs">智能代码补全和建议</p>
                </div>
              </div>

              <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400 sm:line-clamp-2 sm:text-[10px] md:line-clamp-none md:text-xs">
                使用AI提升您的编码效率，实时代码建议、自动补全和智能重构，让编程更轻松。
              </p>

              <a
                href="#"
                className="mt-1 inline-flex items-center self-end rounded-full bg-blue-500 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-blue-600 sm:mt-0 sm:px-2 sm:py-0.5 sm:text-[10px] md:mt-1 md:px-3 md:py-1 md:text-xs"
              >
                了解详情
                <Icon icon="ri:arrow-right-s-line" className="ml-1" />
              </a>

              {/* 小标记表明这是赞助内容，但不明显 */}
              <div className="absolute right-2 top-2">
                <span className="rounded-sm bg-gray-200/50 px-1 py-0.5 text-[10px] text-gray-500 dark:bg-gray-700/50 dark:text-gray-400 sm:text-[8px] md:text-[10px]">
                  推荐
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. 查看全部区域 - 移动端优化 */}
      <div className="mt-auto rounded-xl bg-card p-4 shadow-sm sm:p-3 md:p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Icon icon="ri:article-line" className="mr-2 text-lg text-primary sm:mr-1 sm:text-base md:mr-2 md:text-lg" />
            <span className="text-card-foreground text-sm font-medium sm:text-xs md:text-sm">博客统计</span>
          </div>
          <Link
            href="/blog"
            className="text-xs font-medium text-primary hover:underline sm:text-[10px] md:text-xs"
          >
            查看全部
          </Link>
        </div>
        <div className="mt-3 flex items-center justify-around sm:mt-2 md:mt-3">
          <div className="text-center">
            <div className="text-card-foreground text-xl font-bold sm:text-lg md:text-xl">{filteredPosts.length}</div>
            <div className="text-muted-foreground text-xs sm:text-[10px] md:text-xs">文章</div>
          </div>
          <div className="text-center">
            <div className="text-card-foreground text-xl font-bold sm:text-lg md:text-xl">
              {filteredPosts.reduce((acc, post) => acc + (post.metadata.readingTime || 0), 0).toFixed(0)}
            </div>
            <div className="text-muted-foreground text-xs sm:text-[10px] md:text-xs">阅读分钟</div>
          </div>
          <div className="text-center">
            <div className="text-card-foreground text-xl font-bold sm:text-lg md:text-xl">
              {new Set(filteredPosts.flatMap(post =>
                post.metadata.frontMatter.tags?.map(tag =>
                  typeof tag === 'string' ? tag : (tag as any).label,
                ) || [],
              )).size}
            </div>
            <div className="text-muted-foreground text-xs sm:text-[10px] md:text-xs">标签</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
