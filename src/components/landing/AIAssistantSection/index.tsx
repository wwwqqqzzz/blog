import Translate from '@docusaurus/Translate'
import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@iconify/react'
import { Section } from '../Section'

// 消息类型
interface Message {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
}

// 预设问题项，包含文本和图标
const questionItems = [
  { text: '介绍一下你博客上最近的技术', icon: 'ri:code-line' },
  { text: '你有哪些开源项目?', icon: 'ri:github-line' },
  { text: '推荐几个前端框架', icon: 'ri:layout-grid-line' },
  { text: '帮我解释下 React 和 Vue 的区别', icon: 'ri:question-line' },
  { text: '能吐槽一下开发中遇到的 Bug 吗?', icon: 'ri:bug-line' },
]

// 预设问题的文本列表
const suggestedQuestions = questionItems.map(item => item.text)

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

// 现代化对话气泡组件
function ChatBubble({ message }: { message: Message }) {
  const isAi = message.sender === 'ai'
  const { displayedText, isComplete } = useTypewriter(
    isAi ? message.text : '',
    isAi ? 30 : 0,
  )

  return (
    <motion.div
      className={`flex w-full items-start gap-2.5 py-1.5 ${isAi ? 'justify-start' : 'justify-end'}`}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {isAi && (
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="mt-1 shrink-0"
        >
          <div className="from-primary/20 to-primary/10 flex size-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r ring-1 ring-white/10">
            <Icon icon="ri:robot-line" className="size-5 text-primary" />
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className={`
          relative max-w-[80%] rounded-xl px-3.5 py-2.5 
          ${isAi
      ? 'text-foreground border-border/10 border bg-card shadow-sm'
      : 'bg-primary/10 text-foreground shadow-sm'}
        `}
      >
        {isAi
          ? (
              <>
                {displayedText}
                {!isComplete && (
                  <span className="ml-1 inline-flex">
                    <motion.span
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="mr-[2px] text-primary"
                    >
                      .
                    </motion.span>
                    <motion.span
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                      className="mr-[2px] text-primary"
                    >
                      .
                    </motion.span>
                    <motion.span
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                      className="text-primary"
                    >
                      .
                    </motion.span>
                  </span>
                )}
              </>
            )
          : (
              message.text
            )}
        <div className="mt-1 text-right text-[9px] text-secondary">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </motion.div>

      {!isAi && (
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="mt-1 shrink-0"
        >
          <div className="bg-primary/5 ring-primary/20 flex size-8 items-center justify-center overflow-hidden rounded-full shadow-sm ring-1">
            <Icon icon="ri:user-3-line" className="size-5 text-primary" />
          </div>
        </motion.div>
      )}
    </motion.div>
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
    // 使用更温和的滚动方式，只滚动聊天容器而不是整个页面
    if (messagesEndRef.current) {
      const chatContainer = messagesEndRef.current.parentElement
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight
      }
    }
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

// 现代化聊天气泡样式对话框
function BubbleChat({ messages, inputValue, setInputValue, handleSendMessage, loading }: {
  messages: Message[]
  inputValue: string
  setInputValue: (value: string) => void
  handleSendMessage: () => void
  loading: boolean
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isListening, setIsListening] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const toggleVoiceInput = () => {
    if (loading) return

    setIsListening(!isListening)

    if (!isListening) {
      // 这里应该接入真实的语音识别API
      setTimeout(() => {
        setInputValue(inputValue + '语音输入的内容...')
        setIsListening(false)
      }, 2000)
    }
  }

  useEffect(() => {
    // 使用更温和的滚动方式，只滚动聊天容器而不是整个页面
    if (messagesEndRef.current) {
      const chatContainer = messagesEndRef.current.parentElement
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight
      }
    }
  }, [messages])

  return (
    <motion.div
      layout
      className="border-border/50 flex h-[460px] flex-col overflow-hidden rounded-xl border bg-card p-0 shadow-lg"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      {/* 头部区域 - 简化设计，去掉多余按钮 */}
      <motion.div
        layout="position"
        className="border-border/30 flex items-center border-b p-3"
      >
        <div className="from-primary/20 to-primary/10 mr-3 flex size-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r ring-1 ring-white/10">
          <Icon icon="ri:robot-line" className="size-6 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-text">AI小助手</h3>
          <p className="text-xs text-secondary">在线，随时为您服务</p>
        </div>
      </motion.div>

      {/* 消息区域 - 调整高度，移除不必要的参数 */}
      <motion.div
        layout="position"
        className="custom-scrollbar flex-1 overflow-y-auto px-3 py-2"
        style={{
          maxHeight: '360px',
          overflow: 'auto',
        }}
      >
        <AnimatePresence>
          {messages.length === 0
            ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex h-full flex-col items-center justify-center py-8 text-center"
                >
                  <div className="bg-primary/10 mb-3 rounded-full p-4">
                    <Icon icon="ri:robot-line" className="size-8 text-primary" />
                  </div>
                  <h4 className="mb-1.5 text-base font-medium text-text">你好！我是AI小助手</h4>
                  <p className="mb-4 max-w-md text-xs text-secondary">
                    有什么可以帮到你的吗？试试下面的快捷问题或直接输入你的问题
                  </p>
                  <div className="mt-1 grid w-full max-w-md grid-cols-1 gap-2 px-4 sm:grid-cols-2">
                    {questionItems.slice(0, 4).map((item, idx) => (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setInputValue(item.text)
                          setTimeout(() => handleSendMessage(), 300)
                        }}
                        className="bg-primary/5 ring-primary/10 hover:bg-primary/10 flex items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-text ring-1 transition-colors"
                      >
                        <Icon icon={item.icon} className="size-3.5 text-primary" />
                        <span>{item.text}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )
            : (
                <div className="flex flex-col space-y-4">
                  {messages.map(msg => (
                    <ChatBubble key={msg.id} message={msg} />
                  ))}
                  {loading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="ml-10 mt-1 flex items-center text-secondary"
                    >
                      <div className="ring-border/10 flex items-center rounded-lg bg-card px-2 py-1 text-xs shadow-sm ring-1">
                        <div className="mr-1.5">AI助手正在输入</div>
                        <div className="flex space-x-1">
                          <motion.div
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="size-1 rounded-full bg-primary"
                          />
                          <motion.div
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                            className="size-1 rounded-full bg-primary"
                          />
                          <motion.div
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                            className="size-1 rounded-full bg-primary"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </motion.div>

      {/* 输入区域 */}
      <motion.div layout="position" className="border-border/30 border-t p-3">
        <motion.div
          animate={{
            boxShadow: isFocused
              ? '0 4px 10px rgba(0, 0, 0, 0.08)'
              : '0 2px 5px rgba(0, 0, 0, 0.03)',
          }}
          className={`flex items-end overflow-hidden rounded-xl border bg-background p-1.5 ${
            isFocused ? 'border-primary/50' : 'border-border/50'
          } ${loading && 'opacity-60'}`}
        >
          {/* 语音输入按钮 */}
          <button
            onClick={toggleVoiceInput}
            disabled={loading}
            className={`ml-0.5 flex size-8 shrink-0 items-center justify-center rounded-full transition-colors ${
              isListening
                ? 'animate-pulse bg-primary text-white'
                : 'bg-primary/10 hover:bg-primary/20 text-primary'
            } ${loading && 'cursor-not-allowed opacity-50'}`}
            aria-label="语音输入"
          >
            <Icon
              icon={isListening ? 'ri:volume-vibrate-line' : 'ri:mic-line'}
              className="size-4"
            />
          </button>

          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="flex-1 bg-transparent px-2.5 py-1.5 text-sm outline-none"
            placeholder={isListening ? '正在聆听...' : '输入您的问题，或点击麦克风进行语音输入...'}
            disabled={loading}
          />

          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || loading}
            className={`mr-0.5 flex size-8 shrink-0 items-center justify-center rounded-full transition-colors ${
              inputValue.trim() && !loading
                ? 'hover:bg-primary/90 bg-primary text-white'
                : 'bg-primary/50 cursor-not-allowed text-white opacity-50'
            }`}
            aria-label="发送消息"
          >
            <Icon
              icon={loading ? 'svg-spinners:180-ring' : 'ri:send-plane-fill'}
              className="size-4"
            />
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

// AI 助手介绍区域
function AIIntroPanel({ onClickSuggestion }: { onClickSuggestion: (question: string) => void }) {
  return (
    <motion.div
      className="flex h-[460px] flex-col rounded-xl bg-card p-4 shadow-lg"
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <h3 className="mb-1.5 flex items-center text-base font-bold">
        <Icon icon="ri:robot-line" className="mr-1.5 text-primary" />
        AI 小助手能做什么？
      </h3>

      <p className="text-muted-foreground mb-2 text-xs">
        我是个人博客的 AI 小助手，可以回答关于博客内容、项目和技术的问题。
      </p>

      <h4 className="mb-1.5 text-sm font-medium">你可以问我：</h4>

      <div className="flex-1 space-y-1.5">
        {questionItems.map((item, idx) => (
          <motion.div
            key={idx}
            className="bg-muted hover:bg-muted/80 flex cursor-pointer items-center rounded-lg p-2 text-xs transition-colors"
            whileHover={{ x: 5 }}
            onClick={() => onClickSuggestion(item.text)}
          >
            <Icon icon={item.icon} className="mr-1.5 size-3.5 text-primary" />
            <span>{item.text}</span>
          </motion.div>
        ))}
      </div>

      <div className="bg-primary/10 mt-3 rounded-lg p-2.5">
        <p className="flex items-center text-xs font-medium text-primary">
          <Icon icon="ri:lightbulb-flash-line" className="mr-1" />
          小贴士
        </p>
        <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
          小助手会尝试根据博客内容回答问题，但并不总是完美。这是一个模拟演示，实际项目中可集成各种AI模型。
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
    <motion.button
      onClick={onSwitch}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="hover:bg-card/90 border-border/30 absolute right-4 top-4 z-10 flex aspect-square size-10 items-center justify-center rounded-full border bg-card shadow-md transition-colors"
      aria-label="切换样式"
    >
      <Icon
        icon={currentStyle === 'terminal' ? 'ri:message-3-line' : 'ri:terminal-box-line'}
        className="size-4"
      />
    </motion.button>
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

// 获取问题图标
const getQuestionIcon = (index: number): string => {
  const icons = [
    'ri:code-line',
    'ri:github-line',
    'ri:layout-grid-line',
    'ri:question-line',
  ]
  // 确保返回值永远是string类型，而不是可能的undefined
  return icons[index % icons.length] || 'ri:question-line'
}

// AI 小助手主组件
export default function AIAssistantSection(): React.ReactNode {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [chatStyle, setChatStyle] = useState<'terminal' | 'bubbles'>('bubbles') // 默认使用气泡样式

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

  // 清除聊天记录
  const clearChatHistory = () => {
    setMessages([])
  }

  return (
    <Section
      title={<Translate id="homepage.ai.title">🤖 AI 小助手</Translate>}
      icon="ri:robot-line"
    >
      <div className="relative mb-10">
        <StyleSwitcher currentStyle={chatStyle} onSwitch={toggleChatStyle} />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          {/* 左侧聊天界面 - 调整为占3格 */}
          <div className="lg:col-span-3">
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

          {/* 右侧介绍区域 - 调整为占2格 */}
          <div className="lg:col-span-2">
            <AIIntroPanel onClickSuggestion={handleSuggestionClick} />
          </div>
        </div>
      </div>
    </Section>
  )
}
