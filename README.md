# UPIM - EasyImages2.0 图床上传插件

这是一个用于 Obsidian 的插件，可以将图片上传到 EasyImages2.0 图床，并自动插入 Markdown 格式的图片链接。

## 功能特性

- 🖼️ 支持多图片批量上传
- 🔗 自动插入 Markdown 格式图片链接
- ⚙️ 简单的设置界面
- 🧪 API 连接测试
- 📱 侧边栏快捷按钮

## 安装方法

1. 下载插件文件到你的 Obsidian 插件目录：`.obsidian/plugins/upim/`
2. 在 Obsidian 设置中启用 "UPIM - EasyImage Uploader" 插件

## 配置设置

1. 打开 Obsidian 设置
2. 找到 "UPIM" 设置选项
3. 配置以下信息：
   - **API 地址**: 你的 EasyImages2.0 图床完整URL（例如：https://your-domain.com）
   - **Token**: 从 EasyImages2.0 的 tokenList 文件中获取的访问令牌

## 使用方法

1. **侧边栏按钮**: 点击左侧边栏的图片图标
2. **文件选择**: 选择要上传的图片文件（支持多选）
3. **自动插入**: 上传完成后，Markdown 格式的图片链接会自动插入到当前光标位置

## EasyImages2.0 API 说明

本插件使用以下 API 接口：
- **上传接口**: `POST {apiUrl}/api/index.php`
- **参数**:
  - `image`: 图片文件
  - `token`: 访问令牌
- **响应格式**:
  ```json
  {
    "result": "success",
    "code": 200,
    "url": "https://example.com/image.webp"
  }
  ```

## 注意事项

- 确保你的 EasyImages2.0 服务正常运行
- Token 需要正确配置，否则上传会失败
- 支持的图片格式取决于你的图床服务配置

## 开发

本插件基于 TypeScript 开发，如需自定义请修改 `main.ts` 文件。
