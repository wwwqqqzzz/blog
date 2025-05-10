// eslint-disable-next-line @typescript-eslint/no-require-imports
const blogPluginExports = require('@docusaurus/plugin-content-blog')
const { default: blogPlugin } = blogPluginExports

async function blogPluginEnhanced(context, options) {
  const blogPluginInstance = await blogPlugin(context, options)
  const { postsPerPage } = options

  return {
    ...blogPluginInstance,
    async contentLoaded({ content, allContent, actions }) {
      // Sort blog with pinned and sticky
      content.blogPosts.sort((a, b) => {
        // 首先按照 pinned 字段排序
        const isPinnedA = a.metadata.frontMatter.pinned === true
        const isPinnedB = b.metadata.frontMatter.pinned === true

        if (isPinnedA && !isPinnedB) return -1
        if (!isPinnedA && isPinnedB) return 1

        // 如果 pinned 状态相同，则按照 sticky 字段排序
        return (b.metadata.frontMatter.sticky || 0) - (a.metadata.frontMatter.sticky || 0)
      })

      // Group posts by postsPerPage
      const groupedPosts = Array.from({ length: Math.ceil(content.blogPosts.length / postsPerPage) }, (_, i) => ({
        items: content.blogPosts.slice(i * postsPerPage, (i + 1) * postsPerPage).map(post => post.id),
      }))

      // Update paginated blog list
      content.blogListPaginated.forEach((page, i) => {
        page.items = groupedPosts[i] ? groupedPosts[i].items : []
      })

      // Log private posts for debugging
      const privatePosts = content.blogPosts.filter(post => post.metadata?.frontMatter?.private === true)
      console.log('Plugin found private posts:', privatePosts.length)
      if (privatePosts.length > 0) {
        console.log('Private post titles:', privatePosts.map(post => post.metadata.title))
      }

      // Log pinned posts for debugging
      const pinnedPosts = content.blogPosts.filter(post => post.metadata?.frontMatter?.pinned === true)
      console.log('Plugin found pinned posts:', pinnedPosts.length)
      if (pinnedPosts.length > 0) {
        console.log('Pinned post titles:', pinnedPosts.map(post => post.metadata.title))
      }

      // Create default plugin pages
      await blogPluginInstance.contentLoaded({ content, allContent, actions })

      // Create your additional pages
      const { blogTags } = content
      const { setGlobalData } = actions

      // Store all blog posts in global data
      // For homepage we only need a few, but for private blog we need all
      setGlobalData({
        posts: content.blogPosts.slice(0, 10), // Only store 10 posts for homepage
        blogPosts: content.blogPosts, // Store all blog posts for other pages like private blog
        postNum: content.blogPosts.length,
        tagNum: Object.keys(blogTags).length,
      })

      // Log what we're storing in global data
      console.log('Storing in global data:')
      console.log('- Total posts:', content.blogPosts.length)
      console.log('- Posts for homepage:', content.blogPosts.slice(0, 10).length)
      console.log('- All posts for private blog:', content.blogPosts.length)
    },
  }
}

module.exports = Object.assign({}, blogPluginExports, {
  default: blogPluginEnhanced,
})
