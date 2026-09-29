# Personal Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Hu's responsive personal blog with two Markdown article sections and automatic GitHub Pages deployment.

**Architecture:** Astro generates static pages from one validated Markdown content collection. Small pure functions derive the first image, excerpt, section lists, and pagination; page components render the home, listings, and article views. GitHub Actions builds the same project for GitHub Pages.

**Tech Stack:** Astro, Markdown, CSS, Node's built-in test runner, GitHub Actions.

---

## File map

- `package.json`, `package-lock.json`: scripts and pinned dependencies.
- `astro.config.mjs`: output and GitHub Pages base path, derived from `GITHUB_REPOSITORY` in CI.
- `src/content.config.ts`: required post metadata and Markdown loader.
- `src/lib/post-preview.mjs`: first Markdown image and plain-text excerpt.
- `src/lib/pagination.mjs`: sort, filter, and eight-post paging.
- `tests/post-preview.test.mjs`, `tests/pagination.test.mjs`: content behavior tests.
- `src/layouts/BaseLayout.astro`, `src/styles/global.css`: shared shell, typography, responsive styling.
- `src/components/PostCard.astro`, `src/components/Pagination.astro`, `src/components/ListingPage.astro`: focused listing units.
- `src/pages/index.astro`, `src/pages/essays/[...page].astro`, `src/pages/notes/[...page].astro`, `src/pages/posts/[slug].astro`: generated routes.
- `.github/workflows/deploy.yml`: Pages build and deployment.
- `README.md`, `docs/writing-posts.md`: development, deployment, and author instructions.

## Task 1: Project foundation and validated posts

**Files:** Create `package.json`, `astro.config.mjs`, `src/content.config.ts`, `src/content/posts/.gitkeep`.

- [ ] **Step 1: Add package scripts and dependencies.** Use `npm install astro remark-parse unified` and `npm install -D typescript`; set scripts to `dev: astro dev`, `build: astro build`, `preview: astro preview`, `test: node --test tests/*.test.mjs`, `check: astro check` after installing `@astrojs/check`. Commit `package-lock.json`.
- [ ] **Step 2: Configure GitHub path.** In `astro.config.mjs`, use `const [owner, repo] = (process.env.GITHUB_REPOSITORY ?? '/').split('/')`; `site` is `https://${owner}.github.io` when owner exists; `base` is `/` for local or the `<owner>.github.io` repository, otherwise `/${repo}`. Set `output: 'static'`.
- [ ] **Step 3: Define the content collection.** Use `glob({ pattern: '**/*.md', base: './src/content/posts' })`, and a schema requiring `title: z.string().min(1)`, `date: z.coerce.date()`, `category: z.enum(['essays', 'notes'])`. Export `collections = { posts }`.
- [ ] **Step 4: Run `npm run build`.** Expected: static build succeeds with zero posts. Commit the foundation.

## Task 2: Preview and pagination behavior

**Files:** Create `src/lib/post-preview.mjs`, `src/lib/pagination.mjs`, `tests/post-preview.test.mjs`, `tests/pagination.test.mjs`.

- [ ] **Step 1: Write failing tests.** Test that `previewFromMarkdown('文字 ![图](/images/a.png) 后文')` returns `/images/a.png` and readable text; test image-free Markdown returns `null`; test that code blocks do not become excerpts. Test `pageFor(posts, 2, 8)` returns the second eight-item slice and total page count, and a category filter excludes the other section.
- [ ] **Step 2: Run `npm test`.** Expected: missing-module failures before implementation.
- [ ] **Step 3: Implement the smallest pure helpers.** Parse Markdown with `unified().use(remarkParse).parse(markdown)`. Walk nodes in source order; capture the first `image.url`; gather paragraph and heading text recursively from `text` and `inlineCode` nodes, skipping images and code blocks. Normalize whitespace. In pagination, filter `post.data.category`, sort descending by `post.data.date`, and slice eight entries per page; return `items`, `page`, `pageCount`.
- [ ] **Step 4: Run `npm test`.** Expected: all helper tests pass. Commit the helpers and tests.

## Task 3: Shared visual system and homepage

**Files:** Create `src/layouts/BaseLayout.astro`, `src/styles/global.css`, `src/pages/index.astro`.

- [ ] **Step 1: Implement the shared shell.** Set `lang="zh-CN"`, viewport, title, navigation to 首页/随感/笔记, and a skip link. Prefix internal URLs with `import.meta.env.BASE_URL` so a GitHub project site works.
- [ ] **Step 2: Implement the approved D homepage.** Display “胡某人”, “北京科技大学”, “计算机科学与技术”, “强化学习（RL）”, and “ENTP” in a gray-white information card. Add a short intro and two linked section blocks. Keep article lists off the homepage.
- [ ] **Step 3: Add responsive CSS.** Use a near-white page background, white cards, `#1d1d1f` primary text, muted gray secondary text, about 20px card radius, subtle shadow, and readable system font. Adapt the home card and navigation below tablet width.
- [ ] **Step 4: Run `npm run build` and inspect the home at desktop and mobile widths.** Expected: no missing assets or horizontal overflow. Commit the shell and homepage.

## Task 4: Section lists and pagination

**Files:** Create `src/components/PostCard.astro`, `src/components/Pagination.astro`, `src/components/ListingPage.astro`, `src/pages/essays/[...page].astro`, `src/pages/notes/[...page].astro`.

- [ ] **Step 1: Create section routes.** Call `getCollection('posts')`; generate page one even for an empty section, then pages two through `Math.ceil(count / 8)`. Route labels are 随感/笔记, with category values `essays`/`notes`.
- [ ] **Step 2: Build the shared listing.** Render a centered section title and description, then four columns by two rows of cards on desktop; two columns on tablet and one on phone. Each card links to `/posts/<slug>/`, has an optional first-image cover or gray-white gradient, and shows date, title, and a two-line clamped excerpt. Do not show a post number.
- [ ] **Step 3: Add pagination.** Place larger previous/page/next controls at the bottom center. Render no pagination for a single page. Render an explicit empty state when there are no posts.
- [ ] **Step 4: Test with temporary local Markdown fixtures, then remove them.** Verify nine posts make eight cards on page one and one on page two, categories stay separate, and a first image becomes the cover. Run `npm test` and `npm run build`, then commit without the fixtures.

## Task 5: Article reading and publishing

**Files:** Create `src/pages/posts/[slug].astro`, `.github/workflows/deploy.yml`, `README.md`, `docs/writing-posts.md`.

- [ ] **Step 1: Generate article routes.** Use `getCollection('posts')` and `render(post)`; render title, date, category link, Markdown body, and return link. Style headings, lists, quotes, code, and responsive images.
- [ ] **Step 2: Add the Pages workflow.** Trigger on pushes to `main` and manual dispatch; grant `contents: read`, `pages: write`, `id-token: write`; use the current documented `actions/checkout@v7`, `withastro/action@v6`, and `actions/deploy-pages@v5`. Configure the `github-pages` environment.
- [ ] **Step 3: Write author instructions.** Show an exact Markdown example with `title`, `date`, `category`, body text and `![说明](/images/example/photo.jpg)`. Explain the automatic first-image cover, two-line excerpt, image upload under `public/images/`, GitHub web editing, and Pages setting “GitHub Actions”.
- [ ] **Step 4: Verify.** Run `npm test`, `npm run build`, and `npm run check`; inspect home, empty lists, a fixture article with headings/code/image, and mobile layout. Remove fixtures and rebuild. Commit the finished site.

## Final review

- [ ] Compare every page and behavior with `docs/superpowers/specs/2026-09-29-personal-blog-design.md`.
- [ ] Confirm `git status --short` is clean and the built output contains no sample posts.
- [ ] Open the local preview for user review. Connect the GitHub repository and publish when its identity and user authorization are available.
