# 🚀 快速部署指南

## 第一次部署设置

### 1. 初始化 Git 仓库（如果还没有）

```bash
# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 创建初始提交
git commit -m "🎉 初始提交: Markdown 查看器项目"
```

### 2. 创建 GitHub 仓库

1. 访问 [GitHub](https://github.com)
2. 点击右上角的 "+" 号，选择 "New repository"
3. 仓库名建议使用: `markdown-view`
4. 设置为 Public（GitHub Pages 免费版需要公开仓库）
5. **不要**勾选 "Add a README file"（我们已经有了）
6. 点击 "Create repository"

### 3. 连接本地仓库到 GitHub

```bash
# 添加远程仓库（替换 YOUR_USERNAME 为你的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/markdown-view.git

# 推送代码到 GitHub
git branch -M main
git push -u origin main
```

### 4. 配置 GitHub Pages

1. 进入你的 GitHub 仓库页面
2. 点击 **Settings** 选项卡
3. 在左侧菜单中找到 **Pages**
4. 在 **Source** 部分选择 **GitHub Actions**
5. 保存设置

### 5. 设置 Actions 权限

1. 在仓库设置中，点击 **Actions** → **General**
2. 在 **Workflow permissions** 部分：
   - 选择 **Read and write permissions**
   - 勾选 **Allow GitHub Actions to create and approve pull requests**
3. 点击 **Save** 保存

### 6. 更新配置文件

确保 `vite.config.ts` 中的仓库名正确：

```typescript
// 如果你的仓库名是 markdown-view
base: process.env.NODE_ENV === 'production' ? '/markdown-view/' : '/',

// 如果你的仓库名不同，请修改为你的仓库名
base: process.env.NODE_ENV === 'production' ? '/YOUR_REPO_NAME/' : '/',
```

## 🎯 部署完成！

推送代码后，GitHub Actions 会自动：

1. ✅ 运行代码检查
2. 🔧 进行类型检查  
3. 🏗️ 构建项目
4. 🚀 部署到 GitHub Pages

你的网站将在以下地址可用：
```
https://YOUR_USERNAME.github.io/markdown-view/
```

## 📊 监控部署状态

1. 进入 GitHub 仓库的 **Actions** 选项卡
2. 查看工作流运行状态
3. 点击具体的运行查看详细日志

## 🔄 后续更新

每次修改代码后，只需：

```bash
git add .
git commit -m "✨ 添加新功能"
git push origin main
```

GitHub Actions 会自动重新部署！

## 🛠️ 故障排除

### 常见问题

1. **部署失败**
   - 检查 Actions 日志中的错误信息
   - 确认所有依赖都正确安装

2. **404 错误**
   - 检查 `vite.config.ts` 中的 `base` 路径
   - 确认仓库名和配置一致

3. **权限错误**
   - 检查 Actions 权限设置
   - 确认 Pages 设置正确

### 获取帮助

如果遇到问题，可以：
- 查看 GitHub Actions 的详细日志
- 检查 [DEPLOYMENT.md](./DEPLOYMENT.md) 获取更多信息
- 在 GitHub Issues 中寻求帮助

---

🎉 恭喜！你的 Markdown 查看器现在已经配置了完整的 CI/CD 流程！