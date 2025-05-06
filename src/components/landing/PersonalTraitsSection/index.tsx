import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import { FaCode, FaLaptopCode, FaRegLightbulb, FaServer, FaBrain, FaMobileAlt } from 'react-icons/fa'

// 个人特点数据
const traits = [
  {
    id: 1,
    icon: <FaCode className="text-blue-400" />,
    title: '前端开发',
    description: '熟练掌握React、Vue等现代前端框架，追求高性能、美观的用户界面设计。',
  },
  {
    id: 2,
    icon: <FaServer className="text-green-400" />,
    title: '后端开发',
    description: 'Node.js、Express、NestJS等后端技术栈经验丰富，构建可靠的API和服务。',
  },
  {
    id: 3,
    icon: <FaRegLightbulb className="text-yellow-400" />,
    title: '创新思维',
    description: '善于从不同角度思考问题，寻找创新解决方案，持续探索新技术。',
  },
  {
    id: 4,
    icon: <FaLaptopCode className="text-purple-400" />,
    title: '全栈能力',
    description: '从数据库到UI，全栈开发能力让我能够独立完成完整项目。',
  },
  {
    id: 5,
    icon: <FaBrain className="text-red-400" />,
    title: 'AI热爱者',
    description: '对人工智能充满热情，不断学习和实践AI在开发中的应用。',
  },
  {
    id: 6,
    icon: <FaMobileAlt className="text-cyan-400" />,
    title: '响应式设计',
    description: '注重各种设备上的用户体验，确保应用在任何屏幕上都表现良好。',
  },
]

const PersonalTraitsSection = () => {
  const [activeId, setActiveId] = useState<number | null>(null)

  return (
    <section className="py-16">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-3xl font-bold">个人特点</h2>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
          我的专业领域和个人特长，这些特质定义了我作为开发者的能力和风格
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {traits.map(trait => (
          <motion.div
            key={trait.id}
            className={clsx(
              'group relative overflow-hidden rounded-xl p-6 transition-all duration-300',
              'from-background/80 to-background/40 cursor-pointer bg-gradient-to-br',
              'border-border/50 border backdrop-blur-sm',
              'hover:border-primary/30 hover:shadow-lg',
              activeId === trait.id
                ? 'ring-primary/50 ring-2'
                : '',
            )}
            style={{
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
            }}
            whileHover={{ y: -5 }}
            onClick={() => setActiveId(activeId === trait.id ? null : trait.id)}
          >
            <div className="flex items-start gap-4">
              <div className="bg-background/80 flex size-12 items-center justify-center rounded-full p-3 shadow-sm">
                {trait.icon}
              </div>
              <div className="flex-1">
                <h3 className="mb-2 text-xl font-semibold">{trait.title}</h3>
                <AnimatePresence>
                  {activeId === trait.id
                    ? (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="text-muted-foreground"
                        >
                          {trait.description}
                        </motion.p>
                      )
                    : (
                        <motion.p
                          className="text-muted-foreground truncate"
                        >
                          点击查看更多...
                        </motion.p>
                      )}
                </AnimatePresence>
              </div>
            </div>

            {/* 装饰效果 */}
            <div className="bg-primary/5 absolute -right-20 -top-20 size-40 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="bg-primary/5 absolute -bottom-20 -left-20 size-40 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default PersonalTraitsSection
