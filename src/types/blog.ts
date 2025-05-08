import type { BlogPostFrontMatter } from '@docusaurus/plugin-content-blog'

export interface ExtendedBlogPostFrontMatter extends BlogPostFrontMatter {
  sticky?: number
  featured?: boolean
  description?: string
  image?: string
  password?: string
}

export interface BlogTag {
  label: string
  permalink: string
  description?: string
}

export interface BlogPostData {
  title: string
  link: string
  tags: BlogTag[]
  date: string
  description: string
  sticky?: number
  featured?: boolean
  image?: string
}
