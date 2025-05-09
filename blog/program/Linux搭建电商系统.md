---
slug: linux-ecommerce-system-setup
title: Linux 搭建电商系统
date: 2024-11-09
authors: wqz
tags: [Linux, Spring Boot, Nginx]
keywords: [Linux, 电商系统, 部署, Spring Boot, MariaDB, Redis, Elasticsearch, Kafka, Nginx, 自动化部署, 教程]
description: 本文详细介绍了在 Linux 系统上搭建一个应用商城系统的完整流程，包括基础环境配置、基础服务安装、服务配置和应用商城系统部署。
image: https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/1746229265207-5fa423c1161a543a863367339bea72f2.png
---

<!-- truncate -->

# Linux搭建电商系统

### 一、基础环境配置

1. **网络配置**
   - 修改 `/etc/sysconfig/network-scripts/ifcfg-eno16777736` 配置文件，
   - ```bash
     BOOTPROTO=static
     
     ONBOOT=yes
     IPADDR=192.168.100.101
     NETMASK=255.255.255.0
     ```
   
     
   
   - 重启网络服务：
     ```bash
     systemctl restart network
     ```
   
2. **修改主机名**
   - 设置主机名为 `mall`：
     ```bash
     hostnamectl set-hostname mall
     bash
     ```

3. **配置 `/etc/hosts` 文件**
   
   - 在 `/etc/hosts` 文件中添加 IP 地址和主机名映射：
     ```bash
      vi /etc/hosts
      
     192.168.100.101 mall
     ```
   
4. **关闭 SELinux 和防火墙**
   
   - ~~临时关闭 SELinux 和防火墙：~~
     
     ```bash
     setenforce 0
     systemctl stop firewalld
     ```
   - **永久**关闭 SELinux 和防火墙：
     
     ```bash
     sed -i 's/SELINUX=enforcing/SELINUX=disabled/g' /etc/selinux/config
     systemctl disable firewalld
     ```
   
5. **配置本地 Yum 源**
   - 挂载 ISO 镜像文件或连接光盘镜像：
     ```bash
     mkdir /opt/centos
     mount /root/CentOS-7-x86_64-DVD-1511.iso /opt/centos/
     ```
   - 移动原有的 `yum` 源配置文件：
     ```bash
     mv /etc/yum.repos.d/* /media/
     ```
   - 创建新的 `local.repo` 文件，配置本地 Yum 源：
     ```bash
     vi /etc/yum.repos.d/local.repo
     ```
     内容：
     ```ini
     [centos]
     name=centos
     baseurl=file:///opt/centos
     gpgcheck=0
     enabled=1
     
     [gpmall-mall]
     name=gpmall-mall
     baseurl=file:///root/gpmall-repo
     gpgcheck=0
     enabled=1
     ```
     
     清除yum缓存、查看当前可用yum列表
     
     ```bash
     yum clean all
     yum repolist
     ```
     
     
   
6. **设置开机自动挂载 ISO 镜像文件**
   - 修改 `/etc/fstab` 文件，添加以下内容：
     ```bash
     echo "/root/CentOS-7-x86_64-DVD-1511.iso /opt/centos iso9660 defaults 0 0" >> /etc/fstab
     ```

---

### 二、应用商城系统基础服务安装

1. **安装 Java 环境**
   - 安装 OpenJDK 1.8：
     ```bash
     yum install -y java-1.8.0-openjdk java-1.8.0-openjdk-devel
     ```

2. **安装 Redis 缓存服务**
   
   - 安装 Redis：
     ```bash
     yum install redis -y
     ```
   
3. **安装 Elasticsearch 服务**（可选）
   - 安装 Elasticsearch：
     ```bash
     yum install elasticsearch -y
     ```

4. **安装 Nginx 服务**
   
   - 安装 Nginx：
     ```bash
     yum install nginx -y
     ```
   
5. **安装 MariaDB 数据库**
   - 安装 MariaDB：
     ```bash
     yum install mariadb mariadb-server -y
     ```

6. **安装 ZooKeeper 服务**
   - 上传并解压 `zookeeper-3.4.14.tar.gz` 包：
     ```bash
     cd /opt
     tar -zxvf zookeeper-3.4.14.tar.gz
     ```
   - 配置 ZooKeeper：
     ```bash
     mv zoo_sample.cfg zoo.cfg
     ./zkServer.sh start
     ./zkServer.sh status
     ```

7. **安装 Kafka 服务**
   - 上传并解压 `kafka_2.11-1.1.1.tgz` 包：
     ```bash
     cd /opt
     tar -zxvf kafka_2.11-1.1.1.tgz
     ```
   - 启动 Kafka：
     ```bash
     cd kafka_2.11-1.1.1/bin/
     ./kafka-server-start.sh -daemon ../config/server.properties
     ```

---

### 三、服务配置

1. **MariaDB 配置**
   - 修改 `/etc/my.cnf` 配置：
     ```ini
     [mysqld]
     init_connect='SET collation_connection = utf8_unicode_ci'
     init_connect='SET NAMES utf8'
     character-set-server=utf8
     collation-server=utf8_unicode_ci
     skip-character-set-client-handshake
     ```
   - 启动 MariaDB 服务：
     ```bash
     systemctl start mariadb
     ```
   - 设置 root 密码，并创建 `gpmall` 数据库：
     ```bash
     mysqladmin -uroot password 123456
     mysql -uroot -p123456
     create database gpmall;
     use gpmall;
     source /root/gpmall.sql
     ```

2. **Redis 配置**
   - 修改 `/etc/redis.conf` 配置：
     - 注释 `bind 127.0.0.1`。
     - 修改 `protected-mode yes` 为 `protected-mode no`。
   - 启动 Redis 服务：
     ```bash
     systemctl start redis
     systemctl enable redis
     ```

3. **Elasticsearch 配置**（可选）
   - 修改 `/etc/elasticsearch/elasticsearch.yml` 配置：
     ```ini
     http.cors.enabled: true
     http.cors.allow-origin: "*"
     http.cors.allow-credentials: true
     cluster.name: my-application
     node.name: node-1
     network.host: 192.168.100.101
     http.port: 9200
     ```
   - 启动 Elasticsearch 服务：
     ```bash
     systemctl start elasticsearch
     systemctl enable elasticsearch
     ```

4. **Nginx 配置**
   - 启动 Nginx 服务并设置开机自启：
     ```bash
     systemctl start nginx
     systemctl enable nginx
     ```

---

### 四、应用商城系统部署

1. **全局变量设置**
   - 修改 `/etc/hosts` 文件，添加如下内容：
     ```bash
     192.168.100.101 mall
     192.168.100.101 kafka.mall
     127.0.0.1 mysql.mall
     192.168.100.101 redis.mall
     192.168.100.101 zookeeper.mall
     ```

2. **前端部署**
   - 上传 `dist` 目录至 `/root`。
   - 将文件复制到 Nginx 默认路径：
     ```bash
     rm -rf /usr/share/nginx/html/*
     cp -rvf dist/* /usr/share/nginx/html/
     ```
   - 修改 Nginx 配置文件 `/etc/nginx/conf.d/default.conf`：
     ```nginx
     location /user { proxy_pass http://127.0.0.1:8082; }
     location /shopping { proxy_pass http://127.0.0.1:8081; }
     location /cashier { proxy_pass http://127.0.0.1:8083; }
     ```

   - 重启 Nginx：
     ```bash
     systemctl restart nginx
     ```

3. **后端部署**
   - 上传 4 个 `jar` 包到 `/root`。
   - 依次启动后端服务：
     ```bash
     nohup java -jar shopping-provider-0.0.1-SNAPSHOT.jar &
     nohup java -jar user-provider-0.0.1-SNAPSHOT.jar &
     nohup java -jar gpmall-shopping-0.0.1-SNAPSHOT.jar &
     nohup java -jar gpmall-user-0.0.1-SNAPSHOT.jar &
     ```
   - 验证服务是否正常运行：
     ```bash
     jobs
     ```

---

### 五、网站访问

1. 在浏览器中访问：
   ```url
   http://192.168.100.101/#/home
   ```

2. 登录使用 `test/test` 用户名/密码。

3. 进行商品购买操作，添加商品至购物车并完成结算。

---
