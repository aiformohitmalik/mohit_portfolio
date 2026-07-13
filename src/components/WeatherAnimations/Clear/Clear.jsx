import { useEffect, useRef } from 'react';

// Sun position: upper-right, matching the reference image
const SUN_X_RATIO = 0.72;
const SUN_Y_RATIO = 0.18;
const RAY_COUNT   = 14;
const PARTICLES   = 70;

function initParticles(cw, ch) {
  return Array.from({ length: PARTICLES }, () => ({
    x:    Math.random() * cw,
    y:    Math.random() * ch,
    r:    0.8 + Math.random() * 2.2,
    vx:   (Math.random() - 0.5) * 0.18,
    vy:   -(0.12 + Math.random() * 0.28),   // slowly drift upward
    a:    0.3 + Math.random() * 0.5,
    life: Math.random(),                      // phase offset
  }));
}

export const ClearAnimation = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animId;
    let particles = [];
    let rayAngle  = 0;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      particles     = initParticles(canvas.width, canvas.height);
    };

    const drawSky = (cw, ch, sx, sy) => {
      // Base sky: deep blue corners → lighter blue → near-white near sun
      const sky = ctx.createLinearGradient(0, 0, cw, ch * 0.6);
      sky.addColorStop(0,    '#1B6FA8');   // deep sky blue (top-left)
      sky.addColorStop(0.35, '#3E96C8');   // mid sky blue
      sky.addColorStop(0.65, '#87CEEB');   // light sky blue
      sky.addColorStop(1,    '#C8E8F8');   // pale sky near bottom
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, cw, ch);

      // Atmospheric haze near horizon (bottom brightens)
      const haze = ctx.createLinearGradient(0, ch * 0.5, 0, ch);
      haze.addColorStop(0,   'rgba(200,232,248,0)');
      haze.addColorStop(1,   'rgba(230,245,255,0.45)');
      ctx.fillStyle = haze;
      ctx.fillRect(0, 0, cw, ch);

      // Large warm glow bloom around the sun
      const bloom = ctx.createRadialGradient(sx, sy, 0, sx, sy, cw * 0.62);
      bloom.addColorStop(0,    'rgba(255,253,230,0.55)');
      bloom.addColorStop(0.12, 'rgba(255,240,150,0.30)');
      bloom.addColorStop(0.30, 'rgba(255,220,80,0.12)');
      bloom.addColorStop(0.55, 'rgba(135,200,240,0.08)');
      bloom.addColorStop(1,    'rgba(27,111,168,0)');
      ctx.fillStyle = bloom;
      ctx.fillRect(0, 0, cw, ch);
    };

    const drawRays = (sx, sy, cw, ch, angle) => {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const maxLen = Math.hypot(cw, ch) * 0.85;

      for (let i = 0; i < RAY_COUNT; i++) {
        const a       = angle + (i / RAY_COUNT) * Math.PI * 2;
        const spread  = (0.012 + (i % 3 === 0 ? 0.018 : 0.006));
        const alpha   = (i % 3 === 0 ? 0.07 : 0.04);

        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(
          sx + Math.cos(a - spread) * maxLen,
          sy + Math.sin(a - spread) * maxLen,
        );
        ctx.lineTo(
          sx + Math.cos(a + spread) * maxLen,
          sy + Math.sin(a + spread) * maxLen,
        );
        ctx.closePath();

        const grad = ctx.createRadialGradient(sx, sy, 40, sx, sy, maxLen);
        grad.addColorStop(0,    `rgba(255,252,210,${alpha})`);
        grad.addColorStop(0.35, `rgba(255,235,120,${alpha * 0.55})`);
        grad.addColorStop(1,    'rgba(135,200,240,0)');
        ctx.fillStyle = grad;
        ctx.fill();
      }
      ctx.restore();
    };

    const drawSun = (sx, sy) => {
      // Outermost soft corona
      const corona = ctx.createRadialGradient(sx, sy, 0, sx, sy, 220);
      corona.addColorStop(0,    'rgba(255,255,255,0.95)');
      corona.addColorStop(0.05, 'rgba(255,252,200,0.80)');
      corona.addColorStop(0.15, 'rgba(255,235,100,0.45)');
      corona.addColorStop(0.35, 'rgba(255,200,60,0.18)');
      corona.addColorStop(0.60, 'rgba(255,180,30,0.06)');
      corona.addColorStop(1,    'rgba(255,160,0,0)');
      ctx.beginPath();
      ctx.arc(sx, sy, 220, 0, Math.PI * 2);
      ctx.fillStyle = corona;
      ctx.fill();

      // Mid glow
      const mid = ctx.createRadialGradient(sx, sy, 0, sx, sy, 80);
      mid.addColorStop(0,    'rgba(255,255,255,1)');
      mid.addColorStop(0.25, 'rgba(255,253,220,0.90)');
      mid.addColorStop(0.55, 'rgba(255,230,100,0.55)');
      mid.addColorStop(1,    'rgba(255,200,50,0)');
      ctx.beginPath();
      ctx.arc(sx, sy, 80, 0, Math.PI * 2);
      ctx.fillStyle = mid;
      ctx.fill();

      // Hard sun disc
      const disc = ctx.createRadialGradient(sx, sy, 0, sx, sy, 28);
      disc.addColorStop(0,   'rgba(255,255,255,1)');
      disc.addColorStop(0.6, 'rgba(255,253,230,1)');
      disc.addColorStop(1,   'rgba(255,240,160,0.9)');
      ctx.beginPath();
      ctx.arc(sx, sy, 28, 0, Math.PI * 2);
      ctx.fillStyle = disc;
      ctx.fill();
    };

    const drawLensFlare = (sx, sy, cw, ch) => {
      // Lens flares along the axis: sun → opposite corner
      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      const flares = [
        { t: 0.18, r: 22, a: 0.18, c: 'rgba(255,255,180,' },
        { t: 0.32, r: 14, a: 0.12, c: 'rgba(160,220,255,' },
        { t: 0.50, r: 30, a: 0.08, c: 'rgba(255,240,100,' },
        { t: 0.65, r: 10, a: 0.14, c: 'rgba(200,240,255,' },
        { t: 0.82, r: 18, a: 0.09, c: 'rgba(255,255,200,' },
      ];

      const ax = cw - sx, ay = ch - sy; // axis direction
      for (const f of flares) {
        const fx = sx + ax * f.t;
        const fy = sy + ay * f.t;
        const g  = ctx.createRadialGradient(fx, fy, 0, fx, fy, f.r);
        g.addColorStop(0,   f.c + f.a + ')');
        g.addColorStop(0.5, f.c + (f.a * 0.4) + ')');
        g.addColorStop(1,   f.c + '0)');
        ctx.beginPath();
        ctx.arc(fx, fy, f.r, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      }
      ctx.restore();
    };

    const drawParticles = (cw, ch, t) => {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      for (const p of particles) {
        // Pulsing opacity — gives a "shimmering dust in sunlight" feel
        const pulse = 0.5 + 0.5 * Math.sin(t * 1.2 + p.life * Math.PI * 2);
        ctx.globalAlpha = p.a * pulse;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,252,220,1)';
        ctx.fill();

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Wrap at edges
        if (p.y < -4)  { p.y = ch + 4; p.x = Math.random() * cw; }
        if (p.x < -4)  { p.x = cw + 4; }
        if (p.x > cw + 4) { p.x = -4; }
      }

      ctx.restore();
    };

    const draw = (ts) => {
      const cw = canvas.width;
      const ch = canvas.height;
      const sx = cw * SUN_X_RATIO;
      const sy = ch * SUN_Y_RATIO;
      const t  = ts / 1000;

      rayAngle += 0.00025; // very slow rotation

      drawSky(cw, ch, sx, sy);
      drawRays(sx, sy, cw, ch, rayAngle);
      drawSun(sx, sy);
      drawLensFlare(sx, sy, cw, ch);
      drawParticles(cw, ch, t);

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
        opacity: 1,
        zIndex: 0,
      }}
    />
  );
};

export default ClearAnimation;
