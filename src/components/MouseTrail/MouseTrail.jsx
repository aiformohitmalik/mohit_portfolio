import { useEffect } from 'react';

const GREEK = [
  'α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ',
  'λ', 'μ', 'ν', 'ξ', 'π', 'ρ', 'σ', 'τ', 'φ', 'χ',
  'ψ', 'ω', 'Γ', 'Δ', 'Θ', 'Λ', 'Ξ', 'Π', 'Σ', 'Φ', 'Ψ', 'Ω',
];

const COLORS = ['#F5A623', '#F5A623', '#FFD580', '#E8941A', '#ffffff'];

export const MouseTrail = () => {
  useEffect(() => {
    // Canvas draws outside React's DOM tree — no z-index stacking context fights
    const canvas = document.createElement('canvas');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position      = 'fixed';
    canvas.style.top           = '0';
    canvas.style.left          = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex        = '2147483647'; // INT_MAX — above everything
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const pts = [];
    let raf;

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = pts.length - 1; i >= 0; i--) {
        const p = pts[i];
        p.a -= 0.025;
        if (p.a <= 0) { pts.splice(i, 1); continue; }
        p.x  += p.vx;
        p.y  += p.vy;
        p.vy *= 0.97;
        p.r  += p.spin;

        ctx.save();
        ctx.globalAlpha = p.a;
        ctx.fillStyle   = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur  = 10;
        ctx.font        = `700 ${p.size}px sans-serif`;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        ctx.fillText(p.glyph, 0, 0);
        ctx.restore();
      }

      raf = requestAnimationFrame(draw);
    }

    function onMove(e) {
      if (pts.length >= 80) return;
      pts.push({
        x:     e.clientX,
        y:     e.clientY,
        glyph: GREEK[Math.floor(Math.random() * GREEK.length)],
        size:  13 + Math.random() * 13,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        vx:    (Math.random() - 0.5) * 2.5,
        vy:    -(0.6 + Math.random() * 2),
        a:     1,
        r:     (Math.random() - 0.5) * 0.8,
        spin:  (Math.random() - 0.5) * 0.06,
      });
    }

    function onResize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('resize',    onResize);
    raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize',    onResize);
      cancelAnimationFrame(raf);
      canvas.remove();
    };
  }, []);

  return null;
};

export default MouseTrail;
