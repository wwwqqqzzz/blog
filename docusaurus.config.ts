import type * as Preset from '@docusaurus/preset-classic'
import type { Config } from '@docusaurus/types'
import { themes } from 'prism-react-renderer'
import social from './data/social'
import type { GiscusConfig } from './src/components/Comment'

const beian = ''
const beian1 = ''

const config: Config = {
  title: '王起哲的博客',
  url: 'https://20030727.xyz',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'wwwqqqzzz',
  projectName: 'blog',
  customFields: {
    bio: '技术探索之路',
    description:
      '这是王起哲的个人博客，主要分享编程、游戏开发和Web3技术等领域的知识和项目，该网站基于 React 驱动的静态网站生成器 Docusaurus 构建。',
  },
  themeConfig: {
    // announcementBar: {
    //   id: 'announcementBar-3',
    //   content: ``,
    // },
    image: 'img/og.png',
    metadata: [
      {
        name: 'author',
        content: '王起哲',
      },
      {
        name: 'keywords',
        content: 'blog, javascript, typescript, node, react, vue, web, 游戏开发, web3',
      },
      {
        name: 'keywords',
        content: '全栈开发, Web开发者, 游戏开发尝试者, Next.js, React',
      },
    ],
    docs: {
      sidebar: {
        hideable: true,
      },
    },
    navbar: {
      logo: {
        alt: '王起哲',
        src: 'img/logo.webp',
        srcDark: 'img/logo.webp',
      },
      hideOnScroll: true,
      items: [
        { label: '博客', position: 'right', to: 'blog' },
        { label: '项目', position: 'right', to: 'project' },
        { label: '友链', position: 'right', to: 'friends' },
        { label: '关于', position: 'right', to: 'about' },
        {
          label: '更多',
          position: 'right',
          items: [
            { label: '归档', to: 'blog/archive' },
            { label: '系列', to: 'blog/collections' },
            { label: '技术笔记', to: 'docs/docusaurus-guides' },
            { label: '私密博客', to: 'private' },
          ],
        },
        // {
        //   type: 'localeDropdown',
        //   position: 'right',
        // },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '技术',
          items: [
            { label: '博客', to: 'blog' },
            { label: '归档', to: 'blog/archive' },
            { label: '系列', to: 'blog/collections' },
            { label: '项目展示', to: 'project' },
          ],
        },
        {
          title: '社交媒体',
          items: [
            { label: '关于我', to: '/about' },
            { label: 'GitHub', href: social.github.href },
          ],
        },
        {
          title: '导航',
          items: [
            { label: '友链', to: 'friends' },
            {
              html: `
                <a href="https://docusaurus.io" target="_blank" rel="noreferrer noopener">
                  <img src="/img/buildwith.png" alt="build with docusaurus" width="120" height="50"/>
                </a>
                `,
            },
          ],
        },
      ],
      copyright: `
        <p>Copyright © 2024 - ${new Date().getFullYear()} 王起哲 | Built with Docusaurus.</p>
        `,
    },
    // 使用本地搜索替代 Algolia
    // algolia: {
    //   appId: 'GV6YN1ODMO',
    //   apiKey: '50303937b0e4630bec4a20a14e3b7872',
    //   indexName: 'wangqizhe',
    // },
    prism: {
      theme: themes.oneLight,
      darkTheme: themes.oneDark,
      additionalLanguages: ['bash', 'json', 'java', 'python', 'php', 'graphql', 'rust', 'toml', 'protobuf', 'diff'],
      defaultLanguage: 'javascript',
      magicComments: [
        {
          className: 'theme-code-block-highlighted-line',
          line: 'highlight-next-line',
          block: { start: 'highlight-start', end: 'highlight-end' },
        },
        {
          className: 'code-block-error-line',
          line: 'This will error',
        },
      ],
    },
    giscus: {
      repo: 'wwwqqqzzz/blog',
      repoId: 'MDEwOlJlcG9zaXRvcnkzOTc2MjU2MTI=',
      category: 'General',
      categoryId: 'DIC_kwDOF7NJDM4CPK95',
      theme: 'light',
      darkTheme: 'dark_dimmed',
    } satisfies Partial<GiscusConfig>,
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 4,
    },
    liveCodeBlock: { playgroundPosition: 'top' },
    zoom: {
      selector: '.markdown :not(em) > img',
      background: {
        light: 'rgb(255, 255, 255)',
        dark: 'rgb(50, 50, 50)',
      },
    },
    codeBlockOptions: {
      showLineNumbers: true,
      wordWrap: false,
    },
  } satisfies Preset.ThemeConfig,
  presets: [
    [
      'classic',
      {
        docs: {
          path: 'docs',
          sidebarPath: 'sidebars.ts',
        },
        blog: false,
        theme: {
          customCss: ['./src/css/custom.css', './src/css/tweet-theme.css'],
        },
        sitemap: {
          priority: 0.5,
        },
        gtag: {
          trackingID: 'G-S4SD5NXWXF',
          anonymizeIP: true,
        },
        debug: process.env.NODE_ENV === 'development',
      } satisfies Preset.Options,
    ],
  ],
  plugins: [
    'docusaurus-plugin-image-zoom',
    '@docusaurus/plugin-ideal-image',
    // ['docusaurus-plugin-baidu-tongji', { token: 'c9a3849aa75f9c4a4e65f846cd1a5155' }],
    [
      '@easyops-cn/docusaurus-search-local',
      {
        // 配置选项
        hashed: true, // 生成哈希文件名，避免浏览器缓存问题
        language: ['en', 'zh'], // 支持英文和中文
        highlightSearchTermsOnTargetPage: true, // 在目标页面高亮搜索词
        docsRouteBasePath: ['/docs', '/blog'], // 包含博客和文档路径
        blogRouteBasePath: ['/blog'], // 博客路径
        docsDir: ['docs', 'blog'], // 包含博客和文档目录
        blogDir: ['blog'], // 博客目录
        indexDocs: true, // 索引文档
        indexBlog: true, // 索引博客
        indexPages: true, // 索引页面
        removeDefaultStopWordFilter: false, // 保留默认停用词过滤
        removeDefaultStemmer: false, // 保留默认词干提取
        searchResultLimits: 8, // 搜索结果限制
        searchResultContextMaxLength: 50, // 搜索结果上下文最大长度
        translations: {
          "search_placeholder": "搜索",
          "see_all_results": "查看所有结果",
          "no_results": "没有找到结果",
          "search_results_for": "搜索结果: \"{{ keyword }}\"",
          "search_the_documentation": "搜索文档",
          "count_documents_found": "找到 {{ count }} 篇文档",
          "count_documents_found_plural": "找到 {{ count }} 篇文档",
          "no_documents_were_found": "没有找到文档"
        }
      },
    ],
    [
      '@docusaurus/plugin-pwa',
      {
        debug: process.env.NODE_ENV === 'development',
        offlineModeActivationStrategies: ['appInstalled', 'standalone', 'queryString'],
        pwaHead: [
          { tagName: 'link', rel: 'icon', href: '/img/logo.png' },
          { tagName: 'link', rel: 'manifest', href: '/manifest.json' },
          { tagName: 'meta', name: 'theme-color', content: '#12affa' },
        ],
      },
    ],
    [
      'vercel-analytics',
      {
        debug: process.env.NODE_ENV === 'development',
        mode: 'auto',
      },
    ],
    [
      './src/plugin/plugin-content-blog', // 为了实现全局 blog 数据，必须改写 plugin-content-blog 插件
      {
        path: 'blog',
        editUrl: ({ locale, blogDirPath, blogPath, permalink }) =>
          `https://github.com/wwwqqqzzz/blog/edit/main/${blogDirPath}/${blogPath}`,
        editLocalizedFiles: false,
        blogDescription: '代码人生：编织技术与生活的博客之旅',
        blogSidebarCount: 10,
        blogSidebarTitle: '博文',
        postsPerPage: 12,
        showReadingTime: true,
        readingTime: ({ content, frontMatter, defaultReadingTime }) =>
          defaultReadingTime({ content, options: { wordsPerMinute: 300 } }),
        feedOptions: {
          type: 'all',
          title: '王起哲',
          description: '个人博客RSS订阅',
          copyright: `Copyright © ${new Date().getFullYear()} 王起哲 Built with Docusaurus.`,
        },
      },
    ],
    async function tailwindcssPlugin() {
      return {
        name: 'docusaurus-tailwindcss',
        configurePostCss(postcssOptions) {
          // Appends TailwindCSS and AutoPrefixer.
          postcssOptions.plugins.push(require('tailwindcss'))
          postcssOptions.plugins.push(require('autoprefixer'))
          return postcssOptions
        },
      }
    },
    async function injectMotto() {
      return {
        name: 'docusaurus-motto',
        injectHtmlTags() {
          return {
            headTags: [
              {
                tagName: 'script',
                innerHTML: `
    (${function () {
      console.log(
        `%c Wang Blog %c https://github.com/wwwqqqzzz/blog`,
        'color: #fff; margin: 1em 0; padding: 5px 0; background: #12affa;',
        'margin: 1em 0; padding: 5px 0; background: #efefef;',
      )

      const motto = `
This Webisite Powered By Wang Blog.
Written by Docusaurus, Coding with Love.
--------
Love what you do and do what you love.
`

      if (document.firstChild?.nodeType !== Node.COMMENT_NODE) {
        document.prepend(document.createComment(motto))
      }
    }.toString()})();`,
              },
            ],
          }
        },
      }
    },
  ],
  headTags: [
    {
      tagName: 'meta',
      attributes: {
        name: 'description',
        content: '王起哲的个人博客',
      },
    },
  ],
  stylesheets: [
    'https://cdn.jsdelivr.net/npm/misans@4.0.0/lib/Normal/MiSans-Normal.min.css',
    'https://cdn.jsdelivr.net/npm/misans@4.0.0/lib/Normal/MiSans-Medium.min.css',
    'https://cdn.jsdelivr.net/npm/misans@4.0.0/lib/Normal/MiSans-Semibold.min.css',
  ],
  i18n: {
    defaultLocale: 'zh-CN',
    locales: ['zh-CN'],
  },
  onBrokenLinks: 'warn',
}

export default config
