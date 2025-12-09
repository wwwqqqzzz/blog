---
title: React入门：核心概念与基础语法
description: 本文介绍React的核心概念、JSX语法、组件化思想以及状态与属性的基本用法。
authors: [wqz]
tags: [React, 前端, JavaScript]
date: 2024-05-22
image: https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=1200&auto=format&fit=crop
collection: React学习笔记
collection_order: 1
collection_description: 我的React学习之旅全记录。这个系列涵盖了React基础知识、Hooks使用技巧、状态管理方案、性能优化策略和实际项目案例分析。
---

# React入门：核心概念与基础语法

React是由Facebook开发的JavaScript库，用于构建用户界面，特别是单页应用程序。它允许开发者创建大型的Web应用，在不重新加载页面的情况下可以改变数据。本文将介绍React的核心概念、JSX语法、组件化思想以及状态与属性的基本用法。

<!-- truncate -->

## React的核心理念

React的核心理念可以概括为以下几点：

1. **组件化**：UI被拆分成独立、可复用的组件
2. **声明式编程**：你只需描述UI应该是什么样子，React会负责渲染
3. **单向数据流**：数据从父组件流向子组件，使应用状态更可预测
4. **虚拟DOM**：提高性能的关键技术，减少实际DOM操作

## 搭建React开发环境

使用Create React App是开始React项目的最简单方式：

```bash
# 安装Create React App
npx create-react-app my-app

# 进入项目目录
cd my-app

# 启动开发服务器
npm start
```

## JSX语法

JSX是JavaScript的语法扩展，看起来像HTML，但实际上是JavaScript。它允许我们在JavaScript中编写HTML结构。

### JSX基础语法

```jsx
// 基本JSX元素
const element = <h1>Hello, world!</h1>;

// 在JSX中使用JavaScript表达式
const name = 'John';
const greeting = <h1>Hello, {name}!</h1>;

// JSX中的属性
const link = <a href="https://reactjs.org">React官网</a>;

// JSX中的样式
const style = { color: 'red', fontSize: '20px' };
const styledElement = <p style={style}>这是红色文字</p>;

// JSX中的类名
const classElement = <div className="container">内容</div>;
```

### JSX注意事项

1. JSX必须有一个根元素或使用Fragment
2. 所有标签必须闭合
3. 使用`className`而不是`class`
4. 使用`htmlFor`而不是`for`
5. 事件处理器使用驼峰命名法

## React组件

React组件是构建UI的基本单位，可以将其视为自定义的HTML元素。

### 函数组件

函数组件是最简单的组件形式，它是一个返回React元素的JavaScript函数：

```jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

// 使用箭头函数
const Welcome = (props) => {
  return <h1>Hello, {props.name}</h1>;
};

// 使用组件
const element = <Welcome name="Sara" />;
```

### 类组件

类组件是使用ES6类语法定义的组件：

```jsx
import React, { Component } from 'react';

class Welcome extends Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}

// 使用组件
const element = <Welcome name="Sara" />;
```

## Props（属性）

Props是从父组件传递给子组件的数据，它们是只读的。

```jsx
// 父组件
function App() {
  return (
    <div>
      <Welcome name="Sara" age={25} isAdmin={true} />
    </div>
  );
}

// 子组件
function Welcome(props) {
  return (
    <div>
      <h1>Hello, {props.name}</h1>
      <p>Age: {props.age}</p>
      <p>Admin: {props.isAdmin ? 'Yes' : 'No'}</p>
    </div>
  );
}
```

### 默认Props

可以为组件定义默认的props值：

```jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

Welcome.defaultProps = {
  name: 'Guest'
};

// 或者在函数参数中使用默认值
function Welcome({ name = 'Guest' }) {
  return <h1>Hello, {name}</h1>;
}
```

## State（状态）

State是组件内部管理的数据，可以随时间变化。在函数组件中，使用`useState`钩子管理状态。

### 在函数组件中使用State

```jsx
import React, { useState } from 'react';

function Counter() {
  // 声明一个新的状态变量，我们将其命名为"count"
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

### 在类组件中使用State

```jsx
import React, { Component } from 'react';

class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    );
  }
}
```

## 事件处理

React中的事件处理与DOM事件类似，但有一些语法差异：

```jsx
// 函数组件中的事件处理
function Button() {
  const handleClick = () => {
    console.log('Button clicked!');
  };

  return <button onClick={handleClick}>Click Me</button>;
}

// 类组件中的事件处理
class Button extends Component {
  handleClick = () => {
    console.log('Button clicked!');
  };

  render() {
    return <button onClick={this.handleClick}>Click Me</button>;
  }
}
```

## 条件渲染

在React中，可以根据条件渲染不同的组件或元素：

```jsx
function Greeting({ isLoggedIn }) {
  if (isLoggedIn) {
    return <h1>Welcome back!</h1>;
  }
  return <h1>Please sign in.</h1>;
}

// 使用三元运算符
function Greeting({ isLoggedIn }) {
  return (
    <div>
      {isLoggedIn ? <h1>Welcome back!</h1> : <h1>Please sign in.</h1>}
    </div>
  );
}

// 使用逻辑与运算符
function Greeting({ isLoggedIn, username }) {
  return (
    <div>
      {isLoggedIn && <h1>Welcome back, {username}!</h1>}
    </div>
  );
}
```

## 列表渲染

使用`map()`方法渲染列表：

```jsx
function NumberList({ numbers }) {
  const listItems = numbers.map((number) => (
    <li key={number.toString()}>
      {number}
    </li>
  ));

  return <ul>{listItems}</ul>;
}

// 使用示例
const numbers = [1, 2, 3, 4, 5];
<NumberList numbers={numbers} />
```

注意每个列表项都需要一个唯一的`key`属性，这有助于React识别哪些项发生了变化。

## 表单处理

在React中，表单元素通常是受控组件，即表单数据由React组件的state控制：

```jsx
import React, { useState } from 'react';

function NameForm() {
  const [value, setValue] = useState('');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleSubmit = (event) => {
    alert('A name was submitted: ' + value);
    event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" value={value} onChange={handleChange} />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}
```

## 总结

本文介绍了React的核心概念和基础语法，包括JSX、组件、Props、State、事件处理、条件渲染、列表渲染和表单处理。掌握这些基础知识后，你就可以开始构建简单的React应用了。在下一篇文章中，我们将深入探讨React Hooks的使用方法和最佳实践。

## 参考资料

- [React官方文档](https://reactjs.org/docs/getting-started.html)
- [Create React App](https://create-react-app.dev/)
- [React Hooks文档](https://reactjs.org/docs/hooks-intro.html)
