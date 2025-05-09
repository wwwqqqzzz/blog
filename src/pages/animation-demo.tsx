import React, { useState } from 'react'
import Layout from '@theme/Layout'
import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'
import Link from '@docusaurus/Link'
import AnimatedHeading from '@site/src/components/AnimatedHeading'
import {
  FadeIn,
  Fade,
  Slide,
  Scale,
  AnimatedList,
  RippleEffect,
  TypewriterEffect,
  ScrollProgress,
  ParallaxScroll,
  HoverEffect,
} from '@site/src/components/ui/animations'
import {
  ScrollReveal,
  ScrollStagger,
  ScrollParallax,
  ScrollProgressIndicator,
  FadeByScroll,
  StickyScroll,
} from '@site/src/components/ui/scroll-animations'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@site/src/components/ui'
import { Button } from '@site/src/components/ui'

/**
 * 动画演示页面
 * 展示各种动画效果和微交互
 */
export default function AnimationDemo(): React.ReactElement {
  const [activeTab, setActiveTab] = useState<string>('基础动画')
  const [showFade, setShowFade] = useState<boolean>(true)
  const [showSlide, setShowSlide] = useState<boolean>(true)
  const [showScale, setShowScale] = useState<boolean>(true)

  // 示例数据
  const listItems = [
    '列表项 1 - 动画延迟最短',
    '列表项 2 - 中等延迟',
    '列表项 3 - 延迟更长',
    '列表项 4 - 动画延迟最长',
  ]

  return (
    <Layout
      title="动画与微交互演示"
      description="博客系统动画效果与微交互展示页面"
    >
      {/* 页面顶部进度条 */}
      <ScrollProgress />

      <main className="container mx-auto max-w-5xl px-4 py-12">
        <AnimatedHeading
          title="动画与微交互演示"
          subtitle="浏览各种动画效果，提升用户体验"
          gradient
          typewriter={false}
          className="mb-12"
        />

        <Tabs
          className="mb-8"
          values={[
            { label: '基础动画', value: '基础动画' },
            { label: '滚动动画', value: '滚动动画' },
            { label: '交互效果', value: '交互效果' },
            { label: '页面过渡', value: '页面过渡' },
          ]}
          defaultValue="基础动画"
        >
          <TabItem value="基础动画">
            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* 淡入动画 */}
              <Card>
                <CardHeader>
                  <CardTitle>淡入动画 (FadeIn)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4">
                    <FadeIn delay={0.1} from="bottom">
                      <div className="flex size-24 items-center justify-center rounded-lg bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                        底部淡入
                      </div>
                    </FadeIn>
                    <FadeIn delay={0.3} from="top">
                      <div className="flex size-24 items-center justify-center rounded-lg bg-accent-100 text-accent-700 dark:bg-accent-900 dark:text-accent-300">
                        顶部淡入
                      </div>
                    </FadeIn>
                    <FadeIn delay={0.5} from="left">
                      <div className="bg-success-100 text-success-700 dark:bg-success-900 dark:text-success-300 flex size-24 items-center justify-center rounded-lg">
                        左侧淡入
                      </div>
                    </FadeIn>
                    <FadeIn delay={0.7} from="right">
                      <div className="bg-warning-100 text-warning-700 dark:bg-warning-900 dark:text-warning-300 flex size-24 items-center justify-center rounded-lg">
                        右侧淡入
                      </div>
                    </FadeIn>
                  </div>
                </CardContent>
              </Card>

              {/* 淡入淡出动画 */}
              <Card>
                <CardHeader>
                  <CardTitle>淡入淡出 (Fade)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-32">
                    <Fade show={showFade}>
                      <div className="flex h-24 w-full items-center justify-center rounded-lg bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                        点击按钮切换显示/隐藏
                      </div>
                    </Fade>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => setShowFade(!showFade)}>
                    {showFade ? '隐藏' : '显示'}
                  </Button>
                </CardFooter>
              </Card>

              {/* 滑动动画 */}
              <Card>
                <CardHeader>
                  <CardTitle>滑动动画 (Slide)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-32">
                    <Slide show={showSlide} from="right">
                      <div className="flex h-24 w-full items-center justify-center rounded-lg bg-accent-100 text-accent-700 dark:bg-accent-900 dark:text-accent-300">
                        从右侧滑入
                      </div>
                    </Slide>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => setShowSlide(!showSlide)}>
                    {showSlide ? '隐藏' : '显示'}
                  </Button>
                </CardFooter>
              </Card>

              {/* 缩放动画 */}
              <Card>
                <CardHeader>
                  <CardTitle>缩放动画 (Scale)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-32">
                    <Scale show={showScale} origin="center">
                      <div className="bg-success-100 text-success-700 dark:bg-success-900 dark:text-success-300 flex h-24 w-full items-center justify-center rounded-lg">
                        中心放大
                      </div>
                    </Scale>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => setShowScale(!showScale)}>
                    {showScale ? '隐藏' : '显示'}
                  </Button>
                </CardFooter>
              </Card>

              {/* 列表动画 */}
              <Card>
                <CardHeader>
                  <CardTitle>列表动画 (AnimatedList)</CardTitle>
                </CardHeader>
                <CardContent>
                  <AnimatedList staggerDelay={0.1}>
                    {listItems.map((item, index) => (
                      <div
                        key={index}
                        className="mb-2 rounded-lg bg-gray-100 p-3 dark:bg-gray-800"
                      >
                        {item}
                      </div>
                    ))}
                  </AnimatedList>
                </CardContent>
              </Card>

              {/* 打字机效果 */}
              <Card>
                <CardHeader>
                  <CardTitle>打字机效果 (TypewriterEffect)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-24 rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
                    <TypewriterEffect
                      text="这是一个打字机效果演示，文字会逐字显示..."
                      speed={50}
                      className="text-lg font-medium"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabItem>

          <TabItem value="滚动动画">
            <div className="mt-8 space-y-24">
              {/* 滚动显示动画 */}
              <div>
                <h2 className="mb-4 text-2xl font-bold">滚动显示 (ScrollReveal)</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {[
                    { dir: 'up', color: 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' },
                    { dir: 'down', color: 'bg-accent-100 text-accent-700 dark:bg-accent-900 dark:text-accent-300' },
                    { dir: 'left', color: 'bg-success-100 text-success-700 dark:bg-success-900 dark:text-success-300' },
                    { dir: 'right', color: 'bg-warning-100 text-warning-700 dark:bg-warning-900 dark:text-warning-300' },
                  ].map((item, index) => (
                    <ScrollReveal
                      key={index}
                      direction={item.dir as any}
                      delay={index * 0.1}
                    >
                      <div className={`flex h-40 items-center justify-center rounded-lg ${item.color}`}>
                        从
                        {item.dir === 'up' ? '下' : item.dir === 'down' ? '上' : item.dir === 'left' ? '右' : '左'}
                        方滚动显示
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>

              {/* 滚动错开动画 */}
              <div>
                <h2 className="mb-4 text-2xl font-bold">滚动错开 (ScrollStagger)</h2>
                <ScrollStagger className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex h-32 items-center justify-center rounded-lg bg-gray-100 p-4 shadow-sm dark:bg-gray-800"
                    >
                      错开显示项
                      {' '}
                      {index + 1}
                    </div>
                  ))}
                </ScrollStagger>
              </div>

              {/* 视差滚动 */}
              <div>
                <h2 className="mb-4 text-2xl font-bold">视差滚动 (ScrollParallax)</h2>
                <div className="relative h-64 overflow-hidden rounded-xl bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20">
                  <ScrollParallax speed={-0.2} className="absolute inset-0 flex items-center justify-center">
                    <div className="text-4xl font-bold text-primary-500">背景层 (慢)</div>
                  </ScrollParallax>
                  <ScrollParallax speed={0.1} className="absolute inset-0 flex items-center justify-center">
                    <div className="text-5xl font-bold text-accent-500/70">中间层</div>
                  </ScrollParallax>
                  <ScrollParallax speed={0.4} className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl font-bold text-primary-500/50">前景层 (快)</div>
                  </ScrollParallax>
                </div>
              </div>
            </div>
          </TabItem>

          <TabItem value="交互效果">
            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* 波纹效果 */}
              <Card>
                <CardHeader>
                  <CardTitle>波纹效果 (RippleEffect)</CardTitle>
                </CardHeader>
                <CardContent>
                  <RippleEffect className="flex h-40 items-center justify-center rounded-lg bg-primary-500 text-white">
                    点击产生波纹效果
                  </RippleEffect>
                </CardContent>
              </Card>

              {/* 悬浮效果 */}
              <Card>
                <CardHeader>
                  <CardTitle>悬浮效果 (HoverEffect)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4">
                    <HoverEffect className="flex size-28 items-center justify-center rounded-lg bg-primary-100 text-primary-700 dark:bg-primary-800 dark:text-primary-300">
                      默认悬浮
                    </HoverEffect>
                    <HoverEffect
                      className="flex size-28 items-center justify-center rounded-lg bg-accent-100 text-accent-700 dark:bg-accent-800 dark:text-accent-300"
                      scale={1.1}
                      rotate={5}
                    >
                      旋转放大
                    </HoverEffect>
                    <HoverEffect
                      className="bg-success-100 text-success-700 dark:bg-success-800 dark:text-success-300 flex size-28 items-center justify-center rounded-lg"
                      y={-15}
                      shadow="shadow-none hover:shadow-xl"
                    >
                      大幅上浮
                    </HoverEffect>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabItem>

          <TabItem value="页面过渡">
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>页面过渡</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">页面过渡效果在页面导航时应用，请访问以下链接体验：</p>
                  <div className="flex flex-wrap gap-4">
                    <Link
                      to="/"
                      className="rounded-md bg-primary-500 px-4 py-2 text-white hover:bg-primary-600"
                    >
                      首页
                    </Link>
                    <Link
                      to="/blog"
                      className="rounded-md bg-accent-500 px-4 py-2 text-white hover:bg-accent-600"
                    >
                      博客
                    </Link>
                    <Link
                      to="/ui-components"
                      className="rounded-md bg-success-500 px-4 py-2 text-white hover:bg-success-600"
                    >
                      UI组件
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabItem>
        </Tabs>
      </main>

      {/* 滚动指示器 */}
      <ScrollProgressIndicator showPercentage />
    </Layout>
  )
}
