# UPIM 插件发布指南

## 插件市场发布所需文件

将以下文件上传到 Obsidian 插件市场：

### 必需文件
- `main.js` - 编译后的插件代码
- `manifest.json` - 插件清单和元数据

### 推荐文件
- `README.md` - 详细的使用说明

## 不应上传的文件

以下文件不应包含在插件市场发布中：

### 用户数据
- `data.json` - 包含用户的个人配置

### 开发文件
- `main.ts` - TypeScript 源码
- `package.json` - npm 依赖配置
- `tsconfig.json` - TypeScript 配置
- `esbuild.config.mjs` - 构建配置
- `version-bump.mjs` - 版本更新脚本
- `build.ps1` - 构建脚本

### 其他文件
- `.gitignore` - Git 忽略规则
- `PUBLISH.md` - 此发布指南

## 发布前检查清单

- [ ] 插件能正常加载和运行
- [ ] manifest.json 中的信息准确完整
- [ ] README.md 包含详细的使用说明
- [ ] 只有必需文件被上传
- [ ] 版本号正确
- [ ] 测试过各种使用场景

## 版本发布流程

1. 更新 `manifest.json` 中的版本号
2. 更新 `README.md` 中的版本信息（如需要）
3. 重新构建 `main.js`（如果修改了源码）
4. 测试插件功能
5. 上传必需文件到插件市场
