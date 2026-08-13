// ============================================================
// rpg.js —— 像素 RPG 地图引擎（Canvas 瓦片 / 移动 / 碰撞 / 交互）
// ============================================================
import { MAP_ROWS, TILE, INTERACTIONS, PLAYER_START } from './data.js';

export function createRPG(container, onInteract){
  const grid = MAP_ROWS.map(r => r.split(''));
  const GW = grid[0].length, GH = grid.length;
  const W = GW * TILE, H = GH * TILE;

  const canvas = document.createElement('canvas');
  canvas.id = 'rpg-canvas';
  const wrap = document.createElement('div');
  wrap.className = 'rpg-wrap';
  wrap.appendChild(canvas);

  const hud = el('div', 'rpg-hud', '');
  const hint = el('div', 'rpg-hint', '方向键 / WASD 移动 · 空格 交互 · ESC 返回');
  const back = el('button', 'rpg-back', '返回 ›');
  back.onclick = () => onInteract('__exit');
  const prompt = el('div', 'rpg-prompt', '');
  prompt.style.display = 'none';
  const joy = el('div', 'joystick', ''); const stick = el('div', 'stick', ''); joy.appendChild(stick);
  const interactBtn = el('button', 'rpg-interact-btn', '交');
  wrap.append(hud, hint, back, prompt, joy, interactBtn);

  // 对话/站点弹窗
  const dlg = el('div', 'dlg-box', '');
  wrap.appendChild(dlg);

  container.appendChild(wrap);
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  // 玩家
  const player = {
    tx: PLAYER_START.x, ty: PLAYER_START.y,
    px: PLAYER_START.x * TILE, py: PLAYER_START.y * TILE,
    moving: false, fromX: 0, fromY: 0, toX: 0, toY: 0, t: 0, dir: 'down', bob: 0
  };
  let currentInteract = null;
  const keys = {};
  let raf = null, last = 0, running = false;
  const MOVE_MS = 150;
  let sectColor = '#2c5f7c', sectAccent = '#5a8a6a';

  function setSect(c, a){ sectColor = c; sectAccent = a; }

  function resize(){
    const cw = wrap.clientWidth, ch = wrap.clientHeight;
    const scale = Math.min(cw / W, ch / H);
    canvas.style.width = (W * scale) + 'px';
    canvas.style.height = (H * scale) + 'px';
    canvas.width = W; canvas.height = H;
  }

  function walkable(x, y){
    if(x < 0 || y < 0 || x >= GW || y >= GH) return false;
    const c = grid[y][x];
    return c === '.' || c === '=' || c === 'F';
  }

  function nearestInteract(){
    let best = null, bestD = 1.6;
    for(const it of INTERACTIONS){
      const d = Math.hypot(it.x - player.tx, it.y - player.ty);
      if(d < bestD){ bestD = d; best = it; }
    }
    return best;
  }

  function tryStep(dx, dy){
    if(player.moving) return;
    const nx = player.tx + dx, ny = player.ty + dy;
    player.dir = dirName(dx, dy);
    if(!walkable(nx, ny)) return;
    player.moving = true; player.t = 0;
    player.fromX = player.px; player.fromY = player.py;
    player.toX = nx * TILE; player.toY = ny * TILE;
    player.tx = nx; player.ty = ny;
  }

  function dirName(dx, dy){ return dy < 0 ? 'up' : dy > 0 ? 'down' : dx < 0 ? 'left' : 'right'; }

  // ---- 输入 ----
  const KEYMAP = {
    ArrowUp:[0,-1], ArrowDown:[0,1], ArrowLeft:[-1,0], ArrowRight:[1,0],
    w:[0,-1], s:[0,1], a:[-1,0], d:[1,0], W:[0,-1], S:[0,1], A:[-1,0], D:[1,0]
  };
  function onKey(e, down){
    if(KEYMAP[e.key]){
      keys[e.key] = down;
      if(down) e.preventDefault();
      return true;
    }
    if(down && (e.key === ' ' || e.key === 'e' || e.key === 'E')){
      e.preventDefault(); doInteract(); return true;
    }
    if(down && e.key === 'Escape'){ onInteract('__exit'); return true; }
    return false;
  }
  const kd = e => onKey(e, true), ku = e => onKey(e, false);
  window.addEventListener('keydown', kd); window.addEventListener('keyup', ku);

  // 摇杆
  let joyDir = null;
  function joyStart(e){ e.preventDefault(); joyActive = true; joyMove(e); }
  let joyActive = false;
  function joyMove(e){
    if(!joyActive) return; e.preventDefault();
    const r = joy.getBoundingClientRect();
    const t = (e.touches ? e.touches[0] : e);
    let dx = t.clientX - (r.left + r.width/2);
    let dy = t.clientY - (r.top + r.height/2);
    const max = r.width/2;
    const len = Math.hypot(dx, dy) || 1;
    const cl = Math.min(len, max);
    stick.style.left = (r.width/2 + dx/len*cl - 23) + 'px';
    stick.style.top = (r.height/2 + dy/len*cl - 23) + 'px';
    if(Math.abs(dx) > Math.abs(dy)) joyDir = dx > 0 ? 'right' : 'left';
    else joyDir = dy > 0 ? 'down' : 'up';
  }
  function joyEnd(){ joyActive = false; joyDir = null; stick.style.left = '50%'; stick.style.top = '50%'; stick.style.margin = '-23px 0 0 -23px'; }
  joy.addEventListener('touchstart', joyStart); joy.addEventListener('touchmove', joyMove);
  joy.addEventListener('touchend', joyEnd); joy.addEventListener('mousedown', joyStart);
  joy.addEventListener('mousemove', e => joyActive && joyMove(e)); window.addEventListener('mouseup', joyEnd);
  interactBtn.addEventListener('click', doInteract);

  function doInteract(){
    if(currentInteract){ onInteract(currentInteract.type, currentInteract); }
  }

  // ---- 主循环 ----
  function frame(ts){
    if(!running) return;
    const dt = ts - last; last = ts;
    // 输入 → 移动
    let dx = 0, dy = 0;
    if(joyDir === 'left') dx = -1; else if(joyDir === 'right') dx = 1;
    else if(joyDir === 'up') dy = -1; else if(joyDir === 'down') dy = 1;
    else {
      for(const k in keys){ if(keys[k]){ const m = KEYMAP[k]; dx += m[0]; dy += m[1]; } }
    }
    if((dx || dy) && !player.moving){ tryStep(Math.sign(dx), Math.sign(dy)); }
    if(player.moving){
      player.t += dt / MOVE_MS;
      if(player.t >= 1){ player.t = 1; player.moving = false;
        player.px = player.toX; player.py = player.toY; }
      else {
        player.px = player.fromX + (player.toX - player.fromX) * ease(player.t);
        player.py = player.fromY + (player.toY - player.fromY) * ease(player.t);
        player.bob = Math.sin(player.t * Math.PI) * 3;
      }
    }
    // 交互提示
    const ni = nearestInteract();
    currentInteract = ni;
    if(ni){ prompt.style.display = 'block'; prompt.textContent = '▶ ' + ni.label + '（空格交互）'; }
    else prompt.style.display = 'none';

    render();
    raf = requestAnimationFrame(frame);
  }
  function ease(t){ return t < .5 ? 2*t*t : 1 - Math.pow(-2*t+2,2)/2; }

  function render(){
    ctx.clearRect(0,0,W,H);
    // 背景天空
    const g = ctx.createLinearGradient(0,0,0,H);
    g.addColorStop(0, '#1a2740'); g.addColorStop(1, '#0e1626');
    ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
    // 瓦片
    for(let y=0;y<GH;y++) for(let x=0;x<GW;x++){
      drawTile(grid[y][x], x*TILE, y*TILE);
    }
    // 交互标记
    for(const it of INTERACTIONS){
      const px = it.x*TILE, py = it.y*TILE;
      ctx.save();
      ctx.globalAlpha = .9;
      ctx.fillStyle = it.type === 'npc' ? '#e0b34a' : '#d4a840';
      ctx.beginPath(); ctx.arc(px+TILE/2, py+TILE/2-6, 5, 0, 7); ctx.fill();
      ctx.globalAlpha = .35;
      ctx.fillStyle = '#d4a840';
      ctx.fillRect(px+8, py+TILE-10, TILE-16, 4);
      ctx.restore();
    }
    // NPC 形象（npc 类型画小人）
    for(const it of INTERACTIONS){
      if(it.type === 'npc') drawChar(it.x*TILE, it.y*TILE, it.npc === '童子' ? '#6fae84' : '#b8b0d0', 'down', 0);
    }
    // 玩家
    drawChar(player.px, player.py, sectColor, player.dir, -player.bob);
    // HUD 文字
    hud.textContent = `🧭 ${player.tx},${player.ty}`;
  }

  function drawTile(c, x, y){
    if(c === '#' || c === 'B'){ drawHouse(x, y, c === 'B'); return; }
    let base = '#27432f'; // 草
    if(c === '=') base = '#6b6450';
    if(c === '~') base = '#2a4a6c';
    if(c === 'F') base = '#27432f';
    ctx.fillStyle = base; ctx.fillRect(x, y, TILE, TILE);
    // 纹理
    ctx.fillStyle = 'rgba(0,0,0,.12)';
    if(c === '='){ ctx.fillRect(x, y+TILE/2, TILE, 2); }
    else if(c === '~'){ ctx.fillStyle = 'rgba(255,255,255,.15)'; ctx.fillRect(x+6, y+10, 10, 2); ctx.fillRect(x+22, y+26, 12, 2); }
    else if(c === '.'){ ctx.fillStyle = 'rgba(255,255,255,.05)'; ctx.fillRect(x+8, y+10, 4, 4); ctx.fillRect(x+28, y+28, 4, 4); }
    else if(c === 'F'){ ctx.fillStyle = '#d96a8a'; ctx.beginPath(); ctx.arc(x+TILE/2, y+TILE/2, 4, 0, 7); ctx.fill(); ctx.fillStyle='#e8c84a'; ctx.beginPath(); ctx.arc(x+TILE/2, y+TILE/2, 2, 0, 7); ctx.fill(); }
  }

  function drawHouse(x, y, isB){
    // 墙
    ctx.fillStyle = isB ? '#caa06a' : '#8a7a55';
    ctx.fillRect(x+4, y+14, TILE-8, TILE-16);
    ctx.fillStyle = 'rgba(0,0,0,.12)'; ctx.fillRect(x+4, y+14, TILE-8, 4);
    // 屋顶
    ctx.fillStyle = isB ? '#9c3b2e' : '#6f3b2e';
    ctx.beginPath(); ctx.moveTo(x, y+16); ctx.lineTo(x+TILE/2, y+2); ctx.lineTo(x+TILE, y+16); ctx.closePath(); ctx.fill();
    // 门
    ctx.fillStyle = '#3a2a1a'; ctx.fillRect(x+TILE/2-6, y+TILE-12, 12, 12);
    if(isB){ ctx.fillStyle = '#e8c84a'; ctx.fillRect(x+TILE/2-2, y+TILE-8, 4, 4); }
  }

  function drawChar(px, py, robe, dir, bob){
    const cx = px + TILE/2, feet = py + TILE - 4 + bob;
    // 影子
    ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(cx, py+TILE-2, 11, 4, 0, 0, 7); ctx.fill();
    // 腿
    ctx.fillStyle = '#3a2a1a'; ctx.fillRect(cx-6, feet-10, 4, 10); ctx.fillRect(cx+2, feet-10, 4, 10);
    // 袍
    ctx.fillStyle = robe; ctx.fillRect(cx-8, feet-22, 16, 14);
    ctx.fillStyle = 'rgba(255,255,255,.15)'; ctx.fillRect(cx-8, feet-22, 16, 3);
    // 头
    ctx.fillStyle = '#e8c9a0'; ctx.beginPath(); ctx.arc(cx, feet-28, 7, 0, 7); ctx.fill();
    // 发/冠
    ctx.fillStyle = '#2a2018'; ctx.fillRect(cx-7, feet-34, 14, 5);
    // 眼睛朝向
    ctx.fillStyle = '#1a1a1a';
    if(dir === 'down'){ ctx.fillRect(cx-3, feet-28, 2, 2); ctx.fillRect(cx+1, feet-28, 2, 2); }
    else if(dir === 'up'){ /* 后脑 */ }
    else if(dir === 'left'){ ctx.fillRect(cx-4, feet-28, 2, 2); }
    else if(dir === 'right'){ ctx.fillRect(cx+2, feet-28, 2, 2); }
  }

  function start(){
    if(running) return;
    running = true; last = performance.now();
    resize(); raf = requestAnimationFrame(frame);
  }
  function stop(){ running = false; if(raf) cancelAnimationFrame(raf); }
  window.addEventListener('resize', () => { if(running) resize(); });

  function destroy(){
    stop(); container.removeChild(wrap);
    window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku);
  }

  return { start, stop, destroy, setSect, resize };
}

function el(tag, cls, txt){ const e = document.createElement(tag); if(cls) e.className = cls; if(txt != null) e.textContent = txt; return e; }
