---
slug: axios-guide
title: Axios入门指南：从零开始学习网络请求
date: 2024-06-10
authors: wqz
tags: [前端, HTTP, JavaScript, 网络请求]
keywords: [Axios, HTTP, API, 网络请求, 前端入门]
description: 从零开始学习Axios，图文并茂地介绍网络请求的基本概念、Axios的安装和使用方法，以及在实际项目中的应用，适合前端初学者阅读。
image: https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/1748179719875-b4b82dc9eabd5ed129523f6c920354e7.png
collection: 前端开发
---

# Axios入门指南：从零开始学习网络请求

在网页或App开发过程中，经常需要从服务器获取数据或向服务器发送数据。比如获取用户列表、提交表单、上传图片等。这种与服务器的数据交换就是"网络请求"。本文将带你从零开始了解什么是Axios以及如何使用它来处理网络请求。

<!-- truncate -->

## 什么是Axios？

Axios是一个用于在浏览器和Node.js中发送HTTP请求的JavaScript库。简单来说，它就是一个帮助我们与服务器交换数据的工具。

### 为什么需要Axios？

想象一下，如果你想在网页上显示最新的天气数据，你需要从天气服务器获取这些数据。如何做到呢？

在没有工具的情况下，你需要写很多复杂的代码来处理这个请求：

```javascript
// 原生JavaScript发送请求（复杂且不直观）
var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://api.example.com/weather', true);
xhr.onreadystatechange = function() {
  if (xhr.readyState === 4 && xhr.status === 200) {
    var response = JSON.parse(xhr.responseText);
    console.log(response);
  }
};
xhr.send();
```

而使用Axios，只需几行代码：

```javascript
// 使用Axios发送请求（简单直观）
axios.get('https://api.example.com/weather')
  .then(function(response) {
    console.log(response.data);
  })
  .catch(function(error) {
    console.log('获取天气数据失败');
  });
```

是不是简单多了？这就是为什么我们需要Axios这样的工具。

## 安装Axios

在开始使用Axios前，我们需要先安装它。有两种方法：

### 方法一：通过npm或yarn安装（适合项目开发）

如果你正在使用Node.js开发项目，可以在命令行中输入：

```bash
# 使用npm安装
npm install axios

# 或者使用yarn
yarn add axios
```

然后在你的JavaScript文件中引入：

```javascript
// 在文件顶部引入Axios
import axios from 'axios';
// 或者
const axios = require('axios');
```

### 方法二：通过CDN直接使用（适合简单网页）

如果你只是在做一个简单的网页，可以直接在HTML中引入：

```html
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
```

## Axios基础用法

现在我们已经安装好了Axios，让我们学习如何使用它。

### 发送GET请求

GET请求通常用于获取数据。比如获取用户列表：

```javascript
// 获取用户列表
axios.get('https://api.example.com/users')
  .then(function(response) {
    // 成功获取数据后执行这里的代码
    console.log('获取到的用户数据：', response.data);
    // 在这里可以更新网页上的用户列表
  })
  .catch(function(error) {
    // 发生错误时执行这里的代码
    console.log('获取用户数据失败：', error);
    // 在这里可以显示错误消息
  });
```

#### 带参数的GET请求

如果你需要发送一些参数，比如获取特定页码的用户列表：

```javascript
// 获取第2页的用户列表，每页10条数据
axios.get('https://api.example.com/users', {
  params: {
    page: 2,
    limit: 10
  }
})
  .then(function(response) {
    console.log('第2页的用户数据：', response.data);
  })
  .catch(function(error) {
    console.log('获取数据失败：', error);
  });
```

这会发送请求到 `https://api.example.com/users?page=2&limit=10`。

### 发送POST请求

POST请求通常用于发送数据到服务器。比如提交注册信息：

```javascript
// 提交用户注册信息
axios.post('https://api.example.com/register', {
  username: 'newuser',
  email: 'newuser@example.com',
  password: 'securepassword123'
})
  .then(function(response) {
    // 成功注册后执行这里的代码
    console.log('注册成功！', response.data);
    // 可以在这里显示成功消息或跳转到登录页面
  })
  .catch(function(error) {
    // 注册失败时执行这里的代码
    console.log('注册失败：', error);
    // 可以在这里显示错误消息
  });
```

### 发送文件

如果你需要上传文件，比如上传头像：

```javascript
// 假设有个文件选择器： <input type="file" id="avatar">
const fileInput = document.getElementById('avatar');
const file = fileInput.files[0];

// 创建FormData对象
const formData = new FormData();
formData.append('avatar', file);
formData.append('userId', '12345');  // 可以同时附加其他数据

// 发送文件
axios.post('https://api.example.com/upload', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'  // 设置正确的内容类型
  }
})
  .then(function(response) {
    console.log('文件上传成功！', response.data);
  })
  .catch(function(error) {
    console.log('文件上传失败：', error);
  });
```

## 理解Axios响应对象

当Axios收到服务器的响应后，它会返回一个包含多项信息的响应对象。这个对象包含：

```javascript
{
  // data是服务器返回的实际数据
  data: {},

  // 服务器响应的HTTP状态码
  status: 200,

  // 服务器响应的HTTP状态信息
  statusText: 'OK',

  // 服务器响应的头信息
  headers: {},

  // 发送请求时的配置信息
  config: {}
}
```

**重要提示**：实际数据存储在`response.data`中，而不是直接在`response`中！

这是初学者最容易犯的错误之一：

```javascript
// ❌ 错误用法
axios.get('https://api.example.com/users')
  .then(function(data) {
    console.log(data);  // 这里拿到的不是用户数据，而是整个响应对象
  });

// ✅ 正确用法
axios.get('https://api.example.com/users')
  .then(function(response) {
    console.log(response.data);  // 这里才是真正的用户数据
  });
```

## 使用async/await简化代码

上面的例子都使用了`.then()`和`.catch()`处理异步请求。现代JavaScript提供了一种更简洁的方式：`async/await`。

```javascript
// 使用async/await获取用户列表
async function getUsers() {
  try {
    // 等待请求完成
    const response = await axios.get('https://api.example.com/users');
    // 处理数据
    console.log('用户数据：', response.data);
    return response.data;  // 返回数据给调用者
  } catch (error) {
    // 处理错误
    console.log('获取用户数据失败：', error);
    throw error;  // 可选：将错误传递给调用者
  }
}

// 调用函数
getUsers().then(users => {
  // 使用获取到的用户数据
});
```

这种写法看起来更像同步代码，更容易理解。

## 常见实用功能

### 设置超时时间

如果服务器响应太慢，你可能希望取消请求：

```javascript
// 设置5秒超时
axios.get('https://api.example.com/slowdata', {
  timeout: 5000  // 5000毫秒 = 5秒
})
  .then(function(response) {
    console.log('获取成功！');
  })
  .catch(function(error) {
    if (error.code === 'ECONNABORTED') {
      console.log('请求超时，服务器响应太慢');
    } else {
      console.log('发生了其他错误：', error);
    }
  });
```

### 取消请求

有时你可能需要取消正在进行的请求，比如用户点击了"取消"按钮：

```javascript
// 创建一个取消令牌
const controller = new AbortController();

// 发送请求
axios.get('https://api.example.com/longprocess', {
  signal: controller.signal
})
  .then(function(response) {
    console.log('请求完成！');
  })
  .catch(function(error) {
    if (axios.isCancel(error)) {
      console.log('请求被用户取消');
    } else {
      console.log('发生错误：', error);
    }
  });

// 用户点击取消按钮时调用
function cancelRequest() {
  controller.abort();
}

// 例如：设置取消按钮
document.getElementById('cancelButton').addEventListener('click', cancelRequest);
```

### 创建Axios实例

如果你需要向同一个服务器发送多个请求，可以创建一个自定义的Axios实例：

```javascript
// 创建自定义实例
const userAPI = axios.create({
  baseURL: 'https://api.example.com/users',  // 基础URL
  timeout: 5000,  // 超时时间
  headers: {
    'Content-Type': 'application/json',  // 设置默认请求头
    'Authorization': 'Bearer your-token-here'  // 如果需要认证
  }
});

// 使用自定义实例
userAPI.get('/profile')  // 实际请求 https://api.example.com/users/profile
  .then(response => console.log(response.data));

userAPI.post('/update', { name: 'New Name' });  // 更新用户信息
```

这样可以避免重复输入相同的URL和配置。

## 处理常见错误

使用Axios时，了解如何处理各种错误情况非常重要：

```javascript
axios.get('https://api.example.com/data')
  .catch(function(error) {
    if (error.response) {
      // 服务器返回了错误状态码（例如404、500等）
      console.log('服务器错误状态码：', error.response.status);
      console.log('服务器错误信息：', error.response.data);
      
      // 根据状态码做不同处理
      switch (error.response.status) {
        case 404:
          console.log('找不到请求的资源');
          break;
        case 401:
          console.log('未授权，可能需要登录');
          break;
        case 403:
          console.log('禁止访问，没有权限');
          break;
        case 500:
          console.log('服务器内部错误');
          break;
      }
    } else if (error.request) {
      // 请求已发送，但没有收到响应
      console.log('没有收到服务器响应，检查网络连接');
    } else {
      // 请求配置有问题
      console.log('请求设置错误：', error.message);
    }
  });
```

## 实际案例：构建一个简单的天气应用

让我们用Axios构建一个简单的天气查询应用：

```html
<!DOCTYPE html>
<html>
<head>
  <title>简易天气查询</title>
  <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
</head>
<body>
  <h1>天气查询</h1>
  
  <input type="text" id="cityInput" placeholder="输入城市名称">
  <button id="searchButton">查询</button>
  
  <div id="weatherResult"></div>
  
  <script>
    // 当点击查询按钮时
    document.getElementById('searchButton').addEventListener('click', function() {
      // 获取用户输入的城市
      const city = document.getElementById('cityInput').value;
      
      // 清空之前的结果
      document.getElementById('weatherResult').innerHTML = '正在查询...';
      
      // 发送请求到天气API
      // 注意：实际使用时需要替换为真实的API和密钥
      axios.get('https://api.weatherapi.com/v1/current.json', {
        params: {
          key: 'your-api-key',
          q: city,
          lang: 'zh'
        }
      })
        .then(function(response) {
          // 获取天气数据
          const weather = response.data.current;
          const location = response.data.location;
          
          // 显示天气信息
          document.getElementById('weatherResult').innerHTML = `
            <h2>${location.name}, ${location.country}</h2>
            <p>温度: ${weather.temp_c}°C</p>
            <p>天气: ${weather.condition.text}</p>
            <p>湿度: ${weather.humidity}%</p>
            <img src="https:${weather.condition.icon}" alt="天气图标">
          `;
        })
        .catch(function(error) {
          // 处理错误
          document.getElementById('weatherResult').innerHTML = `
            <p style="color: red;">查询失败: ${error.message}</p>
            <p>请检查城市名称是否正确，或者网络连接是否正常</p>
          `;
        });
    });
  </script>
</body>
</html>
```

这个简单的应用允许用户输入城市名称，然后使用Axios从天气API获取该城市的当前天气信息并显示。

## 进阶技巧：拦截器

当你的应用变得更复杂时，你可能需要在每个请求前或响应后执行一些操作。Axios的拦截器可以帮助你做到这一点。

### 请求拦截器

请求拦截器可以在请求发送前自动执行某些操作，如添加认证令牌：

```javascript
// 添加请求拦截器
axios.interceptors.request.use(function(config) {
  // 在发送请求前做些什么
  
  // 例如：从localStorage获取令牌并添加到请求头
  const token = localStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // 例如：显示加载状态
  document.getElementById('loadingIndicator').style.display = 'block';
  
  return config;  // 一定要返回config
}, function(error) {
  // 处理请求错误
  document.getElementById('loadingIndicator').style.display = 'none';
  return Promise.reject(error);
});
```

### 响应拦截器

响应拦截器可以在收到响应后自动执行某些操作，如处理通用错误：

```javascript
// 添加响应拦截器
axios.interceptors.response.use(function(response) {
  // 对响应数据做点什么
  
  // 例如：隐藏加载状态
  document.getElementById('loadingIndicator').style.display = 'none';
  
  return response;  // 一定要返回响应
}, function(error) {
  // 对响应错误做点什么
  
  // 例如：隐藏加载状态
  document.getElementById('loadingIndicator').style.display = 'none';
  
  // 例如：如果是401错误（未授权），跳转到登录页面
  if (error.response && error.response.status === 401) {
    alert('登录已过期，请重新登录');
    window.location.href = '/login';
  }
  
  return Promise.reject(error);  // 一定要返回错误
});
```

## 常见问题解答

### 跨域问题

如果你遇到"No 'Access-Control-Allow-Origin' header is present"错误，这是由于跨域资源共享(CORS)限制导致的。解决方法有：

1. **服务器端**：配置服务器允许跨域请求（最佳方案）
2. **开发环境**：使用代理服务器
   
   例如，在React项目中，可以在`package.json`中添加：
   ```json
   {
     "proxy": "https://api.example.com"
   }
   ```
   
   然后将请求URL改为相对路径：
   ```javascript
   axios.get('/users')  // 而不是 https://api.example.com/users
   ```

### 如何下载文件

下载文件需要特殊处理：

```javascript
axios.get('https://api.example.com/download/report.pdf', {
  responseType: 'blob'  // 重要：指定响应类型为blob
})
  .then(function(response) {
    // 创建一个blob链接
    const url = window.URL.createObjectURL(new Blob([response.data]));
    
    // 创建一个隐藏的下载链接
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'report.pdf');  // 设置文件名
    document.body.appendChild(link);
    
    // 触发下载
    link.click();
    
    // 清理
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  });
```

## 总结

Axios是一个强大而易用的HTTP请求库，可以极大地简化与服务器的数据交换。通过本文，我们了解了：

1. Axios的基本概念和安装方法
2. 如何发送GET和POST请求
3. 如何处理文件上传
4. 如何处理响应和错误
5. 如何使用async/await简化代码
6. 拦截器的使用
7. 解决常见问题

无论你是前端开发新手还是有经验的开发者，掌握Axios都将大大提高你的开发效率。

## 参考资源

- [Axios官方文档](https://axios-http.com/)
- [MDN Web Docs - Fetch API](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API)
- [MDN Web Docs - XMLHttpRequest](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest) 