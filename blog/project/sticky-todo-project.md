---
slug: sticky-todo-chrome-extension
title: Sticky TODO Chrome插件开发教程：从零开始构建便签应用
date: 2024-06-12
authors: wqz
tags: [Chrome插件, JavaScript, 前端开发, 项目教程]
keywords: [Chrome扩展, 浏览器插件, 便签应用, 拖拽功能, Notion集成]
description: 这个系列教程将带你从零开始构建一个功能完整的Chrome插件，实现在任意网页上创建、编辑、拖拽和保存便签的功能，并学习Chrome插件开发的核心概念和技术。
image: https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/1747555805842-af5b3817dcb9564c2feb229d68d1acf9.png
---

<!-- truncate -->

# Sticky TODO Chrome插件开发教程：从零开始构建便签应用

在这个系列教程中，我将带你从零开始构建一个功能完整的Chrome插件 - Sticky TODO。这个插件允许用户在任何网页上创建、编辑、拖拽和保存便签，就像在网页上贴便利贴一样。通过这个项目，你将学习Chrome插件开发的各个方面，从基本结构到高级功能。

## 项目概述

我们的Sticky TODO插件将实现以下功能：

### 基本功能
- 在任意网页创建便签
- 拖拽便签到任意位置
- 编辑便签内容
- 删除便签
- 保存便签（即使页面刷新也不会丢失）

### UI功能
- 现代化的UI设计
- 深色/浅色主题切换
- 悬浮控制面板
- 便签最小化功能

### 高级功能
- 便签收缩功能（将便签收缩为小圆点）
- 便签磁吸功能（将便签磁吸到屏幕边缘）
- Notion集成（双向同步便签）

## 教程大纲

本教程分为四个主要部分：

1. **项目初始化与基本结构**：创建插件的基本文件结构，实现便签的创建、拖拽、编辑和删除功能
2. **UI改进与控制面板**：改进UI设计，添加悬浮控制面板和主题切换功能
3. **便签收缩与磁吸功能**：实现便签收缩和磁吸功能，优化拖拽体验
4. **Notion集成功能**：实现与Notion的双向同步，添加设置页面

## 第1部分：项目初始化与基本结构

### 1. 准备工作

#### 所需工具
- 文本编辑器（推荐：Visual Studio Code）
- Chrome浏览器
- 基本的HTML、CSS和JavaScript知识

#### 创建项目文件夹
首先，创建一个名为`sticky-todo`的文件夹，用于存放我们的插件文件。

### 2. 创建基本文件结构

Chrome插件需要几个基本文件。让我们一一创建它们：

#### 2.1 创建manifest.json

`manifest.json`是Chrome插件的配置文件，它告诉浏览器插件的名称、版本、权限等信息。

在`sticky-todo`文件夹中创建`manifest.json`文件：

```json
{
  "manifest_version": 3,
  "name": "Sticky TODO",
  "version": "1.0",
  "description": "在任意网页上创建、拖拽和保存便签",
  "permissions": ["storage", "activeTab"],
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "images/icon16.png",
      "48": "images/icon48.png",
      "128": "images/icon128.png"
    }
  },
  "icons": {
    "16": "images/icon16.png",
    "48": "images/icon48.png",
    "128": "images/icon128.png"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"],
      "css": ["styles.css"]
    }
  ]
}
```

**说明：**
- `manifest_version`: 使用最新的Manifest V3
- `permissions`: 请求存储权限（用于保存便签）和activeTab权限
- `action`: 定义点击插件图标时的行为
- `content_scripts`: 定义要注入到网页中的JavaScript和CSS文件

#### 2.2 创建图标文件夹和图标

创建一个`images`文件夹，并在其中放置三个不同尺寸的图标：

```
sticky-todo/
  ├── images/
  │   ├── icon16.png
  │   ├── icon48.png
  │   └── icon128.png
```

你可以使用任何图像编辑工具创建这些图标，或者使用在线工具生成它们。确保图标尺寸分别为16x16、48x48和128x128像素。

#### 2.3 创建popup.html

`popup.html`是点击插件图标时显示的弹出窗口。

```html
<!DOCTYPE html>
<html>
<head>
  <title>Sticky TODO</title>
  <style>
    body {
      width: 300px;
      padding: 10px;
      font-family: Arial, sans-serif;
    }
    h1 {
      font-size: 18px;
      margin-bottom: 10px;
    }
    button {
      margin: 5px 0;
      padding: 8px;
      width: 100%;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:hover {
      background-color: #45a049;
    }
  </style>
</head>
<body>
  <h1>Sticky TODO</h1>
  <button id="createNote">创建新便签</button>
  <button id="clearNotes">清除所有便签</button>
  <button id="toggleTheme">切换深色/浅色模式</button>

  <script src="popup.js"></script>
</body>
</html>
```

#### 2.4 创建popup.js

`popup.js`处理弹出窗口中的按钮点击事件：

```javascript
// 当弹出窗口加载完成时
document.addEventListener('DOMContentLoaded', function() {
  // 创建新便签按钮
  document.getElementById('createNote').addEventListener('click', function() {
    // 向当前标签页发送消息，请求创建新便签
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "createNote"});
    });
  });

  // 清除所有便签按钮
  document.getElementById('clearNotes').addEventListener('click', function() {
    // 向当前标签页发送消息，请求清除所有便签
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "clearNotes"});
    });
  });

  // 切换主题按钮
  document.getElementById('toggleTheme').addEventListener('click', function() {
    // 向当前标签页发送消息，请求切换主题
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "toggleTheme"});
    });
  });
});
```

#### 2.5 创建content.js

`content.js`是注入到网页中的脚本，负责创建和管理便签。这是插件的核心部分，包含了便签的创建、拖拽、编辑、删除和保存功能。

由于代码较长，这里只展示主要功能的代码片段：

```javascript
// 创建一个自执行函数，避免变量污染全局命名空间
(function() {
  // 存储所有便签的数组
  let stickyNotes = [];
  // 当前正在拖拽的便签
  let currentDragNote = null;
  // 拖拽时的初始位置
  let initialX, initialY;
  // 拖拽时的偏移量
  let xOffset = 0, yOffset = 0;
  // 是否为深色模式
  let isDarkMode = false;

  // 监听来自popup.js的消息
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "createNote") {
      createStickyNote();
    } else if (request.action === "clearNotes") {
      clearAllNotes();
    } else if (request.action === "toggleTheme") {
      toggleTheme();
    }
  });

  // 初始化函数
  function init() {
    // 加载保存的便签
    loadStickyNotes();
    // 添加事件监听器
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('mousemove', drag);
  }

  // 创建便签函数
  function createStickyNote(content = '', x = 20, y = 20) {
    // 创建便签容器
    const stickyNote = document.createElement('div');
    stickyNote.className = 'sticky-todo-note';
    stickyNote.style.left = `${x}px`;
    stickyNote.style.top = `${y}px`;

    // ... 创建便签的其他部分 ...

    // 添加到文档中
    document.body.appendChild(stickyNote);

    // 将便签添加到数组中
    stickyNotes.push({
      element: stickyNote,
      content: content,
      x: x,
      y: y
    });

    return stickyNote;
  }

  // 删除便签函数
  function deleteStickyNote(stickyNote) {
    // 从DOM中移除
    stickyNote.remove();

    // 从数组中移除
    stickyNotes = stickyNotes.filter(note => note.element !== stickyNote);

    // 保存更新后的便签
    saveStickyNotes();
  }

  // ... 其他功能函数 ...

  // 当页面加载完成后初始化
  window.addEventListener('load', init);
})();
```

#### 2.6 创建styles.css

`styles.css`定义便签的样式：

```css
/* 便签样式 */
.sticky-todo-note {
  position: absolute;
  width: 200px;
  min-height: 150px;
  background-color: #ffeb3b;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 9999;
  font-family: Arial, sans-serif;
  border-radius: 4px;
  overflow: hidden;
}

/* 便签头部样式 */
.sticky-todo-note-header {
  background-color: #fdd835;
  padding: 8px;
  cursor: move;
  display: flex;
  justify-content: flex-end;
}

/* 删除按钮样式 */
.sticky-todo-delete-button {
  color: #f44336;
  font-size: 20px;
  cursor: pointer;
}

/* 便签内容样式 */
.sticky-todo-note-content {
  padding: 10px;
  min-height: 100px;
  outline: none;
}

/* 拖拽时的样式 */
.sticky-todo-note.dragging {
  opacity: 0.8;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

/* 深色模式样式 */
.sticky-todo-dark-mode .sticky-todo-note {
  background-color: #424242;
  color: #fff;
}

.sticky-todo-dark-mode .sticky-todo-note-header {
  background-color: #303030;
}
```

### 3. 加载插件到Chrome

现在我们已经创建了所有必要的文件，让我们将插件加载到Chrome中：

1. 打开Chrome浏览器
2. 在地址栏中输入 `chrome://extensions/`
3. 打开右上角的"开发者模式"开关
4. 点击"加载已解压的扩展程序"按钮
5. 选择我们的`sticky-todo`文件夹

如果一切正常，你应该能看到我们的插件已经加载到Chrome中了。

### 4. 测试插件

现在让我们测试一下插件的基本功能：

1. 打开任意网页
2. 点击Chrome工具栏中的Sticky TODO图标
3. 在弹出窗口中点击"创建新便签"按钮
4. 你应该能看到一个便签出现在网页上
5. 尝试拖拽便签、编辑内容、删除便签等操作

## 技术要点总结

在这个项目中，我们学习了以下技术要点：

### Chrome插件基础

- **manifest.json**: Chrome插件的配置文件，定义插件的名称、版本、权限等信息
- **content scripts**: 注入到网页中的JavaScript和CSS，可以操作网页DOM
- **background scripts**: 在后台运行的脚本，可以处理跨域请求等
- **popup**: 点击插件图标时显示的弹出窗口

### JavaScript技术

- **DOM操作**: 创建、修改和删除DOM元素
- **事件处理**: 监听和响应用户事件（点击、拖拽等）
- **本地存储**: 使用chrome.storage.local或localStorage保存数据
- **异步编程**: 使用Promise和async/await处理异步操作
- **消息传递**: 在content script和background script之间传递消息

### CSS技术

- **现代CSS**: 使用flexbox、grid、transition等现代CSS特性
- **响应式设计**: 确保UI在不同大小的屏幕上都能正常显示
- **CSS变量**: 使用CSS变量实现主题切换
- **动画效果**: 使用CSS动画和过渡效果提升用户体验

## 后续开发计划

在接下来的教程中，我们将继续完善这个插件，添加更多高级功能：

1. **UI改进与控制面板**：改进UI设计，添加悬浮控制面板和主题切换功能
2. **便签收缩与磁吸功能**：实现便签收缩和磁吸功能，优化拖拽体验
3. **Notion集成功能**：实现与Notion的双向同步，添加设置页面

敬请期待后续教程！

## 完整的文件结构

```
sticky-todo/
  ├── manifest.json
  ├── popup.html
  ├── popup.js
  ├── content.js
  ├── styles.css
  └── images/
      ├── icon16.png
      ├── icon48.png
      └── icon128.png
```

## 学习资源

- [Chrome扩展开发文档](https://developer.chrome.com/docs/extensions/)
- [MDN Web文档](https://developer.mozilla.org/zh-CN/docs/Web)
- [Chrome扩展示例](https://github.com/GoogleChrome/chrome-extensions-samples)
