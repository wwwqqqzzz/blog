---
slug: javascript-network-requests-guide
title: JavaScript网络请求方法详解：XMLHttpRequest、Axios与Fetch API
date: 2024-06-03
authors: wqz
tags: [JavaScript, 前端开发, 网络请求, API]
keywords: [XMLHttpRequest, Axios, Fetch API, Ajax, HTTP请求, 前端网络通信]
description: 全面介绍JavaScript中三种主要的网络请求方法：XMLHttpRequest、Axios和Fetch API，包括基本用法、高级特性和最佳实践，帮助开发者选择最适合自己项目的网络通信方案。
image: https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/1747555805842-af5b3817dcb9564c2feb229d68d1acf9.png
---

<!-- truncate -->

# JavaScript网络请求方法详解：XMLHttpRequest、Axios与Fetch API

在前端开发中，网络请求是与服务器交互的基础。本文将详细介绍三种常用的JavaScript网络请求方法：XMLHttpRequest (Ajax)、Axios和Fetch API，帮助你理解它们的特点和适用场景，从而选择最适合自己项目的网络通信方案。

## 1. XMLHttpRequest (原生Ajax)

XMLHttpRequest是最原始的网络请求方法，所有现代浏览器都支持它。尽管它看起来有些"古老"，但了解它有助于理解其他网络请求方法的基础原理。

### GET请求

```javascript
// 创建XMLHttpRequest对象
const xhr = new XMLHttpRequest();

// 配置请求
xhr.open('get', 'https://api.example.com/data?name=user&age=18');

// 发送请求
xhr.send();

// 监听响应
xhr.onreadystatechange = function() {
    // 方法一：详细判断
    if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
            console.log(xhr.response);
        } else {
            console.log('请求失败');
        }
    }

    // 方法二：简洁判断
    if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        console.log(JSON.parse(xhr.responseText));
    }
};
```

**说明：**
- `readyState`有5个值：
  - 0: 未初始化
  - 1: 已打开
  - 2: 已发送
  - 3: 接收中
  - 4: 已完成
- `XMLHttpRequest.DONE`等于4，表示请求已完成
- `status`是HTTP状态码，200表示成功

### POST请求

```javascript
const xhr = new XMLHttpRequest();

// 配置POST请求
xhr.open('post', 'https://api.example.com/submit');

// 设置请求头，告诉服务器内容类型
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

// 发送数据
xhr.send('name=user&age=18');

// 监听响应
xhr.onreadystatechange = function() {
    if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        console.log(JSON.parse(xhr.responseText));
    }
};
```

**POST请求注意事项：**
- 需要设置`Content-Type`请求头
- 数据在`send()`方法中传递
- 常见的`Content-Type`值：
  - `application/x-www-form-urlencoded`：表单数据
  - `application/json`：JSON数据
  - `multipart/form-data`：文件上传

## 2. Axios

Axios是一个基于Promise的HTTP客户端，可以在浏览器和Node.js中使用。它是目前最流行的网络请求库之一，提供了简洁易用的API和丰富的功能。

### 基本使用

```javascript
// GET请求
axios.get('https://api.example.com/data?name=user&age=18')
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error('请求出错', error);
  });

// 带参数的GET请求
axios.get('https://api.example.com/data', {
  params: {
    name: 'user',
    age: 18
  }
})
  .then(response => {
    console.log(response.data);
  });

// POST请求
axios.post('https://api.example.com/submit', {
  name: 'user',
  age: 18
})
  .then(response => {
    console.log(response.data);
  });
```

### 创建实例

创建Axios实例可以设置基本配置，便于复用：

```javascript
const api = axios.create({
    baseURL: 'https://api.example.com',
    timeout: 1000,
    headers: {'X-Custom-Header': 'foobar'}
});

// 使用实例发送请求
api.get('/data', {
    params: {
        name: 'user',
        age: 18
    }
})
  .then(response => {
    console.log(response.data);
  });
```

### 拦截器

Axios拦截器可以在请求发送前和响应接收后进行处理，非常适合添加认证信息、统一错误处理等场景：

```javascript
// 请求拦截器
api.interceptors.request.use(config => {
    // 在请求发送前做些什么
    console.log('发送了请求');
    // 可以添加认证信息、修改请求配置等
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
}, error => {
    // 请求错误处理
    return Promise.reject(error);
});

// 响应拦截器
api.interceptors.response.use(response => {
    // 在获取响应数据前做些什么
    console.log('收到响应');
    // 可以统一处理响应数据
    return response;
}, error => {
    // 响应错误处理
    if (error.response.status === 401) {
        // 处理未授权错误
        console.log('未授权，请重新登录');
    }
    return Promise.reject(error);
});
```

### 使用async/await

使用async/await可以让Axios请求代码更加简洁易读：

```javascript
async function fetchData() {
    try {
        // GET请求
        const response = await api.get('/data', {
            params: {
                name: 'user',
                age: 18
            }
        });
        
        // POST请求
        const submitResponse = await api.post('/submit', {
            name: 'user',
            age: 18
        });

        console.log(response.data);
        console.log(submitResponse.data);
    } catch (error) {
        console.error('请求出错', error);
    }
}

fetchData();
```

## 3. Fetch API

Fetch API是现代浏览器原生支持的网络请求API，基于Promise设计，提供了一个更简洁的接口来发送和接收网络请求。

### 基本使用

```javascript
// 基本GET请求
fetch('https://api.example.com/data?name=user&age=18')
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error('请求失败');
  })
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error('错误:', error);
  });
```

### 处理响应

Fetch返回的Response对象有多种方法处理不同类型的响应：

```javascript
fetch('https://api.example.com/data')
  .then(response => {
    // 检查响应状态
    if (!response.ok) {
      throw new Error(`HTTP错误! 状态: ${response.status}`);
    }

    // 根据内容类型选择不同的处理方法
    // response.json() - 解析JSON
    // response.text() - 获取文本
    // response.blob() - 获取二进制数据
    // response.formData() - 获取表单数据
    // response.arrayBuffer() - 获取ArrayBuffer

    return response.json();
  })
  .then(data => {
    console.log(data);
  });
```

### 发送POST请求

```javascript
fetch('https://api.example.com/submit', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded' 用于表单数据
    },
    body: JSON.stringify({
        name: 'user',
        age: 18
    })
})
.then(response => {
    if (response.ok) {
        return response.json();
    }
    throw new Error('请求失败');
})
.then(data => console.log(data))
.catch(error => console.error('错误:', error));
```

**注意：** 使用`application/json`时，需要用`JSON.stringify()`处理数据；使用`application/x-www-form-urlencoded`时，可以使用`URLSearchParams`或手动拼接字符串。

### 使用async/await

使用async/await可以让Fetch代码更加简洁：

```javascript
async function fetchData() {
    try {
        const response = await fetch('https://api.example.com/data');
        
        if (!response.ok) {
            throw new Error(`HTTP错误! 状态: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('获取数据失败:', error);
    }
}

fetchData();
```

### 取消请求

Fetch API可以使用AbortController来取消请求：

```javascript
const controller = new AbortController();
const signal = controller.signal;

fetch('https://api.example.com/data', { signal })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => {
    if (error.name === 'AbortError') {
      console.log('请求被取消');
    } else {
      console.error('请求失败:', error);
    }
  });

// 取消请求
setTimeout(() => controller.abort(), 5000); // 5秒后取消请求
```

## 4. 三种方法的比较

| 特性 | XMLHttpRequest | Axios | Fetch API |
|------|---------------|-------|-----------|
| 浏览器支持 | 所有现代浏览器 | 所有现代浏览器 (需引入库) | 现代浏览器 (IE 不支持) |
| 基于 Promise | 否 | 是 | 是 |
| 请求取消 | 支持 | 支持 | 有限支持 (AbortController) |
| 请求超时 | 支持 | 支持 | 不直接支持 (需结合 Promise.race) |
| 自动转换 JSON | 否 | 是 | 需手动调用 .json() |
| 拦截器 | 否 | 是 | 否 |
| 下载进度 | 支持 | 支持 | 有限支持 |
| CSRF 保护 | 手动实现 | 自动支持 | 手动实现 |

## 5. 最佳实践

### 何时使用XMLHttpRequest
- 需要支持非常老的浏览器
- 需要监控上传/下载进度
- 需要更细粒度的控制

### 何时使用Axios
- 大多数现代Web应用
- 需要拦截器功能
- 需要自动转换JSON数据
- 需要取消请求
- 需要设置超时
- 需要在浏览器和Node.js中使用相同的API

### 何时使用Fetch API
- 只需要支持现代浏览器
- 希望使用原生API，不引入额外库
- 简单的请求场景
- 处理流数据

### 通用最佳实践

1. **总是处理错误**：使用try/catch或.catch()捕获异常
   ```javascript
   fetch('/api/data')
     .then(response => {
       if (!response.ok) throw new Error(`HTTP错误: ${response.status}`);
       return response.json();
     })
     .then(data => console.log(data))
     .catch(error => console.error('错误:', error));
   ```

2. **设置超时**：防止请求无限等待
   ```javascript
   // 使用Axios
   axios.get('/api/data', { timeout: 5000 });
   
   // 使用Fetch + Promise.race
   const fetchWithTimeout = (url, options = {}, timeout = 5000) => {
     return Promise.race([
       fetch(url, options),
       new Promise((_, reject) => 
         setTimeout(() => reject(new Error('请求超时')), timeout)
       )
     ]);
   };
   ```

3. **使用适当的内容类型**：根据数据类型设置正确的Content-Type
   ```javascript
   // JSON数据
   fetch('/api/data', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ name: 'user' })
   });
   
   // 表单数据
   const formData = new FormData();
   formData.append('name', 'user');
   fetch('/api/data', {
     method: 'POST',
     body: formData
   });
   ```

4. **验证响应**：检查响应状态码和数据格式
   ```javascript
   fetch('/api/data')
     .then(response => {
       if (!response.ok) throw new Error(`HTTP错误: ${response.status}`);
       return response.json();
     })
     .then(data => {
       if (!data || typeof data !== 'object') {
         throw new Error('无效的数据格式');
       }
       console.log(data);
     });
   ```

5. **使用async/await**：使代码更简洁易读
   ```javascript
   async function fetchData() {
     try {
       const response = await fetch('/api/data');
       if (!response.ok) throw new Error(`HTTP错误: ${response.status}`);
       const data = await response.json();
       return data;
     } catch (error) {
       console.error('获取数据失败:', error);
       return null;
     }
   }
   ```

6. **考虑请求缓存**：适当使用缓存提高性能
   ```javascript
   // 使用Fetch缓存
   fetch('/api/data', { cache: 'force-cache' });
   
   // 不使用缓存
   fetch('/api/data', { cache: 'no-store' });
   ```

## 总结

- **XMLHttpRequest**：最原始但功能完整的API，兼容性最好，适合需要细粒度控制的场景。
- **Axios**：功能丰富的库，基于Promise，使用简便，适合大多数现代Web应用开发场景。
- **Fetch API**：现代浏览器原生支持，基于Promise，API简洁，适合不想引入额外库的项目。

选择哪种网络请求方法取决于你的项目需求、浏览器兼容性要求和个人偏好。对于大多数现代Web应用，Axios是一个很好的选择，它提供了丰富的功能和简洁的API；而如果你希望减少依赖，Fetch API则是一个不错的原生选择。

无论选择哪种方法，记住处理错误、设置超时、验证响应等最佳实践，将帮助你构建更加健壮和可靠的网络请求功能。

## 参考资源

- [MDN Web Docs - XMLHttpRequest](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest)
- [MDN Web Docs - Fetch API](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API)
- [Axios 文档](https://axios-http.com/docs/intro)
- [JavaScript.info - 网络请求](https://zh.javascript.info/network)
