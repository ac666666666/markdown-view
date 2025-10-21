# 📝 Markdown 查看器

一个现代化的 Markdown 文档查看器，支持实时预览、语法高亮、数学公式渲染等功能。

## ✨ 功能特性

- 📱 **响应式设计** - 完美适配桌面端和移动端
- 🎨 **主题切换** - 支持亮色/暗色/护眼模式
- 📄 **文件管理** - 支持多文档管理和快速切换
- 🔍 **语法高亮** - 基于 highlight.js 的代码语法高亮
- 🧮 **数学公式** - 支持 LaTeX 数学公式渲染
- 📤 **文件上传** - 支持拖拽上传 .md、.markdown、.txt 文件
- 💾 **本地存储** - 自动保存文档到本地存储
- 🚀 **快速加载** - 优化的构建配置，快速加载体验

## 🛠️ 技术栈

- **前端框架**: React 19 + TypeScript
- **构建工具**: Vite (Rolldown)
- **样式框架**: Tailwind CSS
- **状态管理**: Zustand
- **Markdown 渲染**: react-markdown + remark/rehype 插件
- **图标库**: Lucide React
- **包管理器**: pnpm

## 🚀 CI/CD 流程

本项目配置了完整的 GitHub Actions CI/CD 流程：

### 自动化流程
- ✅ **代码检查**: ESLint 代码质量检查
- 🔧 **类型检查**: TypeScript 类型验证
- 🏗️ **自动构建**: 每次推送自动构建项目
- 🚀 **自动部署**: 推送到 main 分支自动部署到 GitHub Pages

### 触发条件
- 推送到 `main` 分支
- 创建 Pull Request 到 `main` 分支
- 手动触发工作流

### 部署地址
- **生产环境**: https://your-username.github.io/markdown-view/
- **开发预览**: 每个 PR 都会进行构建验证

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
