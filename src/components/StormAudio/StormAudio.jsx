import { useEffect, useRef } from 'react';

function makePinkNoise(ctx, seconds = 6) {
  const sr  = ctx.sampleRate;
  const buf = ctx.createBuffer(1, sr * seconds, sr);
  const d   = buf.getChannelData(0);
  let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
  for (let i = 0; i < d.length; i++) {
    const w = Math.random() * 2 - 1;
    b0 = 0.99886*b0 + w*0.0555179; b1 = 0.99332*b1 + w*0.0750759;
    b2 = 0.96900*b2 + w*0.1538520; b3 = 0.86650*b3 + w*0.3104856;
    b4 = 0.55000*b4 + w*0.5329522; b5 = -0.7616*b5 - w*0.0168980;
    d[i] = (b0+b1+b2+b3+b4+b5+b6+w*0.5362)*0.11;
    b6   = w*0.115926;
  }
  return buf;
}

function makeWhiteNoise(ctx, seconds = 4) {
  const sr  = ctx.sampleRate;
  const buf = ctx.createBuffer(1, sr * seconds, sr);
  const d   = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return buf;
}

export const StormAudio = () => {
  const audioCtx   = useRef(null);
  const masterGain = useRef(null);
  const started    = useRef(false);

  useEffect(() => {
    const init = () => {
      if (started.current) return;
      started.current = true;

      const ctx    = new (window.AudioContext || window.webkitAudioContext)();
      const master = ctx.createGain();
      master.gain.value = 0.7;
      master.connect(ctx.destination);
      audioCtx.current   = ctx;
      masterGain.current = master;

      // Rain: looping pink noise → lowpass → highpass → gain
      const rainBuf = makePinkNoise(ctx, 8);
      const rain    = ctx.createBufferSource();
      rain.buffer   = rainBuf;
      rain.loop     = true;
      const rainLPF = ctx.createBiquadFilter();
      rainLPF.type            = 'lowpass';
      rainLPF.frequency.value = 4000;
      rainLPF.Q.value         = 0.5;
      const rainHP = ctx.createBiquadFilter();
      rainHP.type            = 'highpass';
      rainHP.frequency.value = 300;
      const rainGain = ctx.createGain();
      rainGain.gain.value = 0.55;
      rain.connect(rainLPF);
      rainLPF.connect(rainHP);
      rainHP.connect(rainGain);
      rainGain.connect(master);
      rain.start();

      // Deep rumble oscillator + slow LFO
      const rumble = ctx.createOscillator();
      rumble.type            = 'sine';
      rumble.frequency.value = 28;
      const lfo     = ctx.createOscillator();
      lfo.frequency.value   = 0.08;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value    = 12;
      lfo.connect(lfoGain);
      lfoGain.connect(rumble.frequency);
      const rumbleGain = ctx.createGain();
      rumbleGain.gain.value = 0.12;
      rumble.connect(rumbleGain);
      rumbleGain.connect(master);
      rumble.start();
      lfo.start();

      // Sub-bass layer
      const sub = ctx.createOscillator();
      sub.type            = 'triangle';
      sub.frequency.value = 45;
      const subGain = ctx.createGain();
      subGain.gain.value  = 0.06;
      sub.connect(subGain);
      subGain.connect(master);
      sub.start();
    };

    const onLightning = () => {
      const ctx    = audioCtx.current;
      const master = masterGain.current;
      if (!ctx || !master) return;
      const delay = 0.4 + Math.random() * 1.8;
      setTimeout(() => {
        if (ctx.state === 'closed') return;
        const src = ctx.createBufferSource();
        src.buffer = makeWhiteNoise(ctx, 5);
        const lpf   = ctx.createBiquadFilter();
        lpf.type            = 'lowpass';
        lpf.frequency.value = 120;
        const tGain = ctx.createGain();
        const now   = ctx.currentTime;
        tGain.gain.setValueAtTime(0, now);
        tGain.gain.linearRampToValueAtTime(0.55, now + 0.08);
        tGain.gain.exponentialRampToValueAtTime(0.001, now + 4.5);
        src.connect(lpf);
        lpf.connect(tGain);
        tGain.connect(master);
        src.start(now);
        src.stop(now + 5);
      }, delay * 1000);
    };

    const onScroll = () => {
      const master = masterGain.current;
      const ctx    = audioCtx.current;
      if (!master || !ctx) return;
      const vol = Math.max(0, 1 - window.scrollY / window.innerHeight);
      master.gain.setTargetAtTime(vol * 0.7, ctx.currentTime, 0.4);
    };

    const onInteract = () => {
      init();
      window.removeEventListener('mousemove', onInteract);
      window.removeEventListener('click',     onInteract);
      window.removeEventListener('keydown',   onInteract);
    };

    window.addEventListener('mousemove',        onInteract,  { once: false });
    window.addEventListener('click',            onInteract,  { once: false });
    window.addEventListener('keydown',          onInteract,  { once: false });
    window.addEventListener('scroll',           onScroll,    { passive: true });
    window.addEventListener('lightning-strike', onLightning);

    return () => {
      window.removeEventListener('mousemove',        onInteract);
      window.removeEventListener('click',            onInteract);
      window.removeEventListener('keydown',          onInteract);
      window.removeEventListener('scroll',           onScroll);
      window.removeEventListener('lightning-strike', onLightning);
      if (audioCtx.current) audioCtx.current.close();
    };
  }, []);

  return null;
};

export default StormAudio;
