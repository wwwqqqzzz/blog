import Translate from '@docusaurus/Translate'
import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import { Section } from '../Section'

// 消息类型
interface Message {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
}

// 预设问题
const suggestedQuestions = [
  '介绍一下你博客上最近的技术',
  '你有哪些开源项目?',
  '推荐几个前端框架',
  '帮我解释下 React 和 Vue 的区别',
  '能吐槽一下开发中遇到的 Bug 吗?',
]

// 打字机效果Hook
function useTypewriter(text: string, speed = 30) {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    setDisplayedText('')
    setIsComplete(false)

    let i = 0
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(prev => prev + text.charAt(i))
        i++
      }
      else {
        setIsComplete(true)
        clearInterval(timer)
      }
    }, speed)

    return () => clearInterval(timer)
  }, [text, speed])

  return { displayedText, isComplete }
}

// 打字机文本组件
function TypewriterText({ text }: { text: string }) {
  const { displayedText, isComplete } = useTypewriter(text)

  return (
    <>
      {displayedText}
      {!isComplete && (
        <span className="animate-blink ml-1 inline-block h-4 w-2 bg-green-500"></span>
      )}
    </>
  )
}

// 聊天气泡组件
function ChatBubble({ message }: { message: Message }) {
  const isAi = message.sender === 'ai'
  const { displayedText, isComplete } = useTypewriter(
    isAi ? message.text : '',
    isAi ? 30 : 0,
  )

  return (
    <div className={`flex w-full ${isAi ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`
          relative max-w-[80%] rounded-xl p-3 
          ${isAi
      ? 'bg-muted text-foreground rounded-tl-none'
      : 'text-primary-foreground rounded-tr-none bg-primary'
    }
        `}
      >
        {isAi
          ? (
              <>
                {displayedText}
                {!isComplete && (
                  <span className="ml-1 inline-flex animate-pulse">
                    <span className="mr-[2px] text-primary">.</span>
                    <span className="animate-delay-200 mr-[2px] text-primary">.</span>
                    <span className="animate-delay-500 text-primary">.</span>
                  </span>
                )}
              </>
            )
          : (
              message.text
            )}
        <div className="mt-1 text-right text-xs opacity-70">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  )
}

// 终端样式对话框
function TerminalChat({ messages, inputValue, setInputValue, handleSendMessage, loading }: {
  messages: Message[]
  inputValue: string
  setInputValue: (value: string) => void
  handleSendMessage: () => void
  loading: boolean
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 滚动到最新消息
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <motion.div
      className="h-[460px] rounded-xl bg-black p-4 font-mono text-green-500 shadow-lg"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      {/* 终端标题栏 */}
      <div className="mb-3 flex items-center space-x-1">
        <div className="size-3 rounded-full bg-red-500"></div>
        <div className="size-3 rounded-full bg-yellow-500"></div>
        <div className="size-3 rounded-full bg-green-500"></div>
        <div className="ml-2 text-xs text-white">AI-Assistant ~ Terminal</div>
      </div>

      {/* 消息区域 */}
      <div className="custom-scrollbar h-[360px] overflow-y-auto pr-2">
        {messages.length === 0
          ? (
              <div className="flex h-full flex-col items-center justify-center opacity-50">
                <Icon icon="ri:robot-line" className="mb-3 size-10" />
                <p className="text-center text-sm">输入问题来和 AI 小助手交流吧</p>
              </div>
            )
          : (
              <>
                {messages.map(msg => (
                  <div key={msg.id} className="mb-3">
                    <div className="mb-1 text-xs text-green-300">
                      {msg.sender === 'user' ? '你' : '小助手'}
                      {' '}
                      <span className="opacity-50">~</span>
                    </div>
                    <div className="text-sm">
                      {msg.sender === 'ai'
                        ? <TypewriterText text={msg.text} />
                        : msg.text}
                    </div>
                  </div>
                ))}
              </>
            )}
        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div className="mt-2 flex items-center">
        <span className="mr-2 text-xs">$</span>
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
          className="flex-1 bg-transparent text-sm text-green-400 outline-none"
          placeholder="输入你的问题..."
          disabled={loading}
        />
      </div>
    </motion.div>
  )
}

// 聊天气泡样式对话框
function BubbleChat({ messages, inputValue, setInputValue, handleSendMessage, loading }: {
  messages: Message[]
  inputValue: string
  setInputValue: (value: string) => void
  handleSendMessage: () => void
  loading: boolean
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 滚动到最新消息
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <motion.div
      className="flex h-[460px] flex-col rounded-xl bg-card p-4 shadow-lg"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      {/* 消息区域 */}
      <div className="custom-scrollbar flex-1 overflow-y-auto pr-2">
        {messages.length === 0
          ? (
              <div className="flex h-full flex-col items-center justify-center">
                <div className="bg-primary/10 rounded-full p-4">
                  <Icon icon="ri:robot-line" className="size-10 text-primary" />
                </div>
                <p className="text-muted-foreground mt-4 text-center text-sm">
                  和 AI 小助手聊聊吧！
                </p>
              </div>
            )
          : (
              <div className="flex flex-col space-y-4">
                {messages.map(msg => (
                  <ChatBubble key={msg.id} message={msg} />
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
      </div>

      {/* 输入区域 */}
      <div className="mt-4 flex items-center rounded-lg border bg-background p-2">
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
          className="flex-1 bg-transparent px-2 text-sm outline-none"
          placeholder="输入你的问题..."
          disabled={loading}
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputValue.trim() || loading}
          className="hover:bg-primary/80 ml-2 rounded-md bg-primary p-2 text-white transition-colors disabled:opacity-50"
        >
          {loading
            ? (
                <Icon icon="svg-spinners:270-ring" className="size-4" />
              )
            : (
                <Icon icon="ri:send-plane-fill" className="size-4" />
              )}
        </button>
      </div>
    </motion.div>
  )
}

// AI 助手介绍区域
function AIIntroPanel({ onClickSuggestion }: { onClickSuggestion: (question: string) => void }) {
  return (
    <motion.div
      className="h-[460px] rounded-xl bg-card p-6 shadow-lg"
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <h3 className="mb-2 flex items-center text-xl font-bold">
        <Icon icon="ri:robot-line" className="mr-2 text-primary" />
        AI 小助手能做什么？
      </h3>

      <p className="text-muted-foreground mb-4 text-sm">
        我是个人博客的 AI 小助手，可以回答关于博客内容、项目和技术的问题。
      </p>

      <h4 className="mb-3 font-medium">你可以问我：</h4>

      <div className="space-y-3">
        {suggestedQuestions.map((question, idx) => (
          <motion.div
            key={idx}
            className="bg-muted hover:bg-muted/80 cursor-pointer rounded-lg p-3 text-sm transition-colors"
            whileHover={{ x: 5 }}
            onClick={() => onClickSuggestion(question)}
          >
            {question}
          </motion.div>
        ))}
      </div>

      <div className="bg-primary/10 mt-6 rounded-lg p-3">
        <p className="text-sm font-medium text-primary">
          <Icon icon="ri:lightbulb-flash-line" className="mr-1" />
          小贴士
        </p>
        <p className="text-muted-foreground mt-2 text-xs">
          小助手会尝试根据博客内容回答问题，但并不总是完美。这是一个模拟演示，实际项目中可以集成各种开源或商业 AI 模型。
        </p>
      </div>
    </motion.div>
  )
}

// 样式切换器
function StyleSwitcher({ currentStyle, onSwitch }: {
  currentStyle: 'terminal' | 'bubbles'
  onSwitch: () => void
}) {
  return (
    <button
      onClick={onSwitch}
      className="bg-muted hover:bg-muted/80 absolute right-4 top-4 z-10 rounded-full p-2 shadow-sm transition-colors"
      aria-label="切换样式"
    >
      <Icon
        icon={currentStyle === 'terminal' ? 'ri:message-3-line' : 'ri:terminal-box-line'}
        className="size-5"
      />
    </button>
  )
}

// 模拟 AI 回复
const simulateAIResponse = async (question: string): Promise<string> => {
  // 这里模拟 AI 回复，实际项目中应该调用真实的 AI API
  return new Promise((resolve) => {
    setTimeout(() => {
      const responses: Record<string, string> = {
        '介绍一下你博客上最近的技术': '最近我在博客上分享了 React 18 的新特性、Tailwind CSS 高级技巧，以及 Next.js 应用路由的最佳实践。还有一系列关于 TypeScript 类型体操的技术文章。',
        '你有哪些开源项目?': '我目前维护着几个开源项目：一个 React 组件库、一个 VSCode 扩展、一个静态站点生成器，以及一些小型工具库。我特别推荐您看看我的文档站生成工具，它结合了 MDX 和交互式组件。',
        '推荐几个前端框架': '我个人最喜欢的前端框架有：\n1. React - 生态系统强大\n2. Vue - 简单易学\n3. Svelte - 编译时优化\n4. Solid.js - 性能极佳\n5. Qwik - 部分水合理念\n选择哪个取决于您的项目需求和团队熟悉度。',
        '帮我解释下 React 和 Vue 的区别': 'React 和 Vue 主要区别：\n- 心智模型：React 偏函数式，Vue 偏声明式\n- 状态管理：React 通过 hooks，Vue 通过响应式系统\n- 模板：React 用 JSX，Vue 有专用模板语法\n- 学习曲线：Vue 入门更平缓，React 概念更抽象\n- 生态：React 生态更庞大，Vue 官方库更集成',
        '能吐槽一下开发中遇到的 Bug 吗?': '哈哈，开发中最令人崩溃的 Bug：\n- 那些只在生产环境出现的幽灵问题\n- "在我电脑上能运行"系列\n- 找了一整天，结果是少了一个分号\n- IE浏览器兼容性问题（感谢它终于退休了！）\n- 明明写的没问题，但就是不工作...\n最可怕的是：解决一个bug，引入两个新bug 😭',
      }

      // 默认回复
      let response = '这是个有趣的问题！作为一个演示 AI，我的知识有限。不过在实际项目中，你可以接入通义千问、文心一言、智谱清言等国内大语言模型来提供更丰富的回答。'

      // 查找预设回答或相似问题
      for (const [key, value] of Object.entries(responses)) {
        if (question.includes(key) || key.includes(question)) {
          response = value
          break
        }
      }

      resolve(response)
    }, 1000) // 模拟网络延迟
  })
}

// AI 小助手主组件
export default function AIAssistantSection(): React.ReactNode {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [chatStyle, setChatStyle] = useState<'terminal' | 'bubbles'>('terminal')

  // 发送消息
  const handleSendMessage = async () => {
    const message = inputValue.trim()
    if (!message || loading) return

    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setLoading(true)

    try {
      // 获取 AI 回复
      const response = await simulateAIResponse(message)

      // 添加 AI 回复
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'ai',
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, aiMessage])
    }
    catch (error) {
      console.error('Failed to get AI response:', error)

      // 添加错误消息
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: '抱歉，我遇到了一些问题。请稍后再试。',
        sender: 'ai',
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, errorMessage])
    }
    finally {
      setLoading(false)
    }
  }

  // 点击建议问题
  const handleSuggestionClick = (question: string) => {
    setInputValue(question)
    // 延迟一下，让用户看到问题被填入输入框
    setTimeout(() => {
      handleSendMessage()
    }, 500)
  }

  // 切换聊天界面样式
  const toggleChatStyle = () => {
    setChatStyle(prev => prev === 'terminal' ? 'bubbles' : 'terminal')
  }

  return (
    <Section
      title={<Translate id="homepage.ai.title">🤖 AI 小助手</Translate>}
      icon="ri:robot-line"
    >
      <div className="relative mb-10">
        <StyleSwitcher currentStyle={chatStyle} onSwitch={toggleChatStyle} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* 左侧聊天界面 */}
          <div className="lg:col-span-7">
            {chatStyle === 'terminal'
              ? (
                  <TerminalChat
                    messages={messages}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    handleSendMessage={handleSendMessage}
                    loading={loading}
                  />
                )
              : (
                  <BubbleChat
                    messages={messages}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    handleSendMessage={handleSendMessage}
                    loading={loading}
                  />
                )}
          </div>

          {/* 右侧介绍区域 */}
          <div className="lg:col-span-5">
            <AIIntroPanel onClickSuggestion={handleSuggestionClick} />
          </div>
        </div>
      </div>
    </Section>
  )
}
