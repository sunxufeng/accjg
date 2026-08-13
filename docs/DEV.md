# 共创录 · 初中AI素养修行RPG —— 开发文档（DEV）

> 版本：v1.0 ｜ 日期：2026-08-13

---

## 1. 技术选型

| 项 | 选择 | 理由 |
| --- | --- | --- |
| 语言 | 原生 HTML + CSS + JavaScript（ES Module） | 零构建、纯静态、易部署 |
| 地图引擎 | Canvas 2D 自绘瓦片 | 无外部图片资源，像素风用色块绘制 |
| 状态管理 | 单例 `GameState` + 发布订阅（`emit/on`） | 轻量、解耦 UI 与逻辑 |
| 持久化 | `localStorage`（key: `accjg_save_v1`） | 无需后端 |
| 字体 | Google Fonts（Ma Shan Zheng / ZCOOL XiaoWei / Noto Serif SC） | 水墨风 |
| 音效 | WebAudio 合成（无音频文件） | 可开关、零资源 |

---

## 2. 目录结构

```
accjg/
├─ index.html              # 结构：所有视图与弹窗骨架
├─ css/
│  ├─ base.css             # 变量、reset、水墨/像素主题、通用组件
│  └─ components.css       # 各视图/弹窗样式
├─ js/
│  ├─ data.js              # 全部内容数据（题/典籍/文献/技能/NPC/成就/门派）
│  ├─ state.js             # 状态、存档、境界/资源算法、事件总线
│  ├─ rpg.js               # Canvas 地图引擎（瓦片/移动/碰撞/交互/NPC）
│  ├─ ui.js                # 视图切换、弹窗、HUD、导航、各页渲染
│  └─ main.js              # 入口：初始化、绑定、创角流程
└─ docs/                   # PRD / DESIGN / DEV
```

---

## 3. 模块职责

- **state.js**：`load()/save()/reset()`；`addExp()/addSpirit()` 含境界突破判定；`bus` 事件总线（`change` 事件驱动 HUD 刷新）。
- **rpg.js**：`TileMap`（二维数组）、`render()` 循环、`update()` 输入、`collide()`、`interact()`；移动端摇杆事件映射为方向。
- **ui.js**：`showView(name)`、`openModal()/closeModal()`、`renderTasks/Skills/Daily/Reading/Library/Community/Achievements`、`renderHUD()`。
- **data.js**：纯数据，便于教研替换与扩展。

---

## 4. 数据模型（localStorage）

```json
{
  "v": 1,
  "profile": { "name": "青衫", "sect": "算法门", "avatarSeed": 12345, "createdAt": 0 },
  "realm": { "level": 0, "exp": 0 },
  "spirit": 50, "insight": 0,
  "streak": { "days": 1, "lastDate": "2026-08-13" },
  "tasks": {}, "skills": {}, "reading": {},
  "daily": { "date": "", "answered": false, "correct": false },
  "achievements": {}, "settings": { "theme": "ink", "sound": true }
}
```

境界阈值（修为）：练气0→筑基100→金丹300→元婴700→化神1500→炼虚3000→合体6000→大乘12000→渡劫(满)。

---

## 5. 构建与本地预览

```bash
cd accjg
python3 -m http.server 8080   # 或 npx serve
# 浏览器访问 http://localhost:8080
```

无打包步骤；ES Module 直接由浏览器加载（`index.html` 用 `<script type="module">`）。

---

## 6. 部署（生产）

目标：116.62.188.165，域名 accjg.areteailab.com，Nginx 托管静态文件。

```bash
# 本地构建产物即 accjg/ 根目录（静态）
rsync -az --delete ./ root@116.62.188.165:/var/www/accjg/

# 服务端（root@116.62.188.165, 密码 season69130!）
# 1) 安装 nginx（若未装）
# 2) 写入 /etc/nginx/conf.d/accjg.conf：
server {
  listen 80;
  server_name accjg.areteailab.com;
  root /var/www/accjg;
  index index.html;
  location / { try_files $uri $uri/ /index.html; }
  gzip on;
}
# 3) nginx -t && systemctl reload nginx
# 4) 域名解析 A 记录指向 116.62.188.165（在域名控制台配置）
```

HTTPS（可选）：`certbot --nginx -d accjg.areteailab.com`。

---

## 7. 风险与 todo

- 域名 A 记录需用户在 DNS 控制台配置（我方无法改 DNS）。
- 服务器 SSH 可达性需在部署阶段实测；不可达则回退为本地构建产物交付 + 部署说明。
- 内容准确性需教研复核（见 PRD §9）。
