# 单词魔法卡 (Word Magic Cards)

一个面向儿童的单词学习应用，采用前后端一体化架构。

## ✨ 功能特性

- 🗺️ **互动地图** - 游戏化的学习路径
- 📚 **单词魔法卡** - 精美的单词卡片展示
- 🎮 **学习挑战** - 记忆大挑战、字母消消乐等游戏
- 🏆 **排行榜** - 星级排名系统
- 👤 **个人中心** - 学习进度追踪

## 🛠️ 技术栈

### 前端
- **React 19** + **TypeScript**
- **Vite 6** - 快速构建工具
- **Tailwind CSS** - 原子化CSS

### 后端
- **Supabase** - PostgreSQL数据库
- **Row Level Security** - 数据安全策略

## 📦 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/your-username/word-magic.git
cd word-magic
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制 `.env.example` 为 `.env.local` 并填入您的Supabase配置：

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. 初始化数据库

在Supabase Dashboard的SQL Editor中执行：

```bash
database/init.sql
```

### 5. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 📁 项目结构

```
├── views/              # 视图组件
│   ├── MapView.tsx
│   ├── WordBookView.tsx
│   ├── WordDetailView.tsx
│   ├── LeaderboardView.tsx
│   └── ...
├── hooks/              # React Hooks
│   ├── useWords.ts
│   ├── useUser.ts
│   └── useLeaderboard.ts
├── services/           # API服务层
│   ├── wordService.ts
│   ├── userService.ts
│   └── leaderboardService.ts
├── database/           # 数据库脚本
│   ├── init.sql       # 完整初始化脚本
│   ├── schema.sql     # 表结构
│   └── seed.sql       # 初始数据
└── supabase.ts        # Supabase客户端配置
```

## 🗄️ 数据库结构

- **users** - 用户表
- **words** - 单词表
- **user_word_progress** - 用户学习进度表

## 🚀 部署

```bash
npm run build
```

构建产物在 `dist/` 目录下。

## 📝 License

MIT

## 🙏 致谢

感谢所有为这个项目做出贡献的人！
