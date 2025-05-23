# ESLint 修复指南

## 问题概览

在项目中发现了以下 ESLint 错误和警告：

1. `/src/components/ui/immersive-toggle.tsx`
   - 警告：第106行 - 'h-3, w-3' 应替换为 'size-3' 简写
   - 警告：第106行 - 'transform' 在 Tailwind CSS v3 中不需要

2. `/src/components/ui/optimized-image.tsx`
   - 错误：第114行 - 不允许尾随空格
   - 错误：第114行 - 文件末尾空行过多，最多允许0行
   - 错误：第114行 - 文件末尾需要换行符但没有找到

3. `/src/components/ui/theme-toggle.tsx`
   - 错误：第93行 - 不允许尾随空格
   - 错误：第93行 - 文件末尾空行过多，最多允许0行
   - 错误：第93行 - 文件末尾需要换行符但没有找到

4. `/src/pages/animation-demo.tsx`
   - 错误：第354行 - 不允许尾随空格
   - 错误：第354行 - 文件末尾空行过多，最多允许0行
   - 错误：第354行 - 文件末尾需要换行符但没有找到

5. `/src/utils/performance.ts`
   - 错误：第22行 - 解析错误，期望有 '>'

## 修复方法

### 1. immersive-toggle.tsx

在第106行中，将:
```tsx
<div className="absolute -left-1 top-1/2 h-3 w-3 transform -translate-y-1/2 rotate-45 bg-primary-500 dark:bg-primary-600"></div>
```
修改为:
```tsx
<div className="absolute -left-1 top-1/2 size-3 -translate-y-1/2 rotate-45 bg-primary-500 dark:bg-primary-600"></div>
```

### 2. optimized-image.tsx、theme-toggle.tsx 和 animation-demo.tsx

这些文件有相同的问题：文件末尾有多余的空格和空行。

修复方法：
1. 打开文件
2. 确保最后一个 `}` 后没有空格
3. 确保文件末尾只有一个换行符（没有多余空行）
4. 保存文件

例如，optimized-image.tsx 应该以下面的格式结束：
```tsx
    </figure>
  )
}
```

### 3. performance.ts

第22行左右存在泛型语法错误。检查 `ErrorBoundary` 类的定义，确保泛型语法正确：

```tsx
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
```

确保 `>` 符号位置正确，可能是由于格式问题导致。

## 使用 ESLint 自动修复

可以使用以下命令自动修复某些格式问题：

```bash
npx eslint --fix src/components/ui/immersive-toggle.tsx src/components/ui/optimized-image.tsx src/components/ui/theme-toggle.tsx src/pages/animation-demo.tsx src/utils/performance.ts
```

或者逐个文件修复：

```bash
npx eslint --fix src/components/ui/immersive-toggle.tsx
npx eslint --fix src/components/ui/optimized-image.tsx
npx eslint --fix src/components/ui/theme-toggle.tsx
npx eslint --fix src/pages/animation-demo.tsx
npx eslint --fix src/utils/performance.ts
```
