---
slug: dom-and-timer-guide
title: DOM操作与定时器：前端交互基础详解
date: 2024-05-26
authors: wqz
tags: [JavaScript, DOM, 前端开发, 定时器]
keywords: [DOM操作, JavaScript定时器, 事件处理, 网页交互]
description: 全面介绍DOM操作和JavaScript定时器的基础知识与实践技巧，包括元素选择、属性操作、事件处理以及各类定时器的使用方法，帮助开发者构建交互丰富的Web应用。
image: https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/1747653755260-82cfbb8cd1d2dfd6053e76da932f1fb5.png
collection: JavaScript基础系列
collection_order: 3
collection_description: 这个系列涵盖了JavaScript的核心概念、DOM操作、ES6+特性和异步编程等内容，帮助你从零开始掌握JavaScript编程。
---

<!-- truncate -->

# DOM操作与定时器：前端交互基础详解

DOM（文档对象模型）操作和定时器是前端开发中不可或缺的基础知识，它们共同构成了网页交互的核心机制。本文将详细介绍DOM操作的各种方法以及JavaScript定时器的使用技巧，帮助你构建更加动态和交互丰富的Web应用。

## 第一部分：DOM基础

### 什么是DOM？

DOM（Document Object Model，文档对象模型）是HTML和XML文档的编程接口。它将网页表示为一个树形结构，其中每个节点都是文档的一部分，如元素、属性或文本。通过DOM，JavaScript可以访问和操作网页的内容、结构和样式。

### DOM树结构

一个HTML文档在浏览器中被解析后，会形成一个树状结构：

```
document
└── html
    ├── head
    │   ├── title
    │   ├── meta
    │   └── link
    └── body
        ├── header
        ├── div
        │   ├── h1
        │   └── p
        └── footer
```

### 节点类型

DOM中的节点主要有以下几种类型：

1. **元素节点**：HTML标签，如`<div>`、`<p>`
2. **文本节点**：标签内的文本内容
3. **属性节点**：元素的属性，如`id`、`class`
4. **注释节点**：HTML注释
5. **文档节点**：整个文档（`document`对象）

## 第二部分：DOM选择器

### 获取元素

JavaScript提供了多种方法来选择DOM元素：

```javascript
// 通过ID获取单个元素
const header = document.getElementById('header');

// 通过类名获取元素集合
const buttons = document.getElementsByClassName('btn');

// 通过标签名获取元素集合
const paragraphs = document.getElementsByTagName('p');

// 通过CSS选择器获取第一个匹配的元素
const firstLink = document.querySelector('a.external');

// 通过CSS选择器获取所有匹配的元素
const allLinks = document.querySelectorAll('a.external');
```

### 遍历DOM

获取元素后，可以通过各种属性遍历DOM树：

```javascript
const parent = element.parentNode; // 获取父节点
const children = element.children; // 获取所有子元素节点
const firstChild = element.firstElementChild; // 获取第一个子元素节点
const lastChild = element.lastElementChild; // 获取最后一个子元素节点
const nextSibling = element.nextElementSibling; // 获取下一个兄弟元素节点
const prevSibling = element.previousElementSibling; // 获取上一个兄弟元素节点
```

## 第三部分：DOM操作

### 创建和添加元素

```javascript
// 创建新元素
const newDiv = document.createElement('div');

// 创建文本节点
const newText = document.createTextNode('这是新创建的文本');

// 将文本添加到div中
newDiv.appendChild(newText);

// 将div添加到body中
document.body.appendChild(newDiv);

// 在特定元素前插入
const referenceElement = document.getElementById('reference');
document.body.insertBefore(newDiv, referenceElement);

// 使用更现代的方法
referenceElement.before(newDiv); // 在参考元素前插入
referenceElement.after(newDiv); // 在参考元素后插入
referenceElement.prepend(newDiv); // 在参考元素内部的开头插入
referenceElement.append(newDiv); // 在参考元素内部的末尾插入
```

### 删除和替换元素

```javascript
// 删除元素
const elementToRemove = document.getElementById('old-element');
elementToRemove.remove(); // 现代方法

// 或者通过父元素删除
const parent = elementToRemove.parentNode;
parent.removeChild(elementToRemove); // 传统方法

// 替换元素
const newElement = document.createElement('p');
newElement.textContent = '这是替换后的内容';
const oldElement = document.getElementById('old-element');
oldElement.parentNode.replaceChild(newElement, oldElement); // 传统方法

// 现代方法
oldElement.replaceWith(newElement);
```

### 操作元素内容

```javascript
// 获取/设置元素的文本内容
element.textContent = '新的文本内容';

// 获取/设置元素的HTML内容
element.innerHTML = '<strong>加粗的文本</strong>';

// 获取/设置元素的HTML（包括元素自身）
element.outerHTML = '<div class="new-class">替换整个元素</div>';
```

### 操作元素属性

```javascript
// 获取属性
const value = element.getAttribute('data-id');

// 设置属性
element.setAttribute('data-id', '123');

// 检查属性是否存在
const hasAttribute = element.hasAttribute('data-id');

// 删除属性
element.removeAttribute('data-id');

// 直接访问标准属性
element.id = 'new-id';
element.className = 'new-class';
element.href = 'https://example.com';

// 操作data-*属性
element.dataset.id = '123'; // 设置data-id属性
console.log(element.dataset.id); // 获取data-id属性
```

### 操作CSS样式

```javascript
// 直接设置内联样式
element.style.color = 'red';
element.style.backgroundColor = 'lightblue';
element.style.fontSize = '16px';

// 一次设置多个样式
Object.assign(element.style, {
  color: 'white',
  backgroundColor: 'black',
  padding: '10px'
});

// 添加CSS类
element.classList.add('highlight');

// 删除CSS类
element.classList.remove('old-class');

// 切换CSS类（有则删除，无则添加）
element.classList.toggle('active');

// 检查是否包含某个类
const hasClass = element.classList.contains('active');

// 替换类
element.classList.replace('old-class', 'new-class');
```

## 第四部分：DOM事件

### 事件处理

DOM事件允许JavaScript对用户操作或浏览器行为做出响应：

```javascript
// 方法1：使用addEventListener
const button = document.getElementById('myButton');
button.addEventListener('click', function(event) {
  console.log('按钮被点击了！');
  console.log(event); // 事件对象
});

// 方法2：使用on属性
button.onclick = function() {
  console.log('按钮被点击了！');
};

// 移除事件监听器
function handleClick() {
  console.log('处理点击');
}
button.addEventListener('click', handleClick);
button.removeEventListener('click', handleClick); // 必须是同一个函数引用
```

### 常见事件类型

```javascript
// 鼠标事件
element.addEventListener('click', handleClick); // 点击
element.addEventListener('dblclick', handleDoubleClick); // 双击
element.addEventListener('mousedown', handleMouseDown); // 鼠标按下
element.addEventListener('mouseup', handleMouseUp); // 鼠标释放
element.addEventListener('mousemove', handleMouseMove); // 鼠标移动
element.addEventListener('mouseover', handleMouseOver); // 鼠标进入
element.addEventListener('mouseout', handleMouseOut); // 鼠标离开

// 键盘事件
document.addEventListener('keydown', handleKeyDown); // 键盘按下
document.addEventListener('keyup', handleKeyUp); // 键盘释放
document.addEventListener('keypress', handleKeyPress); // 键盘按下（仅字符键）

// 表单事件
form.addEventListener('submit', handleSubmit); // 表单提交
input.addEventListener('focus', handleFocus); // 获得焦点
input.addEventListener('blur', handleBlur); // 失去焦点
input.addEventListener('change', handleChange); // 值改变并失去焦点
input.addEventListener('input', handleInput); // 值改变（实时）

// 文档/窗口事件
window.addEventListener('load', handleLoad); // 页面及资源加载完成
document.addEventListener('DOMContentLoaded', handleReady); // DOM加载完成
window.addEventListener('resize', handleResize); // 窗口大小改变
window.addEventListener('scroll', handleScroll); // 页面滚动
```

### 事件冒泡与捕获

DOM事件有两个阶段：捕获阶段（从外到内）和冒泡阶段（从内到外）。

```javascript
// 默认在冒泡阶段处理事件
element.addEventListener('click', handleEvent);

// 在捕获阶段处理事件
element.addEventListener('click', handleEvent, true);

// 阻止事件冒泡
function handleEvent(event) {
  event.stopPropagation();
  // 处理事件...
}

// 阻止默认行为
function handleSubmit(event) {
  event.preventDefault();
  // 自定义表单提交逻辑...
}
```

### 事件委托

利用事件冒泡，可以在父元素上监听子元素的事件，这种模式称为事件委托：

```javascript
// 不使用事件委托，为每个按钮添加事件监听器
document.querySelectorAll('.button').forEach(button => {
  button.addEventListener('click', handleClick);
});

// 使用事件委托，只在父元素上添加一个事件监听器
document.getElementById('button-container').addEventListener('click', function(event) {
  if (event.target.classList.contains('button')) {
    handleClick(event);
  }
});
```

## 第五部分：JavaScript定时器

### setTimeout - 延迟执行

`setTimeout`用于在指定的延迟后执行一次代码：

```javascript
// 基本用法
const timeoutId = setTimeout(function() {
  console.log('3秒后执行');
}, 3000); // 3000毫秒 = 3秒

// 使用箭头函数
setTimeout(() => {
  console.log('延迟执行');
}, 1000);

// 传递参数
setTimeout((name) => {
  console.log(`你好，${name}！`);
}, 2000, '小明');

// 清除定时器
clearTimeout(timeoutId);
```

### setInterval - 周期性执行

`setInterval`用于按照指定的时间间隔重复执行代码：

```javascript
// 基本用法
const intervalId = setInterval(function() {
  console.log('每2秒执行一次');
}, 2000);

// 带参数的用法
let count = 0;
const counterId = setInterval((max) => {
  count++;
  console.log(`计数：${count}`);

  if (count >= max) {
    clearInterval(counterId); // 达到最大次数后停止
    console.log('计数结束');
  }
}, 1000, 5); // 最多执行5次

// 手动清除
clearInterval(intervalId);
```

### requestAnimationFrame - 动画帧

`requestAnimationFrame`是专为动画设计的定时方法，它会在浏览器下一次重绘之前调用指定的函数：

```javascript
// 基本动画示例
function animate() {
  // 更新动画状态
  element.style.left = (parseInt(element.style.left) || 0) + 1 + 'px';

  // 如果还没到目标位置，继续请求下一帧
  if (parseInt(element.style.left) < 300) {
    requestAnimationFrame(animate);
  }
}

// 开始动画
const animationId = requestAnimationFrame(animate);

// 取消动画
cancelAnimationFrame(animationId);
```

### 定时器的注意事项

1. **延迟不精确**：JavaScript是单线程的，如果主线程忙碌，定时器可能会被延迟执行。

2. **最小延迟**：浏览器通常有最小延迟限制（约4ms），即使设置为0也不会立即执行。

3. **this指向**：在定时器回调函数中，`this`默认指向全局对象（window），使用箭头函数或`bind()`可以保持正确的`this`指向。

4. **内存泄漏**：未清除的定时器可能导致内存泄漏，特别是在组件卸载时。

```javascript
// 在组件中使用定时器的正确方式
class Component {
  constructor() {
    this.timerId = null;
  }

  start() {
    // 启动前先清除可能存在的定时器
    this.stop();

    // 使用箭头函数保持this指向
    this.timerId = setInterval(() => {
      this.update();
    }, 1000);
  }

  update() {
    console.log('更新组件');
  }

  stop() {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  // 组件销毁时清除定时器
  destroy() {
    this.stop();
  }
}
```

## 实战示例

### 示例1：动态创建元素并添加事件

```javascript
// 创建一个待办事项列表
function createTodoList() {
  // 创建容器
  const container = document.createElement('div');
  container.className = 'todo-container';

  // 创建输入框和按钮
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = '输入新待办事项...';

  const addButton = document.createElement('button');
  addButton.textContent = '添加';
  addButton.addEventListener('click', function() {
    if (input.value.trim() !== '') {
      addTodoItem(input.value);
      input.value = '';
    }
  });

  // 创建列表
  const list = document.createElement('ul');
  list.className = 'todo-list';

  // 使用事件委托处理列表项的点击
  list.addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-btn')) {
      event.target.parentElement.remove();
    } else if (event.target.tagName === 'LI') {
      event.target.classList.toggle('completed');
    }
  });

  // 添加待办项的函数
  function addTodoItem(text) {
    const item = document.createElement('li');
    item.textContent = text;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '删除';
    deleteBtn.className = 'delete-btn';

    item.appendChild(deleteBtn);
    list.appendChild(item);
  }

  // 组装组件
  container.appendChild(input);
  container.appendChild(addButton);
  container.appendChild(list);

  return container;
}

// 将待办事项列表添加到页面
document.body.appendChild(createTodoList());
```

### 示例2：使用定时器创建倒计时

```javascript
function createCountdown(seconds, elementId) {
  const element = document.getElementById(elementId);
  if (!element) return;

  let remainingTime = seconds;

  // 更新显示
  function updateDisplay() {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    element.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  // 初始显示
  updateDisplay();

  // 启动倒计时
  const intervalId = setInterval(() => {
    remainingTime--;
    updateDisplay();

    if (remainingTime <= 0) {
      clearInterval(intervalId);
      element.textContent = '时间到！';
      element.classList.add('expired');
    }
  }, 1000);

  // 返回控制函数
  return {
    pause() {
      clearInterval(intervalId);
    },
    resume() {
      // 实现恢复功能...
    },
    reset() {
      remainingTime = seconds;
      updateDisplay();
    }
  };
}

// 使用倒计时
const countdown = createCountdown(300, 'countdown-display'); // 5分钟倒计时
```

## 总结

DOM操作和定时器是前端开发的基础技能，掌握它们可以让你构建更加动态和交互丰富的Web应用。本文介绍了DOM的基本概念、选择器、操作方法、事件处理以及各种定时器的使用技巧。通过实战示例，展示了如何将这些知识应用到实际开发中。

随着前端框架（如React、Vue等）的普及，直接操作DOM的场景减少了，但理解底层的DOM操作和事件机制仍然是成为优秀前端开发者的必备知识。同样，虽然有更高级的动画和状态管理库，但定时器仍然是处理时间相关逻辑的基础工具。

## 参考资源

- [MDN Web Docs - DOM](https://developer.mozilla.org/zh-CN/docs/Web/API/Document_Object_Model)
- [MDN Web Docs - 事件参考](https://developer.mozilla.org/zh-CN/docs/Web/Events)
- [MDN Web Docs - setTimeout](https://developer.mozilla.org/zh-CN/docs/Web/API/setTimeout)
- [MDN Web Docs - setInterval](https://developer.mozilla.org/zh-CN/docs/Web/API/setInterval)
- [MDN Web Docs - requestAnimationFrame](https://developer.mozilla.org/zh-CN/docs/Web/API/window/requestAnimationFrame)
