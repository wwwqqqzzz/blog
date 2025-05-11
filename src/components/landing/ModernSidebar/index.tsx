import Link from '@docusaurus/Link'
import type { BlogPost } from '@docusaurus/plugin-content-blog'
import { motion } from 'framer-motion'
import React, { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'

// 简化版侧边栏组件
export function ModernSidebar({
  filteredPosts,
}: {
  filteredPosts: BlogPost[]
}) {
  // 时间和日期状态
  const [currentTime, setCurrentTime] = useState(new Date())
  const [weather, setWeather] = useState({
    temp: '23°C',
    condition: '晴朗',
    icon: 'ri:sun-line',
    loading: true,
  })

  // 金山词霸每日一句状态
  const [quote, setQuote] = useState({
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

  // 获取天气数据
  useEffect(() => {
    // 使用和风天气API获取天气数据
    const fetchWeather = async () => {
      try {
        // 先通过IP获取位置信息
        const locationResponse = await fetch('https://restapi.amap.com/v3/ip?key=0113a13c88697dcea6a445584d535837')
        const locationData = await locationResponse.json()
        const city = locationData.city || '北京'

        // 使用城市名称获取城市ID
        const cityResponse = await fetch(`https://geoapi.qweather.com/v2/city/lookup?location=${encodeURIComponent(city)}&key=80ce7424f8d34974af05d092792c123a`)
        const cityData = await cityResponse.json()

        if (cityData.code === '200' && cityData.location && cityData.location.length > 0) {
          const locationId = cityData.location[0].id

          // 使用城市ID获取天气数据
          const weatherResponse = await fetch(`https://devapi.qweather.com/v7/weather/now?location=${locationId}&key=80ce7424f8d34974af05d092792c123a`)
          const weatherData = await weatherResponse.json()

          if (weatherData.code === '200') {
            // 根据天气状况选择图标
            let icon = 'ri:sun-line'
            const iconMap = {
              晴: 'ri:sun-line',
              多云: 'ri:cloudy-line',
              阴: 'ri:cloudy-2-line',
              雨: 'ri:rainy-line',
              雪: 'ri:snowy-line',
              雾: 'ri:mist-line',
              霾: 'ri:haze-line',
              风: 'ri:windy-line',
              雷: 'ri:thunderstorms-line',
            }

            // 尝试匹配天气文本中的关键词
            for (const [key, value] of Object.entries(iconMap)) {
              if (weatherData.now.text.includes(key)) {
                icon = value
                break
              }
            }

            setWeather({
              temp: `${weatherData.now.temp}°C`,
              condition: weatherData.now.text,
              icon,
              loading: false,
            })
          }
          else {
            throw new Error('获取天气数据失败')
          }
        }
        else {
          throw new Error('获取城市ID失败')
        }
      }
      catch (error) {
        console.error('获取天气数据失败:', error)
        // 出错时使用默认数据
        setWeather({
          temp: '23°C',
          condition: '晴朗',
          icon: 'ri:sun-line',
          loading: false,
        })
      }
    }

    fetchWeather()
  }, [])

  // 获取金山词霸每日一句
  useEffect(() => {
    const fetchQuote = async () => {
      try {
        // 使用金山词霸每日一句API
        const response = await fetch('https://open.iciba.com/dsapi/')
        const data = await response.json()

        setQuote({
          content: data.content,
          translation: data.note,
          author: data.author || 'Daily English',
          loading: false,
        })
      }
      catch (error) {
        console.error('获取每日一句失败:', error)
        setQuote(prev => ({ ...prev, loading: false }))
      }
    }

    fetchQuote()
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
      className="flex h-full flex-col gap-5 rounded-xl"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      {/* 1. 图片展示区 */}
      <div className="overflow-hidden rounded-xl shadow-md">
        <img
          src="https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/1746965731775-25471357192b80de47e28cd7ed93327c.gif"
          alt="动态展示"
          className="h-auto w-full object-cover"
        />
      </div>

      {/* 2. 日期和天气卡片 */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 p-4 text-white shadow-md backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold tracking-tight">{formattedTime}</div>
            <div className="mt-1 text-sm text-white/80">{formattedDate}</div>
          </div>
          <div className="flex flex-col items-center rounded-lg bg-white/10 p-2 backdrop-blur-sm">
            <Icon icon={weather.icon} className="text-2xl" />
            <div className="mt-1 text-sm font-medium">{weather.temp}</div>
          </div>
        </div>

        {/* 装饰元素 */}
        <div className="absolute -right-4 -top-4 size-16 rounded-full bg-white/10"></div>
        <div className="absolute -bottom-4 -left-4 size-16 rounded-full bg-white/10"></div>
      </div>

      {/* 3. 每日英语区块 */}
      <div className="rounded-xl bg-card p-4 shadow-sm">
        <h3 className="text-card-foreground mb-3 flex items-center text-sm font-medium">
          <Icon icon="ri:english-input" className="mr-1.5" />
          每日英语
        </h3>
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 p-4 dark:from-gray-800 dark:to-gray-700">
          {quote.loading
            ? (
                <div className="flex h-24 items-center justify-center">
                  <div className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                </div>
              )
            : (
                <>
                  <div className="absolute -right-4 -top-4 text-6xl text-gray-200 opacity-30 dark:text-gray-600">
                    <Icon icon="ri:double-quotes-r" />
                  </div>
                  <blockquote className="relative z-10">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      "
                      {quote.content}
                      "
                    </p>
                    <p className="mt-2 text-sm italic text-gray-600 dark:text-gray-400">
                      {quote.translation}
                    </p>
                    <footer className="mt-3 flex items-center justify-between">
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
                        <span className="text-xs text-gray-500">朗读</span>
                      </div>
                      <span className="text-right text-xs font-medium text-gray-500 dark:text-gray-400">
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

      {/* 4. 推荐工具区域 (实际是广告) */}
      <div className="rounded-xl bg-card p-4 shadow-sm">
        <h3 className="text-card-foreground mb-3 flex items-center text-sm font-medium">
          <Icon icon="ri:tools-line" className="mr-1.5" />
          开发者工具推荐
        </h3>
        <div className="overflow-hidden rounded-lg">
          {/* 这里是广告占位区域，但设计成推荐工具的样式 */}
          <div className="relative">
            {/* 实际使用时这里放广告代码 */}
            <div className="flex flex-col gap-3 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 p-4 dark:from-gray-800 dark:to-gray-700">
              <div className="flex items-center gap-3">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                  <Icon icon="ri:code-box-line" className="text-2xl" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">VSCode AI 助手</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">智能代码补全和建议</p>
                </div>
              </div>

              <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                使用AI提升您的编码效率，实时代码建议、自动补全和智能重构，让编程更轻松。
              </p>

              <a
                href="#"
                className="mt-1 inline-flex items-center self-end rounded-full bg-blue-500 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-blue-600"
              >
                了解详情
                <Icon icon="ri:arrow-right-s-line" className="ml-1" />
              </a>

              {/* 小标记表明这是赞助内容，但不明显 */}
              <div className="absolute right-2 top-2">
                <span className="rounded-sm bg-gray-200/50 px-1 py-0.5 text-[10px] text-gray-500 dark:bg-gray-700/50 dark:text-gray-400">
                  推荐
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. 查看全部区域 */}
      <div className="mt-auto rounded-xl bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Icon icon="ri:article-line" className="mr-2 text-lg text-primary" />
            <span className="text-card-foreground text-sm font-medium">博客统计</span>
          </div>
          <Link
            href="/blog"
            className="text-xs font-medium text-primary hover:underline"
          >
            查看全部
          </Link>
        </div>
        <div className="mt-3 flex items-center justify-around">
          <div className="text-center">
            <div className="text-card-foreground text-xl font-bold">{filteredPosts.length}</div>
            <div className="text-muted-foreground text-xs">文章</div>
          </div>
          <div className="text-center">
            <div className="text-card-foreground text-xl font-bold">
              {filteredPosts.reduce((acc, post) => acc + (post.metadata.readingTime || 0), 0).toFixed(0)}
            </div>
            <div className="text-muted-foreground text-xs">阅读分钟</div>
          </div>
          <div className="text-center">
            <div className="text-card-foreground text-xl font-bold">
              {new Set(filteredPosts.flatMap(post =>
                post.metadata.frontMatter.tags?.map(tag =>
                  typeof tag === 'string' ? tag : (tag as any).label,
                ) || [],
              )).size}
            </div>
            <div className="text-muted-foreground text-xs">标签</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
