---
title: 文章可视标签（visible）使用说明
published: 2026-04-16T23:10:00+08:00
description: 介绍如何通过 Frontmatter 的 visible 标签控制文章是否在站点中显示。
tags: [教程, 博客, 可视控制]
category: 博客指南
draft: false
visible: true
---

这篇文档用于说明如何使用文章的 `visible` 标签控制展示状态。

## 使用方式

在文章 Frontmatter 中添加字段：

```yaml
---
title: 示例文章
published: 2026-04-16T20:00:00+08:00
visible: false
---
```

- `visible: true` 或不写该字段：文章正常显示在列表、分类、标签和相关页面中。
- `visible: false`：文章不会显示在网站文章列表、杂谈聚合和相关索引中。

## 典型场景

- 临时隐藏尚未准备好的内容。
- 存放仅供仓库留档的内部说明文章。
- 先提交到仓库，后续再改成 `visible: true` 对外发布。

## 发布建议

如果你希望文章完全不对访客展示，建议同时设置：

```yaml
draft: true
visible: false
```

这样既能避免展示，也能避免被误当作正式内容参与页面构建。
