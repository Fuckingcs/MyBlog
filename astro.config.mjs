import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import { remarkPublicImages } from './src/lib/remark-images.mjs';

const [owner, repo] = (process.env.GITHUB_REPOSITORY ?? '/').split('/');
const isGitHubBuild = Boolean(owner && repo);
const base = isGitHubBuild && repo.toLowerCase() !== `${owner.toLowerCase()}.github.io`
  ? `/${repo}`
  : '/';

export default defineConfig({
  output: 'static',
  site: isGitHubBuild ? `https://${owner}.github.io` : 'http://localhost:4321',
  base,
  markdown: { processor: unified({ remarkPlugins: [[remarkPublicImages, { base }]] }) },
});
