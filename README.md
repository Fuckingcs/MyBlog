# 胡某人的博客

一个使用 Astro 和 Markdown 构建的个人博客，文章分为「随感」和「笔记」，适合部署到 GitHub Pages。

## 本地预览

需要 Node.js 24 或更新版本。

```bash
npm ci
npm run dev
```

打开终端给出的本地地址。上线前可以运行：

```bash
npm run check
npm test
```

`npm test` 会先构建网站，再检查首页、空栏目、摘要与分页逻辑。

## 发文章

按照 [发文说明](docs/writing-posts.md) 在 `src/content/posts/` 新建 Markdown 文件。文章可选配图；栏目卡片自动使用正文第一张图片，没有图片时使用灰白渐变。首页的个人资料在 `src/pages/index.astro` 中修改。

## 发布到 GitHub Pages

1. 将本仓库推送到你的 GitHub 仓库，默认分支使用 `main`。
2. 在仓库的 **Settings → Pages → Build and deployment** 中将 **Source** 设为 **GitHub Actions**。
3. 推送到 `main` 后，`.github/workflows/deploy.yml` 会自动构建和发布。也可以在 Actions 页面手动运行。

构建会根据 GitHub 仓库名自动设置站点路径。普通项目仓库会发布到 `https://用户名.github.io/仓库名/`；仓库名为 `用户名.github.io` 时发布在站点根路径。首次发布仍需在 GitHub 上创建仓库并启用 Pages。
