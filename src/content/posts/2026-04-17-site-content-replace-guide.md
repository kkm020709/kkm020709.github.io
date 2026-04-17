---
title: 站点内容替换指南（内部文档）
published: 2026-04-17T10:30:00+08:00
description: 记录站点各处可替换内容的配置位置，供站长自己查阅。
tags: [内部文档, 配置, 站点维护]
category: 博客指南
draft: false
visible: false
---

> 本文档为**仅站长可见**的内部速查表。通过设置 `visible: false`，它不会出现在任何列表 / 分类 / 标签 / 归档 / 搜索中，但可以通过直链访问。
>
> 如果想完全不让访客访问到，把 `visible: false` 改成 `draft: true` 即可——那样就连页面都不会生成。

## 一、公告（首页右侧/弹窗提示）

配置文件：

```
src/config/announcementConfig.ts
```

可修改项：

| 字段         | 作用                                                      |
| ------------ | --------------------------------------------------------- |
| `title`      | 公告标题文字                                              |
| `content`    | 公告正文内容                                              |
| `closable`   | 是否允许访客点"关闭"按钮隐藏公告                          |
| `link.enable`| 是否在公告下方显示"了解更多"一类的跳转按钮                |
| `link.text`  | 按钮的文字                                                |
| `link.url`   | 按钮跳转地址（可相对路径 `/notice/` 或外链 `https://…`）  |
| `link.external` | 是否外链（`true` 新标签页打开）                        |

示例（把公告改成"本周更新"）：

```ts
export const announcementConfig: AnnouncementConfig = {
  title: "本周更新",
  content: "新增站点内容替换指南，优化评论系统加载速度。",
  closable: true,
  link: {
    enable: true,
    text: "查看详情",
    url: "/posts/2026-04-17-site-content-replace-guide/",
    external: false,
  },
};
```

保存 → 提交 → 推送即可生效。

## 二、赞助列表（支付宝 / 微信 / 其他渠道）

配置文件：

```
src/config/sponsorConfig.ts
```

### 2.1 顶部描述

```ts
title: "",          // 留空则用 i18n 默认"赞助"
description: "",    // 留空则用 i18n 默认描述
usage: "您的赞助将用于……"  // 页面上"赞助用途"区块的文案
showSponsorsList: true,      // 是否显示赞助者名单
showButtonInPost: true,      // 是否在文章底部也放赞助按钮
```

### 2.2 修改赞助方式

`methods` 是一个数组，当前只保留了 **支付宝** 和 **微信**：

```ts
methods: [
  {
    name: "支付宝",
    icon: "fa7-brands:alipay",
    qrCode: "/assets/images/sponsor/alipay.png",
    link: "",
    description: "使用 支付宝 扫码赞助",
    enabled: true,
  },
  {
    name: "微信",
    icon: "fa7-brands:weixin",
    qrCode: "/assets/images/sponsor/wechat.png",
    link: "",
    description: "使用 微信 扫码赞助",
    enabled: true,
  },
],
```

#### 替换收款码图片

把新的收款码二维码图片**覆盖**到相同文件名即可（**保持原文件名**，不用改配置）：

- 支付宝：`public/assets/images/sponsor/alipay.png`
- 微信：`public/assets/images/sponsor/wechat.png`

> 提示：文件名保持不变才能让浏览器缓存失效得快，也不用改代码。如果一定要改文件名，记得同步改 `sponsorConfig.ts` 里的 `qrCode` 路径。

#### 临时隐藏某个赞助渠道

把对应项的 `enabled: true` 改成 `false`，**不用删除**整段配置，方便以后开启。

#### 新增第三方赞助渠道（如 PayPal / 爱发电）

在 `methods` 数组里追加一项：

```ts
{
  name: "爱发电",
  icon: "simple-icons:afdian",
  qrCode: "",                           // 无收款码就留空
  link: "https://afdian.com/a/yourname",// 点击后跳转的外链
  description: "通过 爱发电 进行赞助",
  enabled: true,
},
```

图标可在 [Iconify](https://icon-sets.iconify.design/) 找，格式 `<set>:<name>`。

### 2.3 赞助者名单

```ts
sponsors: [
  {
    name: "夏叶",
    amount: "¥50",
    date: "2025-10-01",
    message: "感谢分享！",   // message 可省略
  },
  {
    name: "匿名用户",
    amount: "¥20",
    date: "2025-10-01",
  },
],
```

直接在数组里增删条目即可，日期格式 `YYYY-MM-DD`。

## 三、关于我

内容文件：

```
src/content/spec/about.md
```

这是一个**普通的 Markdown 文件**，打开直接修改正文即可。页面路径是 `/about/`。

常见替换点：

- **第一行的 `# 关于我`**：大标题
- **自我介绍段落**：站长姓名 / 昵称 / 自我描述
- **站点技术栈**：用到的框架、主题、部署平台
- **联系方式**：GitHub / Bilibili / Email 等

示例：

```markdown
# 关于我

你好，我是 **kkm020709**。
这个站点用于记录技术学习、项目实践和日常思考……

## 联系方式

- **GitHub**: [kkm020709](https://github.com/kkm020709)
- **Email**: [kkm2002@163.com](mailto:kkm2002@163.com)
```

想加头像、表情或 HTML 片段都可以直接写在 Markdown 里。

## 四、主页壁纸文字（Lovely firefly! + 滚动副标题）

配置文件：

```
src/config/backgroundWallpaper.ts
```

核心配置块是 `banner.homeText`：

```ts
homeText: {
  enable: true,            // 是否显示主页横幅文字
  title: "Lovely firefly!", // ← 主标题：改这里
  titleSize: "3.8rem",
  subtitle: [              // ← 滚动副标题：改下面这个数组
    "In Reddened Chrysalis, I Once Rest",
    "From Shattered Sky, I Free Fall",
    "Amidst Silenced Stars, I Deep Sleep",
    "Upon Lighted Fyrefly, I Soon Gaze",
    "From Undreamt Night, I Thence Shine",
    "In Finalized Morrow, I Full Bloom",
  ],
  subtitleSize: "1.5rem",
  typewriter: {
    enable: true,          // true=循环打字机效果，false=每次刷新随机显示一条
    speed: 100,            // 打字速度（毫秒 / 每字）
    deleteSpeed: 50,       // 删除速度
    pauseTime: 2000,       // 显示完成后的停顿时间
  },
},
```

### 常见修改

| 想做的事                          | 改哪里                                                      |
| --------------------------------- | ----------------------------------------------------------- |
| 把 `Lovely firefly!` 换成别的     | `banner.homeText.title`                                     |
| 替换 / 增减下方滚动的几条文字     | `banner.homeText.subtitle` 数组（一行一条）                 |
| 关掉滚动，只固定显示一条          | `banner.homeText.typewriter.enable: false`                  |
| 完全关闭横幅文字（只留图）        | `banner.homeText.enable: false`                             |
| 调主标题字号                      | `banner.homeText.titleSize`（支持 `rem`、`px`、`em`）       |
| 调副标题字号                      | `banner.homeText.subtitleSize`                              |
| 打字速度调慢 / 调快               | `banner.homeText.typewriter.speed`（数字越小越快）          |

### 顺便可改的相关项

同一文件里还能改：

- `mode`: `"banner"` / `"overlay"` / `"none"` —— 壁纸模式
- `src.desktop` / `src.mobile` —— 桌面与移动端壁纸图片路径
- `banner.position` —— 图片焦点位置（`center`、`top`、`0% 20%` 等）
- `banner.credit.text` / `banner.credit.url` —— 图片来源署名文本与链接
- `banner.waves.enable` —— 是否开启波浪动画
- `banner.navbar.transparentMode` / `enableBlur` —— 横幅模式下导航栏的透明与毛玻璃效果

## 五、替换完后的工作流

1. 修改对应文件并保存
2. `npm run dev` 本地预览确认
3. 提交并推送：

```bash
git add -A
git commit -m "chore(content): 更新 xxx"
git push
```

CI 自动部署后刷新线上站点即可。

---

> 需要扩展维护其它模块（友链 / 导航 / i18n / 主题配色 / 评论系统）时再在本文件追加对应章节。
