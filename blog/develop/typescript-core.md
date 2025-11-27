---
slug: typescript-core-guide
title: TypeScript核心语法详解：从入门到精通
date: 2024-05-28
authors: wqz
tags: [TypeScript, JavaScript, 前端开发, 编程语言]
keywords: [TypeScript, 类型系统, 接口, 泛型, 类型注解]
description: 全面介绍TypeScript的核心语法和基本概念，包括类型系统、接口、泛型、类型断言等，帮助开发者快速掌握TypeScript并提升代码质量和开发效率。
image: https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/1747555805842-af5b3817dcb9564c2feb229d68d1acf9.png
collection: TypeScript系列
collection_order: 1
collection_description: 这个系列深入讲解TypeScript的核心概念和高级特性，帮助你掌握这门强大的静态类型语言，提升代码质量和开发效率。
---

<!-- truncate -->

# TypeScript核心语法详解：从入门到精通

TypeScript是JavaScript的超集，它添加了类型系统和其他功能，使开发大型应用程序更加容易和安全。本文将全面介绍TypeScript的核心语法和基本概念，帮助你快速掌握这一强大的编程语言。

## 1. 什么是TypeScript？

TypeScript是由Microsoft开发和维护的开源编程语言，它是JavaScript的超集，添加了静态类型定义和其他高级特性。TypeScript代码最终会被编译成纯JavaScript代码，可以在任何支持JavaScript的环境中运行。

### TypeScript的主要优势

- **静态类型检查**：在编译时捕获错误，而不是在运行时
- **更好的IDE支持**：提供智能代码补全、导航和重构工具
- **增强的代码可读性和可维护性**：类型注解作为文档，使代码意图更清晰
- **支持最新的ECMAScript特性**：可以使用最新的JavaScript功能，同时保持对旧浏览器的兼容性
- **面向对象编程支持**：提供类、接口、模块等面向对象编程特性

## 2. 安装和配置TypeScript

### 安装TypeScript

使用npm（Node Package Manager）安装TypeScript：

```bash
# 全局安装
npm install -g typescript

# 查看安装的版本
tsc --version
```

### 创建TypeScript配置文件

在项目根目录创建`tsconfig.json`文件，定义TypeScript编译选项：

```bash
# 自动生成tsconfig.json文件
tsc --init
```

一个基本的`tsconfig.json`配置示例：

```json
{
  "compilerOptions": {
    "target": "es6",           // 编译目标ES版本
    "module": "commonjs",      // 模块系统
    "strict": true,            // 启用所有严格类型检查选项
    "esModuleInterop": true,   // 启用CommonJS和ES模块之间的互操作性
    "skipLibCheck": true,      // 跳过声明文件的类型检查
    "forceConsistentCasingInFileNames": true, // 强制文件名大小写一致
    "outDir": "./dist"         // 输出目录
  },
  "include": ["src/**/*"],     // 要编译的文件
  "exclude": ["node_modules"]  // 要排除的文件
}
```

### 编译TypeScript文件

```bash
# 编译单个文件
tsc filename.ts

# 使用配置文件编译整个项目
tsc

# 监视模式（自动重新编译）
tsc --watch
```

## 3. 基本类型和类型注解

TypeScript提供了丰富的类型系统，可以通过类型注解（`: type`）明确变量的类型。

### 基本类型

```typescript
// 基本类型
let isDone: boolean = false;           // 布尔值
let decimal: number = 6;               // 数字
let color: string = "blue";            // 字符串
let list: number[] = [1, 2, 3];        // 数组
let tuple: [string, number] = ["hello", 10]; // 元组
let u: undefined = undefined;          // undefined
let n: null = null;                    // null

// 枚举
enum Color {Red, Green, Blue}
let c: Color = Color.Green;            // 1

// any类型（任意类型，相当于关闭类型检查）
let notSure: any = 4;
notSure = "maybe a string";
notSure = false;

// void类型（通常用于函数返回值）
function warnUser(): void {
  console.log("This is a warning message");
}

// never类型（永不返回的函数）
function error(message: string): never {
  throw new Error(message);
}

// object类型
let obj: object = {name: "John"};
```

### 类型推断

TypeScript可以根据变量的初始值自动推断其类型：

```typescript
// 类型推断
let x = 3;           // 推断为number
let y = "hello";     // 推断为string
let z = true;        // 推断为boolean

// 数组推断
let arr = [1, 2, 3]; // 推断为number[]
```

### 联合类型

联合类型表示一个值可以是多种类型之一：

```typescript
// 联合类型
let id: string | number;
id = 101;      // 有效
id = "202";    // 有效
// id = true;  // 错误：类型不匹配

// 使用类型守卫处理联合类型
function printId(id: string | number) {
  if (typeof id === "string") {
    // 在这个块中，id的类型是string
    console.log(id.toUpperCase());
  } else {
    // 在这个块中，id的类型是number
    console.log(id.toFixed(2));
  }
}
```

### 类型别名

类型别名用于为类型创建新名称：

```typescript
// 类型别名
type Point = {
  x: number;
  y: number;
};

let p1: Point = { x: 10, y: 20 };

// 联合类型别名
type ID = string | number;
let userId: ID = 123;
```

## 4. 接口

接口是TypeScript的核心特性之一，用于定义对象的结构和契约。

### 基本接口

```typescript
// 定义接口
interface User {
  id: number;
  name: string;
  email: string;
  age?: number;        // 可选属性
  readonly createdAt: Date; // 只读属性
}

// 使用接口
const user: User = {
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  createdAt: new Date()
};

// user.createdAt = new Date(); // 错误：不能修改只读属性
```

### 函数接口

```typescript
// 函数接口
interface SearchFunc {
  (source: string, subString: string): boolean;
}

// 实现函数接口
const mySearch: SearchFunc = function(src, sub) {
  return src.search(sub) > -1;
};
```

### 类实现接口

```typescript
// 类实现接口
interface ClockInterface {
  currentTime: Date;
  setTime(d: Date): void;
}

class Clock implements ClockInterface {
  currentTime: Date = new Date();

  setTime(d: Date): void {
    this.currentTime = d;
  }

  constructor(h: number, m: number) {}
}
```

### 接口继承

```typescript
// 接口继承
interface Shape {
  color: string;
}

interface Square extends Shape {
  sideLength: number;
}

const square: Square = {
  color: "blue",
  sideLength: 10
};
```

### 索引签名

```typescript
// 索引签名
interface StringArray {
  [index: number]: string;
}

const myArray: StringArray = ["Bob", "Fred"];
const myStr: string = myArray[0]; // "Bob"

// 字典模式
interface Dictionary {
  [key: string]: any;
}

const dict: Dictionary = {
  name: "John",
  age: 30,
  isActive: true
};
```

## 5. 函数

TypeScript为函数提供了类型注解，使函数的输入和输出更加明确。

### 函数类型

```typescript
// 函数类型
function add(x: number, y: number): number {
  return x + y;
}

// 函数表达式
const multiply: (x: number, y: number) => number = function(x, y) {
  return x * y;
};

// 箭头函数
const divide = (x: number, y: number): number => x / y;
```

### 可选参数和默认参数

```typescript
// 可选参数
function buildName(firstName: string, lastName?: string): string {
  if (lastName) {
    return `${firstName} ${lastName}`;
  }
  return firstName;
}

// 默认参数
function greet(name: string, greeting: string = "Hello"): string {
  return `${greeting}, ${name}!`;
}

console.log(greet("John"));          // "Hello, John!"
console.log(greet("Jane", "Hi"));    // "Hi, Jane!"
```

### 剩余参数

```typescript
// 剩余参数
function sum(...numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0);
}

console.log(sum(1, 2, 3, 4)); // 10
```

### 函数重载

```typescript
// 函数重载
function convertToNumber(value: string): number;
function convertToNumber(value: boolean): number;
function convertToNumber(value: string | boolean): number {
  if (typeof value === "string") {
    return value.length;
  }
  return value ? 1 : 0;
}

const len = convertToNumber("hello"); // 5
const bool = convertToNumber(true);   // 1
```

## 6. 类

TypeScript提供了完整的面向对象编程支持，包括类、接口、继承等特性。

### 基本类

```typescript
// 基本类
class Person {
  // 属性
  name: string;
  age: number;

  // 构造函数
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  // 方法
  greet(): string {
    return `Hello, my name is ${this.name} and I am ${this.age} years old.`;
  }
}

// 创建实例
const person = new Person("Alice", 30);
console.log(person.greet()); // "Hello, my name is Alice and I am 30 years old."
```

### 访问修饰符

```typescript
// 访问修饰符
class Employee {
  public name: string;        // 公共属性，默认
  private salary: number;     // 私有属性，只能在类内部访问
  protected department: string; // 受保护属性，可在子类中访问
  readonly id: number;        // 只读属性

  constructor(name: string, salary: number, department: string, id: number) {
    this.name = name;
    this.salary = salary;
    this.department = department;
    this.id = id;
  }

  // 公共方法
  public getDetails(): string {
    return `${this.name} works in ${this.department}`;
  }

  // 私有方法
  private calculateBonus(): number {
    return this.salary * 0.1;
  }

  // 受保护方法
  protected getFullInfo(): string {
    return `${this.name}, ${this.department}, ${this.salary}`;
  }
}

const emp = new Employee("Bob", 50000, "IT", 1);
console.log(emp.name);        // "Bob"
// console.log(emp.salary);   // 错误：私有属性
// console.log(emp.department); // 错误：受保护属性
// emp.id = 2;                // 错误：只读属性
```

### 继承

```typescript
// 继承
class Manager extends Employee {
  private subordinates: Employee[] = [];

  constructor(name: string, salary: number, id: number) {
    super(name, salary, "Management", id);
  }

  public addSubordinate(employee: Employee): void {
    this.subordinates.push(employee);
  }

  public getSubordinateCount(): number {
    return this.subordinates.length;
  }

  // 可以访问父类的受保护成员
  public getManagerInfo(): string {
    return this.getFullInfo();
  }
}
```

### 抽象类

```typescript
// 抽象类
abstract class Shape {
  color: string;

  constructor(color: string) {
    this.color = color;
  }

  // 抽象方法（必须在子类中实现）
  abstract calculateArea(): number;

  // 具体方法
  getColor(): string {
    return this.color;
  }
}

class Circle extends Shape {
  radius: number;

  constructor(color: string, radius: number) {
    super(color);
    this.radius = radius;
  }

  // 实现抽象方法
  calculateArea(): number {
    return Math.PI * this.radius * this.radius;
  }
}

// const shape = new Shape("red"); // 错误：不能实例化抽象类
const circle = new Circle("blue", 5);
console.log(circle.calculateArea()); // 78.54...
console.log(circle.getColor());      // "blue"
```

## 7. 泛型

泛型允许创建可重用的组件，这些组件可以处理多种类型而不失去类型安全性。

### 基本泛型

```typescript
// 泛型函数
function identity<T>(arg: T): T {
  return arg;
}

// 显式指定类型参数
const output1 = identity<string>("myString");

// 类型推断
const output2 = identity(42); // 类型参数推断为number
```

### 泛型接口

```typescript
// 泛型接口
interface GenericIdentityFn<T> {
  (arg: T): T;
}

// 实现泛型接口
const myIdentity: GenericIdentityFn<number> = identity;
```

### 泛型类

```typescript
// 泛型类
class GenericBox<T> {
  private value: T;

  constructor(value: T) {
    this.value = value;
  }

  getValue(): T {
    return this.value;
  }

  setValue(value: T): void {
    this.value = value;
  }
}

const stringBox = new GenericBox<string>("Hello TypeScript");
console.log(stringBox.getValue()); // "Hello TypeScript"

const numberBox = new GenericBox(42); // 类型推断为GenericBox<number>
console.log(numberBox.getValue()); // 42
```

### 泛型约束

```typescript
// 泛型约束
interface Lengthwise {
  length: number;
}

// 约束泛型T必须有length属性
function getLength<T extends Lengthwise>(arg: T): number {
  return arg.length;
}

console.log(getLength("Hello")); // 5
console.log(getLength([1, 2, 3])); // 3
// console.log(getLength(3)); // 错误：number没有length属性
```

### 在泛型中使用类型参数

```typescript
// 在泛型中使用类型参数
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const person = { name: "John", age: 30 };
console.log(getProperty(person, "name")); // "John"
// console.log(getProperty(person, "gender")); // 错误：person没有gender属性
```

## 8. 高级类型

TypeScript提供了多种高级类型，用于处理复杂的类型关系。

### 交叉类型

交叉类型将多个类型合并为一个类型：

```typescript
// 交叉类型
interface BusinessPartner {
  name: string;
  credit: number;
}

interface Identity {
  id: number;
  email: string;
}

// 合并类型
type Employee = BusinessPartner & Identity;

// 使用交叉类型
const emp: Employee = {
  name: "John",
  credit: 100,
  id: 1234,
  email: "john@example.com"
};
```

### 类型守卫

类型守卫用于在运行时检查变量的类型：

```typescript
// 类型守卫
function isString(value: any): value is string {
  return typeof value === "string";
}

function processValue(value: string | number) {
  // 使用类型守卫
  if (isString(value)) {
    // 在这个块中，value的类型是string
    return value.toUpperCase();
  } else {
    // 在这个块中，value的类型是number
    return value.toFixed(2);
  }
}
```

### 可辨识联合

可辨识联合是一种模式，结合了联合类型、字面量类型和类型守卫：

```typescript
// 可辨识联合
interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  sideLength: number;
}

type Shape = Circle | Square;

// 使用可辨识联合
function calculateArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      // 在这个块中，shape的类型是Circle
      return Math.PI * shape.radius ** 2;
    case "square":
      // 在这个块中，shape的类型是Square
      return shape.sideLength ** 2;
  }
}
```

### 映射类型

映射类型基于旧类型创建新类型：

```typescript
// 映射类型
interface Person {
  name: string;
  age: number;
}

// 将所有属性变为可选
type PartialPerson = Partial<Person>;
// 等同于: { name?: string; age?: number; }

// 将所有属性变为只读
type ReadonlyPerson = Readonly<Person>;
// 等同于: { readonly name: string; readonly age: number; }

// 从Person中选择特定属性
type NameOnly = Pick<Person, "name">;
// 等同于: { name: string; }

// 排除特定属性
type WithoutAge = Omit<Person, "age">;
// 等同于: { name: string; }
```

## 9. 模块和命名空间

TypeScript支持模块化编程，可以将代码组织成可重用的单元。

### ES模块

```typescript
// math.ts
export function add(x: number, y: number): number {
  return x + y;
}

export function subtract(x: number, y: number): number {
  return x - y;
}

export const PI = 3.14159;

// app.ts
import { add, subtract, PI } from "./math";
console.log(add(5, 3));       // 8
console.log(subtract(10, 4)); // 6
console.log(PI);              // 3.14159

// 导入所有内容
import * as math from "./math";
console.log(math.add(1, 2));  // 3

// 默认导出/导入
// calculator.ts
export default class Calculator {
  add(x: number, y: number): number {
    return x + y;
  }
}

// app.ts
import Calculator from "./calculator";
const calc = new Calculator();
console.log(calc.add(3, 4));  // 7
```

### 命名空间

命名空间是TypeScript特有的功能，用于组织代码：

```typescript
// 命名空间
namespace Validation {
  export interface StringValidator {
    isValid(s: string): boolean;
  }

  export class RegexValidator implements StringValidator {
    private regex: RegExp;

    constructor(regex: RegExp) {
      this.regex = regex;
    }

    isValid(s: string): boolean {
      return this.regex.test(s);
    }
  }
}

// 使用命名空间
const emailValidator = new Validation.RegexValidator(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
console.log(emailValidator.isValid("test@example.com")); // true
```

## 10. 装饰器

装饰器是一种特殊类型的声明，可以附加到类、方法、访问器、属性或参数上。

```typescript
// 启用装饰器
// 在tsconfig.json中设置: "experimentalDecorators": true

// 类装饰器
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@sealed
class Greeter {
  greeting: string;

  constructor(message: string) {
    this.greeting = message;
  }

  greet() {
    return "Hello, " + this.greeting;
  }
}

// 方法装饰器
function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = function(...args: any[]) {
    console.log(`Calling ${propertyKey} with args: ${JSON.stringify(args)}`);
    return originalMethod.apply(this, args);
  };

  return descriptor;
}

class Calculator {
  @log
  add(x: number, y: number) {
    return x + y;
  }
}

const calc = new Calculator();
calc.add(1, 2); // 输出: "Calling add with args: [1,2]"
```

## 总结

TypeScript是一个强大的工具，它通过静态类型检查和现代JavaScript特性，帮助开发者构建更可靠、更易维护的应用程序。本文介绍了TypeScript的核心语法和基本概念，包括：

1. 基本类型和类型注解
2. 接口
3. 函数
4. 类和面向对象编程
5. 泛型
6. 高级类型
7. 模块和命名空间
8. 装饰器

掌握这些核心概念后，你将能够更有效地使用TypeScript进行开发，并充分利用其类型系统带来的优势。

## 参考资源

- [TypeScript官方文档](https://www.typescriptlang.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Playground](https://www.typescriptlang.org/play)
