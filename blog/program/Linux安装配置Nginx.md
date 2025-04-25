---
slug: linux-install-configure-nginx
title: Linux 安装配置 Nginx
date: 2024-11-08
authors: wqz
tags: [Linux, Nginx, Web服务�? 安装, 配置, CentOS, 防火墙]
keywords: [Nginx, Linux, CentOS, Web服务�? 安装, 配置, Yum�? 防火�? 静态网页]
description: 本文详细介绍了在 Linux 系统上安装和配置 Nginx Web 服务器的步骤，包括添�?Yum 源、安�?Nginx、配置服务、设置防火墙以及测试网页访问�?
---

<!-- truncate -->

# Linux 安装配置 Nginx



```plantuml
@startuml
start

:查看环境;
:检查网络连�?
if (网络可用?) then (yes)
  :添加 Yum �?
  :安装 Nginx;
  :配置服务;
  :设置防火�?
  :查看网页;
  if (网页显示成功?) then (yes)
    :显示 "Welcome to nginx!";
  else (no)
    :检查配置或网络;
  endif
else (no)
  :检查网络连接问�?
endif

stop
@enduml
```



## 前言

我在下载 `Nginx` 的时候出现报�?

```
：No package nginx available.
```

按照网上配置阿里云的教程还有或有错误

```bash
[root@192 ~]# yum install nginx -y Loaded plugins: fastestmirror, langpacks Loading mirror speeds from cached hostfile  * base: mirrors.aliyun.com  * extras: mirrors.aliyun.com  * updates: mirrors.aliyun.com No package nginx available. Error: Nothing
```

经过反复试错后找到此方法



## 步骤

### 查看环境

本人环境

> ```basj
> cat /etc/redhat-release 
> ```
>
> ![1722886531556](https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/1722886531556.png)

### 查看网络环境

先检查服务器是否可以连接外网,用百度来举例,若出现一下结�?说明可以连接,可以手动暂停`CTRL + c`

```
ping www.baidu.com
```

![1722887137101](https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/image-20241108002214160.png)

### 添加 yum�?

如果直接使用 ` yum install nginx -y `,会出现Not Found的情�?所以我们使�?`epel` 或者官网的 `yum`源，本例使用官网的源

```bash
sudo rpm -ivh http://nginx.org/packages/centos/7/noarch/RPMS/nginx-release-centos-7-0.el7.ngx.noarch.rpm
```

安装完成�?可以查看一�?

```bash
sudo yum repolist
```

![1722887382744](https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/image-20241108002221589.png)

 

### 安装 `Nginx`

使用命令

```bahs
sudo yum install nginx
```



### 配置 `Nginx`服务

设置开机启�?

``` bash
sudo systemctl enable nginx
```

启动服务

``` bash
sudo systemctl start nginx
```

停止服务

``` bash
sudo systemctl start nginx
```

重新加载,重启服务

```bash
sudo systemctl reload nginx
```

启动后查看服务进�?

``` bash
ps -ef | grep 'nginx'
```

![1722887555147](https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/image-20241108002226353.png)



### 防火墙端口设�?

#### 打开防火�?

```bash
sudo firewall-cmd --zone=public --permanent --add-service=http

sudo firewall-cmd --reload

```

出现`success`则表示成�?

打开�?可以查看一下防火墙打开的所有的服务

```bash
sudo firewall-cmd --list-service
```

![1722888042537](https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/image-20241108002319376.png)



#### 关闭防火�?

```bash
iptables -F
```



### 查看网页

在浏览器输入自己的`IP`,如果看到`Welcome to nginx!`,那么,表示已经成功�?

![1722888467095](https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/image-20241108002330239.png)

```bash
#查看IP命令
ip addr
```

![1722888512799](https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/image-20241108002354992.png)



### 一秒做一个网�?

其实就是把别人的网页代码下载下来,拷到我们自己的网页中

#### 步骤

我们以DNF官网为例,首先打开[DNF官网](https://dnf.qq.com/main.shtml)

使用`wget`直接下载网页

```
wget https://dnf.qq.com/main.shtml
```

![1722888978933](https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/image-20241108002428256.png)

将文件拷贝到`nginx`网站目录�?他会自动识别

 此时会提示你是否要覆�?输入y回车即可,无需重启,网站会自动跟�?[1722889159677](https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/image-20241108002445101.png)

此时在刷新网站后,可以看到

![1722889303784](https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/image-20241108002455610.png)
