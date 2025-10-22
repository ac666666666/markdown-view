# 📝 Markdown 查看器 - 现代化的文档预览工具

> 一个基于 React 19 + TypeScript 构建的现代化 Markdown 文档查看器，支持实时预览、语法高亮、数学公式渲染等功能。

## 🎯 项目概述

### 项目背景
在日常开发和写作中，我们经常需要预览 Markdown 文档的渲染效果。虽然市面上有很多 Markdown 编辑器，但大多数要么功能过于复杂，要么界面不够现代化。因此，我开发了这个轻量级、功能完整的 Markdown 查看器。

### 核心特性
- 🎨 **现代化 UI 设计** - 基于 Tailwind CSS 的响应式设计
- 🌓 **多主题支持** - 亮色/暗色/护眼模式，适应不同使用场景
- 📱 **完美适配移动端** - 响应式布局，手机平板都能完美使用
- 🔍 **强大的 Markdown 渲染** - 支持 GFM、数学公式、代码高亮
- 💾 **智能本地存储** - 自动保存文档，刷新不丢失
- 🚀 **极速加载体验** - 优化的构建配置，秒开应用

## 🛠️ 技术架构

### 前端技术栈
```
React 19.1.1          # 最新的 React 版本，性能更优
TypeScript 5.9.3      # 类型安全，开发体验更好
Vite (Rolldown)       # 下一代构建工具，构建速度极快
Tailwind CSS 3.4.10   # 原子化 CSS 框架
Zustand 4.4.7         # 轻量级状态管理
```

### 核心依赖
```
react-markdown 9.0.1   # Markdown 渲染引擎
highlight.js 11.9.0    # 代码语法高亮
katex 0.16.9          # 数学公式渲染
lucide-react 0.400.0  # 现代化图标库
```

### 项目结构
```
src/
├── components/        # 组件目录
│   ├── Header.tsx    # 顶部导航栏
│   ├── Sidebar.tsx   # 侧边栏文件管理
│   └── MainContent.tsx # 主内容区域
├── stores/           # 状态管理
│   └── useAppStore.ts # Zustand 全局状态
├── utils/            # 工具函数
│   ├── api.ts       # API 接口
│   ├── cache.ts     # 缓存管理
│   └── markdown.ts  # Markdown 处理
└── types/            # TypeScript 类型定义
    └── index.ts
```

## 🚀 核心功能实现

### 1. Markdown 渲染引擎
使用 `react-markdown` 作为核心渲染引擎，配合多个 remark/rehype 插件：

```typescript
// 核心插件配置
const remarkPlugins = [
  remarkGfm,        // GitHub Flavored Markdown
  remarkMath,       // 数学公式支持
  remarkBreaks      // 换行符处理
]

const rehypePlugins = [
  rehypeKatex,      // 数学公式渲染
  rehypeHighlight,  // 代码高亮
  rehypeSlug,       // 标题锚点
  rehypeRaw         // HTML 支持
]
```

### 2. 主题系统
实现了三种主题模式，支持系统主题自动切换：

```typescript
// 主题类型定义
type Theme = 'light' | 'dark' | 'eye-care'

// 主题应用逻辑
useEffect(() => {
  const root = document.documentElement
  root.classList.remove('light', 'dark', 'eye-care')
  root.classList.add(theme)
  
  // 护眼模式特殊处理
  if (theme === 'eye-care') {
    root.style.setProperty('--bg-primary', '#f7f5f3')
    // ... 更多护眼色彩配置
  }
}, [theme])
```

### 3. 状态管理
使用 Zustand 实现轻量级状态管理：

```typescript
interface AppState {
  theme: Theme
  documents: Document[]
  currentDocId: string | null
  sidebarOpen: boolean
  // ... 更多状态
}

export const useAppStore = create<AppState>((set, get) => ({
  // 状态初始值
  theme: 'light',
  documents: [],
  // ... 状态更新方法
}))
```

### 4. 本地存储与缓存
实现了智能的缓存管理系统：

```typescript
class CacheManager {
  private readonly CACHE_PREFIX = 'markdown-viewer-'
  private readonly CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000 // 7天

  set(key: string, data: any): void {
    const cacheData = {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + this.CACHE_EXPIRY
    }
    localStorage.setItem(this.CACHE_PREFIX + key, JSON.stringify(cacheData))
  }

  get<T>(key: string): T | null {
    // 获取并验证缓存有效性
  }

  cleanExpiredCache(): void {
    // 清理过期缓存
  }
}
```

## 🔧 构建与部署

### 构建优化
使用 Vite (Rolldown) 作为构建工具，配置了多项优化：

```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // 智能代码分割
          if (id.includes('react')) return 'vendor'
          if (id.includes('markdown')) return 'markdown'
          // ... 更多分割策略
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
```

### CI/CD 流程
配置了完整的 GitHub Actions 自动化流程：

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Setup pnpm
        uses: pnpm/action-setup@v4
      - name: Lint
        run: pnpm run lint
      - name: Type check
        run: pnpm run type-check
      - name: Build
        run: pnpm run build
      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v4
```

## 📊 性能优化

### 1. 构建优化
- **代码分割**: 按功能模块分割代码，减少初始加载体积
- **Tree Shaking**: 自动移除未使用的代码
- **压缩优化**: 使用 Terser 进行代码压缩

### 2. 运行时优化
- **懒加载**: 大文件内容懒加载渲染
- **缓存策略**: 智能缓存用户文档和设置
- **防抖处理**: 输入防抖，避免频繁渲染

### 3. 用户体验优化
- **响应式设计**: 完美适配各种屏幕尺寸
- **加载状态**: 友好的加载提示
- **错误处理**: 完善的错误边界和提示

## 🎨 设计亮点

### 1. 现代化 UI
- 采用 Tailwind CSS 原子化设计
- 遵循 Material Design 设计规范
- 流畅的动画过渡效果

### 2. 用户体验
- 直观的拖拽上传
- 快捷键支持
- 智能的主题切换

### 3. 可访问性
- 完整的键盘导航支持
- 语义化的 HTML 结构
- 高对比度的护眼模式

## 🚀 部署方案

### GitHub Pages 部署
项目支持一键部署到 GitHub Pages：

1. **自动部署**: 推送到 main 分支自动触发部署
2. **自定义域名**: 支持绑定自定义域名
3. **HTTPS 支持**: 自动启用 HTTPS

### 自部署方案
也可以部署到自己的服务器：

```bash
# 构建项目
pnpm build

# 部署到 Nginx
cp -r dist/* /var/www/html/
```

## 📈 项目数据

- **代码行数**: ~2000 行
- **构建体积**: ~800KB (gzipped)
- **加载时间**: <2s (首次加载)
- **支持格式**: .md, .markdown, .txt

## 🔮 未来规划

### 短期目标
- [ ] 添加文档搜索功能
- [ ] 支持更多文件格式
- [ ] 增加导出功能

### 长期目标
- [ ] 协作编辑功能
- [ ] 插件系统
- [ ] 桌面端应用

## 🤝 开源贡献

这个项目完全开源，欢迎大家：
- 提交 Issue 反馈问题
- 提交 PR 贡献代码
- Star 支持项目发展

## 📝 总结

这个 Markdown 查看器项目展示了现代前端开发的最佳实践：

1. **技术选型**: 使用最新的技术栈，保证项目的先进性
2. **工程化**: 完整的 CI/CD 流程，保证代码质量
3. **用户体验**: 注重细节，提供优秀的用户体验
4. **性能优化**: 多维度优化，保证应用性能
5. **可维护性**: 清晰的代码结构，便于维护和扩展

通过这个项目，我深入实践了 React 19 的新特性、TypeScript 的类型系统、现代化的构建工具等技术，也积累了丰富的前端工程化经验。

---

**项目地址**: https://github.com/ac666666666/markdown-view  
**在线预览**: https://ac666666666.github.io/markdown-view/  
**技术博客**: [即将发布]

> 如果这个项目对你有帮助，欢迎 Star ⭐ 支持！