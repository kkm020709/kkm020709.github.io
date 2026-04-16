# KKM Blog（Astro + Firefly）

这是基于 `Astro` 与 `Firefly` 主题搭建的个人博客项目。

## 你这版已做的功能

- 主题风格：Firefly
- 线上域名：`https://kangxia.top`
- 导航栏包含：主页、归档、链接、音乐、友链、留言板、关于
- 音乐功能：导航栏点击“音乐”进入 `https://kangxia.top/music/` 可直接播放
- 在线协作后台：已移除（`/admin` 不再提供在线编辑）

---

## 技术栈与工具

### 核心框架

- `Astro`：静态站点生成（SSG）
- `TypeScript`：类型约束
- `Svelte`：主题内部分交互组件

### 样式与体验

- `Tailwind CSS`：样式系统
- `Swup`：页面切换动画
- `Pagefind`：本地全文检索
- `APlayer`：音乐播放器
- `Fancybox`：图片预览

### 内容系统

- `Astro Content Collections`
- 文章目录：`src/content/posts`
- 页面内容：`src/content/spec`

### 构建与质量

- `pnpm`：包管理
- `Biome`：格式化与检查
- `astro build`：生产构建

---

## 本地开发

### 1. 环境要求

- Node.js 22+
- pnpm 9+

### 2. 安装依赖

```bash
corepack pnpm install
```

### 3. 启动开发

```bash
corepack pnpm dev
```

默认访问：`http://localhost:4321`

---

## 生产部署（Netlify）

你已经绑定了 `kangxia.top`，按下面配置即可：

### Netlify 构建参数

- Build command: `corepack pnpm build`
- Publish directory: `dist`
- Node version: `22`

### 部署流程

1. 代码推送到 GitHub `main`
2. Netlify 自动触发构建
3. 构建成功后自动发布到 `https://kangxia.top`

---

## 如何新增文章

### 方式 A：本地新增（推荐）

1. 在 `src/content/posts/` 新建 `xxx.md`
2. 写 Frontmatter + Markdown 正文
3. 提交并推送到 GitHub

Frontmatter 示例：

```md
---
title: 我的新文章
published: 2026-04-16
description: 这是一篇测试文章
tags: [Astro, 博客]
category: 技术
draft: false
---

这里是正文（Markdown）。
```

### 方式 B：直接在 GitHub 网页新增（不需要本地）

可以，支持。步骤如下：

1. 打开 GitHub 仓库
2. 进入 `src/content/posts/`
3. 点击 `Add file` -> `Create new file`
4. 文件名填 `your-post.md`
5. 粘贴 Frontmatter + Markdown 内容
6. 直接 Commit 到 `main`

提交后 Netlify 会自动部署，你的网站会更新。

---

## 音乐功能说明

- 导航栏“音乐”路径：`/music/`
- 音乐配置文件：`src/config/musicConfig.ts`
- 默认歌曲资源路径：`public/assets/music/`

如果要换歌，修改 `musicConfig.ts` 的 `local.playlist` 即可。

---

## 关键配置文件

- 站点基础配置：`src/config/siteConfig.ts`
- 导航栏：`src/config/navBarConfig.ts`
- 个人信息：`src/config/profileConfig.ts`
- 音乐配置：`src/config/musicConfig.ts`

