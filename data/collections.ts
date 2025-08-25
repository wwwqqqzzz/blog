/**
 * 博客集合数据
 * 包含每个集合的封面图片和详细描述
 */

export interface CollectionData {
  /**
   * 集合ID，与博客文章中的collection字段匹配
   */
  id: string
  /**
   * 集合名称（可选，默认使用id）
   */
  name?: string
  /**
   * 集合描述
   */
  description: string
  /**
   * 集合封面图片URL
   */
  image: string
}

/**
 * 博客集合数据
 */
export const collections: CollectionData[] = [
  {
    id: 'Git教程',
    description: '从基础到高级的Git版本控制系统完整教程。本系列深入浅出地讲解Git的核心概念、日常工作流、分支管理策略、高级技巧和最佳实践，帮助你掌握这一现代开发必备工具。无论你是初学者还是有经验的开发者，都能从中获取实用知识，提升团队协作效率。',
    image: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'React学习笔记',
    description: '我的React学习之旅全记录。这个系列涵盖了React基础知识、Hooks使用技巧、状态管理方案、性能优化策略和实际项目案例分析。通过实例代码和详细解释，分享我在学习和使用React过程中的心得体会、踩过的坑和解决方案，帮助你更快掌握这一流行的前端框架。',
    image: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'TypeScript入门到精通',
    description: '全面系统的TypeScript学习指南。从基础类型系统到高级类型操作，从接口到泛型，从命名空间到模块，本系列将带你逐步掌握TypeScript的各项特性。结合实际开发场景，讲解如何利用TypeScript提升代码质量、增强开发体验，以及与各种框架的集成应用，助你成为TypeScript专家。',
    image: 'https://images.unsplash.com/photo-1599507593499-a3f7d7d97667?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'Next.js实战',
    description: 'Next.js全栈开发实战指南。本系列详细介绍Next.js的核心特性、路由系统、数据获取策略、服务端渲染、静态生成等关键概念，并通过实际项目案例展示如何构建高性能、SEO友好的现代Web应用。从项目搭建到部署上线，全方位覆盖Next.js开发流程，帮助你掌握这一强大的React框架。',
    image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: '算法与数据结构',
    description: '深入浅出的算法与数据结构学习系列。从基础的数组、链表、栈、队列，到复杂的树、图、哈希表，再到经典算法如排序、搜索、动态规划、贪心算法等，本系列通过清晰的图解和JavaScript/TypeScript代码实现，帮助你构建扎实的计算机科学基础，提升解决问题的能力和编程技巧。',
    image: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'Web性能优化',
    description: '全面的Web应用性能优化指南。本系列涵盖前端性能优化的各个方面，包括资源加载优化、渲染性能提升、JavaScript执行效率改进、网络传输优化等。通过实际案例分析和最佳实践分享，帮助你识别性能瓶颈，掌握各种优化技术，打造流畅快速的用户体验，提升网站的转化率和用户满意度。',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'Docker容器化',
    description: 'Docker容器技术从入门到精通。本系列详细讲解Docker的核心概念、基本命令、Dockerfile编写、容器编排、网络配置、数据管理等关键知识点。通过实际案例演示如何使用Docker简化开发环境搭建、提高部署效率、增强应用可移植性，以及与CI/CD流程的集成，帮助你掌握现代应用交付的必备技能。',
    image: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: '前端工程化',
    description: '现代前端工程化实践指南。本系列探讨前端开发的工程化方案，包括模块化系统、构建工具、包管理器、代码规范、自动化测试、持续集成等关键环节。通过分享实际项目中的最佳实践和工具选型经验，帮助你建立高效、可维护的前端开发流程，提升团队协作效率和代码质量。',
    image: 'https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'Node.js后端开发',
    description: 'Node.js后端开发完全指南。本系列从Node.js基础知识出发，深入探讨异步编程模型、事件循环机制、流式处理、文件系统操作等核心概念，并介绍Express、Koa等流行框架的使用方法。通过实际项目案例，讲解API设计、数据库集成、身份认证、错误处理等关键环节，帮助你掌握使用Node.js构建高性能后端服务的技能。',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: '微前端架构',
    description: '微前端架构设计与实践指南。本系列深入探讨微前端的核心理念、技术选型、实现方案和最佳实践。从基础概念到框架对比，从路由集成到应用通信，从构建配置到部署策略，全面解析如何将庞大的前端应用拆分为独立开发、独立部署的微应用，以提高团队并行开发效率，降低系统复杂度，实现渐进式技术栈演进。',
    image: 'https://images.unsplash.com/photo-1558050032-160f36233a07?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: '量化交易系列',
    description: '从零开始的量化交易学习系列，系统讲解 Alpha 概念、平台设置、股票池、仓位与中性化、技术分析与 PV 数据、基本面与期权等核心主题，配合直观示例与实操思路，帮助你建立完整的量化交易认知体系。',
    image: 'https://images.unsplash.com/photo-1559526324-593bc073d938?q=80&w=1200&auto=format&fit=crop',
  },
]

/**
 * 获取集合数据
 * @param id 集合ID
 * @returns 集合数据
 */
export function getCollectionData(id: string): CollectionData | undefined {
  return collections.find(collection => collection.id === id)
}

/**
 * 默认集合封面图
 */
export const defaultCollectionImage = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200&auto=format&fit=crop'

/**
 * 默认集合描述
 */
export const defaultCollectionDescription = '探索这个系列的文章，系统化学习相关知识，获取深入的技术见解和实践经验。'
