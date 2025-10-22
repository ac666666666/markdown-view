# CI/CD 测试脚本
Write-Host "🚀 开始 CI/CD 测试..." -ForegroundColor Green

# 检查 Node.js 版本
Write-Host "`n📋 检查环境..." -ForegroundColor Yellow
node --version
npm --version

# 安装依赖
Write-Host "`n📦 安装依赖..." -ForegroundColor Yellow
npm install

# 运行构建
Write-Host "`n🔨 执行构建..." -ForegroundColor Yellow
npm run build

# 检查构建产物
Write-Host "`n✅ 检查构建产物..." -ForegroundColor Yellow
if (Test-Path "dist") {
    Write-Host "✓ dist 目录存在" -ForegroundColor Green
    $files = Get-ChildItem -Path "dist" -Recurse
    Write-Host "构建文件数量: $($files.Count)" -ForegroundColor Cyan
} else {
    Write-Host "✗ dist 目录不存在" -ForegroundColor Red
    exit 1
}

# 检查 GitHub Actions 工作流文件
Write-Host "`n🔍 检查 GitHub Actions 配置..." -ForegroundColor Yellow
if (Test-Path ".github/workflows/deploy.yml") {
    Write-Host "✓ GitHub Actions 工作流文件存在" -ForegroundColor Green
} else {
    Write-Host "✗ GitHub Actions 工作流文件缺失" -ForegroundColor Red
}

Write-Host "`n🎉 CI/CD 测试完成！" -ForegroundColor Green
Write-Host "现在可以访问以下链接查看部署状态：" -ForegroundColor Cyan
Write-Host "- GitHub Actions: https://github.com/ac666666666/markdown-view/actions" -ForegroundColor Blue
Write-Host "- GitHub Pages: https://ac666666666.github.io/markdown-view/" -ForegroundColor Blue
Write-Host "- 自部署版本: http://129.204.12.129:9080/" -ForegroundColor Blue