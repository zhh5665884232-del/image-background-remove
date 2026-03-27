# 🖼️ Image Background Remover

在线图片去背景工具 - MVP 版本

## 功能特性

- 📤 图片上传（拖拽或点击）
- ✨ 一键去除背景
- 🖥️ 实时预览对比
- ⬇️ 下载 PNG（保留透明通道）

## 技术栈

- **前端**: 原生 HTML + CSS + JavaScript
- **后端**: Cloudflare Workers
- **AI API**: Remove.bg

## 快速部署

### 1. 获取 API Key

1. 注册 [Remove.bg](https://www.remove.bg/api)
2. 免费版每月 50 张

### 2. 部署 Cloudflare Workers

```bash
# 登录 Cloudflare
wrangler login

# 创建 Workers
wrangler init image-bg- remover

# 设置环境变量
wrangler secret put REMOVE_BG_API_KEY
# 输入你的 Remove.bg API Key

# 部署
wrangler deploy
```

### 3. 配置前端

修改 `index.html` 中的 `API_URL`:

```javascript
const API_URL = 'https://your-worker-name.your-account.workers.dev';
```

### 4. 部署前端

- 方式一：托管到 GitHub Pages
- 方式二：Cloudflare Pages
- 方式三：任意静态托管

## 项目结构

```
image-background-remove/
├── index.html      # 前端页面
├── worker.mjs      # Cloudflare Workers 后端
└── README.md
```

## 注意事项

- 文件大小限制: ≤ 10MB
- 支持格式: JPG, PNG
- 免费 API 额度: 50张/月

---

Made with ❤️
