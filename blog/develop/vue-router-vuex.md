---
slug: vue-router-vuex-guide
title: Vue路由与状态管理详解：Vue Router和Vuex实战指南
date: 2024-06-07
authors: wqz
tags: [Vue, 前端开发, 路由, 状态管理]
keywords: [Vue Router, Vuex, 前端路由, 状态管理, SPA]
description: 全面介绍Vue Router和Vuex的核心概念和使用方法，包括路由配置、导航守卫、状态管理、模块化等，帮助开发者构建结构清晰、状态可控的单页应用。
image: https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/1747555805842-af5b3817dcb9564c2feb229d68d1acf9.png
collection: Vue.js系列
collection_order: 4
collection_description: 这个系列全面介绍Vue.js的核心概念和高级特性，包括Vue 2和Vue 3，以及相关生态系统（Vue Router、Vuex、Pinia等），帮助你掌握这个流行的渐进式JavaScript框架。
---

<!-- truncate -->

# Vue路由与状态管理详解：Vue Router和Vuex实战指南

在构建现代单页应用(SPA)时，路由管理和状态管理是两个核心问题。Vue生态系统提供了Vue Router和Vuex这两个官方库来解决这些问题。本文将详细介绍这两个工具的使用方法和最佳实践，帮助你构建结构清晰、状态可控的Vue应用。

## 第一部分：Vue Router基础

### 什么是Vue Router？

Vue Router是Vue.js官方的路由管理器。它与Vue.js核心深度集成，让构建单页应用变得轻而易举。主要功能包括：

- 嵌套路由/视图映射
- 模块化、基于组件的路由配置
- 路由参数、查询、通配符
- 视图过渡效果
- 细粒度的导航控制
- 自动激活CSS类的链接
- HTML5历史模式或hash模式

### 安装和基本设置

首先，安装Vue Router：

```bash
npm install vue-router
```

然后，在项目中设置路由：

```js
// src/router/index.js
import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView
  }
]

const router = new VueRouter({
  mode: 'history',  // 使用HTML5历史模式
  base: process.env.BASE_URL,
  routes
})

export default router
```

在主应用文件中使用路由：

```js
// src/main.js
import Vue from 'vue'
import App from './App.vue'
import router from './router'

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
```

在App.vue中添加路由视图：

```html
<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </nav>
    <router-view/>
  </div>
</template>
```

### 动态路由匹配

通常我们需要将某种模式匹配到所有路由，全都映射到同一个组件。例如，我们可能有一个`VideoView`组件，对于所有ID不同的视频，都要使用这个组件来渲染：

```js
const routes = [
  // 动态路径参数以冒号开头
  { path: '/video/:id', component: VideoView }
]
```

现在，像`/video/1`和`/video/2`这样的URL都会映射到同一个路由。

在组件中可以通过`$route.params`访问路由参数：

```js
const VideoView = {
  template: '<div>Video ID: {{ $route.params.id }}</div>'
}
```

也可以通过props接收路由参数：

```js
const routes = [
  {
    path: '/video/:id',
    component: VideoView,
    props: true  // 将路由参数作为props传递给组件
  }
]
```

然后在组件中接收：

```js
export default {
  name: 'VideoView',
  props: ['id']  // 直接通过props接收路由参数
}
```

### 嵌套路由

实际应用中，通常由多层嵌套的组件组合而成。URL的各段对应嵌套的各层组件，例如：

```js
const routes = [
  {
    path: '/video/:id',
    name: 'video',
    component: VideoView,
    children: [
      {
        path: 'info1',           // 完整路径是/video/:id/info1
        name: 'video-info1',
        component: VideoInfo1
      },
      {
        path: 'info2',           // 完整路径是/video/:id/info2
        name: 'video-info2',
        component: VideoInfo2
      }
    ]
  }
]
```

在父组件中需要添加`<router-view>`来显示子路由组件：

```html
<template>
  <div class="video-view">
    <h1>Video View</h1>
    <p>视频id为: {{ id }}</p>
    <router-link :to="{ name: 'video-info1', params: { id: id } }">详情1</router-link> |
    <router-link :to="{ name: 'video-info2', params: { id: id } }">详情2</router-link>
    <router-view />  <!-- 子路由组件将渲染在这里 -->
  </div>
</template>
```

### 编程式导航

除了使用`<router-link>`创建导航链接，还可以使用JavaScript代码进行导航：

```js
// 字符串路径
this.$router.push('/home')

// 对象
this.$router.push({ path: '/home' })

// 命名路由
this.$router.push({ name: 'home' })

// 带参数的命名路由
this.$router.push({ name: 'video', params: { id: 123 } })

// 带查询参数
this.$router.push({ path: '/search', query: { q: 'vue' } })
```

其他导航方法：
- `this.$router.replace(...)`：替换当前路由，不会在历史记录中添加新记录
- `this.$router.go(n)`：前进或后退n步
- `this.$router.back()`：后退一步
- `this.$router.forward()`：前进一步

### 命名路由

给路由命名可以简化导航：

```js
const routes = [
  {
    path: '/video/:id',
    name: 'video',        // 路由名称
    component: VideoView
  }
]
```

使用命名路由进行导航：

```html
<router-link :to="{ name: 'video', params: { id: 27 } }">Video</router-link>
```

```js
this.$router.push({ name: 'video', params: { id: 27 } })
```

### 导航守卫

Vue Router提供了导航守卫来控制导航。主要用来通过跳转或取消的方式守卫导航。

全局前置守卫：

```js
router.beforeEach((to, from, next) => {
  // 检查用户是否已登录
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    // 未登录，重定向到登录页
    next({ name: 'login' })
  } else {
    // 继续导航
    next()
  }
})
```

路由独享的守卫：

```js
const routes = [
  {
    path: '/admin',
    component: AdminDashboard,
    beforeEnter: (to, from, next) => {
      // 检查用户是否是管理员
      if (isAdmin) {
        next()
      } else {
        next({ name: 'home' })
      }
    }
  }
]
```

组件内的守卫：

```js
export default {
  beforeRouteEnter(to, from, next) {
    // 在渲染该组件的对应路由被确认前调用
    // 不能获取组件实例 `this`
    next(vm => {
      // 通过 `vm` 访问组件实例
    })
  },
  beforeRouteUpdate(to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    // 可以访问组件实例 `this`
    next()
  },
  beforeRouteLeave(to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    next()
  }
}
```

## 第二部分：Vuex状态管理

### 什么是Vuex

Vuex是一个专为Vue.js应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。

Vuex解决的问题：
- 多个组件共享状态
- 来自不同组件的行为需要变更同一状态
- 实现复杂的状态管理和数据流

### State（状态）

Vuex使用单一状态树，用一个对象包含全部应用层级状态：

```js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loginStatus: '用户已经登陆',
    count: 0,
    todos: [
      { id: 1, text: '学习Vue', done: true },
      { id: 2, text: '学习Vuex', done: false }
    ]
  }
})
```

在组件中访问状态：

```js
// 直接访问
this.$store.state.loginStatus

// 使用计算属性
computed: {
  loginStatus() {
    return this.$store.state.loginStatus
  }
}

// 使用mapState辅助函数
import { mapState } from 'vuex'

computed: {
  ...mapState(['loginStatus', 'count', 'todos'])
}
```

### Getters（获取器）

Getters用于从store中的state派生出一些状态，类似于计算属性：

```js
export default new Vuex.Store({
  state: {
    todos: [
      { id: 1, text: '学习Vue', done: true },
      { id: 2, text: '学习Vuex', done: false }
    ]
  },
  getters: {
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    },
    doneTodosCount: (state, getters) => {
      return getters.doneTodos.length
    }
  }
})
```

在组件中使用getters：

```js
// 直接访问
this.$store.getters.doneTodos

// 使用计算属性
computed: {
  doneTodos() {
    return this.$store.getters.doneTodos
  }
}

// 使用mapGetters辅助函数
import { mapGetters } from 'vuex'

computed: {
  ...mapGetters(['doneTodos', 'doneTodosCount'])
}
```

### Mutations（变更）

更改Vuex的store中的状态的唯一方法是提交mutation：

```js
export default new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment(state) {
      state.count++
    },
    incrementBy(state, payload) {
      state.count += payload.amount
    }
  }
})
```

在组件中提交mutation：

```js
// 直接提交
this.$store.commit('increment')

// 带参数提交
this.$store.commit('incrementBy', { amount: 10 })

// 对象风格提交
this.$store.commit({
  type: 'incrementBy',
  amount: 10
})

// 使用mapMutations辅助函数
import { mapMutations } from 'vuex'

methods: {
  ...mapMutations(['increment', 'incrementBy'])
}
```

**注意**：Mutation必须是同步函数。

### Actions（动作）

Action类似于mutation，不同在于：
- Action提交的是mutation，而不是直接变更状态
- Action可以包含任意异步操作

```js
export default new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment(state) {
      state.count++
    }
  },
  actions: {
    incrementAsync({ commit }) {
      setTimeout(() => {
        commit('increment')
      }, 1000)
    },
    async fetchData({ commit }) {
      try {
        const response = await fetch('/api/data')
        const data = await response.json()
        commit('setData', data)
      } catch (error) {
        commit('setError', error)
      }
    }
  }
})
```

在组件中分发action：

```js
// 直接分发
this.$store.dispatch('incrementAsync')

// 带参数分发
this.$store.dispatch('fetchData', { id: 1 })

// 使用mapActions辅助函数
import { mapActions } from 'vuex'

methods: {
  ...mapActions(['incrementAsync', 'fetchData'])
}
```

### Modules（模块）

Vuex允许我们将store分割成模块，每个模块拥有自己的state、mutation、action、getter：

```js
const moduleA = {
  state: { ... },
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: { ... },
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

// 访问模块状态
store.state.a // -> moduleA的状态
store.state.b // -> moduleB的状态
```

## 实际应用示例

### 项目结构

一个典型的Vue项目结构如下：

```
my-vue-app/
├── public/
│   └── index.html
├── src/
│   ├── assets/
│   ├── components/
│   │   └── HelloWorld.vue
│   ├── router/
│   │   └── index.js        // 路由配置
│   ├── store/
│   │   └── index.js        // Vuex配置
│   ├── views/
│   │   ├── HomeView.vue
│   │   ├── AboutView.vue
│   │   ├── VideoView.vue
│   │   └── video/
│   │       ├── VideoInfo1.vue
│   │       └── VideoInfo2.vue
│   ├── App.vue
│   └── main.js
└── package.json
```

### 路由实现

在`src/router/index.js`中：

```js
import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import VideoView from '@/views/VideoView.vue'
import VideoInfo1 from '@/views/video/VideoInfo1.vue'
import VideoInfo2 from '@/views/video/VideoInfo2.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue')  // 懒加载
  },
  {
    path: '/video/:id',
    name: 'video',
    component: VideoView,
    children: [
      { path: 'info1', name: 'video-info1', component: VideoInfo1 },
      { path: 'info2', name: 'video-info2', component: VideoInfo2 }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
```

在`src/App.vue`中：

```html
<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link :to="{ name: 'video', params: { id: 27 } }">Video</router-link>
    </nav>
    <router-view/>
  </div>
</template>
```

在`src/views/VideoView.vue`中：

```html
<template>
  <div class="video-view">
    <h1>Video View</h1>
    <p>This is the Video View.</p>
    <p>视频id为: {{ id }}</p>
    <router-link :to="{ name: 'video-info1', params: { id: id } }">详情1</router-link> |
    <router-link :to="{ name: 'video-info2', params: { id: id } }">详情2</router-link>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'VideoView',
  props: ['id']
}
</script>
```

### 状态管理实现

在`src/store/index.js`中：

```js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state() {
    return {
      loginStatus: '用户已经登陆'
    }
  },
  getters: {
    // 示例getter
    isLoggedIn: state => {
      return state.loginStatus.includes('已经登陆')
    }
  },
  mutations: {
    // 示例mutation
    setLoginStatus(state, status) {
      state.loginStatus = status
    }
  },
  actions: {
    // 示例action
    updateLoginStatus({ commit }, status) {
      // 可以在这里执行异步操作
      setTimeout(() => {
        commit('setLoginStatus', status)
      }, 1000)
    }
  },
  modules: {
    // 这里可以添加模块
  }
})
```

在`src/views/video/VideoInfo1.vue`中使用Vuex：

```html
<template>
  <div class="video-info1">
    <h1>Video Info 1</h1>
    <p>This is the Video Info 1.</p>
    <p>登录状态: {{ loginStatus }}</p>
  </div>
</template>

<script>
export default {
  name: 'VideoInfo1',
  created() {
    console.log(this.$store.state.loginStatus)
  },
  computed: {
    loginStatus() {
      return this.$store.state.loginStatus
    }
  }
}
</script>
```

## 总结

Vue Router和Vuex是构建大型Vue应用的重要工具：

1. **Vue Router**帮助我们管理应用的路由，实现页面间的无刷新切换，支持：
   - 基本路由配置
   - 动态路由参数
   - 嵌套路由
   - 编程式导航
   - 命名路由
   - 导航守卫

2. **Vuex**提供了一个集中式的状态管理解决方案，包含：
   - State：应用状态
   - Getters：从状态派生的计算属性
   - Mutations：同步更改状态的方法
   - Actions：可包含异步操作的方法
   - Modules：模块化状态管理

通过这两个工具，我们可以构建出结构清晰、状态可控的复杂Vue应用。随着项目规模的增长，良好的路由设计和状态管理变得越来越重要，它们是构建可维护Vue应用的基石。

## 参考资源

- [Vue Router官方文档](https://router.vuejs.org/zh/)
- [Vuex官方文档](https://vuex.vuejs.org/zh/)
- [Vue.js官方文档](https://cn.vuejs.org/)
