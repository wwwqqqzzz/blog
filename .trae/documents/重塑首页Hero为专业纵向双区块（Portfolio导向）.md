## 版式与内容
### 顶部区（Hero Header）
- 左对齐排版，最多两行标题：
  - 行 1：姓名 + 职业定位（粗体 3xl-4xl）
  - 行 2：一句价值陈述（lg，次要色）
- 证据 Metrics（单行，最多 3 项）：
  - `8+ 年经验`、`20+ 项目落地`、`开源贡献`
- 行动区域（CTA）：
  - 主：`查看项目`
  - 次：`关于我`、`最近写作`
- 社交链接（同一行右侧或下一行，简洁 icon + 文本）

### 底部区（About Preview）
- 卡片：头像（圆角）、职业摘要（两句以内）、核心技能标签（最多 6 个）、行动按钮：`查看项目`、`详细简介`
- 卡片宽度与顶部区对齐；边框+轻阴影；背景轻度模糊（backdrop-blur-sm）

## 视觉与主题
- 主色：emerald 绿系（#10B981 为主）；按钮、边框、渐变、Chip 统一使用 `primary` 变量。
- 间距：外部 32/48，内部 16/24；统一圆角 `lg`。
- 字体：标题粗体，正文常规；层级清晰。

## 动效（高帧率）
- 初载：标题/文案/CTA/metrics 依次淡入（opacity + translateY 8px），stagger 80–120ms。
- 悬浮：按钮轻量 `scale(1.01)` + 颜色变化；卡片 `translateY(-2px)`。
- 滚动：底部卡片进入视窗淡入；一次触发。
- 无障碍：`prefers-reduced-motion` 下不触发动效。

## 实施要点（文件）
- `src/components/landing/Hero/index.tsx`：
  - 拆分为两个区块：`HeroHeader` 与 `AboutPreview`（同一组件内返回两节栈）
  - 移除装饰背景与复杂 SVG；使用容器与网格/栈布局
  - 接入 `framer-motion` 的 `motion.div` 初载淡入与错峰
- `src/components/landing/Hero/styles.module.css`：
  - 背景改为轻度绿系渐变；标题渐变换为绿系；减少阴影
- `src/css/custom.css` 与 `tailwind.config.ts`：
  - 保持 emerald 主题（若未完全应用，则同步变量）

## 验证
- 构建通过；首页交互与可访问性检查；移动端响应式良好。
- Lighthouse 简查（可选）：动画与合成层、CLS、LCP。

## 成果
- 一个专业的上下分栏 Hero，清晰展现身份、证据与行动路径；主题与动效统一。

请确认此实现方案；确认后我将直接完成代码改造与构建验证。