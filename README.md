# Astro 博客（网页写作自动同步 GitHub）

这个项目基于 Astro 官方 Blog 模板，已接入 Decap CMS 后台配置。  
目标：你可以在网页后台写作，内容自动提交到 GitHub，Netlify 自动部署上线。

## 已完成的项目结构

- 文章目录：`src/content/blog`
- CMS 后台页面：`public/admin/index.html`
- CMS 配置：`public/admin/config.yml`
- 图片上传目录：`public/uploads`

## 1) 本地开发

```sh
npm install
npm run dev
```

本地访问：
- 前台：`http://localhost:4321`
- 后台：`http://localhost:4321/admin`

## 2) 先完成 SSH 连接 GitHub

当前已生成 SSH key（文件在你的用户目录）：
- 私钥：`~/.ssh/id_ed25519_blog`
- 公钥：`~/.ssh/id_ed25519_blog.pub`

把公钥内容复制到 GitHub：
1. 打开 GitHub -> Settings -> SSH and GPG keys -> New SSH key
2. 粘贴公钥并保存
3. 验证：

```sh
ssh -T git@github.com
```

看到 `You've successfully authenticated` 即成功。

## 3) 推送到 GitHub 仓库

在 GitHub 创建一个新仓库（建议同名：`blog`），然后执行：

```sh
git branch -M main
git remote add origin git@github.com:<你的用户名>/blog.git
git add .
git commit -m "feat: initialize Astro blog with Decap CMS"
git push -u origin main
```

## 4) 部署到 Netlify

1. 登录 Netlify，点击 **Add new site** -> **Import an existing project**
2. 连接 GitHub，选择你的 `blog` 仓库
3. 构建配置：
   - Build command: `npm run build`
   - Publish directory: `dist`
4. 部署完成后，得到线上域名

## 5) 开启网页写作（关键）

在 Netlify 项目后台：

1. `Identity` -> Enable Identity
2. `Identity` -> Registration preferences -> 推荐先选 **Invite only**
3. `Identity` -> Services -> Enable **Git Gateway**
4. `Identity` -> Invite users，邀请你自己的邮箱
5. 打开 `https://你的域名/admin`，登录后即可在线写作/发布

发布流程：
- 在 `/admin` 新建文章
- 保存 Draft 或 Publish
- Decap CMS 自动向 GitHub 提交内容
- Netlify 自动触发新一轮部署

## 6) 首次上线后务必修改

请把以下内容改成你自己的：

- `astro.config.mjs` 里的 `site`
- `public/admin/config.yml` 里的 `site_url` 和 `display_url`
- `src/consts.ts` 的站点标题和描述

## 常用命令

```sh
npm run dev
npm run build
npm run preview
```
