# UPIM 插件构建脚本
# 用于Windows PowerShell环境

Write-Host "开始构建 UPIM 插件..." -ForegroundColor Green

# 检查Node.js是否安装
try {
    $nodeVersion = node --version 2>$null
    Write-Host "Node.js 版本: $nodeVersion" -ForegroundColor Yellow
} catch {
    Write-Host "错误: Node.js 未安装。请先安装 Node.js" -ForegroundColor Red
    exit 1
}

# 检查npm是否安装
try {
    $npmVersion = npm --version 2>$null
    Write-Host "npm 版本: $npmVersion" -ForegroundColor Yellow
} catch {
    Write-Host "错误: npm 未安装。请先安装 npm" -ForegroundColor Red
    exit 1
}

# 安装依赖
Write-Host "安装依赖包..." -ForegroundColor Green
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "错误: 依赖安装失败" -ForegroundColor Red
    exit 1
}

# 构建插件
Write-Host "构建插件..." -ForegroundColor Green
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "错误: 构建失败" -ForegroundColor Red
    exit 1
}

Write-Host "构建完成！插件文件已生成。" -ForegroundColor Green
Write-Host "你可以在 Obsidian 的插件设置中启用 'UPIM - EasyImage Uploader'" -ForegroundColor Cyan
