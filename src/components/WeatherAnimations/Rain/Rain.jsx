import { useEffect, useRef } from 'react';

const GREEK = [
  'α','β','γ','δ','ε','ζ','η','θ','ι','κ',
  'λ','μ','ν','ξ','π','ρ','σ','τ','φ','χ',
  'ψ','ω','Γ','Δ','Θ','Λ','Ξ','Π','Σ','Φ','Ψ','Ω',
];

const PALETTES = [
  ['#F5A623', '#FFD580', '#E8941A'],
  ['#F5A623', '#F5A623', '#ffffff'],
  ['#FFD580', '#F5A623', '#E8941A'],
  ['#ffffff', '#FFD580', '#F5A623'],
  ['#E8941A', '#F5A623', '#FFD580'],
];

const FONT_SIZE = 15;
const nextDelay = () => 2000 + Math.random() * 8000;

// ── Lightning ─────────────────────────────────────────────────────────────────

function makeBolt(cw, midY) {
  const dir    = Math.random() > 0.5 ? 1 : -1;
  const startX = dir > 0 ? 10 + Math.random() * cw * 0.1 : cw - 10 - Math.random() * cw * 0.1;
  const span   = cw * (0.55 + Math.random() * 0.38);
  const endX   = Math.max(10, Math.min(cw - 10, startX + dir * span));

  const pts = [{ x: startX, y: midY + (Math.random() - 0.5) * 18 }];
  let cx = startX, cy = pts[0].y;

  while (dir > 0 ? cx < endX - 10 : cx > endX + 10) {
    cx += dir * (16 + Math.random() * 30);
    cy += (Math.random() - 0.5) * 26;
    cy  = Math.max(midY - 40, Math.min(midY + 50, cy));
    pts.push({ x: cx, y: cy });
  }
  pts.push({ x: endX, y: cy });
  return pts;
}

function makeBranches(bolt, cw, midY, count) {
  const branches = [];
  for (let b = 0; b < count; b++) {
    const idx    = Math.floor(bolt.length * 0.1 + Math.random() * bolt.length * 0.8);
    const origin = bolt[idx];
    const pts    = [{ ...origin }];
    let cx = origin.x, cy = origin.y;
    const len = 3 + Math.floor(Math.random() * 5);
    for (let i = 0; i < len; i++) {
      cy += 9 + Math.random() * 14;
      cx += (Math.random() - 0.5) * 36;
      cx  = Math.max(10, Math.min(cw - 10, cx));
      cy  = Math.min(midY + 110, cy);
      pts.push({ x: cx, y: cy });
    }
    branches.push({ pts, level: 1 });

    if (Math.random() > 0.5 && pts.length > 2) {
      const subIdx = Math.floor(1 + Math.random() * (pts.length - 2));
      const sub    = [{ ...pts[subIdx] }];
      let scx = sub[0].x, scy = sub[0].y;
      const slen = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < slen; i++) {
        scy += 7 + Math.random() * 10;
        scx += (Math.random() - 0.5) * 24;
        scx  = Math.max(10, Math.min(cw - 10, scx));
        sub.push({ x: scx, y: scy });
      }
      branches.push({ pts: sub, level: 2 });
    }
  }
  return branches;
}

function triggerStrike(clouds, cw) {
  const midY    = clouds.reduce((s, c) => s + c.y, 0) / clouds.length + 22;
  const bolt    = makeBolt(cw, midY);
  const branches = makeBranches(bolt, cw, midY, 3 + Math.floor(Math.random() * 4));

  const allPts = [...bolt, ...branches.flatMap(b => b.pts)];
  for (const pt of allPts) {
    for (const cloud of clouds) {
      if (Math.abs(pt.x - cloud.x) < cloud.w * 0.65 && Math.abs(pt.y - cloud.y) < 68) {
        cloud.glow = 1.0;
      }
    }
  }

  return { bolt, branches, flash: 0.8, age: 0 };
}

function drawPath(ctx, pts) {
  if (!pts || pts.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
  ctx.stroke();
}

function drawLightningUnder(ctx, strike) {
  if (!strike || strike.flash <= 0.01) return;
  const step = Math.max(1, Math.floor(strike.bolt.length / 6));
  for (let i = 0; i < strike.bolt.length; i += step) {
    const pt = strike.bolt[i];
    const g  = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, 100);
    g.addColorStop(0,   `rgba(180,210,255,${(strike.flash * 0.5).toFixed(3)})`);
    g.addColorStop(0.5, `rgba(130,170,240,${(strike.flash * 0.2).toFixed(3)})`);
    g.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(pt.x - 100, pt.y - 80, 200, 160);
  }
}

function drawLightningOver(ctx, strike) {
  if (!strike) return false;
  strike.age++;
  const boltAlpha = Math.max(0, 1 - strike.age / 12);

  if (boltAlpha > 0) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.lineJoin = 'round';

    ctx.globalAlpha  = boltAlpha * 0.95;
    ctx.strokeStyle  = 'rgba(200,225,255,1)';
    ctx.lineWidth    = 2.8;
    ctx.shadowColor  = '#c0daff';
    ctx.shadowBlur   = 24;
    drawPath(ctx, strike.bolt);
    ctx.strokeStyle  = '#ffffff';
    ctx.lineWidth    = 1.2;
    ctx.shadowBlur   = 8;
    drawPath(ctx, strike.bolt);

    for (const { pts, level } of strike.branches) {
      const lw   = level === 1 ? 1.6 : 0.9;
      const blur = level === 1 ? 14  : 7;
      const a    = level === 1 ? 0.8 : 0.6;
      ctx.globalAlpha = boltAlpha * a;
      ctx.strokeStyle = 'rgba(180,215,255,0.9)';
      ctx.lineWidth   = lw;
      ctx.shadowColor = '#b0d0ff';
      ctx.shadowBlur  = blur;
      drawPath(ctx, pts);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth   = lw * 0.5;
      ctx.shadowBlur  = blur * 0.4;
      drawPath(ctx, pts);
    }

    ctx.restore();
  }

  strike.flash *= strike.age < 3 ? 0.4 : 0.72;
  return strike.age < 14;
}

// ── Cloud helpers ─────────────────────────────────────────────────────────────

function makeCloud(cw) {
  const w = 160 + Math.random() * 220;
  return {
    x:       Math.random() * cw,
    y:       20 + Math.random() * 60,
    w,
    glow:    0,
    speed:   (0.10 + Math.random() * 0.20) * (Math.random() > 0.5 ? 1 : -1),
    opacity: 0.82 + Math.random() * 0.18,
    puffs:   Array.from({ length: 18 + Math.floor(Math.random() * 10) }, () => ({
      dx: (Math.random() - 0.3) * w,
      dy: (Math.random() - 0.5) * 22,
      r:  36 + Math.random() * 56,
    })),
  };
}

function drawCloud(ctx, cloud, cw) {
  for (const p of cloud.puffs) {
    const gx = cloud.x + p.dx;
    const gy = cloud.y + p.dy;
    const g  = ctx.createRadialGradient(gx, gy, 0, gx, gy, p.r);
    g.addColorStop(0,    `rgba(210,210,210,${cloud.opacity})`);
    g.addColorStop(0.3,  `rgba(160,160,160,${(cloud.opacity * 0.85).toFixed(2)})`);
    g.addColorStop(0.62, `rgba(100,100,100,${(cloud.opacity * 0.45).toFixed(2)})`);
    g.addColorStop(0.85, `rgba(55,55,55,${(cloud.opacity * 0.15).toFixed(2)})`);
    g.addColorStop(1,    'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.arc(gx, gy, p.r, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
  }

  if (cloud.glow > 0.01) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const gr = ctx.createRadialGradient(cloud.x, cloud.y, 0, cloud.x, cloud.y, cloud.w * 0.6);
    gr.addColorStop(0,    `rgba(200,225,255,${(cloud.glow * 0.95).toFixed(3)})`);
    gr.addColorStop(0.35, `rgba(160,200,255,${(cloud.glow * 0.6).toFixed(3)})`);
    gr.addColorStop(0.7,  `rgba(100,150,230,${(cloud.glow * 0.25).toFixed(3)})`);
    gr.addColorStop(1,    'rgba(0,0,0,0)');
    ctx.fillStyle = gr;
    ctx.fillRect(cloud.x - cloud.w * 0.65, cloud.y - 75, cloud.w * 1.3, 150);
    ctx.restore();
    cloud.glow *= 0.86;
  }

  cloud.x += cloud.speed;
  if (cloud.x >  cw + cloud.w) cloud.x = -cloud.w;
  if (cloud.x < -cloud.w)      cloud.x =  cw + cloud.w;
}

// ── Splash helper ─────────────────────────────────────────────────────────────

function spawnSplash(splashes, x, y, palette) {
  const count = 4 + Math.floor(Math.random() * 4);
  for (let s = 0; s < count; s++) {
    const angle = Math.PI * (0.1 + Math.random() * 0.8);
    const speed = 1.5 + Math.random() * 3.5;
    splashes.push({
      x,
      y,
      vx:    Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
      vy:    -Math.abs(Math.sin(angle) * speed) - 0.5,
      ay:    0.18,
      a:     0.85 + Math.random() * 0.15,
      glyph: GREEK[Math.floor(Math.random() * GREEK.length)],
      color: palette[Math.floor(Math.random() * palette.length)],
      size:  7 + Math.random() * 7,
    });
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

export const RainAnimation = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animId;
    let cols, drops, palettes, clouds;
    const splashes = [];
    let strike     = null;
    let lastStrike = performance.now();
    let nextStrike = nextDelay();

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      cols     = Math.floor(canvas.width / FONT_SIZE);
      drops    = Array.from({ length: cols }, () => Math.random() * -(canvas.height / FONT_SIZE) * 2);
      palettes = Array.from({ length: cols }, () => PALETTES[Math.floor(Math.random() * PALETTES.length)]);
      clouds   = Array.from({ length: 40 }, () => makeCloud(canvas.width));
      splashes.length = 0;
    };

    const draw = (now) => {
      ctx.fillStyle = 'rgba(0,0,0,0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (now - lastStrike >= nextStrike) {
        strike     = triggerStrike(clouds, canvas.width);
        lastStrike = now;
        nextStrike = nextDelay();
        window.dispatchEvent(new CustomEvent('lightning-strike'));
      }

      for (const cloud of clouds) drawCloud(ctx, cloud, canvas.width);

      if (strike) {
        const alive = drawLightningOver(ctx, strike);
        if (!alive) strike = null;
      }

      ctx.font = `${FONT_SIZE}px monospace`;
      for (let i = 0; i < cols; i++) {
        const y = drops[i] * FONT_SIZE;
        if (y < 0) { drops[i] += 1; continue; }

        const glyph = GREEK[Math.floor(Math.random() * GREEK.length)];
        ctx.fillStyle   = '#ffffff';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur  = 12;
        ctx.fillText(glyph, i * FONT_SIZE, y);
        ctx.shadowBlur  = 0;
        drops[i] += 1;

        if (drops[i] * FONT_SIZE > canvas.height) {
          spawnSplash(splashes, i * FONT_SIZE + FONT_SIZE / 2, canvas.height, palettes[i]);
          drops[i]    = -(8 + Math.random() * 80);
          palettes[i] = PALETTES[Math.floor(Math.random() * PALETTES.length)];
        }
      }

      for (let j = splashes.length - 1; j >= 0; j--) {
        const s = splashes[j];
        s.x += s.vx; s.y += s.vy; s.vy += s.ay; s.a -= 0.032;
        if (s.a <= 0 || s.y > canvas.height + FONT_SIZE) { splashes.splice(j, 1); continue; }
        ctx.save();
        ctx.globalAlpha = Math.max(0, s.a);
        ctx.fillStyle   = s.color;
        ctx.shadowColor = s.color;
        ctx.shadowBlur  = 8;
        ctx.font        = `${s.size}px monospace`;
        ctx.fillText(s.glyph, s.x, s.y);
        ctx.restore();
      }

      animId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity: 0.45,
        zIndex: 0,
      }}
    />
  );
};

export default RainAnimation;
