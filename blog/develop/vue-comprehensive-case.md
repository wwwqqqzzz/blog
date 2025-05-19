---
slug: vue-todo-app-tutorial
title: Vue TodoMVC实战教程：从零构建待办事项应用
date: 2024-06-08
authors: wqz
tags: [Vue, 前端开发, 实战教程, TodoMVC]
keywords: [Vue.js, TodoMVC, 待办事项, 前端项目, 组件化开发]
description: 通过构建一个完整的TodoMVC应用，详细讲解Vue的核心概念和实践技巧，包括数据管理、组件通信、事件处理、条件渲染等，帮助初学者掌握Vue实战开发。
image: https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/1747555805842-af5b3817dcb9564c2feb229d68d1acf9.png
collection: Vue.js系列
collection_order: 6
collection_description: 这个系列全面介绍Vue.js的核心概念和高级特性，包括Vue 2和Vue 3，以及相关生态系统（Vue Router、Vuex、Pinia等），帮助你掌握这个流行的渐进式JavaScript框架。
---

<!-- truncate -->

# Vue TodoMVC实战教程：从零构建待办事项应用

TodoMVC是前端框架学习中的经典案例，它包含了一个待办事项应用的核心功能，足够简单又能覆盖框架的主要特性。本教程将带你使用Vue.js实现一个完整的TodoMVC应用，帮助你理解Vue的核心概念和实践技巧。

## 目录

1. [项目结构](#项目结构)
2. [数据管理](#数据管理)
3. [添加任务](#添加任务)
4. [显示任务列表](#显示任务列表)
5. [切换任务状态](#切换任务状态)
6. [删除任务](#删除任务)
7. [编辑任务](#编辑任务)
8. [过滤任务](#过滤任务)
9. [清除已完成任务](#清除已完成任务)
10. [显示剩余任务数量](#显示剩余任务数量)
11. [隐藏空列表](#隐藏空列表)

## 项目结构

Vue TodoMVC应用主要由一个`App.vue`文件组成，包含三个部分：

- `<script>`: 包含应用的数据和逻辑
- `<template>`: 定义应用的HTML结构
- `<style>`: 引入样式表

## 数据管理

在`data()`函数中，我们定义了应用需要的数据：

```js
data() {
  return {
    todos: [
      { id: 1, title: '吃饭', completed: false },
      { id: 2, title: '睡觉', completed: true },
      { id: 3, title: '打豆豆', completed: false }
    ],
    visibility: 'all',     // 当前过滤状态：'all', 'active', 'completed'
    editingId: null,       // 当前正在编辑的任务ID
    beforeEditCache: ''    // 编辑前的任务标题（用于取消编辑时恢复）
  }
}
```

这些数据包括：
- 任务列表数组
- 当前过滤状态
- 编辑状态相关变量

## 添加任务

添加任务的功能通过`addTodo`方法实现：

```js
addTodo(e) {
  const title = e.target.value.trim()  // 获取输入框的值并去除首尾空格
  if (!title) {  // 如果输入为空，不添加任务
    return
  }
  this.todos.push({  // 向todos数组添加新任务
    id: Date.now(),  // 使用当前时间戳作为唯一ID
    title,           // 任务标题
    completed: false // 新任务默认未完成
  })
  e.target.value = ''  // 清空输入框
}
```

在模板中，我们为输入框添加了`@keyup.enter`事件监听器，当用户按下回车键时触发`addTodo`方法：

```html
<input @keyup.enter="addTodo" class="new-todo" placeholder="What needs to be done?" autofocus>
```

## 显示任务列表

使用`v-for`指令遍历`filteredTodos`计算属性，显示任务列表：

```html
<li
  v-for="todo in filteredTodos"
  :key="todo.id"
  :class="{completed: todo.completed, editing: editingId === todo.id}"
>
  <!-- 任务内容 -->
</li>
```

`filteredTodos`计算属性根据当前的`visibility`值过滤任务：

```js
filteredTodos() {
  switch (this.visibility) {
    case 'active':
      return this.todos.filter(todo => !todo.completed)
    case 'completed':
      return this.todos.filter(todo => todo.completed)
    default:
      return this.todos
  }
}
```

## 切换任务状态

使用`v-model`双向绑定`todo.completed`属性，实现任务状态的切换：

```html
<input class="toggle" type="checkbox" v-model="todo.completed">
```

还可以使用`toggleAll`方法一次性切换所有任务的状态：

```js
toggleAll(e) {
  this.todos.forEach(todo => todo.completed = e.target.checked)
}
```

```html
<input id="toggle-all" class="toggle-all" type="checkbox" @click="toggleAll">
```

## 删除任务

通过`removeTodo`方法删除任务：

```js
removeTodo(todo) {
  this.todos.splice(this.todos.indexOf(todo), 1)
}
```

在模板中，为删除按钮添加点击事件：

```html
<button class="destroy" @click="removeTodo(todo)"></button>
```

## 编辑任务

编辑任务需要三个方法：

### 1. 开始编辑

```js
editTodo(todo) {
  this.beforeEditCache = todo.title  // 保存编辑前的标题
  this.editingId = todo.id           // 设置当前编辑的任务ID
}
```

### 2. 完成编辑

```js
doneEdit(todo) {
  if (!this.editingId) return
  todo.title = todo.title.trim()  // 去除首尾空格
  if (!todo.title) {              // 如果标题为空，删除任务
    this.removeTodo(todo)
  }
  this.editingId = null           // 退出编辑模式
}
```

### 3. 取消编辑

```js
cancelEdit(todo) {
  this.editingId = null                  // 退出编辑模式
  todo.title = this.beforeEditCache      // 恢复原标题
}
```

在模板中，我们需要：
- 为标签添加双击事件，进入编辑模式
- 为编辑输入框添加事件处理器，处理保存和取消操作
- 使用自定义指令`v-focus`自动聚焦编辑框

```html
<label @dblclick="editTodo(todo)" v-text="todo.title"></label>
<input class="edit"
       v-model="todo.title"
       @blur="doneEdit(todo)"
       @keyup.enter="doneEdit(todo)"
       @keyup.escape="cancelEdit(todo)"
       v-focus="editingId === todo.id">
```

自定义指令`v-focus`的实现：

```js
directives: {
  focus: {
    inserted(el, binding) {
      if (binding.value) {
        el.focus()
      }
    },
    update(el, binding) {
      if (binding.value) {
        el.focus()
      }
    }
  }
}
```

## 过滤任务

通过URL哈希值实现任务过滤：

```js
onHashChange() {
  const hash = window.location.hash.replace(/#\/?/, '')
  if (['all', 'active', 'completed'].includes(hash)) {
    this.visibility = hash
  } else {
    window.location.hash = ''
    this.visibility = 'all'
  }
}
```

在`mounted`钩子中添加哈希变化的事件监听器：

```js
mounted() {
  window.addEventListener('hashchange', this.onHashChange)
  this.onHashChange()
}
```

在模板中，为过滤链接添加激活状态：

```html
<ul class="filters">
  <li>
    <a :class="{ active: visibility === 'all' }" href="#/all">All</a>
  </li>
  <li>
    <a :class="{ active: visibility === 'active' }" href="#/active">Active</a>
  </li>
  <li>
    <a :class="{ active: visibility === 'completed' }" href="#/completed">Completed</a>
  </li>
</ul>
```

## 清除已完成任务

通过`clearCompleted`方法清除已完成的任务：

```js
clearCompleted() {
  this.todos = this.todos.filter(todo => !todo.completed)
}
```

在模板中，为清除按钮添加点击事件：

```html
<button class="clear-completed" @click="clearCompleted">Clear completed</button>
```

## 显示剩余任务数量

使用`activeTodoCount`计算属性获取未完成任务的数量：

```js
activeTodoCount() {
  return this.todos.filter(todo => !todo.completed).length
}
```

在模板中显示数量：

```html
<span class="todo-count">
  <strong>{{ activeTodoCount }}</strong> {{ activeTodoCount === 1 ? 'item' : 'items' }} left
</span>
```

## 隐藏空列表

当没有任务时，隐藏主要内容和页脚：

```html
<section v-show="todos.length" class="main">
  <!-- 主要内容 -->
</section>
<footer v-show="todos.length" class="footer">
  <!-- 页脚内容 -->
</footer>
```

## 完整代码解析

下面是完整的`App.vue`文件代码：

```vue
<script>
export default {
  // 自定义指令：自动聚焦编辑框
  directives: {
    focus: {
      inserted(el, binding) {
        if (binding.value) {
          el.focus()
        }
      },
      update(el, binding) {
        if (binding.value) {
          el.focus()
        }
      }
    }
  },

  // 应用数据
  data() {
    return {
      todos: [
        { id: 1, title: '吃饭', completed: false },
        { id: 2, title: '睡觉', completed: true },
        { id: 3, title: '打豆豆', completed: false }
      ],
      visibility: 'all',
      editingId: null,
      beforeEditCache: ''
    }
  },

  // 方法
  methods: {
    // 添加任务
    addTodo(e) {
      const title = e.target.value.trim()
      if (!title) {
        return
      }
      this.todos.push({
        id: Date.now(),
        title,
        completed: false
      })
      e.target.value = ''
    },

    // 切换所有任务状态
    toggleAll(e) {
      this.todos.forEach(todo => todo.completed = e.target.checked)
    },

    // 处理哈希变化
    onHashChange() {
      const hash = window.location.hash.replace(/#\/?/, '')
      if (['all', 'active', 'completed'].includes(hash)) {
        this.visibility = hash
      } else {
        window.location.hash = ''
        this.visibility = 'all'
      }
    },

    // 删除任务
    removeTodo(todo) {
      this.todos.splice(this.todos.indexOf(todo), 1)
    },

    // 清除已完成任务
    clearCompleted() {
      this.todos = this.todos.filter(todo => !todo.completed)
    },

    // 开始编辑任务
    editTodo(todo) {
      this.beforeEditCache = todo.title
      this.editingId = todo.id
    },

    // 完成编辑
    doneEdit(todo) {
      if (!this.editingId) return
      todo.title = todo.title.trim()
      if (!todo.title) {
        this.removeTodo(todo)
      }
      this.editingId = null
    },

    // 取消编辑
    cancelEdit(todo) {
      this.editingId = null
      todo.title = this.beforeEditCache
    }
  },

  // 计算属性
  computed: {
    // 过滤后的任务列表
    filteredTodos() {
      switch (this.visibility) {
        case 'active':
          return this.todos.filter(todo => !todo.completed)
        case 'completed':
          return this.todos.filter(todo => todo.completed)
        default:
          return this.todos
      }
    },

    // 未完成任务数量
    activeTodoCount() {
      return this.todos.filter(todo => !todo.completed).length
    }
  },

  // 生命周期钩子
  mounted() {
    window.addEventListener('hashchange', this.onHashChange)
    this.onHashChange()
  }
}
</script>
```

## 学习要点

这个TodoMVC应用展示了Vue的多种功能：

1. **数据绑定**：使用`v-model`实现表单输入和数据的双向绑定
2. **条件渲染**：使用`v-show`控制元素的显示和隐藏
3. **列表渲染**：使用`v-for`渲染任务列表
4. **事件处理**：处理用户交互，如点击、双击、按键等
5. **计算属性**：动态计算派生数据
6. **自定义指令**：扩展Vue的功能，如自动聚焦
7. **生命周期钩子**：在适当的时机执行代码

## 总结

通过实现这个TodoMVC应用，我们学习了Vue的核心概念和实践技巧。这个案例虽然简单，但包含了前端应用开发中的常见功能，如数据管理、用户交互、状态过滤等。掌握了这些基础知识，你就能够开始构建更复杂的Vue应用了。

希望这个教程能帮助你更好地理解Vue的工作原理和使用方法。接下来，你可以尝试扩展这个应用，添加更多功能，如本地存储、拖拽排序、任务分类等，进一步提升你的Vue开发技能。

## 参考资源

- [Vue.js官方文档](https://cn.vuejs.org/)
- [TodoMVC官方网站](http://todomvc.com/)
- [Vue TodoMVC示例](https://todomvc.com/examples/vue/)
