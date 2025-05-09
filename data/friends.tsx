export type FriendCategory = 'tech' | 'personal' | 'design' | 'other'

export type Friend = {
  title: string
  description: string
  website: string
  avatar?: string
  tags?: string[]
  socialLinks?: {
    github?: string
    twitter?: string
    juejin?: string
  }
  category?: FriendCategory
}

export const Friends: Friend[] = [
  {
    title: '峰华前端工程师',
    description: '致力于帮助你以最直观、最快速的方式学会前端开发',
    website: 'https://zxuqian.cn',
    avatar: '/img/friend/zxuqian.png',
    category: 'tech',
    tags: ['前端教程', '技术分享', '学习资源'],
  },
  {
    title: 'Mas0n',
    description: '梦想是咸鱼',
    website: 'https://mas0n.org/',
    avatar: '/img/friend/mas0n.png',
    category: 'personal',
    tags: ['生活记录', '技术爱好者'],
  },
  {
    title: 'Jetzihan',
    description: 'A bug maker.',
    website: 'https://www.jet-lab.site/',
    avatar: '/img/friend/jetzihan.png',
    category: 'tech',
  },
  {
    title: 'Pincman',
    description: '中年老码农,专注于全栈开发与教学',
    website: 'https://pincman.com',
    avatar: '/img/friend/pincman.png',
    category: 'tech',
    tags: ['全栈开发', '技术教学'],
  },
  {
    title: 'Opacity',
    description: '助力每一个梦想',
    website: 'https://www.opacity.ink',
    avatar: '/img/friend/opacity.png',
    category: 'personal',
    tags: ['积极向上', '梦想追求'],
  },
  {
    title: '静かな森',
    description: '致虚极，守静笃',
    website: 'https://innei.in',
    avatar: '/img/friend/innei.png',
    category: 'personal',
  },
  {
    title: 'Simon He',
    description: 'Front-end development, Open source',
    website: 'https://simonme.netlify.app',
    avatar: '/img/friend/simonme.png',
    category: 'tech',
    tags: ['前端开发', '开源贡献'],
  },
  {
    title: 'SkyWT',
    description: '热爱与激情永不止息。',
    website: 'https://skywt.cn',
    avatar: '/img/friend/skywt.png',
    category: 'personal',
    tags: ['热爱生活', '积极乐观'],
  },
  {
    title: 'Licodeao',
    description: 'The water flows incessantly, without vying for precedence.',
    website: 'https://www.licodeao.top',
    avatar: '/img/friend/licodeao.png',
    category: 'tech',
  },
  {
    title: '云小逸',
    description: '不积跬步，无以至千里',
    website: 'https://www.gerenbiji.com',
    avatar: 'https://www.gerenbiji.com/img/logo.jpg',
    category: 'personal',
    tags: ['成长记录', '个人博客'],
  },
  {
    title: 'CWorld Blog',
    description: '求知若愚，虚怀若谷',
    website: 'https://cworld.top',
    avatar: '/img/friend/cworld.png',
    category: 'tech',
  },
  {
    title: 'Fernando Prieto',
    description: 'Cloud Engineer, Open Source, AI Enthusiast.',
    website: 'https://fernandogprieto.com',
    avatar: 'https://fernandogprieto.com/img/logo.png',
    category: 'tech',
    tags: ['开源', '人工智能', '云计算'],
  },
  {
    title: '尚宇',
    description: '心怀理想，仰望星空，埋头苦干',
    website: 'https://www.disnox.top',
    avatar: '/img/friend/disnox.png',
    category: 'personal',
    tags: ['理想追求', '埋头苦干', '积极向上'],
  },
  {
    title: 'Meoo',
    description: '一杯茶，一根网线，一台电脑',
    website: 'https://cxorz.com',
    avatar: '/img/friend/meoo.png',
    category: 'personal',
  },
  {
    title: 'Shake',
    description: '世界继续热闹，愿你不变模样，勇敢且自由😃',
    website: 'https://www.shaking.site',
    avatar: '/img/friend/shake.png',
    category: 'personal',
    tags: ['勇敢', '自由', '坚持自我'],
  },
  {
    title: '鲸落',
    description: '心中无女人，代码自然神',
    website: 'http://www.xiaojunnan.cn',
    avatar: '/img/friend/xiaojunnan.png',
    category: 'tech',
    tags: ['专注技术', '代码之道'],
  },
  {
    title: 'LineXic书屋',
    description: '念念不忘，必有回响',
    website: 'https://linexic.top',
    avatar: '/img/friend/linexic.png',
    category: 'other',
    tags: ['知识分享', '读书笔记'],
  },
]
