// ============================================================
// state.js —— 游戏状态、存档、资源/境界算法、事件总线
// ============================================================
import { SECTS, REALMS, ACHIEVEMENTS, SKILLS, DIM_META } from './data.js';

const SAVE_KEY = 'accjg_save_v1';

// ---- 极简事件总线 ----
const listeners = {};
export const bus = {
  on(evt, fn){ (listeners[evt] ||= []).push(fn); },
  emit(evt, payload){ (listeners[evt]||[]).forEach(fn => fn(payload)); }
};

function defaultState(){
  return {
    v: 1,
    profile: null,            // { name, sect, avatarSeed, createdAt }
    realm: { level: 0, exp: 0 },
    spirit: 0,
    insight: 0,
    streak: { days: 0, lastDate: '' },
    tasks: {},                // id -> 'accepted'|'done'|'claimed'
    skills: {},               // nodeId -> true
    reading: {},              // id -> true
    daily: { date: '', answered: false, correct: false },
    lundao: { date: '', best: 0 },
    achievements: {},         // id -> true
    stats: { correct: 0, answered: 0, lundao: 0 },
    settings: { theme: 'ink', sound: true }
  };
}

let state = defaultState();

export function load(){
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if(!raw) return false;
    const parsed = JSON.parse(raw);
    if(!parsed || parsed.v !== 1 || !parsed.profile) return false;
    state = Object.assign(defaultState(), parsed);
    state.settings = Object.assign({ theme:'ink', sound:true }, parsed.settings||{});
    state.stats = Object.assign({ correct:0, answered:0, lundao:0 }, parsed.stats||{});
    return true;
  } catch(e){
    console.warn('存档损坏，重置', e);
    state = defaultState();
    return false;
  }
}

export function save(){
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); }
  catch(e){ console.warn('保存失败', e); }
}

export function reset(){
  state = defaultState();
  try { localStorage.removeItem(SAVE_KEY); } catch(e){}
}

export function getState(){ return state; }

// ---- 创角 ----
export function createProfile(name, sectId){
  const sect = SECTS.find(s => s.id === sectId) || SECTS[0];
  state.profile = {
    name: (name && name.trim()) || '无名',
    sect: sect.id,
    avatarSeed: Math.floor(Math.random()*100000),
    createdAt: Date.now()
  };
  // 门派初始奖励
  if(sect.bonus.type === 'spirit') state.spirit += sect.bonus.value;
  state.streak = { days: 1, lastDate: today() };
  save();
  bus.emit('change');
  checkAchievements();
}

export function getSect(){
  return SECTS.find(s => s.id === (state.profile?.sect)) || SECTS[0];
}

// ---- 资源 ----
export function addExp(base){
  const mul = expMultiplier();
  const gain = Math.round(base * mul);
  state.realm.exp += gain;
  // 境界突破
  let broke = false;
  while(state.realm.level < REALMS.length-1 && state.realm.exp >= REALMS[state.realm.level+1].exp){
    state.realm.level++;
    broke = true;
  }
  save();
  bus.emit('change');
  if(broke) bus.emit('realmbreak', REALMS[state.realm.level]);
  return gain;
}

export function addSpirit(base){
  const mul = spiritMultiplier();
  const gain = Math.round(base * mul);
  state.spirit += gain;
  save(); bus.emit('change');
  return gain;
}

export function addInsight(n){ state.insight += n; save(); bus.emit('change'); }

// ---- 倍率（技能 + 门派） ----
function hasSkill(id){ return !!state.skills[id]; }
function expMultiplier(){
  let m = 1;
  const sect = getSect();
  if(sect.bonus.type === 'expMul') m *= sect.bonus.value;
  if(hasSkill('s_p4')) m *= 1.1;
  if(hasSkill('s_a1')) m *= 1.05;
  if(hasSkill('s_d1')) m *= 1.05;
  if(hasSkill('s_p3')) m *= 1.1;
  return m;
}
function spiritMultiplier(){
  let m = 1;
  if(hasSkill('s_d4')) m *= 1.1;
  return m;
}
export function skillBonus(id){
  return hasSkill(id);
}
export { expMultiplier, spiritMultiplier };

export function realmName(){ return REALMS[state.realm.level].name; }
export function expToNext(){
  if(state.realm.level >= REALMS.length-1) return null;
  const cur = REALMS[state.realm.level].exp;
  const next = REALMS[state.realm.level+1].exp;
  return { cur: state.realm.exp - cur, need: next - cur, pct: (state.realm.exp-cur)/(next-cur) };
}

// ---- 每日一问 ----
export function today(){ return new Date().toISOString().slice(0,10); }

export function refreshStreak(){
  const t = today();
  if(state.streak.lastDate === t) return;
  const y = new Date(Date.now()-86400000).toISOString().slice(0,10);
  if(state.streak.lastDate === y) state.streak.days += 1;
  else state.streak.days = 1;
  state.streak.lastDate = t;
  // 新的一天：每日一问重置
  state.daily = { date: t, answered: false, correct: false };
  save(); bus.emit('change');
}

export function answerDaily(qid, correct){
  state.stats.answered++;
  if(correct) state.stats.correct++;
  state.daily.answered = true;
  state.daily.correct = correct;
  state.daily.qid = qid;
  refreshStreak();
  save(); bus.emit('change');
  checkAchievements();
}

export function recordReading(id, correct){
  state.reading[id] = true;
  state.stats.answered++;
  if(correct) state.stats.correct++;
  save(); bus.emit('change');
  checkAchievements();
}

export function recordLundao(score){
  state.stats.lundao = (state.stats.lundao||0) + 1;
  if(state.lundao.date !== today()){ state.lundao = { date: today(), best: 0 }; }
  state.lundao.best = Math.max(state.lundao.best, score);
  save(); bus.emit('change');
  checkAchievements();
}

// ---- 任务 ----
export function taskStatus(id){ return state.tasks[id] || 'none'; }
export function setTaskStatus(id, st){ state.tasks[id] = st; save(); bus.emit('change'); }

// ---- 技能 ----
export function unlockSkill(id){
  const sk = SKILLS.find(s=>s.id===id);
  if(!sk || state.skills[id]) return false;
  if(sk.prereq && !state.skills[sk.prereq]) return false;
  if(state.spirit < sk.cost) return false;
  state.spirit -= sk.cost;
  state.skills[id] = true;
  // 某些技能直接给修为
  if(id === 's_a4' || id === 's_d4' || id === 's_e4' || id === 's_p4') addExp(50);
  save(); bus.emit('change');
  checkAchievements();
  return true;
}

// ---- 成就 ----
export function checkAchievements(){
  let newly = [];
  for(const a of ACHIEVEMENTS){
    if(!state.achievements[a.id] && safeCheck(a)) {
      state.achievements[a.id] = true;
      newly.push(a);
    }
  }
  if(newly.length){ save(); bus.emit('achievement', newly); }
  return newly;
}
function safeCheck(a){
  try { return a.check(state); } catch(e){ return false; }
}

export function setSetting(k, v){ state.settings[k] = v; save(); }
