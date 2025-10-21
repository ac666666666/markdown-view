# 🚀 部署指南

本文档将指导你如何将 Markdown 查看器部署到 GitHub Pages。

## 📋 前置条件

1. **GitHub 账号**: 确保你有 GitHub 账号
2. **Git 工具**: 本地安装了 Git
3. **项目仓库**: 项目已推送到 GitHub 仓库

## 🔧 GitHub Pages 设置步骤

### 1. 创建 GitHub 仓库

如果还没有创建仓库：

```bash
# 在项目根目录初始化 Git
git init

# 添加所有文件
git add .

# 提交代码
git commit -m "初始提交: Markdown 查看器项目"

# 添加远程仓库（替换为你的用户名和仓库名）
git remote add origin https://github.com/your-username/markdown-view.git

# 推送到 GitHub
git push -u origin main
```

### 2. 启用 GitHub Pages

1. 进入你的 GitHub 仓库页面
2. 点击 **Settings** 选项卡
3. 在左侧菜单中找到 **Pages**
4. 在 **Source** 部分选择 **GitHub Actions**

### 3. 配置仓库权限

确保 GitHub Actions 有足够的权限：

1. 在仓库设置中，点击 **Actions** → **General**
2. 在 **Workflow permissions** 部分：
   - 选择 **Read and write permissions**
   - 勾选 **Allow GitHub Actions to create and approve pull requests**
3. 点击 **Save** 保存设置

### 4. 更新 Vite 配置

确保 `vite.config.ts` 中的 `base` 路径正确：

```typescript
// 如果你的仓库名是 markdown-view
base: process.env.NODE_ENV === 'production' ? '/markdown-view/' : '/',

// 如果你的仓库名不同，请相应修改
base: process.env.NODE_ENV === 'production' ? '/your-repo-name/' : '/',
```

## 🚀 部署流程

### 自动部署

一旦配置完成，每次推送到 `main` 分支都会自动触发部署：

```bash
# 修改代码后
git add .
git commit -m "更新功能"
git push origin main
```

### 手动触发部署

1. 进入 GitHub 仓库的 **Actions** 选项卡
2. 选择 **构建和部署** 工作流
3. 点击 **Run workflow** 按钮
4. 选择分支并点击 **Run workflow**

## 📊 监控部署状态

### 查看构建日志

1. 进入 **Actions** 选项卡
2. 点击最新的工作流运行
3. 查看各个步骤的执行情况

### 常见状态

- ✅ **成功**: 绿色勾号，部署完成
- ❌ **失败**: 红色叉号，检查错误日志
- 🟡 **进行中**: 黄色圆点，正在执行

## 🌐 访问部署的网站

部署成功后，你可以通过以下地址访问：

```
https://your-username.github.io/markdown-view/
```

## 🔧 故障排除

### 常见问题

1. **404 错误**
   - 检查 `base` 路径配置是否正确
   - 确认仓库名和配置一致

2. **构建失败**
   - 检查 `package.json` 中的脚本是否正确
   - 确认所有依赖都已正确安装

3. **权限错误**
   - 检查 GitHub Actions 权限设置
   - 确认 Pages 设置为 GitHub Actions

### 调试步骤

1. **检查工作流文件**
   ```bash
   # 确认文件路径正确
   .github/workflows/deploy.yml
   ```

2. **本地测试构建**
   ```bash
   # 本地测试构建是否成功
   pnpm build
   pnpm preview
   ```

3. **查看详细日志**
   - 在 Actions 页面点击失败的步骤
   - 查看详细的错误信息

## 📝 自定义域名（可选）

如果你有自定义域名：

1. 在 `public` 目录创建 `CNAME` 文件
2. 文件内容为你的域名：
   ```
   your-domain.com
   ```
3. 在域名提供商处设置 CNAME 记录指向 `your-username.github.io`

## 🔄 更新部署

### 更新代码

```bash
# 拉取最新代码
git pull origin main

# 修改代码
# ...

# 提交并推送
git add .
git commit -m "更新描述"
git push origin main
```

### 回滚版本

如果需要回滚到之前的版本：

```bash
# 查看提交历史
git log --oneline

# 回滚到指定提交
git reset --hard <commit-hash>
git push --force origin main
```

## 📈 性能优化

### 构建优化

- 代码分割已配置
- 静态资源压缩
- Tree shaking 优化

### 缓存策略

- 静态资源长期缓存
- HTML 文件短期缓存

## 🎯 下一步

- 配置自定义域名
- 设置 CDN 加速
- 添加监控和分析
- 配置 HTTPS 证书（GitHub Pages 自动提供）

---

🎉 恭喜！你的 Markdown 查看器现在已经成功部署到 GitHub Pages！