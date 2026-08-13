// ============================================================
// avatar.js —— 由种子生成水墨/像素风像素头像（确定性）
// ============================================================

export function drawAvatar(canvas, seed, color, accent){
  const size = canvas.width;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, size, size);
  // 背景
  ctx.fillStyle = '#f3ead2';
  ctx.fillRect(0, 0, size, size);
  const N = 7;
  const cell = size / N;
  let s = (seed >>> 0) || 1;
  const rnd = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
  // 对称图案
  for(let y = 0; y < N; y++){
    for(let x = 0; x < Math.ceil(N/2); x++){
      const on = rnd() > 0.5;
      const c = rnd() > 0.5 ? color : accent;
      if(on){
        ctx.fillStyle = c;
        ctx.fillRect(x*cell, y*cell, cell+0.5, cell+0.5);
        ctx.fillRect((N-1-x)*cell, y*cell, cell+0.5, cell+0.5);
      }
    }
  }
  // 边框
  ctx.strokeStyle = color; ctx.lineWidth = Math.max(2, size/24);
  ctx.strokeRect(1, 1, size-2, size-2);
}
