// ============================================================
// ui.js —— 视图 / 导航 / 弹窗 / HUD / 各功能页渲染
// ============================================================
import {
  getState, getSect, addExp, addSpirit, addInsight, today,
  answerDaily, recordReading, recordLundao, taskStatus, setTaskStatus,
  unlockSkill, skillBonus, realmName, expToNext, checkAchievements,
  bus, setSetting, refreshStreak, save
} from './state.js';
import {
  QUESTIONS, READINGS, LIBRARY, SKILLS, TASKS, SECTS, DIM_META,
  ACHIEVEMENTS, REALMS, INTERACTIONS
} from './data.js';
import { drawAvatar } from './avatar.js';
import { createRPG } from './rpg.js';

let rpg = null;
let currentView = 'home';

// ---------- 工具 ----------
function esc(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function $(id){ return document.getElementById(id); }
function el(tag, cls, txt){ const e = document.createElement(tag); if(cls) e.className = cls; if(txt!=null) e.textContent = txt; return e; }

let toastTimer = null;
export function toast(msg){
  const t = $('toast'); t.textContent = msg; t.classList.remove('hidden');
  clearTimeout(toastTimer); toastTimer = setTimeout(()=>t.classList.add('hidden'), 2200);
}

// ---------- 模态 ----------
let modalEl = null;
export function openModal({ title, bodyHTML, onMount }){
  closeModal();
  const overlay = el('div', 'modal-overlay');
  overlay.innerHTML = `<div class="modal"><div class="modal-head"><div class="modal-title page-title">${esc(title)}</div><button class="modal-close">×</button></div><div class="modal-body"></div></div>`;
  overlay.querySelector('.modal-close').onclick = closeModal;
  overlay.addEventListener('click', e => { if(e.target === overlay) closeModal(); });
  overlay.querySelector('.modal-body').innerHTML = bodyHTML;
  $('modal-root').appendChild(overlay);
  modalEl = overlay;
  if(onMount) onMount(overlay);
}
export function closeModal(){ if(modalEl){ modalEl.remove(); modalEl = null; } }

// ---------- 导航 ----------
const NAV = [
  { id:'home',  ico:'🏠', label:'主页' },
  { id:'map',   ico:'🗺️', label:'地图' },
  { id:'tasks', ico:'📜', label:'任务' },
  { id:'skills',ico:'🌿', label:'技能' },
  { id:'more',  ico:'☰', label:'更多' }
];
const ENTRIES = [
  { id:'home',  ico:'🏠', label:'主页' },
  { id:'map',   ico:'🗺️', label:'修行地图' },
  { id:'tasks', ico:'📜', label:'修行任务' },
  { id:'skills',ico:'🌿', label:'技能树' },
  { id:'daily', ico:'❓', label:'每日一问' },
  { id:'reading',ico:'📖',label:'典籍阅览' },
  { id:'library',ico:'📚',label:'文献库' },
  { id:'community',ico:'🤝',label:'共创' },
  { id:'achievements',ico:'🏆',label:'成就' }
];

function buildNav(){
  const nav = $('bottom-nav'); nav.innerHTML = '';
  NAV.forEach(n => {
    const b = el('button', 'nav-item' + (n.id===currentView?' active':''));
    b.innerHTML = `<span class="ico">${n.ico}</span><span>${n.label}</span>`;
    b.onclick = () => n.id==='more' ? openDrawer() : showView(n.id);
    nav.appendChild(b);
  });
}
function buildDrawer(){
  const grid = $('drawer-grid'); grid.innerHTML = '';
  ENTRIES.forEach(e => {
    const d = el('div', 'drawer-entry');
    d.innerHTML = `<span class="ico">${e.ico}</span>${e.label}`;
    d.onclick = () => { closeDrawer(); showView(e.id); };
    grid.appendChild(d);
  });
}
function openDrawer(){ $('menu-name').textContent = getState().profile.name; $('menu-realm').textContent = realmName(); $('menu-sect').textContent = getSect().name; $('menu-drawer').classList.remove('hidden'); }
function closeDrawer(){ $('menu-drawer').classList.add('hidden'); }

// ---------- 视图切换 ----------
export function showView(id){
  if(currentView === 'map' && id !== 'map'){ if(rpg) rpg.stop(); }
  currentView = id;
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const view = $('view-' + id);
  if(view) view.classList.add('active');
  buildNav();
  const renderers = { home:renderHome, tasks:renderTasks, skills:renderSkills, daily:()=>openDaily(), reading:renderReading, library:renderLibrary, community:renderCommunity, achievements:renderAchievements };
  if(renderers[id]) renderers[id]();
  if(id === 'map') enterMap();
}

function enterMap(){
  const c = $('view-map');
  if(!rpg){
    const sect = getSect();
    rpg = createRPG(c, onInteract);
    rpg.setSect(sect.color, sect.accent);
  }
  rpg.setSect(getSect().color, getSect().accent);
  rpg.start();
  rpg.resize();
}
function exitMap(){ if(rpg) rpg.stop(); showView('home'); }

function onInteract(type, data){
  if(type === '__exit'){ exitMap(); return; }
  switch(type){
    case 'daily': openDaily(); break;
    case 'reading': renderReading(); showView('reading'); break;
    case 'library': renderLibrary(); showView('library'); break;
    case 'task': renderTasks(); showView('tasks'); break;
    case 'quiz': openQuiz(); break;
    case 'lundao': openLundao(); break;
    case 'skill': renderSkills(); showView('skills'); break;
    case 'npc': openNpc(data); break;
    case 'secret': openSecret(data); break;
  }
}

// ---------- HUD ----------
export function renderHUD(){
  const s = getState();
  $('hud-name').textContent = s.profile.name;
  $('hud-realm').textContent = realmName();
  $('hud-sect').textContent = getSect().name;
  $('hud-spirit').textContent = s.spirit;
  $('hud-insight').textContent = s.insight;
  const e = expToNext();
  if(e){ $('hud-exp-fill').style.width = (e.pct*100).toFixed(1) + '%'; $('hud-exp-num').textContent = e.cur + '/' + e.need; }
  else { $('hud-exp-fill').style.width = '100%'; $('hud-exp-num').textContent = '圆满'; }
  // 头像
  const av = $('hud-avatar'); av.innerHTML = '';
  const cv = document.createElement('canvas'); cv.width = 40; cv.height = 40;
  drawAvatar(cv, s.profile.avatarSeed, getSect().color, getSect().accent);
  av.appendChild(cv);
}

// ---------- 主页 ----------
function renderHome(){
  const s = getState();
  const e = expToNext();
  const readCount = READINGS.filter(r => s.reading[r.id]).length;
  const v = $('view-home');
  v.innerHTML = `
    <div class="home-hero">
      <div class="realm-card">
        <div class="realm-label">当前境界</div>
        <div class="realm-name">${realmName()}</div>
        <div class="realm-bar"><i style="width:${(e? e.pct*100:100).toFixed(1)}%"></i></div>
        <div class="realm-next">${e ? `距「${REALMS[s.realm.level+1].name}」还需修为 ${e.need - e.cur}` : '已臻化境 · 渡劫圆满'}</div>
      </div>
      <div class="home-stats">
        <div class="stat-box"><div class="num">${s.streak.days}</div><div class="lab">连续修行</div></div>
        <div class="stat-box"><div class="num">${s.stats.correct}</div><div class="lab">累计答对</div></div>
        <div class="stat-box"><div class="num">${readCount}/${READINGS.length}</div><div class="lab">典籍已读</div></div>
      </div>
      <div class="quick-grid">
        ${quickCard('❓','每日一问','今日一题', 'daily')}
        ${quickCard('🗺️','修行地图','走动修行', 'map')}
        ${quickCard('📜','修行任务','领取修行', 'tasks')}
        ${quickCard('📖','典籍阅览','参悟经典', 'reading')}
        ${quickCard('💬','论道台','提示词试炼', 'lundao')}
        ${quickCard('🌿','技能树','点亮神通', 'skills')}
      </div>
    </div>`;
  v.querySelectorAll('.quick-card').forEach(c => c.onclick = () => {
    const t = c.dataset.target;
    if(t === 'lundao') openLundao();
    else if(t === 'daily') openDaily();
    else showView(t);
  });
}
function quickCard(ico, t, d, target){ return `<div class="quick-card" data-target="${target}"><span class="q-ico">${ico}</span><div><div class="q-t">${t}</div><div class="q-d">${d}</div></div></div>`; }

// ---------- 任务 ----------
function taskComputed(id){
  const s = getState();
  if(s.tasks[id] === 'claimed') return 'claimed';
  let done = false;
  if(id === 't1') done = s.daily.answered && s.daily.date === today();
  else if(id === 't2') done = READINGS.some(r => s.reading[r.id]);
  else if(id === 't3') done = !!s.tasks['__quiz'];
  else if(id === 't4') done = !!s.tasks['__lib'];
  else if(id === 't5') done = (s.stats.lundao||0) >= 1;
  else if(id === 't6') done = Object.values(s.skills).some(Boolean);
  else if(id === 't7') done = (s.tasks.__npcSet || []).length >= 1;
  else if(id === 't8') done = Object.keys(s.secrets || {}).length >= 1;
  else if(id === 't9') done = (s.tasks.__quizCount || 0) >= 2;
  else if(id === 't10') done = READINGS.every(r => s.reading[r.id]);
  else if(id === 't11') done = Object.values(s.skills).filter(Boolean).length >= 3;
  else if(id === 't12') done = (s.stats.lundao || 0) >= 3;
  else if(id === 't13') done = Object.keys(s.secrets || {}).length >= 3;
  else if(id === 't14') done = (s.tasks.__npcSet || []).length >= 3;
  return done ? 'done' : 'none';
}
function renderTasks(){
  const v = $('view-tasks');
  const cats = ['主线','日常','支线'];
  v.innerHTML = `<div class="section-head"><h2 class="page-title">修行任务</h2><p class="page-subtitle">完成修行，领取修为与灵气</p></div>`;
  const tabs = el('div', 'tabs');
  cats.forEach((c,i) => { const t = el('div', 'tab'+(i===0?' active':''), c); t.dataset.cat = c; tabs.appendChild(t); });
  v.appendChild(tabs);
  const list = el('div', 'task-list'); v.appendChild(list);
  const draw = (cat) => {
    list.innerHTML = '';
    TASKS.filter(t => t.cat === cat).forEach(t => {
      const st = taskComputed(t.id);
      const item = el('div', 'task-item');
      item.innerHTML = `
        <div class="task-top"><span class="task-name">${esc(t.name)}</span><span class="task-cat ${t.cat}">${t.cat}</span></div>
        <div class="task-desc">${esc(t.desc)}</div>
        <div class="task-reward">奖励：修为 +${t.reward.exp} · 灵气 +${t.reward.spirit}</div>`;
      const btn = el('button', 'btn-brush task-btn' + (st==='claimed'?' done':''));
      if(st === 'claimed'){ btn.textContent = '已完成'; btn.disabled = true; }
      else if(st === 'done'){ btn.textContent = '领取'; btn.className = 'btn-brush primary task-btn'; }
      else { btn.textContent = '前往'; btn.className = 'btn-brush secondary task-btn'; }
      btn.onclick = () => {
        if(st === 'claimed') return;
        if(st === 'done'){
          addExp(t.reward.exp); addSpirit(t.reward.spirit);
          setTaskStatus(t.id, 'claimed');
          toast(`领取成功！修为 +${t.reward.exp} 灵气 +${t.reward.spirit}`);
          renderTasks(); renderHUD();
        } else {
          gotoTaskTarget(t.target);
        }
      };
      item.appendChild(btn);
      list.appendChild(item);
    });
  };
  tabs.querySelectorAll('.tab').forEach(t => t.onclick = () => {
    tabs.querySelectorAll('.tab').forEach(x=>x.classList.remove('active')); t.classList.add('active'); draw(t.dataset.cat);
  });
  draw('主线');
}
function gotoTaskTarget(target){
  const map = { daily:openDaily, reading:()=>showView('reading'), library:()=>showView('library'), quiz:openQuiz, lundao:openLundao, skill:()=>showView('skills'), task:()=>showView('tasks'), npc:enterMap, secret:enterMap };
  (map[target] || (()=>showView('home')))();
}

// ---------- 技能 ----------
function renderSkills(){
  const s = getState();
  const v = $('view-skills');
  v.innerHTML = `<div class="section-head"><h2 class="page-title">技能树</h2><p class="page-subtitle">以灵气点亮神通，获得修行加成</p></div>`;
  const tabs = el('div', 'dim-tabs');
  Object.entries(DIM_META).forEach(([k,m],i) => {
    const t = el('div', 'tab'+(i===0?' active':''), m.name); t.dataset.dim = k; t.style.background = i===0?m.color:''; tabs.appendChild(t);
  });
  v.appendChild(tabs);
  const grid = el('div', 'skill-grid'); v.appendChild(grid);
  const draw = (dim) => {
    grid.innerHTML = '';
    SKILLS.filter(sk => sk.dim === dim).forEach(sk => {
      const unlocked = !!s.skills[sk.id];
      const preok = (!sk.prereq || s.skills[sk.prereq]);
      const crossOk = !sk.crossReq || sk.crossReq.every(r => s.skills[r]);
      const crossNames = sk.crossReq ? sk.crossReq.map(r => (SKILLS.find(x=>x.id===r)||{}).name || r).join('、') : '';
      const node = el('div', 'skill-node ' + (unlocked?'unlocked':(preok&&crossOk?'':'locked')));
      node.innerHTML = `
        <span class="sn-seal">✓</span>
        <div class="sn-name">${esc(sk.name)}</div>
        <div class="sn-desc">${esc(sk.desc)}</div>
        <div class="sn-bonus">加成：${esc(sk.bonus)}</div>
        ${sk.crossReq ? `<div class="sn-cross">跨维需：${esc(crossNames)}</div>` : ''}
        <div class="sn-cost">灵气 ${sk.cost}</div>`;
      if(!unlocked){
        const lockMsg = !preok ? '需前置' : (!crossOk ? '需跨维' : '解锁');
        const b = el('button', 'btn-brush sn-unlock', lockMsg);
        b.disabled = !(preok && crossOk) || s.spirit < sk.cost;
        b.onclick = () => {
          if(unlockSkill(sk.id)){ toast('神通点亮：'+sk.name); renderSkills(); renderHUD(); }
          else toast('灵气不足或前置未解锁');
        };
        node.appendChild(b);
      } else {
        const tag = el('div', 'sn-cost', '已点亮'); tag.style.color = 'var(--jade)'; node.appendChild(tag);
      }
      grid.appendChild(node);
    });
  };
  tabs.querySelectorAll('.tab').forEach(t => t.onclick = () => {
    tabs.querySelectorAll('.tab').forEach(x=>{ x.classList.remove('active'); x.style.background=''; });
    t.classList.add('active'); t.style.background = DIM_META[t.dataset.dim].color;
    draw(t.dataset.dim);
  });
  draw('algorithm');
}

// ---------- 每日一问 ----------
function dailyQuestion(){
  const t = today();
  let h = 0; for(const c of t) h = (h*31 + c.charCodeAt(0)) & 0x7fffffff;
  return QUESTIONS[h % QUESTIONS.length];
}
function openDaily(){
  const s = getState(); const q = dailyQuestion();
  const already = s.daily.answered && s.daily.date === today();
  openModal({ title:'每日一问', bodyHTML:`<div id="db"></div>`, onMount(m){
    const body = m.querySelector('#db');
    if(already){
      const qq = QUESTIONS.find(x=>x.id===s.daily.qid) || q;
      body.innerHTML = `<div class="question-scroll"><span class="q-seal">已修行</span><p class="q-sub">今日已修行 · 连续 ${s.streak.days} 天，复习一下：</p></div>`;
      renderQuestionInto(body, qq, null);
    } else {
      renderQuestionInto(body, q, (correct) => {
        answerDaily(q.id, correct);
        const eg = addExp(correct ? 20 : 5);
        let sp = 0;
        if(correct){
          sp = 10 + (skillBonus('s_e1')?6:0) + (skillBonus('s_a4')?12:0);
          const sect = getSect(); if(sect.bonus.type==='ethicBonus') sp += sect.bonus.value;
          addSpirit(sp);
        }
        toast(correct ? `修为 +${eg} 灵气 +${sp}` : `修为 +${eg}，明日再战`);
        renderHUD();
        if(taskComputed('t1')==='done') setTaskStatus('t1','done');
      });
    }
  }});
}

// ---------- 参悟点答题 ----------
function openQuiz(){
  const q = QUESTIONS[Math.floor(Math.random()*QUESTIONS.length)];
  openModal({ title:'参悟 · 算法试炼', bodyHTML:`<div id="qb"></div>`, onMount(m){
    renderQuestionInto(m.querySelector('#qb'), q, (correct) => {
      const eg = addExp(correct ? 25 : 8);
      let sp = 0;
      if(correct){ sp = 12 + (skillBonus('s_a2')?8:0); addSpirit(sp); }
      setTaskStatus('__quiz','done');
      const stq = getState(); stq.tasks.__quizCount = (stq.tasks.__quizCount || 0) + 1; save();
      toast(correct ? `修为 +${eg} 灵气 +${sp}` : `修为 +${eg}`);
      renderHUD();
    });
  }});
}

// ---------- 通用答题渲染 ----------
function renderQuestionInto(container, q, onResult){
  container.innerHTML = `
    <div class="question-scroll">
      <span class="q-seal">问</span>
      <h3 class="q-title">${esc(q.q)}</h3>
      <div class="q-options">
        ${q.options.map((o,i)=>`<div class="q-option" data-i="${i}"><span class="opt-letter">${'ABCD'[i]}</span><span>${esc(o)}</span></div>`).join('')}
      </div>
      <div class="result-box" style="display:none"></div>
    </div>`;
  const opts = [...container.querySelectorAll('.q-option')];
  const rb = container.querySelector('.result-box');
  let answered = false;
  opts.forEach(op => op.onclick = () => {
    if(answered) return; answered = true;
    const i = +op.dataset.i; const correct = i === q.answer;
    opts.forEach(o => o.classList.add('disabled'));
    if(correct) op.classList.add('correct'); else { op.classList.add('wrong'); opts[q.answer].classList.add('correct'); }
    rb.style.display = 'block';
    rb.innerHTML = `<div class="result-title ${correct?'ok':'no'}">${correct?'答对啦 ✦':'答错了 ✕'}</div>
      <div class="result-explain">${esc(q.explain)}</div>
      <div class="result-source">出处：${esc(q.source)}</div>`;
    if(onResult) onResult(correct, rb);
  });
}

// ---------- 典籍 ----------
function renderReading(){
  const s = getState();
  const v = $('view-reading');
  v.innerHTML = `<div class="section-head"><h2 class="page-title">典籍阅览</h2><p class="page-subtitle">读古文，思 AI，作答以证悟</p></div>`;
  READINGS.forEach(r => {
    const card = el('div', 'reading-card');
    const done = !!s.reading[r.id];
    card.innerHTML = `
      <div class="rc-head">
        <span class="rc-cat">${r.category}</span>
        <span class="rc-title">${esc(r.title)}</span>
        <span class="rc-stars">${'★'.repeat(r.stars)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px">
        <span class="rc-author">${esc(r.author)}</span>
        ${done?'<span class="rc-read">✓ 已参悟</span>':'<span class="rc-read" style="color:var(--ink-3)">未读</span>'}
      </div>`;
    card.onclick = () => openReading(r.id);
    v.appendChild(card);
  });
}
function openReading(id){
  const r = READINGS.find(x=>x.id===id); const s = getState();
  openModal({ title:r.title, bodyHTML:`
    <div class="rc-head" style="margin-bottom:10px">
      <span class="rc-cat">${r.category}</span><span class="rc-author">${esc(r.author)}</span>
      <span class="rc-stars">${'★'.repeat(r.stars)}</span>
    </div>
    <div style="white-space:pre-wrap;line-height:1.95;font-size:15px">${esc(r.content)}</div>
    <div id="refl"></div>`, onMount(m){
    const refl = m.querySelector('#refl');
    if(s.reading[id]){
      refl.innerHTML = `<div class="result-box" style="margin-top:14px"><div class="result-title ok">已参悟</div><div class="result-explain">你已读毕此典籍，思辨通透。</div></div>`;
      return;
    }
    refl.innerHTML = `<div class="result-box" style="margin-top:14px">
      <div style="font-family:var(--font-sub);font-weight:600;margin-bottom:8px">思辨 · ${esc(r.reflection.q)}</div>
      <div class="q-options" id="ro"></div><div id="rres" style="display:none"></div></div>`;
    const ro = refl.querySelector('#ro');
    r.reflection.options.forEach((o,i) => {
      const d = el('div', 'q-option'); d.dataset.i = i;
      d.innerHTML = `<span class="opt-letter">${'ABCD'[i]}</span><span>${esc(o)}</span>`;
      d.onclick = () => {
        const correct = i === r.reflection.answer;
        ro.querySelectorAll('.q-option').forEach(x=>x.classList.add('disabled'));
        if(correct) d.classList.add('correct'); else { d.classList.add('wrong'); ro.children[r.reflection.answer].classList.add('correct'); }
        const rr = refl.querySelector('#rres'); rr.style.display='block';
        rr.innerHTML = `<div class="result-title ${correct?'ok':'no'}">${correct?'思辨通透 ✦':'再想想'}</div><div class="result-explain">${esc(r.reflection.explain)}</div>`;
        recordReading(id, correct);
        const ins = 2; addInsight(ins);
        if(correct){ const sp = 5 + (skillBonus('s_d2')?8:0); addSpirit(sp); addExp(15); }
        toast(correct ? `顿悟 +${ins}` : '已读毕');
        renderHUD(); setTaskStatus('t2','done');
      };
      ro.appendChild(d);
    });
  }});
}

// ---------- 文献库 ----------
function renderLibrary(){
  const v = $('view-library');
  v.innerHTML = `<div class="section-head"><h2 class="page-title">文献库</h2><p class="page-subtitle">延伸阅读，博采众长</p></div>`;
  LIBRARY.forEach(l => {
    const card = el('div', 'lit-card');
    card.innerHTML = `
      <span class="lit-type ${l.type}">${l.type}</span>
      <div class="lit-title">${esc(l.title)}</div>
      <div class="lit-source">来源：${esc(l.source)}</div>
      <div class="lit-summary">${esc(l.summary)}</div>`;
    card.style.cursor = 'pointer';
    card.onclick = () => { openLibrary(l.id); };
    v.appendChild(card);
  });
}
function openLibrary(id){
  const l = LIBRARY.find(x=>x.id===id);
  openModal({ title:l.title, bodyHTML:`
    <span class="lit-type ${l.type}">${l.type}</span>
    <div class="lit-source" style="margin:8px 0">来源：${esc(l.source)}</div>
    <div class="lit-summary" style="font-size:15px;line-height:1.85">${esc(l.summary)}</div>
    <div style="margin-top:12px"><button class="btn-brush secondary" id="lib-ok">收下</button></div>`,
    onMount(m){ m.querySelector('#lib-ok').onclick = () => { setTaskStatus('__lib','done'); closeModal(); renderHUD(); toast('已浏览文献'); }; }
  });
}

// ---------- 论道 mini-game ----------
function lundaoMult(){
  let mul = 1, base = 0;
  const sect = getSect();
  if(sect.bonus.type === 'lundaoMul') mul *= sect.bonus.value;
  if(skillBonus('s_p2')) mul *= 1.15;
  if(skillBonus('s_d3')) mul *= 1.10;
  if(skillBonus('s_p1')) base += 10;
  return { base, mul };
}
function scorePrompt(text){
  let score = Math.min(text.length, 60) / 60 * 55;
  const keys = ['角色','格式','字数','风格','例如','请','目标','要求','清晰','具体'];
  let hits = 0;
  keys.forEach(k => { if(text.includes(k)) hits++; });
  score += Math.min(hits, 6) * 6;
  if(/[？?：:]/.test(text)) score += 5;
  if(/[，,、]/.test(text)) score += 3;
  return Math.max(0, Math.min(100, Math.round(score)));
}
function scoreComment(score){
  if(score >= 85) return '立意清晰、约束明确，灵兽听令！(优秀)';
  if(score >= 60) return '还不错，若补充角色与格式会更妙。(良好)';
  if(score >= 40) return '尚可，试着写清"要什么、给什么、什么格式"。(及格)';
  return '提示词偏空泛，越具体 AI 越懂你。(待提升)';
}
function openLundao(){
  const topics = [
    '向 AI 描述：帮我把"校园植树节"写成一首五言绝句，要有春日和团结的意境。',
    '向 AI 描述：帮我制定一份"一周减糖饮食"计划，要适合学生且每天不重样。',
    '向 AI 描述：用生活比喻解释"什么是神经网络"，让初学者也能听懂。'
  ];
  const topic = topics[Math.floor(Math.random()*topics.length)];
  openModal({ title:'论道台 · 提示词试炼', bodyHTML:`
    <div class="lundao-area">
      <div class="lundao-topic">命题：${esc(topic)}</div>
      <textarea class="lundao-textarea" id="ld" placeholder="写下你的提示词（prompt）。越清晰具体，评分越高～"></textarea>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px">
        <span id="ld-score" class="lundao-score"></span>
        <button class="btn-brush secondary" id="ld-go">论道</button>
      </div>
      <div id="ld-tip" style="margin-top:10px;color:var(--ink-2);font-size:13px"></div>
    </div>`, onMount(m){
    const ta = m.querySelector('#ld'), go = m.querySelector('#ld-go'), scoreEl = m.querySelector('#ld-score'), tip = m.querySelector('#ld-tip');
    go.onclick = () => {
      const text = ta.value.trim();
      if(text.length < 4){ tip.textContent = '提示词太短，写详细一点吧。'; return; }
      const { base, mul } = lundaoMult();
      let score = Math.round((scorePrompt(text) + base) * mul);
      score = Math.max(0, Math.min(100, score));
      scoreEl.textContent = score + ' 分';
      tip.innerHTML = scoreComment(score);
      recordLundao(score);
      addExp(Math.round(score/3));
      if(score >= 60) addSpirit(Math.round(score/8));
      setTaskStatus('t5','done');
      renderHUD();
      toast('论道完成！');
    };
  }});
}

// ---------- NPC 对话 ----------
function openNpc(it){
  const lines = it.npc === '老者'
    ? ['小友，修行之路贵在持恒。AI 虽巧，终是器也，不可尽信。',
       '每日一问不可荒废，连续修行方见真章；遇"幻觉"须核实，莫被巧言误了心神。',
       '去藏经阁读读书吧，典籍里的道理，比灵气更养人。']
    : ['师姐说，写好提示词就能让灵兽听话！',
       '我昨天在论道台得了 80 分，嘻嘻～你也去试试嘛。',
       '你多去参悟点答题，修为涨得可快啦！'];
  openModal({ title:it.label, bodyHTML:`
    <div class="dlg-box show" style="position:relative;display:block;width:auto;box-shadow:none;border:none;padding:0;background:transparent">
      <div class="dlg-speaker">${esc(it.label)}</div>
      <div class="dlg-text" id="npc-text" style="background:var(--paper-2);border:2px solid var(--ink);border-radius:12px;padding:14px"></div>
      <div class="dlg-choices"><button class="dlg-choice" id="npc-next" style="text-align:center">继续 ›</button></div>
    </div>`, onMount(m){
    let i = 0; const txt = m.querySelector('#npc-text'), next = m.querySelector('#npc-next');
    txt.textContent = lines[0];
    next.onclick = () => { i++; if(i < lines.length) txt.textContent = lines[i];
      else {
        const stt = getState();
        const set = stt.tasks.__npcSet || [];
        if(!set.includes(it.label)) set.push(it.label);
        stt.tasks.__npcSet = set; stt.tasks.__npc = 'done'; save();
        closeModal(); toast('与'+it.label+'论道愉快');
      } };
  }});
}

// ---------- 隐藏彩蛋点 ----------
const SECRET_LORE = {
  '隐秘石碑': '碑文漫漶：「凡有所学，皆成性格。」你似有所悟，灵气与修为皆有增益。',
  '古井': '井水倒映星河，竟照见自己修行的初心。心境澄明，获益良多。',
  '神秘洞窟': '洞中石壁上刻满前辈修行笔记，字字珠玑，令你灵台清明。',
  '灵泉': '掬一捧灵泉饮下，周身暖流涌动，修为大进。',
  '残破经幢': '残幢虽破，偈语犹存：「知之为知之」。恍然间参透数据真伪之理。',
  '棋盘石': '石上棋局未终，落子声如梵音。你静坐片刻，顿觉思路开阔。',
  '许愿灯': '点亮一盏许愿灯，愿「AI 向善」。灯焰摇曳，福泽加身。',
  '星象台': '登台观星，银河垂野。你窥见算法星辰的运转轨迹，灵光乍现。'
};
function openSecret(it){
  const s = getState();
  const found = !!s.secrets[it.label];
  const lore = SECRET_LORE[it.label] || '你在此发现一处隐秘之地，心神为之一振。';
  let body = `<div class="dlg-speaker">✦ ${esc(it.label)}</div>
    <div class="dlg-text" style="background:var(--paper-2);border:2px solid var(--primary);border-radius:12px;padding:14px">${esc(lore)}</div>`;
  if(!found){
    addSpirit(40); addExp(60); s.secrets[it.label] = true; save();
    body += `<div style="margin-top:10px;color:var(--jade);font-weight:700">初次发现！获得 灵气 +40 · 修为 +60</div>`;
  } else {
    body += `<div style="margin-top:10px;color:var(--ink-3)">（此处彩蛋已发现过，不再重复奖励）</div>`;
  }
  body += `<div class="dlg-choices"><button class="dlg-choice" id="sec-ok" style="text-align:center">收下 ›</button></div>`;
  openModal({ title:'神秘地点', bodyHTML:body, onMount(m){
    m.querySelector('#sec-ok').onclick = () => { closeModal(); renderHUD(); toast(found ? '已探索' : '发现彩蛋！'); };
  }});
}

// ---------- 共创 / 排行榜 ----------
function renderCommunity(){
  const s = getState();
  const mock = [
    { name:'玄机子', realm:'大乘', exp:13500 },
    { name:'青萍', realm:'合体', exp:8200 },
    { name:'墨尘', realm:'化神', exp:4100 },
    { name:'云汐', realm:'金丹', exp:1900 },
    { name:'石樵', realm:'筑基', exp:680 },
    { name:'小满', realm:'练气', exp:240 }
  ];
  const me = { name:s.profile.name+'（我）', realm:realmName(), exp:s.realm.exp, me:true };
  const all = [...mock, me].sort((a,b)=>b.exp-a.exp);
  const myRank = all.indexOf(me) + 1;
  const v = $('view-community');
  v.innerHTML = `
    <div class="section-head"><h2 class="page-title">共创</h2><p class="page-subtitle">与万千弟子同修 AI 之道</p></div>
    <div class="overview">
      <div class="ov-box"><div class="ov-num">12</div><div class="ov-lab">共创章节</div></div>
      <div class="ov-box"><div class="ov-num">${1280 + (s.stats.answered||0)}</div><div class="ov-lab">弟子总数</div></div>
      <div class="ov-box"><div class="ov-num">${(88420 + s.spirit).toLocaleString()}</div><div class="ov-lab">灵气总量</div></div>
    </div>
    <div class="chapter">
      <div class="chapter-top"><span class="chapter-name">第一章 · 初识智能</span><span class="chapter-status done">已共成</span></div>
      <div class="chapter-bar"><i style="width:100%"></i></div>
    </div>
    <div class="chapter">
      <div class="chapter-top"><span class="chapter-name">第二章 · 数据之道</span><span class="chapter-status doing">进行中 64%</span></div>
      <div class="chapter-bar"><i style="width:64%"></i></div>
    </div>
    <div class="chapter">
      <div class="chapter-top"><span class="chapter-name">第三章 · 伦理之尺</span><span class="chapter-status todo">待开启</span></div>
      <div class="chapter-bar"><i style="width:0%"></i></div>
    </div>
    <div class="section-head"><h3 class="page-title" style="font-size:22px">修行榜</h3></div>
    <div class="lb">
      ${all.map((p,i)=>`<div class="lb-row ${p.me?'me':''}">
        <span class="lb-rank ${i<3?'top':''}">${i+1}</span>
        <span class="lb-name">${esc(p.name)}<div class="lb-realm">${p.realm}</div></span>
        <span class="lb-exp">${p.exp.toLocaleString()}</span>
      </div>`).join('')}
    </div>
    <p style="text-align:center;color:var(--ink-3);font-size:13px;margin-top:10px">你当前排名第 ${myRank} 位</p>`;
}

// ---------- 成就 ----------
function renderAchievements(){
  const s = getState();
  const got = Object.values(s.achievements).filter(Boolean).length;
  const v = $('view-achievements');
  v.innerHTML = `
    <div class="section-head"><h2 class="page-title">成就</h2><p class="page-subtitle">修行路上的勋章</p></div>
    <div class="ach-stats">
      <div class="stat-box"><div class="num">${got}/${ACHIEVEMENTS.length}</div><div class="lab">已点亮</div></div>
      <div class="stat-box"><div class="num">${s.stats.correct}</div><div class="lab">累计答对</div></div>
      <div class="stat-box"><div class="num">${s.streak.days}</div><div class="lab">连续修行</div></div>
    </div>
    <div class="ach-grid">
      ${ACHIEVEMENTS.map(a=>{ const g = !!s.achievements[a.id]; return `<div class="ach-card ${g?'got':''}">
        <span class="ach-seal">印</span>
        <div class="ach-name">${esc(a.name)}</div>
        <div class="ach-desc">${esc(a.desc)}</div>
        <div class="ach-reward">奖励：${esc(a.reward)}</div>
      </div>`; }).join('')}
    </div>`;
}

// ---------- 设置 ----------
function applyTheme(t){ document.documentElement.setAttribute('data-theme', t); }
function setupSettings(){
  const t = getState().settings.theme || 'ink';
  applyTheme(t);
  const seg = $('set-theme');
  seg.querySelectorAll('span').forEach(sp => sp.classList.toggle('on', sp.dataset.t === t));
  seg.onclick = (e) => { const sp = e.target.closest('span'); if(!sp) return; const nt = sp.dataset.t; setSetting('theme', nt); applyTheme(nt); seg.querySelectorAll('span').forEach(x=>x.classList.toggle('on', x.dataset.t===nt)); };
  const sw = $('set-sound'); const on = getState().settings.sound; sw.classList.toggle('on', on);
  sw.onclick = () => { const n = !sw.classList.contains('on'); sw.classList.toggle('on', n); setSetting('sound', n); };
  $('btn-reset').onclick = () => {
    if(confirm('确定重置修行？所有进度将清空。')){
      import('./state.js').then(m => { m.reset(); location.reload(); });
    }
  };
}

// ---------- 初始化 ----------
export function initUI(){
  buildNav(); buildDrawer();
  $('open-menu').onclick = openDrawer;
  $('drawer-mask').onclick = closeDrawer;
  bus.on('change', renderHUD);
  bus.on('achievement', list => { list.forEach(a => toast('成就达成：' + a.name)); });
  bus.on('realmbreak', r => { toast('境界突破 · ' + r.name + '！'); });
  setupSettings();
  refreshStreak();
  renderHUD();
  showView('home');
}
