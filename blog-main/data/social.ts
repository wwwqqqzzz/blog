export type Social = {
  github?: string
  x?: string
  juejin?: string
  qq?: string
  wx?: string
  cloudmusic?: string
  zhihu?: string
  email?: string
  discord?: string
}

type SocialValue = {
  href?: string
  title: string
  icon: string
  color: string
}

const social: Social = {
  github: 'https://github.com/你的GitHub用户名',
  x: 'https://twitter.com/你的Twitter用户名',
  juejin: 'https://juejin.cn/user/你的掘金ID',
  wx: '你的微信二维码图片URL',
  // qq: '你的QQ二维码图片URL',
  // zhihu: 'https://www.zhihu.com/people/你的知乎ID',
  cloudmusic: 'https://music.163.com/#/user/home?id=你的网易云ID',
  email: 'mailto:你的邮箱@example.com',
  discord: 'https://discord.gg/你的Discord邀请链接',
}

const socialSet: Record<keyof Social | 'rss', SocialValue> = {
  github: {
    href: social.github,
    title: 'GitHub',
    icon: 'ri:github-line',
    color: '#010409',
  },
  juejin: {
    href: social.juejin,
    title: '掘金',
    icon: 'simple-icons:juejin',
    color: '#1E81FF',
  },
  x: {
    href: social.x,
    title: 'X',
    icon: 'ri:twitter-x-line',
    color: '#000',
  },
  wx: {
    href: social.wx,
    title: '微信',
    icon: 'ri:wechat-2-line',
    color: '#07c160',
  },
  zhihu: {
    href: social.zhihu,
    title: '知乎',
    icon: 'ri:zhihu-line',
    color: '#1772F6',
  },
  discord: {
    href: social.discord,
    title: 'Discord',
    icon: 'ri:discord-line',
    color: '#5A65F6',
  },
  qq: {
    href: social.qq,
    title: 'QQ',
    icon: 'ri:qq-line',
    color: '#1296db',
  },
  email: {
    href: social.email,
    title: '邮箱',
    icon: 'ri:mail-line',
    color: '#D44638',
  },
  cloudmusic: {
    href: social.cloudmusic,
    title: '网易云',
    icon: 'ri:netease-cloud-music-line',
    color: '#C20C0C',
  },
  rss: {
    href: '/blog/rss.xml',
    title: 'RSS',
    icon: 'ri:rss-line',
    color: '#FFA501',
  },
}

export default socialSet
