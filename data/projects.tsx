export const projects: Project[] = [
  {
    title: '王起哲的博客',
    description: '基于 Docusaurus 静态站点生成器实现',
    preview: 'https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/1746226518943-d8f5a6f56335e1a11b2a46971e647735.png',
    website: 'https://20030727.xyz/',
    source: 'https://github.com/wwwqqqzzz/blog',
    tags: ['opensource', 'favorite', 'design'],
    type: 'web',
  },
  {
    title: 'Discord克隆',
    description: '基于Next.js, React, Prisma和Socket.io开发的全栈实时通讯应用',
    preview: '/img/project/discord-clone.png',
    website: 'https://discord.20030727.xyz',
    source: 'https://github.com/wwwqqqzzz/discord-clone',
    tags: ['opensource', 'favorite', 'large', 'product'],
    type: 'web',
  },
  {
    title: '教务管理系统',
    description: 'AI辅助开发的基于Spring Boot和Vue的教务管理系统',
    preview: 'https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/1746626110941-5392fb210907bcc28cc0c5f1b0508577.png',
    website: '/project-status',
    source: 'https://github.com/wwwqqqzzz/education-system',
    tags: ['opensource', 'product'],
    type: 'web',
  },
  {
    title: '电商系统',
    description: '基于Spring Boot实现的电子商务平台',
    preview: '/img/project/ecommerce.png',
    website: '/project-status',
    source: 'https://github.com/wwwqqqzzz/ecommerce-system',
    tags: ['opensource', 'large'],
    type: 'web',
  },
  {
    title: '游戏开发项目',
    description: '使用Unity3D开发的2D游戏作品',
    preview: '/img/project/game-dev.png',
    website: '/project-status',
    source: 'https://github.com/wwwqqqzzz/unity-game',
    tags: ['personal', 'design'],
    type: 'app',
  },
  {
    title: 'React组件库',
    description: '自主开发的React UI组件库',
    preview: '/img/project/ui-components.png',
    website: '/project-status',
    source: 'https://github.com/wwwqqqzzz/react-ui-components',
    tags: ['opensource', 'design'],
    type: 'personal',
  },
  {
    title: 'AI文本摘要工具',
    description: '使用自然语言处理技术实现的文本摘要工具',
    preview: '/img/project/text-summary.png',
    website: '/project-status',
    source: 'https://github.com/wwwqqqzzz/text-summarizer',
    tags: ['product', 'personal'],
    type: 'toy',
  },
  {
    title: 'WebAssembly图像处理',
    description: '使用WebAssembly实现的高性能图像处理应用',
    preview: '/img/project/wasm-image.png',
    website: '/project-status',
    source: 'https://github.com/wwwqqqzzz/wasm-image-processor',
    tags: ['opensource'],
    type: 'other',
  },
]

export type Tag = {
  label: string
  description: string
  color: string
}

export type TagType = 'favorite' | 'opensource' | 'product' | 'design' | 'large' | 'personal'

export type ProjectType = 'web' | 'app' | 'commerce' | 'personal' | 'toy' | 'other'

export const projectTypeMap = {
  web: '🖥️ 网站',
  app: '💫 应用',
  commerce: '商业项目',
  personal: '👨‍💻 个人',
  toy: '🔫 玩具',
  other: '🗃️ 其他',
}

export type Project = {
  title: string
  description: string
  preview?: string
  website: string
  source?: string | null
  tags: TagType[]
  type: ProjectType
}

export const Tags: Record<TagType, Tag> = {
  favorite: {
    label: '喜爱',
    description: '我最喜欢的网站，一定要去看看!',
    color: '#e9669e',
  },
  opensource: {
    label: '开源',
    description: '开源项目可以提供灵感!',
    color: '#39ca30',
  },
  product: {
    label: '产品',
    description: '与产品相关的项目!',
    color: '#dfd545',
  },
  design: {
    label: '设计',
    description: '设计漂亮的网站!',
    color: '#a44fb7',
  },
  large: {
    label: '大型',
    description: '大型项目，原多于平均数的页面',
    color: '#8c2f00',
  },
  personal: {
    label: '个人',
    description: '个人项目',
    color: '#12affa',
  },
}

export const TagList = Object.keys(Tags) as TagType[]

export const groupByProjects = projects.reduce(
  (group, project) => {
    const { type } = project
    group[type] = group[type] ?? []
    group[type].push(project)
    return group
  },
  {} as Record<ProjectType, Project[]>,
)
