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
- **popup**: 点击插件图标时显示的弹出窗口

### JavaScript技术

- **DOM操作**: 创建、修改和删除DOM元素
- **事件处理**: 监听和响应用户事件（点击、拖拽等）
- **本地存储**: 使用chrome.storage.local保存数据
- **消息传递**: 在popup和content script之间传递消息

### CSS技术

- **绝对定位**: 使用position: absolute定位便签
- **盒子模型**: 使用padding、margin、border等属性设计便签样式
- **阴影效果**: 使用box-shadow添加阴影效果
- **过渡效果**: 使用transition添加平滑过渡效果

## 第2部分：UI改进与控制面板

在第1部分中，我们创建了一个基本的便签插件，实现了创建、拖拽、编辑和删除便签的功能。在这一部分中，我们将改进UI设计，添加悬浮控制面板和主题切换功能，使插件更加美观和易用。

### 1. 改进便签设计

首先，让我们改进便签的设计，使其更加现代化和美观。

#### 1.1 更新styles.css

```css
/* 便签样式 */
.sticky-todo-note {
  position: absolute;
  width: 240px;
  min-height: 180px;
  background-color: #ffeb3b;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

/* 便签头部样式 */
.sticky-todo-note-header {
  background-color: #fdd835;
  padding: 10px;
  cursor: move;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

/* 便签标题 */
.sticky-todo-note-title {
  font-weight: 600;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.8);
  flex-grow: 1;
  margin-right: 10px;
}

/* 便签控制按钮容器 */
.sticky-todo-note-controls {
  display: flex;
  gap: 8px;
}

/* 便签控制按钮 */
.sticky-todo-note-control {
  cursor: pointer;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.6);
  transition: color 0.2s ease;
}

.sticky-todo-note-control:hover {
  color: rgba(0, 0, 0, 0.9);
}

/* 删除按钮 */
.sticky-todo-delete-button {
  color: #f44336;
}

.sticky-todo-delete-button:hover {
  color: #d32f2f;
}

/* 最小化按钮 */
.sticky-todo-minimize-button {
  color: #2196F3;
}

.sticky-todo-minimize-button:hover {
  color: #1976D2;
}

/* 便签内容样式 */
.sticky-todo-note-content {
  padding: 15px;
  min-height: 120px;
  outline: none;
  font-size: 14px;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.8);
}

/* 便签底部 */
.sticky-todo-note-footer {
  padding: 8px 15px;
  display: flex;
  justify-content: flex-end;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.5);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

/* 拖拽时的样式 */
.sticky-todo-note.dragging {
  opacity: 0.8;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  transform: scale(1.02);
}

/* 深色模式样式 */
.sticky-todo-dark-mode .sticky-todo-note {
  background-color: #424242;
  color: #fff;
  border-color: rgba(255, 255, 255, 0.1);
}

.sticky-todo-dark-mode .sticky-todo-note-header {
  background-color: #303030;
  border-color: rgba(255, 255, 255, 0.1);
}

.sticky-todo-dark-mode .sticky-todo-note-title {
  color: rgba(255, 255, 255, 0.9);
}

.sticky-todo-dark-mode .sticky-todo-note-control {
  color: rgba(255, 255, 255, 0.7);
}

.sticky-todo-dark-mode .sticky-todo-note-control:hover {
  color: rgba(255, 255, 255, 1);
}

.sticky-todo-dark-mode .sticky-todo-note-content {
  color: rgba(255, 255, 255, 0.9);
}

.sticky-todo-dark-mode .sticky-todo-note-footer {
  color: rgba(255, 255, 255, 0.5);
  border-color: rgba(255, 255, 255, 0.1);
}
```

#### 1.2 更新便签创建函数

现在我们需要更新`content.js`中的便签创建函数，以支持新的UI设计：

```javascript
// 创建便签函数
function createStickyNote(content = '', x = 20, y = 20) {
  // 创建便签容器
  const stickyNote = document.createElement('div');
  stickyNote.className = 'sticky-todo-note';
  stickyNote.style.left = `${x}px`;
  stickyNote.style.top = `${y}px`;

  // 创建便签头部
  const header = document.createElement('div');
  header.className = 'sticky-todo-note-header';

  // 创建便签标题
  const title = document.createElement('div');
  title.className = 'sticky-todo-note-title';
  title.textContent = '便签';

  // 创建控制按钮容器
  const controls = document.createElement('div');
  controls.className = 'sticky-todo-note-controls';

  // 创建最小化按钮
  const minimizeButton = document.createElement('div');
  minimizeButton.className = 'sticky-todo-note-control sticky-todo-minimize-button';
  minimizeButton.innerHTML = '&#8722;'; // 减号符号
  minimizeButton.title = '最小化';
  minimizeButton.addEventListener('click', function() {
    toggleMinimize(stickyNote);
  });

  // 创建删除按钮
  const deleteButton = document.createElement('div');
  deleteButton.className = 'sticky-todo-note-control sticky-todo-delete-button';
  deleteButton.innerHTML = '&times;'; // 乘号符号
  deleteButton.title = '删除';
  deleteButton.addEventListener('click', function() {
    deleteStickyNote(stickyNote);
  });

  // 添加控制按钮到容器
  controls.appendChild(minimizeButton);
  controls.appendChild(deleteButton);

  // 添加标题和控制按钮到头部
  header.appendChild(title);
  header.appendChild(controls);

  // 添加拖拽事件
  header.addEventListener('mousedown', function(e) {
    dragStart(e, stickyNote);
  });

  // 创建便签内容
  const noteContent = document.createElement('div');
  noteContent.className = 'sticky-todo-note-content';
  noteContent.contentEditable = 'true';
  noteContent.textContent = content;
  noteContent.addEventListener('input', function() {
    saveStickyNotes();
  });

  // 创建便签底部
  const footer = document.createElement('div');
  footer.className = 'sticky-todo-note-footer';
  footer.textContent = new Date().toLocaleDateString();

  // 组装便签
  stickyNote.appendChild(header);
  stickyNote.appendChild(noteContent);
  stickyNote.appendChild(footer);

  // 添加到文档中
  document.body.appendChild(stickyNote);

  // 将便签添加到数组中
  stickyNotes.push({
    element: stickyNote,
    content: content,
    x: x,
    y: y,
    minimized: false
  });

  // 保存便签
  saveStickyNotes();

  return stickyNote;
}
```

### 2. 添加最小化功能

现在我们需要添加便签最小化功能，让用户可以暂时隐藏便签内容，只显示一个小图标。

```javascript
// 切换便签最小化状态
function toggleMinimize(stickyNote) {
  const noteContent = stickyNote.querySelector('.sticky-todo-note-content');
  const footer = stickyNote.querySelector('.sticky-todo-note-footer');
  const minimizeButton = stickyNote.querySelector('.sticky-todo-minimize-button');

  // 查找便签在数组中的索引
  const noteIndex = stickyNotes.findIndex(note => note.element === stickyNote);

  if (noteIndex !== -1) {
    // 切换最小化状态
    stickyNotes[noteIndex].minimized = !stickyNotes[noteIndex].minimized;

    if (stickyNotes[noteIndex].minimized) {
      // 最小化便签
      noteContent.style.display = 'none';
      footer.style.display = 'none';
      stickyNote.style.width = '40px';
      stickyNote.style.height = '40px';
      stickyNote.style.borderRadius = '50%';
      stickyNote.classList.add('sticky-todo-minimized');
      minimizeButton.innerHTML = '&#43;'; // 加号符号
      minimizeButton.title = '展开';
    } else {
      // 展开便签
      noteContent.style.display = 'block';
      footer.style.display = 'flex';
      stickyNote.style.width = '240px';
      stickyNote.style.height = 'auto';
      stickyNote.style.borderRadius = '8px';
      stickyNote.classList.remove('sticky-todo-minimized');
      minimizeButton.innerHTML = '&#8722;'; // 减号符号
      minimizeButton.title = '最小化';
    }

    // 保存便签状态
    saveStickyNotes();
  }
}
```

然后，我们需要在`styles.css`中添加最小化状态的样式：

```css
/* 最小化状态的便签 */
.sticky-todo-minimized .sticky-todo-note-header {
  height: 40px;
  width: 40px;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
}

.sticky-todo-minimized .sticky-todo-note-title,
.sticky-todo-minimized .sticky-todo-delete-button {
  display: none;
}

.sticky-todo-minimized .sticky-todo-note-controls {
  margin: 0;
}

.sticky-todo-minimized .sticky-todo-minimize-button {
  font-size: 20px;
}
```

### 3. 创建悬浮控制面板

接下来，我们将创建一个悬浮控制面板，让用户可以方便地创建新便签、切换主题和清除所有便签。

#### 3.1 添加控制面板样式

首先，在`styles.css`中添加控制面板的样式：

```css
/* 控制面板样式 */
.sticky-todo-control-panel {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 10000;
}

/* 控制面板按钮 */
.sticky-todo-control-panel button {
  width: 180px;
  padding: 10px;
  border: none;
  border-radius: 8px;
  background-color: #4CAF50;
  color: white;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.sticky-todo-control-panel button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

/* 添加按钮 */
.sticky-todo-add-button {
  background-color: #4CAF50 !important;
}

.sticky-todo-add-button:hover {
  background-color: #45a049 !important;
}

/* 主题切换按钮 */
.sticky-todo-theme-button {
  background-color: #673AB7 !important;
}

.sticky-todo-theme-button:hover {
  background-color: #5E35B1 !important;
}

/* 清除按钮 */
.sticky-todo-clear-button {
  background-color: #F44336 !important;
}

.sticky-todo-clear-button:hover {
  background-color: #E53935 !important;
}

/* 深色模式下的控制面板 */
.sticky-todo-dark-mode .sticky-todo-control-panel button {
  background-color: #424242;
  color: white;
}
```

#### 3.2 创建控制面板

接下来，在`content.js`中添加创建控制面板的函数：

```javascript
// 创建控制面板
function createControlPanel() {
  const controlPanel = document.createElement('div');
  controlPanel.className = 'sticky-todo-control-panel';

  // 添加新便签按钮
  const addButton = document.createElement('button');
  addButton.textContent = '+ 新便签';
  addButton.className = 'sticky-todo-add-button';
  addButton.addEventListener('click', createStickyNote);

  // 主题切换按钮
  const themeButton = document.createElement('button');
  themeButton.textContent = '🌙 深色模式';
  themeButton.className = 'sticky-todo-theme-button';
  themeButton.addEventListener('click', toggleTheme);

  // 清除所有便签按钮
  const clearButton = document.createElement('button');
  clearButton.textContent = '🗑️ 清除全部';
  clearButton.className = 'sticky-todo-clear-button';
  clearButton.addEventListener('click', clearAllNotes);

  // 添加按钮到控制面板
  controlPanel.appendChild(addButton);
  controlPanel.appendChild(themeButton);
  controlPanel.appendChild(clearButton);

  // 添加控制面板到文档
  document.body.appendChild(controlPanel);

  // 从存储中加载主题设置
  loadThemeSettings();
}
```

### 4. 实现主题切换功能

现在我们需要实现主题切换功能，让用户可以在深色模式和浅色模式之间切换。

```javascript
// 切换主题
function toggleTheme() {
  isDarkMode = !isDarkMode;

  if (isDarkMode) {
    document.body.classList.add('sticky-todo-dark-mode');
    document.querySelector('.sticky-todo-theme-button').textContent = '☀️ 浅色模式';
  } else {
    document.body.classList.remove('sticky-todo-dark-mode');
    document.querySelector('.sticky-todo-theme-button').textContent = '🌙 深色模式';
  }

  // 保存主题设置
  chrome.storage.local.set({ 'stickyTodoDarkMode': isDarkMode });
}

// 加载主题设置
function loadThemeSettings() {
  chrome.storage.local.get('stickyTodoDarkMode', function(data) {
    if (data.stickyTodoDarkMode) {
      isDarkMode = true;
      document.body.classList.add('sticky-todo-dark-mode');
      document.querySelector('.sticky-todo-theme-button').textContent = '☀️ 浅色模式';
    }
  });
}
```

### 5. 更新保存和加载函数

最后，我们需要更新保存和加载函数，以支持新的便签属性（如最小化状态）：

```javascript
// 保存便签
function saveStickyNotes() {
  const notesData = stickyNotes.map(note => {
    const content = note.element.querySelector('.sticky-todo-note-content').textContent;
    const rect = note.element.getBoundingClientRect();
    const x = parseInt(note.element.style.left);
    const y = parseInt(note.element.style.top);

    return {
      content: content,
      x: x,
      y: y,
      minimized: note.minimized
    };
  });

  // 保存到chrome.storage
  chrome.storage.local.set({ 'stickyTodoNotes': notesData });
}

// 加载便签
function loadStickyNotes() {
  chrome.storage.local.get('stickyTodoNotes', function(data) {
    if (data.stickyTodoNotes && data.stickyTodoNotes.length > 0) {
      data.stickyTodoNotes.forEach(noteData => {
        const stickyNote = createStickyNote(noteData.content, noteData.x, noteData.y);

        // 如果便签是最小化状态，则应用最小化样式
        if (noteData.minimized) {
          toggleMinimize(stickyNote);
        }
      });
    }
  });

  // 创建控制面板
  createControlPanel();
}
```

### 6. 清除所有便签功能

最后，我们需要实现清除所有便签的功能，并添加确认对话框，防止用户误操作：

```javascript
// 清除所有便签
function clearAllNotes() {
  // 如果没有便签，直接返回
  if (stickyNotes.length === 0) {
    return;
  }

  // 创建确认对话框
  const confirmDialog = document.createElement('div');
  confirmDialog.className = 'sticky-todo-confirm-dialog';
  confirmDialog.innerHTML = `
    <div class="sticky-todo-confirm-content">
      <h3>确认删除</h3>
      <p>确定要删除所有便签吗？此操作不可撤销。</p>
      <div class="sticky-todo-confirm-buttons">
        <button class="sticky-todo-cancel-button">取消</button>
        <button class="sticky-todo-confirm-button">确定</button>
      </div>
    </div>
  `;

  // 添加确认对话框样式
  const style = document.createElement('style');
  style.textContent = `
    .sticky-todo-confirm-dialog {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10001;
    }

    .sticky-todo-confirm-content {
      background-color: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      max-width: 400px;
      width: 90%;
    }

    .sticky-todo-dark-mode .sticky-todo-confirm-content {
      background-color: #333;
      color: white;
    }

    .sticky-todo-confirm-content h3 {
      margin-top: 0;
      color: #f44336;
    }

    .sticky-todo-confirm-buttons {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
    }

    .sticky-todo-confirm-buttons button {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .sticky-todo-cancel-button {
      background-color: #e0e0e0;
      color: #333;
    }

    .sticky-todo-confirm-button {
      background-color: #f44336;
      color: white;
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(confirmDialog);

  // 添加按钮事件
  confirmDialog.querySelector('.sticky-todo-cancel-button').addEventListener('click', function() {
    confirmDialog.remove();
  });

  confirmDialog.querySelector('.sticky-todo-confirm-button').addEventListener('click', function() {
    // 删除所有便签
    stickyNotes.forEach(note => note.element.remove());
    stickyNotes = [];

    // 保存便签状态
    saveStickyNotes();

    // 关闭确认对话框
    confirmDialog.remove();
  });
}
```

### 7. 测试UI改进

现在我们已经完成了UI改进和控制面板的实现，让我们重新加载插件并测试这些新功能：

1. 打开Chrome浏览器
2. 在地址栏中输入 `chrome://extensions/`
3. 找到我们的Sticky TODO插件
4. 点击"重新加载"按钮
5. 打开任意网页
6. 你应该能看到右下角的悬浮控制面板
7. 点击"+ 新便签"按钮创建一个新便签
8. 尝试最小化和展开便签
9. 尝试切换深色模式和浅色模式
10. 尝试清除所有便签

## 技术要点总结

在这一部分中，我们学习了以下技术要点：

### CSS技术

- **Flexbox布局**: 使用flex布局创建灵活的UI组件
- **CSS变量**: 使用CSS变量实现主题切换
- **过渡和动画**: 使用transition和transform添加平滑过渡效果
- **媒体查询**: 使用@media查询实现响应式设计

### JavaScript技术

- **DOM操作**: 创建和操作DOM元素
- **事件处理**: 处理用户交互事件
- **本地存储**: 使用chrome.storage.local保存用户设置
- **状态管理**: 管理应用的状态（如深色模式、便签最小化状态等）

### UI/UX设计

- **现代UI设计**: 使用圆角、阴影、过渡效果等创建现代化的UI
- **用户体验**: 添加确认对话框、悬浮控制面板等提升用户体验
- **主题切换**: 实现深色模式和浅色模式切换
- **响应式设计**: 确保UI在不同屏幕尺寸下都能正常显示

## 第3部分：便签收缩与磁吸功能

在前两部分中，我们创建了一个基本的便签插件，并改进了UI设计和用户体验。在这一部分中，我们将实现便签收缩和磁吸功能，进一步优化拖拽体验。

### 1. 便签收缩功能

便签收缩功能允许用户将便签收缩为一个小圆点，只显示便签的第一个字符，节省屏幕空间。

#### 1.1 更新styles.css

首先，我们需要在`styles.css`中添加收缩状态的样式：

```css
/* 收缩状态的便签 */
.sticky-todo-collapsed {
  width: 40px !important;
  height: 40px !important;
  border-radius: 50% !important;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.8);
  background-color: #ffeb3b;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.sticky-todo-collapsed:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

/* 深色模式下的收缩便签 */
.sticky-todo-dark-mode .sticky-todo-collapsed {
  background-color: #424242;
  color: rgba(255, 255, 255, 0.9);
}

/* 收缩按钮 */
.sticky-todo-collapse-button {
  color: #ff9800;
}

.sticky-todo-collapse-button:hover {
  color: #f57c00;
}
```

#### 1.2 添加收缩功能

接下来，我们需要更新便签创建函数，添加收缩按钮：

```javascript
// 创建便签函数（更新版）
function createStickyNote(content = '', x = 20, y = 20) {
  // 创建便签容器
  const stickyNote = document.createElement('div');
  stickyNote.className = 'sticky-todo-note';
  stickyNote.style.left = `${x}px`;
  stickyNote.style.top = `${y}px`;

  // 创建便签头部
  const header = document.createElement('div');
  header.className = 'sticky-todo-note-header';

  // 创建便签标题
  const title = document.createElement('div');
  title.className = 'sticky-todo-note-title';
  title.textContent = '便签';

  // 创建控制按钮容器
  const controls = document.createElement('div');
  controls.className = 'sticky-todo-note-controls';

  // 创建收缩按钮
  const collapseButton = document.createElement('div');
  collapseButton.className = 'sticky-todo-note-control sticky-todo-collapse-button';
  collapseButton.innerHTML = '&#8635;'; // 循环箭头符号
  collapseButton.title = '收缩';
  collapseButton.addEventListener('click', function() {
    toggleCollapse(stickyNote);
  });

  // 创建最小化按钮
  const minimizeButton = document.createElement('div');
  minimizeButton.className = 'sticky-todo-note-control sticky-todo-minimize-button';
  minimizeButton.innerHTML = '&#8722;'; // 减号符号
  minimizeButton.title = '最小化';
  minimizeButton.addEventListener('click', function() {
    toggleMinimize(stickyNote);
  });

  // 创建删除按钮
  const deleteButton = document.createElement('div');
  deleteButton.className = 'sticky-todo-note-control sticky-todo-delete-button';
  deleteButton.innerHTML = '&times;'; // 乘号符号
  deleteButton.title = '删除';
  deleteButton.addEventListener('click', function() {
    deleteStickyNote(stickyNote);
  });

  // 添加控制按钮到容器
  controls.appendChild(collapseButton);
  controls.appendChild(minimizeButton);
  controls.appendChild(deleteButton);

  // 添加标题和控制按钮到头部
  header.appendChild(title);
  header.appendChild(controls);

  // 添加拖拽事件
  header.addEventListener('mousedown', function(e) {
    dragStart(e, stickyNote);
  });

  // 创建便签内容
  const noteContent = document.createElement('div');
  noteContent.className = 'sticky-todo-note-content';
  noteContent.contentEditable = 'true';
  noteContent.textContent = content;
  noteContent.addEventListener('input', function() {
    saveStickyNotes();
  });

  // 创建便签底部
  const footer = document.createElement('div');
  footer.className = 'sticky-todo-note-footer';
  footer.textContent = new Date().toLocaleDateString();

  // 组装便签
  stickyNote.appendChild(header);
  stickyNote.appendChild(noteContent);
  stickyNote.appendChild(footer);

  // 添加到文档中
  document.body.appendChild(stickyNote);

  // 将便签添加到数组中
  stickyNotes.push({
    element: stickyNote,
    content: content,
    x: x,
    y: y,
    minimized: false,
    collapsed: false
  });

  // 保存便签
  saveStickyNotes();

  return stickyNote;
}
```

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
