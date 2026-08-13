// ============================================================
// main.js —— 入口：存档加载 / 创角流程 / 启动
// ============================================================
import { load, createProfile, getState, getSect } from './state.js';
import { SECTS } from './data.js';
import { drawAvatar } from './avatar.js';
import { initUI } from './ui.js';

let selectedSect = SECTS[0].id;

function renderSects(){
  const wrap = document.getElementById('onb-sects');
  wrap.innerHTML = '';
  SECTS.forEach(s => {
    const card = document.createElement('div');
    card.className = 'sect-card' + (s.id === selectedSect ? ' sel' : '');
    card.innerHTML = `
      <span class="sect-pick">✦</span>
      <div class="sect-name" style="color:${s.color}">${s.name}</div>
      <div class="sect-motto">${s.motto}</div>
      <div class="sect-badge" style="background:linear-gradient(90deg,${s.color},${s.accent})"></div>`;
    card.onclick = () => { selectedSect = s.id; renderSects(); updatePreview(); };
    wrap.appendChild(card);
  });
}

function updatePreview(){
  const sect = SECTS.find(s => s.id === selectedSect);
  document.getElementById('onb-sect-desc').textContent = sect.desc;
  const cv = document.getElementById('onb-avatar');
  drawAvatar(cv, (sect.id.length * 9973 + 12345), sect.color, sect.accent);
}

function setupOnboarding(){
  renderSects(); updatePreview();
  const nameInput = document.getElementById('onb-name');
  const err = document.getElementById('onb-name-err');
  nameInput.addEventListener('input', () => { err.textContent = ''; });
  document.getElementById('onb-submit').onclick = () => {
    const name = nameInput.value.trim();
    if(name && name.length > 8){ err.textContent = '道号请控制在 8 字以内'; return; }
    createProfile(name, selectedSect);
    document.getElementById('onboarding').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    initUI();
  };
  nameInput.addEventListener('keydown', e => { if(e.key === 'Enter') document.getElementById('onb-submit').click(); });
}

function main(){
  const hasSave = load();
  if(hasSave && getState().profile){
    document.getElementById('onboarding').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    initUI();
  } else {
    setupOnboarding();
  }
}

main();
