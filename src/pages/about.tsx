import React from 'react'
import Layout from '@theme/Layout'
import { Icon } from '@iconify/react'
import social from '@site/data/social'
import Comment from '@site/src/components/Comment'
import { Fade } from 'react-awesome-reveal'
import styles from './styles/about.module.css'

// 技能数据
const skills = [
  { name: 'JavaScript', icon: 'logos:javascript', category: 'frontend', level: 90 },
  { name: 'TypeScript', icon: 'logos:typescript-icon', category: 'frontend', level: 85 },
  { name: 'React', icon: 'logos:react', category: 'frontend', level: 88 },
  { name: 'Vue', icon: 'logos:vue', category: 'frontend', level: 80 },
  { name: 'Next.js', icon: 'logos:nextjs-icon', category: 'frontend', level: 82 },
  { name: 'Node.js', icon: 'logos:nodejs-icon', category: 'backend', level: 75 },
  { name: 'Spring Boot', icon: 'logos:spring-icon', category: 'backend', level: 70 },
  { name: 'MySQL', icon: 'logos:mysql', category: 'database', level: 72 },
  { name: 'Redis', icon: 'logos:redis', category: 'database', level: 65 },
  { name: 'Git', icon: 'logos:git-icon', category: 'tools', level: 85 },
  { name: 'Docker', icon: 'logos:docker-icon', category: 'tools', level: 68 },
]

// 里程碑数据
const milestones = [
  {
    year: 2025,
    title: '职业目标',
    events: [
      '成为高级前端开发工程师',
      '建立个人技术影响力',
      '参与开源项目核心贡献',
    ],
    isGoal: true,
  },
  {
    year: 2024,
    title: '当前重点',
    events: [
      '深化React技术栈实战能力',
      '掌握TypeScript工程化应用',
      '构建完整的全栈项目架构经验',
    ],
  },
  {
    year: 2023,
    title: '里程碑成就',
    events: [
      '独立开发教务管理系统（Vue3+Spring Boot）',
      '完成Next.js仿Discord项目开发部署',
      '获得1+X云计算平台运维开发认证',
    ],
  },
  {
    year: 2022,
    title: '前端转型',
    events: [
      '转型前端开发方向',
      '完成Vue+Element UI管理后台项目',
    ],
  },
  {
    year: 2021,
    title: 'Java学习',
    events: [
      '系统学习Java开发',
      '掌握Spring Boot基础应用',
    ],
  },
  {
    year: 2020,
    title: '编程起步',
    events: [
      '开启编程学习之路',
      '从C语言基础入门',
    ],
  },
]

// 兴趣爱好数据
const interests = [
  {
    icon: 'carbon:blog',
    title: '技术博客写作',
    description: '定期在掘金平台分享学习心得，累计获得1000+阅读',
  },
  {
    icon: 'carbon:collaborate',
    title: '开源社区贡献',
    description: '参与Element Plus组件库问题修复，提交PR 2次',
  },
  {
    icon: 'carbon:tool-kit',
    title: '效率工具研究',
    description: '开发自动化脚本提升开发效率，GitHub开源工具集Star 10+',
  },
  {
    icon: 'carbon:notebook',
    title: '持续学习',
    description: '保持每周至少10小时的技术学习，持续跟进前端发展趋势',
  },
]

export default function AboutPage(): React.ReactElement {
  return (
    <Layout
      title="关于我"
      description="王起哲的个人介绍"
    >
      <main className={styles.aboutPage}>
        {/* 头部个人简介区 */}
        <section className={styles.hero}>
          <div className="container">
            <div className={styles.heroInner}>
              <div className={styles.heroBio}>
                <Fade direction="up" triggerOnce>
                  <h1 className={styles.heroTitle}>
                    <span className={styles.wave}>👋</span>
                    {' '}
                    你好，我是
                    <span className={styles.name}>王起哲</span>
                  </h1>
                  <p className={styles.heroSubtitle}>
                    前端开发学习者 | 软件工程专业学生
                  </p>

                  <div className={styles.heroTags}>
                    <span className={styles.tag}>
                      <Icon icon="carbon:location" />
                      {' '}
                      江苏 | 南京
                    </span>
                    <span className={styles.tag}>
                      <Icon icon="carbon:development" />
                      {' '}
                      Web前端开发
                    </span>
                    <span className={styles.tag}>
                      <Icon icon="carbon:idea" />
                      {' '}
                      快速学习能力
                    </span>
                    <span className={styles.tag}>
                      <Icon icon="carbon:skill-level" />
                      {' '}
                      持续改进意识
                    </span>
                  </div>
                </Fade>
              </div>

              <div className={styles.heroImage}>
                <Fade direction="right" triggerOnce>
                  <div className={styles.avatarContainer}>
                    <img
                      src="https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/49bd6f9e-4246-447e-b2f1-c51b8930e964.png"
                      alt="王起哲"
                      className={styles.avatar}
                    />
                    <div className={styles.avatarBlob}></div>
                  </div>
                </Fade>
              </div>
            </div>
          </div>
        </section>

        {/* 关于我部分 */}
        <section className={styles.about}>
          <div className="container">
            <Fade direction="up" triggerOnce>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <Icon icon="carbon:user-profile" className={styles.sectionIcon} />
                  关于我
                </h2>
              </div>
              <div className={styles.aboutContent}>
                <p>
                  软件工程专科在读，同时攻读计算机科学与技术自考本科。具备扎实的前端开发基础，熟悉主流Web开发技术栈，通过项目实践积累了全流程开发经验。
                </p>
                <p>
                  坚持"以用促学"的学习理念，在GitHub持续进行技术实践，擅长将理论知识转化为实际解决方案。
                </p>
                <p className={styles.quote}>
                  "代码是对逻辑最精确的表达" —— 我的开发准则
                </p>
              </div>
            </Fade>
          </div>
        </section>

        {/* 技能展示部分 */}
        <section className={`${styles.section} ${styles.skills}`}>
          <div className="container">
            <Fade direction="up" triggerOnce>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <Icon icon="carbon:skill-level-advanced" className={styles.sectionIcon} />
                  技术技能
                </h2>
                <p className={styles.sectionDescription}>
                  不断学习和实践的技术栈
                </p>
              </div>
            </Fade>

            <div className={styles.skillCategories}>
              <Fade cascade damping={0.1} triggerOnce>
                <div className={styles.skillGroup}>
                  <h3 className={styles.skillGroupTitle}>
                    <Icon icon="carbon:application" />
                    {' '}
                    前端技术
                  </h3>
                  <div className={styles.skillCards}>
                    {skills
                      .filter(skill => skill.category === 'frontend')
                      .map(skill => (
                        <div className={styles.skillCard} key={skill.name}>
                          <Icon icon={skill.icon} className={styles.skillIcon} />
                          <div className={styles.skillInfo}>
                            <div className={styles.skillNameWrapper}>
                              <span className={styles.skillName}>{skill.name}</span>
                              <span className={styles.skillLevel}>
                                {skill.level}
                                %
                              </span>
                            </div>
                            <div className={styles.skillBar}>
                              <div
                                className={styles.skillProgress}
                                style={{ width: `${skill.level}%` }}
                              >
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div className={styles.skillGroup}>
                  <h3 className={styles.skillGroupTitle}>
                    <Icon icon="carbon:cloud" />
                    {' '}
                    后端技术
                  </h3>
                  <div className={styles.skillCards}>
                    {skills
                      .filter(skill => skill.category === 'backend' || skill.category === 'database')
                      .map(skill => (
                        <div className={styles.skillCard} key={skill.name}>
                          <Icon icon={skill.icon} className={styles.skillIcon} />
                          <div className={styles.skillInfo}>
                            <div className={styles.skillNameWrapper}>
                              <span className={styles.skillName}>{skill.name}</span>
                              <span className={styles.skillLevel}>
                                {skill.level}
                                %
                              </span>
                            </div>
                            <div className={styles.skillBar}>
                              <div
                                className={styles.skillProgress}
                                style={{ width: `${skill.level}%` }}
                              >
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div className={styles.skillGroup}>
                  <h3 className={styles.skillGroupTitle}>
                    <Icon icon="carbon:tools" />
                    {' '}
                    工具与其他
                  </h3>
                  <div className={styles.skillCards}>
                    {skills
                      .filter(skill => skill.category === 'tools')
                      .map(skill => (
                        <div className={styles.skillCard} key={skill.name}>
                          <Icon icon={skill.icon} className={styles.skillIcon} />
                          <div className={styles.skillInfo}>
                            <div className={styles.skillNameWrapper}>
                              <span className={styles.skillName}>{skill.name}</span>
                              <span className={styles.skillLevel}>
                                {skill.level}
                                %
                              </span>
                            </div>
                            <div className={styles.skillBar}>
                              <div
                                className={styles.skillProgress}
                                style={{ width: `${skill.level}%` }}
                              >
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </Fade>
            </div>
          </div>
        </section>

        {/* 开发环境 */}
        <section className={`${styles.section} ${styles.devEnvironment}`}>
          <div className="container">
            <Fade direction="up" triggerOnce>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <Icon icon="carbon:terminal" className={styles.sectionIcon} />
                  开发环境
                </h2>
              </div>
              <div className={styles.environmentCards}>
                <div className={styles.environmentCard}>
                  <Icon icon="carbon:application-web" className={styles.environmentIcon} />
                  <h3>编辑器</h3>
                  <p>Cursor + MCP Server</p>
                </div>
                <div className={styles.environmentCard}>
                  <Icon icon="carbon:code" className={styles.environmentIcon} />
                  <h3>IDE</h3>
                  <p>VS Code + IDEA</p>
                </div>
                <div className={styles.environmentCard}>
                  <Icon icon="carbon:laptop" className={styles.environmentIcon} />
                  <h3>系统</h3>
                  <p>Ubuntu 20.04 + Windows 11</p>
                </div>
              </div>
            </Fade>
          </div>
        </section>

        {/* 时间线部分 */}
        <section className={`${styles.section} ${styles.timeline}`}>
          <div className="container">
            <Fade direction="up" triggerOnce>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <Icon icon="carbon:chart-line" className={styles.sectionIcon} />
                  我的编程之旅
                </h2>
                <p className={styles.sectionDescription}>
                  不断成长的技术历程
                </p>
              </div>
            </Fade>

            <div className={styles.timelineContainer}>
              {milestones.map((milestone, index) => (
                <Fade direction={index % 2 ? 'right' : 'left'} key={milestone.year} triggerOnce cascade damping={0.1}>
                  <div
                    className={`${styles.timelineItem} ${milestone.isGoal ? styles.timelineGoal : ''} ${
                      index % 2 === 0 ? styles.timelineLeft : styles.timelineRight
                    }`}
                  >
                    <div className={styles.timelineContent}>
                      <div className={styles.timelineYear}>{milestone.year}</div>
                      <h3 className={styles.timelineTitle}>{milestone.title}</h3>
                      <ul className={styles.timelineEvents}>
                        {milestone.events.map((event, eventIndex) => (
                          <li key={eventIndex}>{event}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Fade>
              ))}
              <div className={styles.timelineLine}></div>
            </div>
          </div>
        </section>

        {/* 兴趣爱好部分 */}
        <section className={`${styles.section} ${styles.interests}`}>
          <div className="container">
            <Fade direction="up" triggerOnce>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <Icon icon="carbon:favorite" className={styles.sectionIcon} />
                  兴趣爱好
                </h2>
              </div>
            </Fade>

            <div className={styles.interestGrid}>
              {interests.map((interest, i) => (
                <Fade direction="up" delay={i * 100} key={interest.title} triggerOnce>
                  <div className={styles.interestCard}>
                    <div className={styles.interestIcon}>
                      <Icon icon={interest.icon} />
                    </div>
                    <h3 className={styles.interestTitle}>{interest.title}</h3>
                    <p className={styles.interestDescription}>{interest.description}</p>
                  </div>
                </Fade>
              ))}
            </div>
          </div>
        </section>

        {/* 联系方式部分 */}
        <section className={`${styles.section} ${styles.contact}`}>
          <div className="container">
            <Fade direction="up" triggerOnce>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <Icon icon="carbon:email" className={styles.sectionIcon} />
                  联系方式
                </h2>
                <p className={styles.sectionDescription}>
                  期待与您交流技术见解和职业发展建议
                </p>
              </div>

              <div className={styles.contactGrid}>
                <a href={social.github.href} target="_blank" rel="noopener noreferrer" className={styles.contactCard}>
                  <Icon icon="carbon:logo-github" className={styles.contactIcon} />
                  <span>GitHub</span>
                </a>
                <a href={social.x.href} target="_blank" rel="noopener noreferrer" className={styles.contactCard}>
                  <Icon icon="carbon:logo-twitter" className={styles.contactIcon} />
                  <span>掘金专栏</span>
                </a>
                <a href={social.wx.href} target="_blank" rel="noopener noreferrer" className={styles.contactCard}>
                  <Icon icon="carbon:chat" className={styles.contactIcon} />
                  <span>wxid_frontend</span>
                </a>
                <a href={social.email.href} target="_blank" rel="noopener noreferrer" className={styles.contactCard}>
                  <Icon icon="carbon:email" className={styles.contactIcon} />
                  <span>wqz.dev@outlook.com</span>
                </a>
              </div>
            </Fade>
          </div>
        </section>

        {/* 评论部分 */}
        <section className={`${styles.section} ${styles.comments}`}>
          <div className="container">
            <Fade direction="up" triggerOnce>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <Icon icon="carbon:chat" className={styles.sectionIcon} />
                  留言板
                </h2>
                <p className={styles.sectionDescription}>
                  欢迎留下您的宝贵意见
                </p>
              </div>
              <Comment />
            </Fade>
          </div>
        </section>
      </main>
    </Layout>
  )
}
