---
slug: http-basics
title: 网络请求基础：JavaScript原生HTTP请求详解
date: 2024-06-09
authors: wqz
tags: [前端, HTTP, JavaScript, 网络请求]
keywords: [XMLHttpRequest, Fetch API, HTTP, 网络请求, 前端基础]
description: 详细介绍JavaScript原生HTTP请求方法，包括XMLHttpRequest和Fetch API的使用，以及常见的网络请求概念，为学习Axios等库打下基础。
image: https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/1748179332703-f11583d99a8ca98a31edaaaa089ca766.png
collection: 前端开发
---

# JavaScript网络请求指南

网络请求是前端开发中的核心概念，从XMLHttpRequest到Fetch API再到Ajax，这些术语确实需要系统了解。本文将用通俗易懂的语言解释这些概念，帮助你全面理解JavaScript中的网络请求。

<!-- truncate -->

## 网络请求是什么？为什么我们需要它？

想象一下，你在美团上点了一份外卖。你需要告诉商家你想要什么（请求），然后商家会给你回复（响应）。网页中的HTTP请求也是类似的过程！

简单来说，当你：
- 打开一个网页
- 点击"加载更多"按钮
- 提交一个表单
- 在网页上发送消息

这些操作背后，浏览器都在和服务器进行"对话"，这就是HTTP请求的本质。

这种"对话"包括：
- 你说什么（请求方法：GET、POST等）
- 你对谁说（URL地址）
- 你怎么说（请求头）
- 说什么内容（请求体）

然后服务器会回应：
- 听到了没（状态码：200成功，404没找到等）
- 回应的方式（响应头）
- 回应的内容（响应体）

## JavaScript中的两大网络请求主角

在JavaScript中，我们有两种主要的方式发送网络请求：

1. **XMLHttpRequest（简称XHR）**：老前辈，资历深但脾气有点怪
2. **Fetch API**：新生代，时尚灵活但有时候太年轻气盛

我们先来看看这位老前辈。

## XMLHttpRequest：老当益壮的网络请求大爷

XMLHttpRequest虽然名字里有"XML"，但它其实什么数据都能处理。这就像一个叫"面条专家"的厨师，其实煲汤和炒菜也很拿手。

### 基本使用

```javascript
// 创建一个XHR对象（相当于拿起电话准备打）
const xhr = new XMLHttpRequest();

// 设置请求（拨号）
xhr.open('GET', 'https://api.example.com/data', true); // true表示异步，就像你打电话后可以做别的事

// 设置接收数据的格式
xhr.responseType = 'json'; // 可以是'text'、'json'、'blob'等

// 监听状态变化（等待对方接电话并说话）
xhr.onreadystatechange = function() {
  // readyState就像电话的状态：
  // 0: 刚拿起电话
  // 1: 开始拨号
  // 2: 对方接听了
  // 3: 对方正在说话
  // 4: 通话结束
  
  if (xhr.readyState === 4) { // 通话结束
    if (xhr.status === 200) { // 对方好好回答了
      console.log('收到数据啦:', xhr.response);
    } else {
      console.error('哎呀，出错了:', xhr.status);
    }
  }
};

// 更简单的方式监听（我只关心通话结束）
xhr.onload = function() {
  if (xhr.status === 200) {
    console.log('收到数据啦:', xhr.response);
  } else {
    console.error('哎呀，出错了:', xhr.status);
  }
};

// 处理出错情况（电话线路问题）
xhr.onerror = function() {
  console.error('网络出问题了，可能是你的WiFi断了？');
};

// 发送请求（按下拨号键）
xhr.send(); // GET请求是空的，POST会带上数据
```

老实说，XHR的代码看起来有点复杂，这也是为什么后来大家都更喜欢用Fetch API或Axios。

### 发送POST请求

如果GET请求是"问问题"，那POST请求就是"告诉对方一些信息"：

```javascript
const xhr = new XMLHttpRequest();
xhr.open('POST', 'https://api.example.com/users', true);

// 设置请求头（相当于告诉对方我们说的是什么语言）
xhr.setRequestHeader('Content-Type', 'application/json');

xhr.onload = function() {
  if (xhr.status === 201) { // 201表示"我已经创建了你要的东西"
    console.log('用户创建成功啦:', xhr.response);
  } else {
    console.error('创建失败了，可能是表单填错了?', xhr.status);
  }
};

// 准备要发送的数据
const data = {
  name: '张三',
  email: 'zhangsan@example.com'
};

// 发送数据（一定要先转成JSON字符串！）
xhr.send(JSON.stringify(data));
```

我第一次用POST请求时，就忘了把对象转成JSON字符串，调试了半天才发现问题。这是很多新手都会踩的坑！

### 上传文件

上传文件时，我们需要用到FormData对象：

```javascript
const xhr = new XMLHttpRequest();
xhr.open('POST', 'https://api.example.com/upload', true);

// 监控上传进度（这是XHR的一个很酷的特性！）
xhr.upload.onprogress = function(e) {
  if (e.lengthComputable) {
    const percentComplete = (e.loaded / e.total) * 100;
    console.log('已经上传了:', percentComplete.toFixed(2) + '%');
    // 这里可以更新进度条UI
  }
};

xhr.onload = function() {
  if (xhr.status === 200) {
    console.log('文件上传成功!', xhr.response);
  } else {
    console.error('上传失败了，文件太大了？', xhr.status);
  }
};

// 创建FormData对象（相当于一个虚拟表单）
const formData = new FormData();

// 假设页面上有个文件选择器
const fileInput = document.getElementById('fileInput');
formData.append('file', fileInput.files[0]);
formData.append('username', '张三'); // 可以添加额外信息

// 发送FormData
xhr.send(formData);
```

我记得有一次做文件上传功能，用户反馈上传大文件时没有进度提示，体验很差。加上这个进度监控后，用户满意度立刻提高了！

### 设置超时和取消请求

有时候服务器响应太慢，我们需要设置超时：

```javascript
const xhr = new XMLHttpRequest();
xhr.open('GET', 'https://api.example.com/data', true);

// 设置5秒超时（如果5秒内没回应就放弃）
xhr.timeout = 5000; // 毫秒

// 超时处理
xhr.ontimeout = function() {
  console.error('服务器太慢了，等不及了！');
  // 这里可以提示用户稍后再试
};

xhr.send();

// 如果用户突然不想等了，我们可以取消请求
// xhr.abort(); // 挂断电话
```

## Fetch API：新时代的网络请求小鲜肉

Fetch API是现代浏览器提供的更简洁的API，它基于Promise，写起来更加优雅。

### 基本使用

```javascript
// 基本GET请求，简单多了吧？
fetch('https://api.example.com/data')
  .then(response => {
    // 注意这个坑：fetch不会自动因为HTTP错误状态而失败！
    if (!response.ok) {
      throw new Error(`出错了: ${response.status}`);
    }
    // 解析JSON
    return response.json();
  })
  .then(data => {
    console.log('获取的数据:', data);
  })
  .catch(error => {
    console.error('获取数据失败:', error);
  });
```

注意：Fetch API有个奇怪的特性 - 即使服务器返回404或500错误，它也不会自动reject Promise。你必须手动检查`response.ok`。这个"特性"让我第一次使用时很困惑！

### 发送POST请求

```javascript
// 准备数据
const data = {
  name: '张三',
  email: 'zhangsan@example.com'
};

fetch('https://api.example.com/users', {
  method: 'POST', // 请求方法
  headers: {
    'Content-Type': 'application/json', // 告诉服务器我们发送的是JSON
  },
  body: JSON.stringify(data) // 一样要转成JSON字符串
})
  .then(response => {
    if (!response.ok) {
      throw new Error(`出错了: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('创建成功:', data);
  })
  .catch(error => {
    console.error('创建失败:', error);
  });
```

### 上传文件

```javascript
const fileInput = document.getElementById('fileInput');
const file = fileInput.files[0];

const formData = new FormData();
formData.append('file', file);
formData.append('username', '张三');

fetch('https://api.example.com/upload', {
  method: 'POST',
  body: formData // Fetch会自动处理FormData
})
  .then(response => {
    if (!response.ok) {
      throw new Error(`上传失败: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('上传成功:', data);
  })
  .catch(error => {
    console.error('上传出错:', error);
  });
```

遗憾的是，Fetch API原生不支持上传进度监控，这是它相比XHR的一个缺点。每当我需要做带进度条的上传功能时，要么用XHR，要么用第三方库。

### 设置超时

Fetch没有内置的超时选项，但我们可以用Promise.race()实现：

```javascript
// 创建一个会自动超时的Promise
const timeout = function(ms) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('服务器响应太慢，请稍后再试'));
    }, ms);
  });
};

// 让请求和超时赛跑
Promise.race([
  fetch('https://api.example.com/data'),
  timeout(5000) // 5秒超时
])
  .then(response => {
    if (!response.ok) {
      throw new Error(`出错了: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('获取的数据:', data);
  })
  .catch(error => {
    console.error('请求失败:', error);
  });
```

这个方法我经常用，尤其是调用不太稳定的第三方API时。用户等待超过5秒基本就会失去耐心，与其让他们干等，不如先返回超时提示。

### 取消请求

使用AbortController取消Fetch请求：

```javascript
// 创建一个"取消按钮"
const controller = new AbortController();
const signal = controller.signal;

// 发送请求并把"取消按钮"传进去
fetch('https://api.example.com/data', { signal })
  .then(response => response.json())
  .then(data => console.log('数据:', data))
  .catch(error => {
    if (error.name === 'AbortError') {
      console.log('用户取消了请求');
    } else {
      console.error('请求失败:', error);
    }
  });

// 用户点击取消按钮时
// controller.abort();
```

## 用async/await让代码更优雅

如果说Promise让代码比回调更清晰，那async/await则是锦上添花，让异步代码看起来像同步代码：

```javascript
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    
    if (!response.ok) {
      throw new Error(`HTTP错误: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('获取的数据:', data);
    return data;
  } catch (error) {
    console.error('获取数据失败:', error);
    // 可以显示一个友好的错误信息给用户
    throw error;
  }
}

// 使用函数
fetchData().then(data => {
  // 使用数据更新UI
});
```

我现在几乎所有的网络请求都用async/await写，代码可读性高多了！尤其是需要按顺序发送多个请求时，async/await比链式.then()清晰得多。

## XHR vs Fetch：该选哪个？

这就像选择自动档还是手动档汽车的问题：

### XMLHttpRequest的优点
- 浏览器支持广泛，兼容性好（连IE7都支持）
- 原生支持请求超时
- 可以监控上传和下载进度
- 可以轻松获取二进制数据

### XMLHttpRequest的缺点
- API设计复杂，代码啰嗦
- 容易陷入回调地狱
- 错误处理不够优雅

### Fetch API的优点
- 基于Promise，代码简洁
- 完美配合async/await
- API设计更现代
- 支持流式数据
- 原生支持请求中断

### Fetch API的缺点
- 不支持IE（但谁还关心IE呢？）
- 不支持监控上传进度
- 需要手动处理HTTP错误状态
- 没有原生的超时设置

我的建议？如果不需要考虑IE浏览器，就用Fetch API，尤其是配合async/await使用。如果需要上传进度显示，就用XMLHttpRequest。更简单的方法是用Axios库，它综合了两者的优点。

## 实战案例：一个简单的天气查询应用

让我们通过一个实例来巩固所学知识。下面是一个简单的天气查询应用：

### 使用XMLHttpRequest版本

```html
<!DOCTYPE html>
<html>
<head>
  <title>城市天气查询 - XHR版</title>
  <style>
    body { font-family: 'Microsoft YaHei', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
    .weather-container { border: 1px solid #ddd; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .error { color: #e74c3c; }
    .loading { color: #3498db; }
    input, button { padding: 8px; margin: 10px 0; }
    button { background: #3498db; color: white; border: none; cursor: pointer; border-radius: 4px; }
    button:hover { background: #2980b9; }
  </style>
</head>
<body>
  <h1>🌤️ 城市天气查询</h1>
  <input type="text" id="cityInput" placeholder="输入城市名称，如：北京、上海">
  <button id="searchButton">查询天气</button>
  
  <div id="weatherResult" class="weather-container"></div>
  
  <script>
    document.getElementById('searchButton').addEventListener('click', function() {
      const city = document.getElementById('cityInput').value;
      if (!city) {
        alert('请输入城市名称哦！');
        return;
      }
      
      const resultDiv = document.getElementById('weatherResult');
      resultDiv.innerHTML = '<p class="loading">正在查询天气，请稍等...</p>';
      
      // 创建XHR对象
      const xhr = new XMLHttpRequest();
      
      // API密钥（实际使用需替换）
      const apiKey = 'your-api-key';
      
      // 设置请求
      xhr.open('GET', `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}&lang=zh`, true);
      
      // 设置响应类型
      xhr.responseType = 'json';
      
      // 监听加载完成
      xhr.onload = function() {
        if (xhr.status === 200) {
          // 获取天气数据
          const data = xhr.response;
          const weather = data.current;
          const location = data.location;
          
          // 显示天气信息
          resultDiv.innerHTML = `
            <h2>${location.name}, ${location.country}</h2>
            <p>🌡️ 当前温度: ${weather.temp_c}°C</p>
            <p>☁️ 天气状况: ${weather.condition.text}</p>
            <p>💧 湿度: ${weather.humidity}%</p>
            <p>🌬️ 风速: ${weather.wind_kph} km/h</p>
            <img src="https:${weather.condition.icon}" alt="天气图标">
            <p><small>数据更新时间: ${weather.last_updated}</small></p>
          `;
        } else {
          resultDiv.innerHTML = `<p class="error">查询失败: ${xhr.status}，可能是城市名称输入有误？</p>`;
        }
      };
      
      // 监听错误
      xhr.onerror = function() {
        resultDiv.innerHTML = '<p class="error">网络错误，请检查您的网络连接是否正常</p>';
      };
      
      // 监听超时
      xhr.ontimeout = function() {
        resultDiv.innerHTML = '<p class="error">查询超时，服务器可能暂时不可用，请稍后再试</p>';
      };
      
      // 设置5秒超时
      xhr.timeout = 5000;
      
      // 发送请求
      xhr.send();
    });
  </script>
</body>
</html>
```

### 使用Fetch API版本

```html
<!DOCTYPE html>
<html>
<head>
  <title>城市天气查询 - Fetch版</title>
  <style>
    body { font-family: 'Microsoft YaHei', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
    .weather-container { border: 1px solid #ddd; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .error { color: #e74c3c; }
    .loading { color: #3498db; }
    input, button { padding: 8px; margin: 10px 0; }
    button { background: #3498db; color: white; border: none; cursor: pointer; border-radius: 4px; }
    button:hover { background: #2980b9; }
  </style>
</head>
<body>
  <h1>🌤️ 城市天气查询</h1>
  <input type="text" id="cityInput" placeholder="输入城市名称，如：北京、上海">
  <button id="searchButton">查询天气</button>
  
  <div id="weatherResult" class="weather-container"></div>
  
  <script>
    // 超时函数
    function timeout(ms) {
      return new Promise((_, reject) => {
        setTimeout(() => reject(new Error('查询超时')), ms);
      });
    }
    
    document.getElementById('searchButton').addEventListener('click', async function() {
      const city = document.getElementById('cityInput').value;
      if (!city) {
        alert('请输入城市名称哦！');
        return;
      }
      
      const resultDiv = document.getElementById('weatherResult');
      resultDiv.innerHTML = '<p class="loading">正在查询天气，请稍等...</p>';
      
      // API密钥（实际使用需替换）
      const apiKey = 'your-api-key';
      const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}&lang=zh`;
      
      try {
        // 使用Promise.race实现超时
        const response = await Promise.race([
          fetch(url),
          timeout(5000) // 5秒超时
        ]);
        
        if (!response.ok) {
          throw new Error(`查询失败: ${response.status}`);
        }
        
        const data = await response.json();
        const weather = data.current;
        const location = data.location;
        
        // 显示天气信息
        resultDiv.innerHTML = `
          <h2>${location.name}, ${location.country}</h2>
          <p>🌡️ 当前温度: ${weather.temp_c}°C</p>
          <p>☁️ 天气状况: ${weather.condition.text}</p>
          <p>💧 湿度: ${weather.humidity}%</p>
          <p>🌬️ 风速: ${weather.wind_kph} km/h</p>
          <img src="https:${weather.condition.icon}" alt="天气图标">
          <p><small>数据更新时间: ${weather.last_updated}</small></p>
        `;
      } catch (error) {
        if (error.message === '查询超时') {
          resultDiv.innerHTML = '<p class="error">查询超时，服务器可能暂时不可用，请稍后再试</p>';
        } else {
          resultDiv.innerHTML = `<p class="error">${error.message}，可能是城市名称输入有误？</p>`;
        }
      }
    });
  </script>
</body>
</html>
```

## 开发中常见的坑和解决方案

在我的开发经历中，遇到过很多网络请求相关的问题，分享几个常见的：

### 1. 跨域问题 (CORS)

这可能是前端开发中最常见的错误之一：

```
已阻止跨源请求：同源策略禁止读取位于 https://api.example.com/data 的远程资源。（原因：CORS 头缺少 'Access-Control-Allow-Origin'）。
```

第一次遇到这个问题时，我以为是自己的代码错了，折腾了半天才发现是浏览器的安全限制。

解决方案：
- 最好的方法是让后端开发者在服务器添加正确的CORS头
- 开发环境可以使用代理服务器（如webpack的devServer.proxy或Vite的server.proxy）
- 不建议使用JSONP（只支持GET且有安全风险）
- 生产环境可以在自己的服务器上设置API代理

### 2. 忘记转换JSON

这是新手常犯的错误：

```javascript
// 错误做法
xhr.send(data); // data是一个对象，但应该是字符串！

// 正确做法
xhr.send(JSON.stringify(data));
```

记住：无论是XHR还是Fetch，发送JSON数据时都需要：
1. 设置`Content-Type: application/json`
2. 使用`JSON.stringify()`将对象转换为字符串

### 3. 处理大文件上传

对于大文件上传，建议：
- 添加进度条提示
- 考虑分片上传
- 增加断点续传功能

```javascript
// 上传进度示例（XHR）
xhr.upload.onprogress = function(e) {
  if (e.lengthComputable) {
    const percent = (e.loaded / e.total) * 100;
    progressBar.style.width = percent + '%';
  }
};
```

## 总结：选择适合你的工具

学习了这么多，到底该用哪种方法呢？我的建议是：

- **初学者**：先掌握Fetch API + async/await，更简单易用
- **需要兼容旧浏览器**：使用XMLHttpRequest
- **需要上传进度**：使用XMLHttpRequest
- **大型项目**：考虑使用Axios，它结合了两者的优点，API更一致
- **想要最轻量级**：使用原生Fetch API

无论选择哪种方法，理解原理比使用特定API更重要。掌握了基础，切换不同的工具就很容易了。

## 下一步学习

现在你已经掌握了原生网络请求的基础，准备好了解更强大的[Axios请求库](/blog/axios-guide)了吗？它能让你的代码更简洁，功能更强大！

## 实用资源

- [MDN Web Docs - XMLHttpRequest](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest)
- [MDN Web Docs - Fetch API](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API)
- [MDN Web Docs - HTTP](https://developer.mozilla.org/zh-CN/docs/Web/HTTP)
- [MDN Web Docs - FormData](https://developer.mozilla.org/zh-CN/docs/Web/API/FormData)

记住，编程就像学自行车，刚开始可能会摔几跤，但多练习就会越来越顺！祝你学习愉快！ 
