# 共创录 · AI素养修行RPG —— 开发文档（DEV）

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

## 6. 部署（生产）— 实际方案

目标：116.62.188.165，域名 accjg.areteailab.com。

实际服务器环境：80 端口由 **Nginx Proxy Manager（NPM，`jc21/nginx-proxy-manager`，docker 容器 `nginx-app`）** 接管，所有对外站点均经 NPM 反代。宿主机自带 nginx 未实际监听（端口被 docker-proxy 占用），故采用「宿主机静态服务 + NPM 反代」方案。

```bash
# 1) 上传静态产物（宿主机 /var/www/accjg）
tar czf - --exclude=.git . | ssh root@116.62.188.165 "mkdir -p /var/www/accjg && tar xzf - -C /var/www/accjg"

# 2) 宿主机用 systemd 启动静态服务（Python3.6 无 --directory，靠 WorkingDirectory）
#    /etc/systemd/system/accjg.service：
#    ExecStart=/usr/bin/python3 -m http.server 8099 --bind 0.0.0.0
#    WorkingDirectory=/var/www/accjg
systemctl daemon-reload && systemctl enable --now accjg.service

# 3) 在 NPM 的 proxy_host 配置（宿主机路径：
#    /clouddream/nginx-proxy-manage/data/nginx/proxy_host/accjg.conf）加入：
#    server { set $forward_scheme http; set $server "172.17.0.1"; set $port 8099;
#             listen 80; server_name accjg.areteailab.com;
#             location / { include conf.d/include/proxy.conf; } }
#    容器内执行：docker exec nginx-app nginx -s reload

# 4) 域名 A 记录已生效：accjg.areteailab.com -> 116.62.188.165（实测解析正常）
```

访问：http://accjg.areteailab.com （实测 HTTP 200，页面/资源均正常）

> 注：当前为 HTTP。如需 HTTPS，可在 NPM 面板为该 Proxy Host 申请 Let's Encrypt 证书（force SSL）。

---

## 7. 风险与 todo

- 内容准确性需教研复核（见 PRD §9）。
- HTTPS 为可选项，待用户在 NPM 申请证书后开启。
- 宿主机 nginx 与 NPM 共存：不要改宿主机 `/etc/nginx/conf.d/accjg.conf`（未被外部流量使用），以 NPM proxy_host 为准。
