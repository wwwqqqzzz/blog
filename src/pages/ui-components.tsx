import React, { useState } from 'react'
import MyLayout from '@site/src/theme/MyLayout'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Badge,
  Input,
} from '@site/src/components/ui'
import { HtmlClassNameProvider } from '@docusaurus/theme-common'

export default function UIComponentsPage(): React.ReactNode {
  const [inputValue, setInputValue] = useState('')

  return (
    <HtmlClassNameProvider className="ui-components-page">
      <MyLayout>
        <div className="container mx-auto py-10">
          <h1 className="mb-8 text-3xl font-bold">UI组件库</h1>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold">按钮组件</h2>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">主要按钮</Button>
              <Button variant="secondary">次要按钮</Button>
              <Button variant="outline">轮廓按钮</Button>
              <Button variant="ghost">幽灵按钮</Button>
              <Button variant="link">链接按钮</Button>
              <Button variant="danger">危险按钮</Button>
            </div>

            <h3 className="mb-4 mt-6 text-xl font-medium">按钮尺寸</h3>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm" variant="primary">小按钮</Button>
              <Button size="md" variant="primary">中按钮</Button>
              <Button size="lg" variant="primary">大按钮</Button>
            </div>

            <h3 className="mb-4 mt-6 text-xl font-medium">带图标的按钮</h3>
            <div className="flex flex-wrap gap-4">
              <Button startIcon="ri:user-line">用户</Button>
              <Button endIcon="ri:arrow-right-line">下一步</Button>
              <Button startIcon="ri:search-line" variant="outline">搜索</Button>
              <Button variant="ghost" startIcon="ri:settings-line">设置</Button>
            </div>

            <h3 className="mb-4 mt-6 text-xl font-medium">状态按钮</h3>
            <div className="flex flex-wrap gap-4">
              <Button disabled>禁用按钮</Button>
              <Button isLoading>加载中</Button>
              <Button fullWidth>全宽按钮</Button>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold">卡片组件</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>卡片标题</CardTitle>
                  <CardDescription>这是一个简单的卡片描述示例</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>卡片内容区域，可以放置任何内容。比如这段文字描述了卡片组件的用途和灵活性。</p>
                </CardContent>
                <CardFooter>
                  <Button variant="primary">操作按钮</Button>
                </CardFooter>
              </Card>

              <Card hasShadow={false} noBorder>
                <CardHeader withBorder={false}>
                  <CardTitle>无边框卡片</CardTitle>
                  <CardDescription>这是一个无边框和阴影的卡片</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>卡片内容区域示例文本。</p>
                </CardContent>
              </Card>

              <Card hoverEffect>
                <CardHeader>
                  <CardTitle>悬停效果卡片</CardTitle>
                  <CardDescription>将鼠标悬停在此卡片上查看效果</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>此卡片在悬停时会有轻微的上浮和阴影增强效果。</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline">详情</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>卡片示例</CardTitle>
                </CardHeader>
                <CardContent noPadding>
                  <div className="bg-gray-100 p-4 dark:bg-gray-700">
                    <p>这是一个无内边距的内容区域，自定义了背景色。</p>
                  </div>
                </CardContent>
                <CardFooter withBorder={false}>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">取消</Button>
                    <Button variant="primary" size="sm">确认</Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold">徽章组件</h2>
            <div className="space-y-6">
              <div>
                <h3 className="mb-4 text-xl font-medium">基础徽章</h3>
                <div className="flex flex-wrap gap-3">
                  <Badge>默认徽章</Badge>
                  <Badge variant="primary">主要徽章</Badge>
                  <Badge variant="secondary">次要徽章</Badge>
                  <Badge variant="success">成功徽章</Badge>
                  <Badge variant="warning">警告徽章</Badge>
                  <Badge variant="danger">危险徽章</Badge>
                  <Badge variant="info">信息徽章</Badge>
                  <Badge variant="outline">轮廓徽章</Badge>
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-xl font-medium">圆形徽章</h3>
                <div className="flex flex-wrap gap-3">
                  <Badge rounded>默认圆形</Badge>
                  <Badge variant="primary" rounded>主要圆形</Badge>
                  <Badge variant="success" rounded>成功圆形</Badge>
                  <Badge variant="danger" rounded>危险圆形</Badge>
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-xl font-medium">尺寸徽章</h3>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge size="sm" variant="primary">小尺寸</Badge>
                  <Badge size="md" variant="primary">中尺寸</Badge>
                  <Badge size="lg" variant="primary">大尺寸</Badge>
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-xl font-medium">带图标徽章</h3>
                <div className="flex flex-wrap gap-3">
                  <Badge startIcon="ri:check-line" variant="success">已完成</Badge>
                  <Badge endIcon="ri:arrow-right-s-line" variant="info">更多</Badge>
                  <Badge startIcon="ri:time-line" variant="warning">等待中</Badge>
                  <Badge startIcon="ri:error-warning-line" variant="danger">错误</Badge>
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-xl font-medium">可移除徽章</h3>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="primary" removable>可移除徽章</Badge>
                  <Badge variant="outline" removable rounded>可移除圆形</Badge>
                  <Badge startIcon="ri:tag-line" variant="info" removable>标签</Badge>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold">输入框组件</h2>
            <div className="space-y-6 md:w-2/3">
              <div>
                <h3 className="mb-4 text-xl font-medium">基础输入框</h3>
                <Input
                  placeholder="请输入内容"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  className="mb-3"
                />
                <Input placeholder="禁用状态" disabled />
              </div>

              <div>
                <h3 className="mb-4 text-xl font-medium">状态输入框</h3>
                <div className="space-y-3">
                  <Input placeholder="成功状态" status="success" />
                  <Input placeholder="错误状态" status="error" />
                  <Input placeholder="警告状态" status="warning" />
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-xl font-medium">带图标输入框</h3>
                <div className="space-y-3">
                  <Input placeholder="搜索..." startIcon="ri:search-line" />
                  <Input placeholder="密码" type="password" endIcon="ri:lock-line" />
                  <Input
                    placeholder="用户名"
                    startIcon="ri:user-line"
                    clearable
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onClear={() => setInputValue('')}
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </MyLayout>
    </HtmlClassNameProvider>
  )
}
