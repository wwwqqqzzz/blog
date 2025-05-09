---
slug: browser-use-webui-deepseek-ai-automation-guide
title: 使用 Browser-Use WebUI + DeepSeek 实现浏览器AI自动化全攻略
date: 2025-03-24
authors: wqz
tags: [人工智能, Python, 教程]
keywords: [浏览器自动化, AI, DeepSeek, Browser-Use, WebUI, Playwright, Python, Gradio, 自动化测试]
description: 一份详细指南，介绍如何结合 Browser-Use WebUI、DeepSeek AI 和 Playwright 实现浏览器自动化操作，包括环境搭建、项目配置和常见问题解决。
image: https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/1746228260123-2165db07cd85e2b30f4827a6c3c18a70.png
---

<!-- truncate -->

# 使用 Browser-Use WebUI + DeepSeek 实现浏览器AI自动化全攻略

## 环境准备
### 1. 安装 Python 环境
- **版本要求**：Python 3.11 或更高版本
- **验证安装**：命令行执行 `python --version`
- **注意**：安装时需勾选 "Add to PATH" 选项（Windows用户）

### 2. 核心工具安装
```bash
# 安装 browser-use 框架
pip install browser-use

# 安装 Playwright 浏览器自动化工具
playwright install
```

> [!TIP]
>
> - **使用国内镜像**：
>   设置环境变量，使用国内镜像源加速下载：
>
>   ```bash
>   # Windows
>   set PLAYWRIGHT_DOWNLOAD_HOST=https://npmmirror.com/mirrors/playwright
>   playwright install
>
>   # macOS/Linux
>   export PLAYWRIGHT_DOWNLOAD_HOST=https://npmmirror.com/mirrors/playwright
>   playwright install
>   ```
>
> - **手动下载浏览器**：
>
>   1. 访问 [Playwright 官方下载页面](https://playwright.dev/docs/downloads) 或镜像站，手动下载所需浏览器的二进制文件。
>   2. 将下载的文件放置到 Playwright 的缓存目录中：
>      - Windows: `%USERPROFILE%\AppData\Local\ms-playwright`
>      - macOS/Linux: `~/Library/Caches/ms-playwright` 或 `~/.cache/ms-playwright`



### 3. 安装项目依赖
```bash
pip install langchain-google-genai==2.0.8
pip install pyperclip==1.9.0
pip install gradio==5.9.1
pip install langchain-ollama==0.2.2
pip install langchain-openai==0.2.14
```

---

## 项目配置
### 1. 获取项目代码
1. 访问 GitHub 仓库：https://github.com/browser-use/web-ui
2. 下载 ZIP 包并解压到本地目录
3. 推荐存放路径（示例）：
   - Windows: `E:\browser-use-webui`
   - Linux/macOS: `~/projects/browser-use-webui`

![img](https://img2023.cnblogs.com/blog/3349836/202503/3349836-20250324043116335-155442714.png)

或使用git

```bash
git clone https://github.com/browser-use/web-ui.git
```

![img](https://img2023.cnblogs.com/blog/3349836/202503/3349836-20250324043143749-1390393535.png)

### 2. 环境变量配置

1. 复制 `.env.example` 为 `.env`
   ```bash
   cp .env.example .env
   ```

![img](https://img2023.cnblogs.com/blog/3349836/202503/3349836-20250324043234910-1044836211.png)
2. 关键配置项说明：
   ```ini
   # 使用自定义 Chrome 浏览器时配置
   CHROME_PATH = "C:\Program Files\Google\Chrome\Application\chrome.exe"
   CHROME_USER_DATA = "C:\Users\<YourName>\AppData\Local\Google\Chrome\User Data"
   ```

![img](https://img2023.cnblogs.com/blog/3349836/202503/3349836-20250324043255070-1806307920.png)

---

#### **1. 找到项目目录**

- 找到已经下载的 `browser-use-webui` 项目。
- 默认情况下，项目文件夹中应包含以下文件：
  - `webui.py`
  - `src/`
  - `.env`
  - 其他项目文件

#### **2. 切换到项目目录**

在 CMD 或 PowerShell 中，使用 `cd` 命令切换到项目目录。例如：

```cmd
cd D:\browser-use-webui
```

或者：

```cmd
cd C:\Users\<你的用户名>\Downloads\browser-use-webui
```

#### **3. 确认 `webui.py` 存在**

在项目目录下运行以下命令，确认 `webui.py` 文件存在：

```cmd
dir webui.py
```

如果文件存在，会显示类似以下内容：

```cmd
 Volume in drive C is OS
 Volume Serial Number is XXXX-XXXX

 Directory of C:\path\to\project

2023-10-01  12:34 PM             1,234 webui.py
               1 File(s)          1,234 bytes
               0 Dir(s)  123,456,789,012 bytes free
```

#### **4. 运行项目**

确保在项目目录下运行以下命令：

```cmd
python webui.py --ip 127.0.0.1 --port 7788
```

## 常见错误

### 缺少**`lxml[html_clean]`**

![img](https://img2023.cnblogs.com/blog/3349836/202503/3349836-20250324043306294-1463833328.png)

#### **1. 安装 `lxml[html_clean]`**

运行以下命令安装 `lxml` 及其 HTML 清理模块：

```cmd
pip install lxml[html_clean]
```

#### **2. 安装 `lxml_html_clean`**

如果上述方法无效，可以直接安装 `lxml_html_clean`：

```cmd
pip install lxml_html_clean
```

#### **3. 确保所有依赖安装正确**

在安装完上述依赖后，重新安装项目所需的其他依赖：

```cmd
pip install -r requirements.txt
```

如果项目没有 `requirements.txt` 文件，可以手动安装以下依赖：

```cmd
pip install langchain-google-genai==2.0.8 \
            pyperclip==1.9.0 \
            gradio==5.9.1 \
            langchain-ollama==0.2.2 \
            langchain-openai==0.2.14
```

#### **4. 检查 Python 环境**

确保你使用的 Python 环境正确：

```cmd
python --version  # 确认是 Python 3.11 或更高版本
pip --version     # 确认 pip 是最新版本
```

如果环境有问题，可以尝试创建一个新的虚拟环境：

```cmd
python -m venv myenv
myenv\Scripts\activate
pip install --upgrade pip
pip install lxml[html_clean]
pip install -r requirements.txt
```

#### **5. 重新运行项目**

安装完依赖后，重新运行项目：

```cmd
python webui.py --ip 127.0.0.1 --port 7788
```

###  cannot import name 'AgentStepErrorTelemetryEvent'
![img](https://img2023.cnblogs.com/blog/3349836/202503/3349836-20250324043317395-2073480831.png)

#### **1. 修改 `custom_agent.py`**

1. 打开文件：`D:\browser-use-webui\src\agent\custom_agent.py`

2. 找到以下代码：

   ```python
   from browser_use.telemetry.views import (
       AgentEndTelemetryEvent,
       AgentRunTelemetryEvent,
       AgentStepErrorTelemetryEvent,
   )
   ```

3. 将 `AgentStepErrorTelemetryEvent` 替换为 `AgentStepTelemetryEvent`：

   ```python
   from browser_use.telemetry.views import (
       AgentEndTelemetryEvent,
       AgentRunTelemetryEvent,
       AgentStepTelemetryEvent,
   )
   ```

![img](https://img2023.cnblogs.com/blog/3349836/202503/3349836-20250324043330376-58914955.png)
4. 保存文件。

#### **2. 重新启动项目**

在修改代码后，重新运行项目：

```cmd
python webui.py --ip 127.0.0.1 --port 7788
```

## 代理问题

![img](https://img2023.cnblogs.com/blog/3349836/202503/3349836-20250324043341443-1522277785.png)

#### **1. 设置 `share=True`**

在 `webui.py` 中，找到 `demo.launch()` 的调用，并添加 `share=True` 参数：

```python
demo.launch(server_name=args.ip, server_port=args.port, share=True)
```

这将启用 Gradio 的共享功能，生成一个公共链接，即使 `localhost` 不可访问也能正常运行。

#### **2. 检查代理设置**

如果你的系统配置了代理，可能会导致 `localhost` 无法访问。可以通过以下方式检查和修改代理设置：

1. **检查环境变量**：

   ```cmd
   echo %HTTP_PROXY%
   echo %HTTPS_PROXY%
   ```

   如果设置了代理，尝试关闭或配置正确的代理：

   ```cmd
   set HTTP_PROXY=
   set HTTPS_PROXY=
   ```

2. **修改系统代理设置**：

   - Windows：打开“设置” -> “网络和 Internet” -> “代理”，关闭代理服务器。
   - macOS/Linux：检查网络设置，确保没有配置代理。

#### **3. 允许访问 `localhost`**

如果代理是必需的，确保代理允许访问 `localhost`。可以在代理设置中添加以下规则：

- 允许 `127.0.0.1` 和 `localhost`。

#### **4. 使用 `0.0.0.0` 替代 `localhost`**

将 `server_name` 设置为 `0.0.0.0`，允许从任何 IP 访问：

```python
demo.launch(server_name="0.0.0.0", server_port=args.port)
```

然后通过 `http://127.0.0.1:7788` 或 `http://<你的IP>:7788` 访问。

#### **5. 检查端口占用**

确保端口 `7788` 没有被其他程序占用：

```python
netstat -ano | findstr :7788
```

如果端口被占用，可以更换端口号：

```python
demo.launch(server_name=args.ip, server_port=12345)  # 使用其他端口
```

#### **6. 更新 Gradio**

如果 Gradio 版本较旧，可能会导致兼容性问题。更新到最新版本：

```cmd
pip install --upgrade gradio
```

## 启动

![img](https://img2023.cnblogs.com/blog/3349836/202503/3349836-20250324043355578-1895109047.png)
浏览器打开这个链接：[http://127.0.0.1:7788](http://127.0.0.1:7788/)

![img](https://img2023.cnblogs.com/blog/3349836/202503/3349836-20250324043411459-1162435366.png)

![img](https://img2023.cnblogs.com/blog/3349836/202503/3349836-20250324043446363-1500781190.png)
