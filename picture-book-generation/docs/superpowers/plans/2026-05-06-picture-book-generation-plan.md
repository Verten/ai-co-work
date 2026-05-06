# 儿童绘本生成器 - 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个儿童绘本生成 Web 应用，支持对话式和随机式生成绘本，用户可注册登录、保存历史作品、预览翻页和打印输出。

**Architecture:** 前后端分离架构，React 前端调用 Node.js/Express 后端 API，后端处理 MiniMax AI 调用和 SQLite 数据库存储。

**Tech Stack:** React (Vite), Node.js, Express, SQLite, MiniMax API

---

## 文件结构

```
picture-book-generation/
├── .env.example                 # 环境变量示例
├── .gitignore                   # Git 忽略配置
├── package.json                 # 根目录 package.json (monorepo)
├── client/                      # React 前端
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── api/                 # API 调用
│       │   └── index.js
│       ├── components/           # 组件
│       │   ├── HomePage.jsx
│       │   ├── ChatGeneratePage.jsx
│       │   ├── RandomGeneratePage.jsx
│       │   ├── PreviewPage.jsx
│       │   ├── LoginPage.jsx
│       │   ├── RegisterPage.jsx
│       │   └── ProfilePage.jsx
│       ├── context/             # React Context
│       │   └── AuthContext.jsx
│       └── pages/               # 页面组件
├── server/                      # Node.js 后端
│   ├── package.json
│   ├── index.js                 # Express 入口
│   ├── routes/
│   │   ├── auth.js              # 认证路由
│   │   ├── storybooks.js        # 绘本路由
│   │   └── generate.js          # 生成路由
│   ├── services/
│   │   ├── aiService.js         # MiniMax AI 服务
│   │   └── storyService.js      # 故事生成服务
│   ├── middleware/
│   │   └── auth.js              # 认证中间件
│   └── db/
│       ├── index.js             # 数据库初始化
│       └── schema.sql            # 数据库 schema
└── data/                        # SQLite 数据目录
```

---

## 任务列表

### Task 1: 项目初始化

**Files:**
- Create: `package.json` (根目录)
- Create: `client/package.json`
- Create: `client/vite.config.js`
- Create: `client/index.html`
- Create: `server/package.json`
- Create: `.env.example`
- Create: `.gitignore`

- [ ] **Step 1: 创建根目录 package.json**

```json
{
  "name": "picture-book-generation",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "concurrently \"npm run server\" \"npm run client\"",
    "server": "cd server && npm run dev",
    "client": "cd client && npm run dev",
    "install:all": "npm install && cd client && npm install && cd ../server && npm install"
  },
  "devDependencies": {
    "concurrently": "^8.2.0"
  }
}
```

- [ ] **Step 2: 创建 client/package.json**

```json
{
  "name": "picture-book-client",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0"
  }
}
```

- [ ] **Step 3: 创建 client/vite.config.js**

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
})
```

- [ ] **Step 4: 创建 client/index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>童话绘本生成器</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 5: 创建 server/package.json**

```json
{
  "name": "picture-book-server",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "node --watch index.js",
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "better-sqlite3": "^9.2.2",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  }
}
```

- [ ] **Step 6: 创建 .env.example**

```
MINIMAX_API_KEY=your_api_key_here
DATABASE_URL=./data/storybook.db
SESSION_SECRET=your_session_secret_here
PORT=3000
```

- [ ] **Step 7: 创建 .gitignore**

```
node_modules/
.env
data/
dist/
.DS_Store
```

- [ ] **Step 8: 提交**

```bash
git add package.json client/package.json client/vite.config.js client/index.html server/package.json .env.example .gitignore
git commit -m "chore: initial project structure"
```

---

### Task 2: 数据库初始化

**Files:**
- Create: `server/db/schema.sql`
- Create: `server/db/index.js`

- [ ] **Step 1: 创建 server/db/schema.sql**

```sql
-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 绘本表
CREATE TABLE IF NOT EXISTS storybooks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  story_config TEXT NOT NULL,
  pages TEXT NOT NULL,
  status TEXT DEFAULT 'generating',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

- [ ] **Step 2: 创建 server/db/index.js**

```javascript
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import schema from './schema.sql' assert { type: 'text' };

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, '../../data/storybook.db');

// 确保 data 目录存在
const dataDir = join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// 初始化 schema
db.exec(schema);

export default db;
```

- [ ] **Step 3: 提交**

```bash
git add server/db/schema.sql server/db/index.js
git commit -m "feat: add database schema and initialization"
```

---

### Task 3: 后端 - 认证 API

**Files:**
- Create: `server/middleware/auth.js`
- Create: `server/routes/auth.js`
- Modify: `server/index.js` (添加路由)

- [ ] **Step 1: 创建 server/middleware/auth.js**

```javascript
import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.SESSION_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export default authMiddleware;
```

- [ ] **Step 2: 创建 server/routes/auth.js**

```javascript
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db/index.js';

const router = express.Router();

// 注册
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // 检查用户是否存在
    const existing = db.prepare('SELECT id FROM users WHERE email = ? OR username = ?').get(email, username);
    if (existing) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // 密码哈希
    const passwordHash = await bcrypt.hash(password, 10);

    // 插入用户
    const result = db.prepare('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)').run(username, email, passwordHash);

    const token = jwt.sign(
      { id: result.lastInsertRowid, username, email },
      process.env.SESSION_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: result.lastInsertRowid, username, email } });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 登录
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.SESSION_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
```

- [ ] **Step 3: 创建 server/index.js**

```javascript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import storyRoutes from './routes/storybooks.js';
import generateRoutes from './routes/generate.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/storybooks', storyRoutes);
app.use('/api/generate', generateRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

- [ ] **Step 4: 提交**

```bash
git add server/middleware/auth.js server/routes/auth.js server/index.js
git commit -m "feat: add authentication API and routes"
```

---

### Task 4: 后端 - 绘本 CRUD API

**Files:**
- Create: `server/routes/storybooks.js`

- [ ] **Step 1: 创建 server/routes/storybooks.js**

```javascript
import express from 'express';
import authMiddleware from '../middleware/auth.js';
import db from '../db/index.js';

const router = express.Router();

// 获取用户的所有绘本
router.get('/', authMiddleware, (req, res) => {
  try {
    const storybooks = db.prepare(`
      SELECT id, title, status, created_at, updated_at
      FROM storybooks
      WHERE user_id = ?
      ORDER BY updated_at DESC
    `).all(req.user.id);

    res.json(storybooks);
  } catch (error) {
    console.error('Get storybooks error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 获取单个绘本详情
router.get('/:id', authMiddleware, (req, res) => {
  try {
    const storybook = db.prepare(`
      SELECT * FROM storybooks WHERE id = ? AND user_id = ?
    `).get(req.params.id, req.user.id);

    if (!storybook) {
      return res.status(404).json({ error: 'Storybook not found' });
    }

    // 解析 JSON 字段
    storybook.pages = JSON.parse(storybook.pages);
    storybook.story_config = JSON.parse(storybook.story_config);

    res.json(storybook);
  } catch (error) {
    console.error('Get storybook error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 创建新绘本
router.post('/', authMiddleware, (req, res) => {
  try {
    const { title, story_config, pages } = req.body;

    const result = db.prepare(`
      INSERT INTO storybooks (user_id, title, story_config, pages, status)
      VALUES (?, ?, ?, ?, 'generating')
    `).run(req.user.id, title, JSON.stringify(story_config), JSON.stringify(pages));

    res.json({ id: result.lastInsertRowid, status: 'generating' });
  } catch (error) {
    console.error('Create storybook error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 更新绘本
router.put('/:id', authMiddleware, (req, res) => {
  try {
    const { title, pages, status } = req.body;

    const storybook = db.prepare('SELECT * FROM storybooks WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
    if (!storybook) {
      return res.status(404).json({ error: 'Storybook not found' });
    }

    const updates = [];
    const values = [];

    if (title) {
      updates.push('title = ?');
      values.push(title);
    }
    if (pages) {
      updates.push('pages = ?');
      values.push(JSON.stringify(pages));
    }
    if (status) {
      updates.push('status = ?');
      values.push(status);
    }
    updates.push('updated_at = CURRENT_TIMESTAMP');

    values.push(req.params.id);
    values.push(req.user.id);

    db.prepare(`UPDATE storybooks SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`).run(...values);

    res.json({ success: true });
  } catch (error) {
    console.error('Update storybook error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 删除绘本
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const result = db.prepare('DELETE FROM storybooks WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Storybook not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Delete storybook error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
```

- [ ] **Step 2: 提交**

```bash
git add server/routes/storybooks.js
git commit -m "feat: add storybooks CRUD API"
```

---

### Task 5: 后端 - AI 服务

**Files:**
- Create: `server/services/aiService.js`

- [ ] **Step 1: 创建 server/services/aiService.js**

```javascript
const API_URL = 'https://api.minimaxi.com';

// 文本生成 (Anthropic 兼容格式)
export async function generateStoryText(messages) {
  const response = await fetch(`${API_URL}/anthropic/v1/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.MINIMAX_API_KEY}`
    },
    body: JSON.stringify({
      model: 'MiniMax-M2.7',
      messages,
      max_tokens: 2048,
      temperature: 0.8
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.base_resp?.status_msg || 'Text generation failed');
  }

  const data = await response.json();
  return data.content.find(c => c.type === 'text')?.text || '';
}

// 文生图
export async function generateImage(prompt, style = '漫画') {
  const response = await fetch(`${API_URL}/v1/image_generation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.MINIMAX_API_KEY}`
    },
    body: JSON.stringify({
      model: 'image-01',
      prompt,
      style: {
        style_type: style,
        style_weight: 0.8
      },
      aspect_ratio: '3:4',
      response_format: 'url',
      n: 1,
      prompt_optimizer: true
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.base_resp?.status_msg || 'Image generation failed');
  }

  const data = await response.json();
  return data.data.image_urls[0];
}
```

- [ ] **Step 2: 提交**

```bash
git add server/services/aiService.js
git commit -m "feat: add MiniMax AI service"
```

---

### Task 6: 后端 - 故事生成服务

**Files:**
- Create: `server/services/storyService.js`
- Create: `server/routes/generate.js`

- [ ] **Step 1: 创建 server/services/storyService.js**

```javascript
import { generateStoryText, generateImage } from './aiService.js';

// 构建系统提示词
function buildSystemPrompt() {
  return `你是一位专业的儿童绘本作家。请根据用户输入生成一个10页左右的儿童绘本故事。

要求：
1. 每页包含一段文字描述（适合3-8岁儿童）
2. 故事情节生动有趣，富有想象力
3. 故事要有起承转合：开头（介绍主角）→ 经过（遇到问题/挑战）→ 高潮（解决问题）→ 结尾（感悟/成长）
4. 每页的文字要简洁，适合大声朗读

请以JSON格式输出故事内容：
{
  "title": "绘本标题",
  "pages": [
    {"page_number": 1, "text": "第一页的文字描述"},
    {"page_number": 2, "text": "第二页的文字描述"},
    ...
  ]
}

只输出JSON，不要有其他内容。`;
}

// 构建用户提示词
function buildUserPrompt(config, mode) {
  if (mode === 'chat') {
    return `用户描述：${config.description}`;
  } else {
    return `请为一个${config.character}创作一本绘本。
主角：${config.character}
故事场景：${config.setting}
故事主题：${config.theme}
画风：${config.style}`;
  }
}

// 生成完整故事
export async function generateStory(config, mode = 'chat') {
  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(config, mode);

  const text = await generateStoryText([
    { role: 'user', content: userPrompt }
  ]);

  // 解析 JSON 响应
  let story;
  try {
    // 尝试提取 JSON 部分
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      story = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('No JSON found in response');
    }
  } catch (error) {
    console.error('Parse story JSON error:', error, 'Raw text:', text);
    throw new Error('Failed to parse story response');
  }

  // 为每一页生成图片
  const pagesWithImages = await Promise.all(
    story.pages.map(async (page) => {
      const imagePrompt = `儿童绘本插图：${page.text}，风格温馨可爱，适合3-8岁儿童观赏`;
      const imageUrl = await generateImage(imagePrompt, config.style || '漫画');
      return {
        ...page,
        image_url: imageUrl
      };
    })
  );

  return {
    title: story.title,
    pages: pagesWithImages
  };
}
```

- [ ] **Step 2: 创建 server/routes/generate.js**

```javascript
import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { generateStory } from '../services/storyService.js';
import db from '../db/index.js';

const router = express.Router();

// 对话生成故事
router.post('/chat', authMiddleware, async (req, res) => {
  try {
    const { description, style } = req.body;

    if (!description) {
      return res.status(400).json({ error: 'Description is required' });
    }

    const storyConfig = { description, style: style || '漫画' };

    // 创建绘本记录
    const result = db.prepare(`
      INSERT INTO storybooks (user_id, title, story_config, pages, status)
      VALUES (?, ?, ?, ?, 'generating')
    `).run(req.user.id, '生成中...', JSON.stringify(storyConfig), JSON.stringify([]));

    const storybookId = result.lastInsertRowid;

    try {
      // 生成故事
      const story = await generateStory(storyConfig, 'chat');

      // 更新绘本
      db.prepare(`
        UPDATE storybooks SET title = ?, pages = ?, status = 'completed', updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(story.title, JSON.stringify(story.pages), storybookId);

      res.json({
        id: storybookId,
        title: story.title,
        pages: story.pages,
        status: 'completed'
      });
    } catch (error) {
      // 生成失败，更新状态
      db.prepare(`UPDATE storybooks SET status = 'failed' WHERE id = ?`).run(storybookId);
      throw error;
    }
  } catch (error) {
    console.error('Chat generate error:', error);
    res.status(500).json({ error: error.message || 'Generation failed' });
  }
});

// 随机生成故事
router.post('/random', authMiddleware, async (req, res) => {
  try {
    const { character, setting, theme, style } = req.body;

    if (!character || !setting || !theme || !style) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const storyConfig = { character, setting, theme, style };

    // 创建绘本记录
    const result = db.prepare(`
      INSERT INTO storybooks (user_id, title, story_config, pages, status)
      VALUES (?, ?, ?, ?, 'generating')
    `).run(req.user.id, '生成中...', JSON.stringify(storyConfig), JSON.stringify([]));

    const storybookId = result.lastInsertRowid;

    try {
      // 生成故事
      const story = await generateStory(storyConfig, 'random');

      // 更新绘本
      db.prepare(`
        UPDATE storybooks SET title = ?, pages = ?, status = 'completed', updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(story.title, JSON.stringify(story.pages), storybookId);

      res.json({
        id: storybookId,
        title: story.title,
        pages: story.pages,
        status: 'completed'
      });
    } catch (error) {
      db.prepare(`UPDATE storybooks SET status = 'failed' WHERE id = ?`).run(storybookId);
      throw error;
    }
  } catch (error) {
    console.error('Random generate error:', error);
    res.status(500).json({ error: error.message || 'Generation failed' });
  }
});

export default router;
```

- [ ] **Step 3: 提交**

```bash
git add server/services/storyService.js server/routes/generate.js
git commit -m "feat: add story generation service and API"
```

---

### Task 7: 前端基础架构

**Files:**
- Create: `client/src/main.jsx`
- Create: `client/src/App.jsx`
- Create: `client/src/api/index.js`
- Create: `client/src/context/AuthContext.jsx`

- [ ] **Step 1: 创建 client/src/main.jsx**

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

- [ ] **Step 2: 创建 client/src/App.jsx**

```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import HomePage from './components/HomePage'
import ChatGeneratePage from './components/ChatGeneratePage'
import RandomGeneratePage from './components/RandomGeneratePage'
import PreviewPage from './components/PreviewPage'
import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage'
import ProfilePage from './components/ProfilePage'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" />
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<PrivateRoute><ChatGeneratePage /></PrivateRoute>} />
          <Route path="/random" element={<PrivateRoute><RandomGeneratePage /></PrivateRoute>} />
          <Route path="/preview/:id" element={<PrivateRoute><PreviewPage /></PrivateRoute>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
```

- [ ] **Step 3: 创建 client/src/api/index.js**

```javascript
const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

// Auth
export const auth = {
  login: (email, password) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }),
  register: (username, email, password) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password })
  })
}

// Storybooks
export const storybooks = {
  list: () => request('/storybooks'),
  get: (id) => request(`/storybooks/${id}`),
  create: (data) => request('/storybooks', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  delete: (id) => request(`/storybooks/${id}`, { method: 'DELETE' })
}

// Generate
export const generate = {
  chat: (description, style) => request('/generate/chat', {
    method: 'POST',
    body: JSON.stringify({ description, style })
  }),
  random: (config) => request('/generate/random', {
    method: 'POST',
    body: JSON.stringify(config)
  })
}
```

- [ ] **Step 4: 创建 client/src/context/AuthContext.jsx**

```jsx
import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = (token, userData) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
```

- [ ] **Step 5: 提交**

```bash
git add client/src/main.jsx client/src/App.jsx client/src/api/index.js client/src/context/AuthContext.jsx
git commit -m "feat: add frontend basic structure"
```

---

### Task 8: 前端 - 首页和认证页面

**Files:**
- Create: `client/src/components/HomePage.jsx`
- Create: `client/src/components/LoginPage.jsx`
- Create: `client/src/components/RegisterPage.jsx`

- [ ] **Step 1: 创建 client/src/components/HomePage.jsx**

```jsx
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './HomePage.css'

function HomePage() {
  const { user } = useAuth()

  return (
    <div className="home">
      <header className="hero">
        <h1>🐻 童话绘本生成器</h1>
        <p>用 AI 为孩子创作专属的精美绘本</p>
      </header>

      <div className="mode-selection">
        <Link to={user ? '/chat' : '/login'} className="mode-card">
          <span className="mode-icon">💬</span>
          <h2>对话生成</h2>
          <p>描述你的故事，我来帮你扩展成精美绘本</p>
        </Link>

        <Link to={user ? '/random' : '/login'} className="mode-card">
          <span className="mode-icon">🎲</span>
          <h2>随机生成</h2>
          <p>选择主角和场景，随机组合创作故事</p>
        </Link>
      </div>

      {user && (
        <div className="user-info">
          <span>欢迎，{user.username}</span>
          <Link to="/profile">我的绘本</Link>
        </div>
      )}
    </div>
  )
}

export default HomePage
```

- [ ] **Step 2: 创建 client/src/components/HomePage.css**

```css
.home {
  min-height: 100vh;
  padding: 40px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.hero {
  text-align: center;
  color: white;
  margin-bottom: 60px;
}

.hero h1 {
  font-size: 48px;
  margin-bottom: 16px;
}

.hero p {
  font-size: 20px;
  opacity: 0.9;
}

.mode-selection {
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
  max-width: 800px;
  margin: 0 auto;
}

.mode-card {
  background: white;
  border-radius: 24px;
  padding: 40px;
  width: 300px;
  text-align: center;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  transition: transform 0.3s, box-shadow 0.3s;
}

.mode-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

.mode-icon {
  font-size: 64px;
  display: block;
  margin-bottom: 20px;
}

.mode-card h2 {
  margin: 0 0 12px;
  font-size: 24px;
  color: #333;
}

.mode-card p {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
}

.user-info {
  text-align: center;
  margin-top: 40px;
  color: white;
}

.user-info a {
  color: white;
  margin-left: 20px;
  text-decoration: underline;
}
```

- [ ] **Step 3: 创建 client/src/components/LoginPage.jsx**

```jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { auth } from '../api'
import { useAuth } from '../context/AuthContext'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await auth.login(email, password)
      login(data.token, data.user)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>登录</h1>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>邮箱</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? '登录中...' : '登录'}
          </button>
        </form>
        <p>
          还没有账号？<Link to="/register">注册</Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
```

- [ ] **Step 4: 创建 client/src/components/RegisterPage.jsx**

```jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { auth } from '../api'
import { useAuth } from '../context/AuthContext'

function RegisterPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await auth.register(username, email, password)
      login(data.token, data.user)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>注册</h1>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>用户名</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>邮箱</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? '注册中...' : '注册'}
          </button>
        </form>
        <p>
          已有账号？<Link to="/login">登录</Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
```

- [ ] **Step 5: 添加认证页面样式**

```css
/* client/src/components/AuthPage.css */
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.auth-card {
  background: white;
  border-radius: 24px;
  padding: 40px;
  width: 400px;
  max-width: 90%;
}

.auth-card h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #666;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 16px;
  box-sizing: border-box;
}

.auth-card button {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
}

.auth-card button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-card p {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.auth-card a {
  color: #667eea;
  text-decoration: none;
}

.error {
  background: #fee;
  color: #c00;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
}
```

- [ ] **Step 6: 提交**

```bash
git add client/src/components/HomePage.jsx client/src/components/HomePage.css client/src/components/LoginPage.jsx client/src/components/RegisterPage.jsx client/src/components/AuthPage.css
git commit -m "feat: add home page and auth pages"
```

---

### Task 9: 前端 - 对话生成页面

**Files:**
- Create: `client/src/components/ChatGeneratePage.jsx`

- [ ] **Step 1: 创建 client/src/components/ChatGeneratePage.jsx**

```jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { generate } from '../api'
import './ChatGeneratePage.css'

const STYLE_OPTIONS = [
  { value: '漫画', label: '漫画' },
  { value: '元气', label: '元气' },
  { value: '中世纪', label: '中世纪' },
  { value: '水彩', label: '水彩' }
]

function ChatGeneratePage() {
  const [step, setStep] = useState(0)
  const [character, setCharacter] = useState('')
  const [setting, setSetting] = useState('')
  const [theme, setTheme] = useState('')
  const [style, setStyle] = useState('漫画')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const steps = [
    { key: 'character', label: '主角', options: ['小女孩', '小男孩', '小熊', '小兔', '小狗', '小猫', '机器人', '小马'] },
    { key: 'setting', label: '场景', options: ['森林', '海底', '太空', '城市', '农场', '学校', '城堡', '丛林'] },
    { key: 'theme', label: '主题', options: ['冒险', '友情', '成长', '幽默', '勇气', '亲情', '智慧', '感恩'] }
  ]

  const handleOptionSelect = (key, value) => {
    switch (key) {
      case 'character': setCharacter(value); break
      case 'setting': setSetting(value); break
      case 'theme': setTheme(value); break
    }
    setStep(step + 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const fullDescription = `主角是${character}，在${setting}，发生了关于${theme}的故事。${description}`

    try {
      const result = await generate.chat(fullDescription, style)
      navigate(`/preview/${result.id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const currentStep = steps[step]

  return (
    <div className="chat-generate">
      <header className="header">
        <button onClick={() => navigate('/')} className="back-btn">← 返回</button>
        <h1>💬 对话生成</h1>
      </header>

      <div className="progress-bar">
        <div className="progress" style={{ width: `${((step + 1) / (steps.length + 1)) * 100}%` }}></div>
      </div>

      <div className="content">
        {step < steps.length && (
          <>
            <h2>第 {step + 1} 步：选择{currentStep.label}</h2>
            <div className="options-grid">
              {currentStep.options.map((option) => (
                <button
                  key={option}
                  className="option-btn"
                  onClick={() => handleOptionSelect(currentStep.key, option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </>
        )}

        {step === steps.length && (
          <form onSubmit={handleSubmit} className="final-form">
            <h2>最后一步：补充故事描述</h2>

            <div className="summary">
              <p><strong>主角：</strong>{character}</p>
              <p><strong>场景：</strong>{setting}</p>
              <p><strong>主题：</strong>{theme}</p>
            </div>

            <div className="style-select">
              <label>选择画风</label>
              <div className="style-options">
                {STYLE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`style-btn ${style === opt.value ? 'active' : ''}`}
                    onClick={() => setStyle(opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>还想补充什么？（选填）</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="例如：希望故事有一个温馨的结局..."
                rows={4}
              />
            </div>

            {error && <div className="error">{error}</div>}

            <button type="submit" className="generate-btn" disabled={loading}>
              {loading ? '✨ 生成中...' : '✨ 开始生成绘本'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default ChatGeneratePage
```

- [ ] **Step 2: 创建 CSS 样式**

```css
/* client/src/components/ChatGeneratePage.css */
.chat-generate {
  min-height: 100vh;
  background: #f8f9fa;
}

.header {
  background: white;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.back-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #667eea;
}

.header h1 {
  flex: 1;
  text-align: center;
  margin: 0;
  font-size: 24px;
}

.progress-bar {
  height: 4px;
  background: #e0e0e0;
}

.progress {
  height: 100%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  transition: width 0.3s;
}

.content {
  max-width: 600px;
  margin: 40px auto;
  padding: 0 20px;
}

.content h2 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

.option-btn {
  padding: 20px;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.option-btn:hover {
  border-color: #667eea;
  background: #f0f0ff;
}

.final-form {
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.summary {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.summary p {
  margin: 8px 0;
}

.style-select {
  margin-bottom: 20px;
}

.style-select label {
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
}

.style-options {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.style-btn {
  padding: 10px 20px;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 20px;
  cursor: pointer;
}

.style-btn.active {
  border-color: #667eea;
  background: #667eea;
  color: white;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #666;
}

.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 16px;
  resize: vertical;
  box-sizing: border-box;
}

.generate-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
}

.generate-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  background: #fee;
  color: #c00;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
}
```

- [ ] **Step 3: 提交**

```bash
git add client/src/components/ChatGeneratePage.jsx client/src/components/ChatGeneratePage.css
git commit -m "feat: add chat generation page"
```

---

### Task 10: 前端 - 随机生成页面

**Files:**
- Create: `client/src/components/RandomGeneratePage.jsx`

- [ ] **Step 1: 创建 client/src/components/RandomGeneratePage.jsx**

```jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { generate } from '../api'
import './RandomGeneratePage.css'

const OPTIONS = {
  character: ['小女孩', '小男孩', '小熊', '小兔', '小狗', '小猫', '机器人', '小马', '独角兽', '小狐狸'],
  setting: ['森林', '海底', '太空', '城市', '农场', '学校', '城堡', '丛林', '沙漠', '北极'],
  theme: ['冒险', '友情', '成长', '幽默', '勇气', '亲情', '智慧', '感恩', '环保', '分享'],
  style: ['漫画', '元气', '中世纪', '水彩']
}

function RandomGeneratePage() {
  const [character, setCharacter] = useState('')
  const [setting, setSetting] = useState('')
  const [theme, setTheme] = useState('')
  const [style, setStyle] = useState('漫画')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleRandom = (key) => {
    const opts = OPTIONS[key]
    const random = opts[Math.floor(Math.random() * opts.length)]
    switch (key) {
      case 'character': setCharacter(random); break
      case 'setting': setSetting(random); break
      case 'theme': setTheme(random); break
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!character || !setting || !theme) {
      setError('请先选择所有选项')
      return
    }
    setError('')
    setLoading(true)

    try {
      const result = await generate.random({ character, setting, theme, style })
      navigate(`/preview/${result.id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="random-generate">
      <header className="header">
        <button onClick={() => navigate('/')} className="back-btn">← 返回</button>
        <h1>🎲 随机生成</h1>
      </header>

      <div className="content">
        <form onSubmit={handleSubmit} className="config-form">
          <div className="config-item">
            <label>主角</label>
            <div className="config-row">
              <div className="options-scroll">
                {OPTIONS.character.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={`option-chip ${character === opt ? 'active' : ''}`}
                    onClick={() => setCharacter(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <button type="button" className="random-btn" onClick={() => handleRandom('character')}>🎲</button>
            </div>
          </div>

          <div className="config-item">
            <label>场景</label>
            <div className="config-row">
              <div className="options-scroll">
                {OPTIONS.setting.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={`option-chip ${setting === opt ? 'active' : ''}`}
                    onClick={() => setSetting(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <button type="button" className="random-btn" onClick={() => handleRandom('setting')}>🎲</button>
            </div>
          </div>

          <div className="config-item">
            <label>主题</label>
            <div className="config-row">
              <div className="options-scroll">
                {OPTIONS.theme.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={`option-chip ${theme === opt ? 'active' : ''}`}
                    onClick={() => setTheme(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <button type="button" className="random-btn" onClick={() => handleRandom('theme')}>🎲</button>
            </div>
          </div>

          <div className="config-item">
            <label>画风</label>
            <div className="style-options">
              {OPTIONS.style.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className={`option-chip style ${style === opt ? 'active' : ''}`}
                  onClick={() => setStyle(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {error && <div className="error">{error}</div>}

          <button type="submit" className="generate-btn" disabled={loading || !character || !setting || !theme}>
            {loading ? '✨ 生成中...' : '✨ 生成绘本'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default RandomGeneratePage
```

- [ ] **Step 2: 创建 CSS**

```css
/* client/src/components/RandomGeneratePage.css */
.random-generate {
  min-height: 100vh;
  background: #f8f9fa;
}

.header {
  background: white;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.back-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #667eea;
}

.header h1 {
  flex: 1;
  text-align: center;
  margin: 0;
  font-size: 24px;
}

.content {
  max-width: 700px;
  margin: 40px auto;
  padding: 0 20px;
}

.config-form {
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.config-item {
  margin-bottom: 30px;
}

.config-item label {
  display: block;
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 12px;
}

.config-row {
  display: flex;
  gap: 12px;
  align-items: center;
}

.options-scroll {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.option-chip {
  padding: 10px 16px;
  background: #f0f0f0;
  border: 2px solid transparent;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.option-chip:hover {
  background: #e0e0ff;
}

.option-chip.active {
  background: #667eea;
  color: white;
}

.option-chip.style {
  padding: 12px 24px;
  font-size: 16px;
}

.random-btn {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #f093fb, #f5576c);
  border: none;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  transition: transform 0.2s;
}

.random-btn:hover {
  transform: scale(1.1);
}

.generate-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 20px;
}

.generate-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  background: #fee;
  color: #c00;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
}
```

- [ ] **Step 3: 提交**

```bash
git add client/src/components/RandomGeneratePage.jsx client/src/components/RandomGeneratePage.css
git commit -m "feat: add random generation page"
```

---

### Task 11: 前端 - 绘本预览页面

**Files:**
- Create: `client/src/components/PreviewPage.jsx`

- [ ] **Step 1: 创建 client/src/components/PreviewPage.jsx**

```jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { storybooks } from '../api'
import './PreviewPage.css'

function PreviewPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [storybook, setStorybook] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadStorybook()
  }, [id])

  const loadStorybook = async () => {
    try {
      const data = await storybooks.get(id)
      setStorybook(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return <div className="loading">加载中...</div>
  }

  if (error) {
    return <div className="error">错误: {error}</div>
  }

  if (!storybook || !storybook.pages || storybook.pages.length === 0) {
    return <div className="error">绘本内容为空</div>
  }

  const totalPages = storybook.pages.length

  return (
    <div className="preview">
      <header className="header">
        <button onClick={() => navigate('/profile')} className="back-btn">← 返回</button>
        <h1>{storybook.title}</h1>
        <div className="actions">
          <button onClick={handlePrint} className="action-btn">🖨️ 打印</button>
        </div>
      </header>

      <div className="book-container">
        <button
          className="nav-btn prev"
          onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
        >
          ◀
        </button>

        <div className="book">
          <div className="page">
            <div className="page-indicator">第 {currentPage + 1} / {totalPages} 页</div>
            <div className="page-image">
              {storybook.pages[currentPage].image_url ? (
                <img src={storybook.pages[currentPage].image_url} alt={`Page ${currentPage + 1}`} />
              ) : (
                <div className="image-placeholder">图片加载中...</div>
              )}
            </div>
            <div className="page-text">
              {storybook.pages[currentPage].text}
            </div>
          </div>
        </div>

        <button
          className="nav-btn next"
          onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
          disabled={currentPage === totalPages - 1}
        >
          ▶
        </button>
      </div>

      <div className="page-dots">
        {storybook.pages.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentPage ? 'active' : ''}`}
            onClick={() => setCurrentPage(index)}
          />
        ))}
      </div>

      <div className="thumbnails">
        {storybook.pages.map((page, index) => (
          <div
            key={index}
            className={`thumbnail ${index === currentPage ? 'active' : ''}`}
            onClick={() => setCurrentPage(index)}
          >
            <span>{index + 1}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PreviewPage
```

- [ ] **Step 2: 创建 CSS**

```css
/* client/src/components/PreviewPage.css */
.preview {
  min-height: 100vh;
  background: #fef9e7;
  display: flex;
  flex-direction: column;
}

.header {
  background: white;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.back-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #667eea;
}

.header h1 {
  flex: 1;
  text-align: center;
  margin: 0;
  font-size: 24px;
}

.actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  padding: 10px 16px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.book-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  gap: 20px;
}

.nav-btn {
  width: 50px;
  height: 50px;
  background: white;
  border: none;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: all 0.2s;
}

.nav-btn:hover:not(:disabled) {
  background: #667eea;
  color: white;
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.book {
  background: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 4px 30px rgba(0,0,0,0.15);
  max-width: 500px;
  width: 100%;
}

.page {
  min-height: 500px;
}

.page-indicator {
  text-align: center;
  color: #999;
  font-size: 14px;
  margin-bottom: 15px;
}

.page-image {
  background: #f5f5f5;
  border-radius: 8px;
  height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  overflow: hidden;
}

.page-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.image-placeholder {
  color: #999;
}

.page-text {
  font-size: 18px;
  line-height: 1.8;
  text-align: center;
  color: #333;
}

.page-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 20px;
}

.dot {
  width: 10px;
  height: 10px;
  background: #ddd;
  border: none;
  border-radius: 50%;
  cursor: pointer;
}

.dot.active {
  background: #667eea;
}

.thumbnails {
  display: flex;
  justify-content: center;
  gap: 10px;
  padding: 20px;
  background: white;
  flex-wrap: wrap;
}

.thumbnail {
  width: 40px;
  height: 40px;
  background: #f0f0f0;
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #666;
}

.thumbnail.active {
  border-color: #667eea;
  background: #e8f4fd;
}

.loading, .error {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-size: 18px;
}

.error {
  color: #c00;
}

@media print {
  .header, .nav-btn, .page-dots, .thumbnails {
    display: none !important;
  }

  .book-container {
    padding: 0;
  }

  .book {
    box-shadow: none;
    max-width: none;
  }
}
```

- [ ] **Step 3: 提交**

```bash
git add client/src/components/PreviewPage.jsx client/src/components/PreviewPage.css
git commit -m "feat: add preview page with flip effect"
```

---

### Task 12: 前端 - 用户中心页面

**Files:**
- Create: `client/src/components/ProfilePage.jsx`

- [ ] **Step 1: 创建 client/src/components/ProfilePage.jsx**

```jsx
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { storybooks } from '../api'
import { useAuth } from '../context/AuthContext'
import './ProfilePage.css'

function ProfilePage() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    loadList()
  }, [])

  const loadList = async () => {
    try {
      const data = await storybooks.list()
      setList(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('确定要删除这个绘本吗？')) return
    try {
      await storybooks.delete(id)
      setList(list.filter(item => item.id !== id))
    } catch (err) {
      alert('删除失败: ' + err.message)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed': return <span className="badge success">已完成</span>
      case 'generating': return <span className="badge warning">生成中</span>
      case 'failed': return <span className="badge error">失败</span>
      default: return <span className="badge">{status}</span>
    }
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return <div className="loading">加载中...</div>
  }

  return (
    <div className="profile">
      <header className="header">
        <button onClick={() => navigate('/')} className="back-btn">← 返回首页</button>
        <h1>📚 我的绘本</h1>
        <button onClick={handleLogout} className="logout-btn">退出</button>
      </header>

      <div className="user-welcome">
        <span>欢迎，{user?.username}</span>
      </div>

      {error && <div className="error">{error}</div>}

      {list.length === 0 ? (
        <div className="empty">
          <p>还没有绘本，</p>
          <Link to="/" className="create-link">去创建一个</Link>
        </div>
      ) : (
        <div className="storybook-list">
          {list.map((item) => (
            <div key={item.id} className="storybook-item">
              <div className="item-info">
                <h3>{item.title}</h3>
                <div className="item-meta">
                  {getStatusBadge(item.status)}
                  <span className="date">{formatDate(item.created_at)}</span>
                </div>
              </div>
              <div className="item-actions">
                {item.status === 'completed' && (
                  <button onClick={() => navigate(`/preview/${item.id}`)} className="view-btn">
                    查看
                  </button>
                )}
                <button onClick={() => handleDelete(item.id)} className="delete-btn">
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProfilePage
```

- [ ] **Step 2: 创建 CSS**

```css
/* client/src/components/ProfilePage.css */
.profile {
  min-height: 100vh;
  background: #f8f9fa;
}

.header {
  background: white;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.back-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #667eea;
}

.header h1 {
  flex: 1;
  text-align: center;
  margin: 0;
  font-size: 24px;
}

.logout-btn {
  padding: 8px 16px;
  background: #f5576c;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.user-welcome {
  padding: 20px;
  text-align: center;
  color: #666;
}

.storybook-list {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 20px 40px;
}

.storybook-item {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.item-info h3 {
  margin: 0 0 8px;
  font-size: 18px;
  color: #333;
}

.item-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
}

.badge.success {
  background: #e8f5e9;
  color: #4caf50;
}

.badge.warning {
  background: #fff3e0;
  color: #ff9800;
}

.badge.error {
  background: #ffebee;
  color: #f44336;
}

.date {
  color: #999;
  font-size: 14px;
}

.item-actions {
  display: flex;
  gap: 10px;
}

.view-btn {
  padding: 8px 16px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.delete-btn {
  padding: 8px 16px;
  background: #f5576c;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.empty {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.create-link {
  color: #667eea;
  text-decoration: none;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-size: 18px;
}

.error {
  background: #fee;
  color: #c00;
  padding: 12px;
  margin: 20px;
  border-radius: 8px;
  text-align: center;
}
```

- [ ] **Step 3: 提交**

```bash
git add client/src/components/ProfilePage.jsx client/src/components/ProfilePage.css
git commit -m "feat: add profile page"
```

---

### Task 13: 集成测试

**Files:**
- Modify: `client/src/App.jsx` (导入所有样式)

- [ ] **Step 1: 更新 App.jsx 导入所有样式**

```jsx
import './components/HomePage.css'
import './components/AuthPage.css'
import './components/ChatGeneratePage.css'
import './components/RandomGeneratePage.css'
import './components/PreviewPage.css'
import './components/ProfilePage.css'
```

- [ ] **Step 2: 安装依赖并测试**

```bash
# 安装根目录依赖
npm install

# 安装服务端依赖
cd server && npm install

# 安装客户端依赖
cd ../client && npm install
```

- [ ] **Step 3: 提交**

```bash
git add client/src/App.jsx
git commit -m "chore: import all styles in App"
```

---

## 自检清单

### Spec 覆盖检查

| 设计需求 | 实现位置 |
|---------|---------|
| 首页卡片式选择 | Task 8: HomePage.jsx |
| 对话生成引导式 | Task 9: ChatGeneratePage.jsx |
| 随机生成要素选择 | Task 10: RandomGeneratePage.jsx |
| 翻页预览+打印 | Task 11: PreviewPage.jsx |
| 用户登录注册 | Task 8: LoginPage/RegisterPage |
| 绘本 CRUD | Task 4: storybooks routes |
| AI 文本生成 | Task 5: aiService.js |
| AI 文生图 | Task 5: aiService.js |
| 数据库持久化 | Task 2: db schema |

### 占位符检查
- 无 TBD/TODO
- 无"实现后续"等模糊描述
- 所有代码块完整

### 类型一致性
- API 响应格式在前后端一致
- 数据库 schema 与后端代码匹配

---

## 执行选项

**Plan complete and saved to `docs/superpowers/plans/2026-05-06-picture-book-generation-plan.md`.**

**Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
