---
slug: react-basics-guide
title: React基础完全指南：从入门到实践
date: 2024-05-27
authors: wqz
tags: [React, 前端开发, JavaScript, UI框架]
keywords: [React基础, React组件, React Hooks, 状态管理, JSX]
description: 全面介绍React的核心概念和基础知识，包括组件、JSX语法、状态管理、生命周期和Hooks等，帮助初学者快速掌握React开发技能并构建现代化的用户界面。
image: https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/1747555805842-af5b3817dcb9564c2feb229d68d1acf9.png
collection: React学习笔记
collection_order: 2
collection_description: 我的React学习之旅全记录。这个系列涵盖了React基础知识、Hooks使用技巧、状态管理方案、性能优化策略和实际项目案例分析。
---

<!-- truncate -->

# React基础完全指南：从入门到实践

React是由Facebook开发的JavaScript库，用于构建用户界面，特别是单页应用程序。它以组件化、声明式编程和高效的DOM操作而闻名。本文将全面介绍React的基础知识，帮助你快速入门并掌握这一强大的前端框架。

## 什么是React？

React是一个用于构建用户界面的JavaScript库，主要用于开发单页应用程序(SPA)。它的核心特点包括：

1. **组件化**：将UI拆分为独立、可复用的组件，每个组件维护自己的状态
2. **声明式编程**：你只需描述UI应该是什么样子，React会负责更新DOM
3. **虚拟DOM**：通过比较虚拟DOM的差异来最小化实际DOM操作，提高性能
4. **单向数据流**：数据从父组件流向子组件，使应用状态更可预测
5. **JSX语法**：允许在JavaScript中编写类似HTML的代码

## 环境搭建

### 使用Create React App

最简单的方式是使用官方脚手架工具Create React App：

```bash
# 安装Create React App
npx create-react-app my-app

# 进入项目目录
cd my-app

# 启动开发服务器
npm start
```

### 使用Vite（更快的替代方案）

```bash
# 使用Vite创建React项目
npm create vite@latest my-react-app -- --template react

# 进入项目目录
cd my-react-app

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## JSX基础

JSX是React的核心特性之一，它允许你在JavaScript中编写类似HTML的代码。

### JSX语法规则

```jsx
// 基本JSX语法
const element = <h1>Hello, React!</h1>;

// 多行JSX需要用括号包裹
const element = (
  <div>
    <h1>Hello, React!</h1>
    <p>Welcome to the world of React!</p>
  </div>
);

// JSX中使用JavaScript表达式
const name = "React";
const element = <h1>Hello, {name}!</h1>;

// JSX中的条件渲染
const element = (
  <div>
    {isLoggedIn ? (
      <button>Logout</button>
    ) : (
      <button>Login</button>
    )}
  </div>
);

// JSX中的列表渲染
const items = ['Apple', 'Banana', 'Orange'];
const listItems = (
  <ul>
    {items.map((item, index) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
);
```

### JSX中的属性

```jsx
// 使用HTML属性（驼峰命名）
const element = <div className="container" id="app"></div>;

// 内联样式
const style = { color: 'red', fontSize: '16px' };
const element = <p style={style}>Styled text</p>;

// 展开属性
const props = { id: 'app', className: 'container' };
const element = <div {...props}>Content</div>;
```

### JSX注意事项

1. JSX必须有一个根元素（或使用Fragment）
2. 所有标签必须闭合（包括自闭合标签如`<img />`)
3. 类名使用`className`而不是`class`
4. 事件处理器使用驼峰命名（如`onClick`而不是`onclick`）
5. 注释需要写在花括号内：`{/* 注释 */}`

## 组件基础

React应用由组件构建而成。组件是可复用的、独立的代码块，返回要在页面上渲染的React元素。

### 函数组件

```jsx
// 简单的函数组件
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

// 使用箭头函数
const Welcome = (props) => {
  return <h1>Hello, {props.name}</h1>;
};

// 使用组件
const element = <Welcome name="React" />;
```

### 类组件

```jsx
import React, { Component } from 'react';

class Welcome extends Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}

// 使用组件
const element = <Welcome name="React" />;
```

### 组件的组合和嵌套

```jsx
function App() {
  return (
    <div>
      <Welcome name="Alice" />
      <Welcome name="Bob" />
      <Welcome name="Charlie" />
    </div>
  );
}
```

## Props和State

### Props（属性）

Props是从父组件传递给子组件的数据，它们是只读的。

```jsx
// 传递props
function ParentComponent() {
  return <ChildComponent name="React" version={18} isStable={true} />;
}

// 接收props
function ChildComponent(props) {
  return (
    <div>
      <p>Name: {props.name}</p>
      <p>Version: {props.version}</p>
      <p>Stable: {props.isStable ? 'Yes' : 'No'}</p>
    </div>
  );
}

// 解构props
function ChildComponent({ name, version, isStable }) {
  return (
    <div>
      <p>Name: {name}</p>
      <p>Version: {version}</p>
      <p>Stable: {isStable ? 'Yes' : 'No'}</p>
    </div>
  );
}

// 默认props
ChildComponent.defaultProps = {
  version: 17,
  isStable: true
};
```

### State（状态）

State是组件内部的数据，可以随时间变化。

#### 在类组件中使用State

```jsx
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  increment = () => {
    this.setState({ count: this.state.count + 1 });
  }

  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={this.increment}>Increment</button>
      </div>
    );
  }
}
```

#### 在函数组件中使用State (Hooks)

```jsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}
```

## 生命周期和Hooks

### 类组件生命周期

类组件有多个生命周期方法，让你在组件的不同阶段执行代码：

```jsx
class LifecycleDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: null };
    console.log('1. Constructor');
  }

  static getDerivedStateFromProps(props, state) {
    console.log('2. getDerivedStateFromProps');
    return null;
  }

  componentDidMount() {
    console.log('4. componentDidMount');
    // 适合进行API调用
    fetch('https://api.example.com/data')
      .then(response => response.json())
      .then(data => this.setState({ data }));
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log('5. shouldComponentUpdate');
    return true; // 返回false会阻止更新
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    console.log('6. getSnapshotBeforeUpdate');
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log('7. componentDidUpdate');
    // 可以在这里处理props或state的变化
  }

  componentWillUnmount() {
    console.log('8. componentWillUnmount');
    // 清理工作：取消订阅、清除定时器等
  }

  render() {
    console.log('3. render');
    return <div>Lifecycle Demo</div>;
  }
}
```

### React Hooks

Hooks是React 16.8引入的特性，让你在函数组件中使用状态和其他React特性。

#### useState - 状态管理

```jsx
import React, { useState } from 'react';

function Counter() {
  // 声明一个状态变量和更新函数
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
```

#### useEffect - 副作用处理

```jsx
import React, { useState, useEffect } from 'react';

function DataFetcher() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 相当于componentDidMount和componentDidUpdate的组合
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.example.com/data');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // 清理函数（相当于componentWillUnmount）
    return () => {
      console.log('Component unmounting, cleanup here');
    };
  }, []); // 空依赖数组表示只在组件挂载时运行一次

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>No data</div>;

  return (
    <div>
      <h2>Data:</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
```

#### useContext - 上下文访问

```jsx
import React, { createContext, useContext, useState } from 'react';

// 创建上下文
const ThemeContext = createContext('light');

function App() {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={theme}>
      <div>
        <h1>Theme: {theme}</h1>
        <Button />
        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          Toggle Theme
        </button>
      </div>
    </ThemeContext.Provider>
  );
}

function Button() {
  // 使用上下文
  const theme = useContext(ThemeContext);

  return (
    <button
      style={{
        background: theme === 'light' ? '#fff' : '#333',
        color: theme === 'light' ? '#333' : '#fff',
        padding: '10px 20px',
        border: '1px solid #ccc',
        borderRadius: '4px'
      }}
    >
      I am styled based on the theme
    </button>
  );
}
```

#### useRef - 引用DOM元素或保存值

```jsx
import React, { useRef, useEffect } from 'react';

function TextInputWithFocus() {
  // 创建ref
  const inputRef = useRef(null);

  // 组件挂载后自动聚焦
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={() => inputRef.current.focus()}>Focus Input</button>
    </div>
  );
}
```

#### useMemo和useCallback - 性能优化

```jsx
import React, { useState, useMemo, useCallback } from 'react';

function ExpensiveCalculation({ a, b }) {
  // 只有当a或b变化时才重新计算
  const result = useMemo(() => {
    console.log('Computing expensive result...');
    return a * b;
  }, [a, b]);

  // 只有当a变化时才创建新函数
  const handleClick = useCallback(() => {
    console.log(`Clicked with a=${a}`);
  }, [a]);

  return (
    <div>
      <p>Result: {result}</p>
      <button onClick={handleClick}>Click me</button>
    </div>
  );
}
```

## 事件处理

React中的事件处理与DOM事件类似，但有一些语法差异：

```jsx
// 基本事件处理
function Button() {
  const handleClick = () => {
    console.log('Button clicked!');
  };

  return <button onClick={handleClick}>Click me</button>;
}

// 传递参数给事件处理器
function ItemList() {
  const handleItemClick = (id, event) => {
    console.log(`Item ${id} clicked`, event);
  };

  return (
    <ul>
      <li onClick={(e) => handleItemClick(1, e)}>Item 1</li>
      <li onClick={(e) => handleItemClick(2, e)}>Item 2</li>
    </ul>
  );
}

// 在类组件中绑定this
class Button extends React.Component {
  constructor(props) {
    super(props);
    // 方法1：在构造函数中绑定
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    console.log('Button clicked!', this);
  }

  // 方法2：使用箭头函数属性（推荐）
  handleAnotherClick = () => {
    console.log('Another button clicked!', this);
  };

  render() {
    return (
      <div>
        <button onClick={this.handleClick}>Click me</button>
        <button onClick={this.handleAnotherClick}>Click me too</button>
        {/* 方法3：在JSX中使用箭头函数（不推荐，每次渲染都会创建新函数） */}
        <button onClick={() => this.handleClick()}>Click me three</button>
      </div>
    );
  }
}
```

## 条件渲染

React中有多种方式实现条件渲染：

```jsx
function ConditionalRendering({ isLoggedIn, count }) {
  // 1. if/else语句
  if (isLoggedIn) {
    return <div>Welcome back!</div>;
  } else {
    return <div>Please log in</div>;
  }

  // 2. 三元运算符
  return (
    <div>
      {isLoggedIn ? <div>Welcome back!</div> : <div>Please log in</div>}
    </div>
  );

  // 3. 逻辑与运算符（短路求值）
  return (
    <div>
      {count > 0 && <div>You have {count} unread messages</div>}
    </div>
  );

  // 4. 立即执行函数
  return (
    <div>
      {(() => {
        if (count > 10) return <div>Many messages</div>;
        else if (count > 0) return <div>Some messages</div>;
        else return <div>No messages</div>;
      })()}
    </div>
  );
}
```

## 列表渲染

在React中渲染列表时，需要为每个项提供一个唯一的`key`属性：

```jsx
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          {todo.text}
        </li>
      ))}
    </ul>
  );
}

// 使用索引作为key（只有在列表不会重新排序时才推荐）
function NumberList({ numbers }) {
  return (
    <ul>
      {numbers.map((number, index) => (
        <li key={index}>
          {number}
        </li>
      ))}
    </ul>
  );
}
```

## 表单处理

### 受控组件

在受控组件中，表单数据由React组件的state控制：

```jsx
import React, { useState } from 'react';

function LoginForm() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Form submitted:', formData);
    // 处理表单提交逻辑
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
          />
          Remember me
        </label>
      </div>

      <button type="submit">Login</button>
    </form>
  );
}
```

### 非受控组件

在非受控组件中，表单数据由DOM本身处理：

```jsx
import React, { useRef } from 'react';

function FileUploadForm() {
  const fileInputRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const file = fileInputRef.current.files[0];
    console.log('Selected file:', file);
    // 处理文件上传逻辑
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="file">Select a file:</label>
        <input
          type="file"
          id="file"
          ref={fileInputRef}
        />
      </div>

      <button type="submit">Upload</button>
    </form>
  );
}
```

## 组件通信

### 父组件向子组件传递数据

通过props传递数据：

```jsx
function Parent() {
  const data = "Hello from parent";
  return <Child message={data} />;
}

function Child({ message }) {
  return <p>{message}</p>;
}
```

### 子组件向父组件传递数据

通过回调函数传递数据：

```jsx
function Parent() {
  const handleChildData = (data) => {
    console.log("Received from child:", data);
  };

  return <Child onSendData={handleChildData} />;
}

function Child({ onSendData }) {
  return (
    <button onClick={() => onSendData("Hello from child")}>
      Send data to parent
    </button>
  );
}
```

### 兄弟组件通信

通过共同的父组件或Context进行通信：

```jsx
function Parent() {
  const [sharedData, setSharedData] = useState("Initial data");

  return (
    <div>
      <SiblingA sharedData={sharedData} />
      <SiblingB onUpdateData={setSharedData} />
    </div>
  );
}

function SiblingA({ sharedData }) {
  return <div>Sibling A received: {sharedData}</div>;
}

function SiblingB({ onUpdateData }) {
  return (
    <button onClick={() => onUpdateData("Updated data")}>
      Update shared data
    </button>
  );
}
```

## 总结

本文介绍了React的核心概念和基础知识，包括：

1. JSX语法和基本规则
2. 组件的创建和使用
3. Props和State的管理
4. 生命周期方法和Hooks
5. 事件处理
6. 条件渲染和列表渲染
7. 表单处理
8. 组件间通信

掌握这些基础知识后，你可以开始构建自己的React应用。随着经验的积累，你可以进一步学习更高级的主题，如Context API、Redux状态管理、React Router路由管理、性能优化等。

## 参考资源

- [React官方文档](https://reactjs.org/docs/getting-started.html)
- [Create React App](https://create-react-app.dev/)
- [React Hooks文档](https://reactjs.org/docs/hooks-intro.html)
- [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
