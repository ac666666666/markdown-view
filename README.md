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

## 🚀 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev
```

### 构建项目

```bash
pnpm build
```

### 预览构建结果

```bash
pnpm preview
```

## 📚 使用指南

1. **上传文件**: 点击上传按钮或拖拽 Markdown 文件到页面
2. **切换主题**: 使用右上角的主题切换按钮
3. **管理文档**: 在侧边栏中管理和切换文档
4. **实时预览**: 编辑内容时实时查看渲染效果

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License
