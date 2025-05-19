---
slug: vue3-core-guide
title: Vue 3核心语法详解：从入门到精通
date: 2024-06-04
authors: wqz
tags: [Vue, JavaScript, 前端开发, 框架]
keywords: [Vue3, Composition API, 响应式, 组件通信, 生命周期]
description: 全面介绍Vue 3的核心语法和概念，包括Composition API、响应式系统、组件通信、生命周期钩子等，帮助开发者快速掌握Vue 3的新特性和最佳实践。
image: https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/1747555805842-af5b3817dcb9564c2feb229d68d1acf9.png
collection: Vue.js系列
collection_order: 2
collection_description: 这个系列全面介绍Vue.js的核心概念和高级特性，包括Vue 2和Vue 3，以及相关生态系统（Vue Router、Vuex、Pinia等），帮助你掌握这个流行的渐进式JavaScript框架。
---

<!-- truncate -->

# Vue 3核心语法详解：从入门到精通

Vue 3是一个用于构建用户界面的渐进式JavaScript框架，于2020年9月正式发布。相比Vue 2，Vue 3带来了许多重大改进，包括更小的包体积、更好的性能、更好的TypeScript支持以及全新的Composition API。本文将全面介绍Vue 3的核心语法和概念，帮助你快速掌握这一强大的前端框架。

## Vue 3简介

Vue 3相比Vue 2带来了以下重大改进：

- **更小的包体积**：核心代码体积减少约41%
- **更好的性能**：渲染速度提升约55%，内存使用减少约54%
- **更好的TypeScript支持**：从底层重写，提供更好的类型推断
- **Composition API**：提供更灵活的代码组织方式
- **Teleport, Fragments, Suspense**等新特性

## 创建Vue 3项目

### 使用Vue CLI

```bash
# 安装或更新Vue CLI
npm install -g @vue/cli

# 创建新项目
vue create my-vue3-project

# 选择Vue 3预设
```

### 使用Vite（推荐）

Vite是一个由Vue团队开发的新一代前端构建工具，提供更快的开发体验：

```bash
# 使用npm
npm init vite@latest my-vue3-project -- --template vue

# 使用yarn
yarn create vite my-vue3-project --template vue

# 进入项目目录并安装依赖
cd my-vue3-project
npm install
npm run dev
```

## 组合式API (Composition API)

Vue 3引入了组合式API，它是一组基于函数的API，允许更灵活地组织组件逻辑。

### `<script setup>`语法

`<script setup>`是在单文件组件(SFC)中使用组合式API的编译时语法糖：

```vue
<script setup>
import { ref, onMounted } from 'vue'

// 声明的变量和函数可直接在模板中使用
const count = ref(0)

function increment() {
  count.value++
}

onMounted(() => {
  console.log('组件已挂载')
})
</script>

<template>
  <button @click="increment">{{ count }}</button>
</template>
```

**优点**：
- 更少的样板代码
- 更好的运行时性能
- 更好的IDE类型推断
- 更好的代码组织

## 响应式系统

Vue 3的响应式系统是基于ES6的Proxy实现的，提供了多种创建响应式状态的方式。

### reactive

`reactive`用于创建一个对象的响应式副本：

```javascript
import { reactive } from 'vue'

const state = reactive({
  name: 'wqz',
  age: 18,
  friends: ['wqz1', 'wqz2', 'wqz3']
})

// 修改属性会触发视图更新
state.age++
state.friends.push('wqz4')
```

**特点**：
- 只能用于对象类型（对象、数组、Map、Set）
- 深层响应式，嵌套属性也是响应式的
- 不需要使用`.value`访问

### shallowReactive

`shallowReactive`创建一个浅层响应式对象，只有根级属性是响应式的：

```javascript
import { shallowReactive } from 'vue'

const state = shallowReactive({
  name: 'wqz',
  age: 18,
  friends: ['wqz1', 'wqz2', 'wqz3']
})

// 修改根级属性会触发视图更新
state.age++ // 响应式

// 但修改嵌套属性不会触发视图更新
state.friends.push('wqz4') // 非响应式
```

### ref

`ref`用于创建任何类型值的响应式引用：

```javascript
import { ref } from 'vue'

const count = ref(0)
const name = ref('wqz')
const active = ref(true)
const list = ref([1, 2, 3])

// 修改值需要使用.value
count.value++
name.value = 'new name'
list.value.push(4)
```

**特点**：
- 可用于任何类型的值
- 在JavaScript中访问需要使用`.value`
- 在模板中使用时会自动解包，不需要`.value`
- 对象类型的值内部使用`reactive`实现深层响应式

### readonly和shallowReadonly

`readonly`创建一个只读的响应式代理：

```javascript
import { reactive, readonly } from 'vue'

const original = reactive({ count: 0 })
const copy = readonly(original)

original.count++ // 可以修改
copy.count++ // 警告: Set operation on key "count" failed: target is readonly.
```

`shallowReadonly`创建一个浅层只读代理：

```javascript
import { shallowReadonly } from 'vue'

const state = shallowReadonly({
  name: 'wqz',
  profile: {
    age: 18
  }
})

state.name = 'new name' // 警告: 只读
state.profile.age = 20 // 可以修改，因为是浅层只读
```

### computed

`computed`用于创建计算属性：

```javascript
import { ref, computed } from 'vue'

const content = ref('这是一个测试内容')

// 创建一个计算属性
const contentLength = computed(() => {
  console.log('计算属性执行了')
  return content.value.length
})

// 使用计算属性
console.log(contentLength.value) // 输出内容长度

// 修改依赖值会触发计算属性重新计算
content.value += '!'
console.log(contentLength.value) // 输出新的内容长度
```

**特点**：
- 计算属性会缓存结果，只有依赖变化时才会重新计算
- 计算属性是只读的，除非使用getter和setter

### watch

`watch`用于监听一个或多个响应式数据源的变化：

```javascript
import { ref, watch, reactive } from 'vue'

const count = ref(0)

// 监听单个数据源
watch(count, (newValue, oldValue) => {
  console.log(`count从${oldValue}变为${newValue}`)
})

// 监听多个数据源
const name = ref('wqz')
watch([count, name], ([newCount, newName], [oldCount, oldName]) => {
  console.log(`count: ${oldCount} -> ${newCount}, name: ${oldName} -> ${newName}`)
})

// 监听对象的属性
const user = reactive({ name: 'wqz', age: 18 })
watch(
  () => user.name,
  (newName, oldName) => {
    console.log(`name: ${oldName} -> ${newName}`)
  }
)
```

`watch`选项：

```javascript
watch(source, callback, {
  immediate: true, // 立即执行一次回调
  deep: true,      // 深度监听
  flush: 'post'    // 回调的触发时机 ('pre' | 'post' | 'sync')
})
```

### watchEffect

`watchEffect`立即运行一个函数，同时响应式地追踪其依赖，并在依赖更改时重新运行：

```javascript
import { ref, reactive, watchEffect } from 'vue'

const count = ref(0)
const user = reactive({ name: 'wqz', age: 18 })

watchEffect(() => {
  console.log(`Count: ${count.value}, Age: ${user.age}`)
})
// 立即输出: "Count: 0, Age: 18"

// 修改依赖会触发watchEffect回调
count.value++
// 输出: "Count: 1, Age: 18"

user.age++
// 输出: "Count: 1, Age: 19"
```

**与`watch`的区别**：
- `watchEffect`会立即执行一次
- `watchEffect`自动追踪依赖，不需要明确指定
- `watch`可以访问变化前后的值，`watchEffect`只能访问变化后的值

## 组件通信

### Props

在`<script setup>`中使用`defineProps`声明props：

```vue
<script setup>
// 简单语法
const props = defineProps(['msg', 'title'])

// 带类型和默认值的对象语法
const props = defineProps({
  msg: String,
  title: {
    type: String,
    default: 'Default Title',
    required: false
  },
  count: {
    type: Number,
    validator: (value) => value > 0
  }
})

console.log(props.msg)
</script>
```

### Emits

在`<script setup>`中使用`defineEmits`声明事件：

```vue
<script setup>
// 简单语法
const emit = defineEmits(['update', 'delete'])

// 带验证的对象语法
const emit = defineEmits({
  update: (id, value) => {
    if (id && value) return true
    return false
  },
  delete: (id) => {
    if (id) return true
    return false
  }
})

// 触发事件
function handleClick() {
  emit('update', 1, 'new value')
}
</script>
```

### Provide/Inject

跨多级组件传递数据：

```javascript
// 父组件提供数据
import { provide, ref } from 'vue'

const message = ref('Hello from parent')
provide('message', message) // 可以提供响应式数据

// 子组件注入数据
import { inject } from 'vue'

const message = inject('message', 'default value') // 第二个参数是默认值
console.log(message.value)
```

## 生命周期钩子

在Composition API中，生命周期钩子是以`on`开头的函数：

```javascript
import {
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  onActivated,
  onDeactivated,
  onErrorCaptured
} from 'vue'

// 在组件挂载前调用
onBeforeMount(() => {
  console.log('组件挂载前')
})

// 在组件挂载后调用
onMounted(() => {
  console.log('组件挂载后')
})

// 在数据更新导致虚拟DOM重新渲染前调用
onBeforeUpdate(() => {
  console.log('组件更新前')
})

// 在数据更新导致虚拟DOM重新渲染后调用
onUpdated(() => {
  console.log('组件更新后')
})

// 在组件卸载前调用
onBeforeUnmount(() => {
  console.log('组件卸载前')
})

// 在组件卸载后调用
onUnmounted(() => {
  console.log('组件卸载后')
})
```

## 模板语法

Vue 3的模板语法与Vue 2基本相同：

### 文本插值

```html
<span>{{ message }}</span>
```

### 属性绑定

```html
<div v-bind:id="dynamicId"></div>
<!-- 简写 -->
<div :id="dynamicId"></div>
```

### 条件渲染

```html
<div v-if="type === 'A'">A</div>
<div v-else-if="type === 'B'">B</div>
<div v-else>Not A/B</div>

<!-- v-show切换元素的display属性 -->
<div v-show="isVisible">Hello</div>
```

### 列表渲染

```html
<ul>
  <li v-for="(item, index) in items" :key="item.id">
    {{ index }} - {{ item.name }}
  </li>
</ul>

<ul>
  <li v-for="(value, key, index) in object" :key="key">
    {{ index }}. {{ key }}: {{ value }}
  </li>
</ul>
```

### 事件处理

```html
<button v-on:click="increment">增加</button>
<!-- 简写 -->
<button @click="increment">增加</button>

<!-- 内联处理 -->
<button @click="count++">增加</button>

<!-- 事件修饰符 -->
<form @submit.prevent="onSubmit">...</form>
```

### 表单输入绑定

```html
<input v-model="message">
<textarea v-model="message"></textarea>

<input type="checkbox" v-model="checked">
<input type="radio" v-model="picked" value="A">

<select v-model="selected">
  <option value="">请选择</option>
  <option value="A">A</option>
  <option value="B">B</option>
</select>
```

## 常见问题与解决方案

### 1. "Cannot read properties of null (reading 'emitsOptions')"错误

这个错误通常与组件的emits选项有关，可能出现在以下情况：

- **组件通信问题**：当父组件尝试监听子组件的事件，但子组件没有正确定义这些事件时。
- **组件实例化问题**：当组件实例为null或未正确初始化时。

**解决方案**：
- 确保正确使用`defineEmits`定义组件发出的事件
- 检查组件是否正确注册和导入
- 在App.vue中确保有一个根元素包裹所有内容
- 重启开发服务器或清除浏览器缓存

### 2. 响应式数据不更新视图

**可能的原因**：
- 使用`reactive`时直接替换整个对象
- 使用`ref`时忘记使用`.value`
- 修改数组时使用索引直接赋值

**解决方案**：
- 使用`reactive`时修改属性而不是替换整个对象
- 使用`ref`时记得使用`.value`
- 修改数组时使用`push`, `splice`等方法或使用展开运算符创建新数组

### 3. 计算属性不更新

**可能的原因**：
- 计算属性依赖的响应式数据没有正确追踪
- 计算属性内部使用了非响应式数据

**解决方案**：
- 确保计算属性依赖的所有数据都是响应式的
- 不要在计算属性中使用异步操作

### 4. 生命周期钩子不执行

**可能的原因**：
- 钩子函数名称错误
- 钩子函数在条件语句中调用

**解决方案**：
- 确保使用正确的钩子函数名称（`onMounted`而不是`mounted`）
- 确保钩子函数在组件的顶层调用，不要放在条件语句中

## 总结

Vue 3的组合式API提供了更灵活、更强大的方式来组织组件逻辑。通过`reactive`、`ref`、`computed`、`watch`和`watchEffect`等API，我们可以创建响应式数据并监听其变化。使用`<script setup>`语法可以大大简化组件的编写。

Vue 3不仅保留了Vue 2的简洁和易用性，还通过全新的架构和API设计提供了更好的性能和开发体验。无论是小型项目还是大型应用，Vue 3都能满足现代Web开发的需求。

希望这个教程能帮助您更好地理解和使用Vue 3的核心语法，为您的学习和开发提供参考。

## 参考资源

- [Vue 3官方文档](https://v3.cn.vuejs.org/)
- [Vue 3组合式API文档](https://v3.cn.vuejs.org/guide/composition-api-introduction.html)
- [Vite官方文档](https://cn.vitejs.dev/)
- [Vue 3 Composition API教程](https://v3.vuejs.org/guide/composition-api-introduction.html)
