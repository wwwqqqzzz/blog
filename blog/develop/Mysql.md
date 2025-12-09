---
slug: mysql-tutorial
title: Mysql
date: 2022-11-09
authors: wqz
tags: [MySQL, 教程, 常用函数]
keywords: [MySQL, 数据库, SQL, 多表查询, 聚合函数, 子查询, 分页, 字符串函数, 数值函数, 日期函数, 教程]
description: 本文是 MySQL 数据库的入门教程，涵盖多表查询、聚合函数、子查询、分页查询和常用函数等内容，适合初学者学习。
image: https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/1747234454872-da49115a11c15192c9737f3f1882f04d.png
---

<!-- truncate -->

# Mysql

## 一、多表查询

### 1. 简介

多表查询是指从多张表中查询数据，通常多张表之间存在某种关系。

### 2. 基本用法

#### 语法

```sql
SELECT * | 列名1 别名1, 列名2 别名2...
FROM 表名1, 表名2
WHERE 条件
ORDER BY 排序列1 ASC | DESC, 排序列2 ASC | DESC;
```

#### 示例

```sql
-- 查询 emp 和 dept 表的笛卡尔积
SELECT * FROM emp, dept;

-- 去掉笛卡尔积，通过关联字段连接
SELECT * FROM emp, dept WHERE emp.deptno = dept.deptno;

-- 使用表别名
SELECT * FROM emp e, dept d WHERE e.deptno = d.deptno;
```

### 3. 常用方法

| 方法       | 描述                                               | 示例                                                         |
| ---------- | -------------------------------------------------- | ------------------------------------------------------------ |
| 笛卡尔积   | 将两表的所有记录相组合，通常需避免                 | `SELECT * FROM emp, dept;`                                   |
| 等值连接   | 基于关联字段（如外键）连接两表，去掉笛卡尔积       | `SELECT * FROM emp, dept WHERE emp.deptno = dept.deptno;`    |
| 表别名     | 为表起别名简化查询语句                             | `SELECT * FROM emp e, dept d WHERE e.deptno = d.deptno;`     |
| 内连接     | 使用 `INNER JOIN` 连接，适合关联条件明确的多表查询 | `SELECT e.empno, e.ename, d.dname FROM emp e INNER JOIN dept d ON e.deptno = d.deptno;` |
| 左外连接   | 使用 `LEFT JOIN` 以左表为主，显示左表全部数据      | `SELECT d.dname, e.ename FROM dept d LEFT JOIN emp e ON d.deptno = e.deptno;` |
| 右外连接   | 使用 `RIGHT JOIN` 以右表为主，显示右表全部数据     | `SELECT e.ename, d.dname FROM emp e RIGHT JOIN dept d ON e.deptno = d.deptno;` |
| 自连接     | 在同一表中进行连接操作                             | `SELECT e.ename, m.ename FROM emp e, emp m WHERE e.mgr = m.empno;` |
| 非等值连接 | 使用不等号条件连接两表，如工资等级表与工资表连接   | `SELECT e.ename, e.sal, g.grade FROM emp e, salgrade g WHERE e.sal BETWEEN g.losal AND g.hisal;` |
| 多表连接   | 使用多个连接条件进行多表查询                       | `SELECT e.ename, d.dname, m.ename FROM emp e INNER JOIN dept d ON e.deptno = d.deptno INNER JOIN emp m ON e.mgr = m.empno;` |

---

## 二、聚合函数和分组统计

### 1. 聚合函数

| 函数      | 功能       | 示例                        |
| --------- | ---------- | --------------------------- |
| `COUNT()` | 计算总数量 | `SELECT COUNT(*) FROM emp;` |
| `MAX()`   | 获取最大值 | `SELECT MAX(sal) FROM emp;` |
| `MIN()`   | 获取最小值 | `SELECT MIN(sal) FROM emp;` |
| `SUM()`   | 计算总和   | `SELECT SUM(sal) FROM emp;` |
| `AVG()`   | 计算平均值 | `SELECT AVG(sal) FROM emp;` |

### 2. 分组统计

#### 语法

```sql
SELECT * | 列名1 别名1, 列名2 别名2...
FROM 表名1 LEFT JOIN 表名2 ON 关联条件
WHERE 分组前条件
GROUP BY 分组列
HAVING 分组后条件
ORDER BY 排序列;
```

#### 示例

```sql
-- 查询每个部门的平均工资
SELECT deptno, AVG(sal) FROM emp GROUP BY deptno;

-- 查询每个部门的名称、位置及平均工资
SELECT d.dname, d.loc, AVG(e.sal) FROM emp e LEFT JOIN dept d ON e.deptno = d.deptno GROUP BY d.dname, d.loc;
```

---

## 三、子查询

| 类型           | 描述                                          | 示例                                                         |
| -------------- | --------------------------------------------- | ------------------------------------------------------------ |
| 单行单列子查询 | 返回单行单列结果，用于单值条件                | `SELECT * FROM emp WHERE sal > (SELECT AVG(sal) FROM emp);`  |
| 多行单列子查询 | 返回多行单列结果，用于 `IN`、`ANY` 等条件     | `SELECT * FROM emp WHERE deptno IN (SELECT deptno FROM dept WHERE loc = 'NEW YORK');` |
| 多列子查询     | 返回多列结果，通常放在 `FROM` 子句中          | `SELECT e.ename, s.grade FROM emp e, (SELECT * FROM salgrade) s WHERE e.sal BETWEEN s.losal AND s.hisal;` |
| 子查询位置     | 子查询可位于 `SELECT`、`FROM`、`WHERE` 等位置 | `SELECT * FROM emp WHERE sal > (SELECT AVG(sal) FROM emp);`  |

---

## 四、分页查询

| 关键字  | 描述             | 示例                                                         |
| ------- | ---------------- | ------------------------------------------------------------ |
| `LIMIT` | 限制返回的记录数 | `SELECT * FROM emp ORDER BY sal DESC LIMIT 5;`               |
| 分页    | 分页显示查询结果 | `SELECT * FROM emp ORDER BY sal DESC LIMIT (page-1)*size, size;` |

---

## 五、常用函数

### 字符串函数

| 函数                  | 描述       | 示例                                           |
| --------------------- | ---------- | ---------------------------------------------- |
| `CONCAT(s1, s2, ...)` | 字符串拼接 | `SELECT CONCAT(firstname, lastname) FROM emp;` |
| `LOWER(s)`            | 转小写     | `SELECT LOWER(name) FROM emp;`                 |
| `UPPER(s)`            | 转大写     | `SELECT UPPER(name) FROM emp;`                 |
| `LENGTH(s)`           | 字符串长度 | `SELECT LENGTH(name) FROM emp;`                |
| `REPLACE(s, s1, s2)`  | 替换字符串 | `SELECT REPLACE(name, 'a', 'o') FROM emp;`     |

### 数值函数

| 函数          | 描述                | 示例                        |
| ------------- | ------------------- | --------------------------- |
| `CEIL(n)`     | 向上取整            | `SELECT CEIL(10.7);`        |
| `FLOOR(n)`    | 向下取整            | `SELECT FLOOR(10.7);`       |
| `ROUND(n, d)` | 四舍五入，保留 d 位 | `SELECT ROUND(123.456, 2);` |
| `RAND()`      | 返回随机数          | `SELECT RAND();`            |

### 日期和时间函数

| 函数                        | 描述           | 示例                                     |
| --------------------------- | -------------- | ---------------------------------------- |
| `NOW()`                     | 当前日期时间   | `SELECT NOW();`                          |
| `CURDATE()`                 | 当前日期       | `SELECT CURDATE();`                      |
| `YEAR(date)`                | 提取年份       | `SELECT YEAR(NOW());`                    |
| `DATE_FORMAT(date, format)` | 格式化日期时间 | `SELECT DATE_FORMAT(NOW(), '%Y-%m-%d');` |
