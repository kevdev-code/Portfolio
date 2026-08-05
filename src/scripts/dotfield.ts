// Canvas dot field: replaces the old CSS `.dots` mask-spotlight div.
// Owns its own mouse tracking + rAF loop. The loop only keeps running while
// the mouse is still lerping toward its target or an egg effect is active —
// an idle canvas repaints zero frames. Also exposes a tiny API so the
// easter egg (Header.astro) can light up dots to spell out a word.

const GRID = 28; // px spacing, matches the old background-size
const DOT_RGB = '90, 107, 99'; // ~= oklch(0.42 0.04 160)
const BUTTER_RGB = '236, 217, 141'; // ~= oklch(0.88 0.11 95)
const BASE_ALPHA = 0.16;
const REDUCED_ALPHA = 0.25;
const SPOTLIGHT_RADIUS = 520;
const SPOTLIGHT_MAX_ALPHA = 1.0;
const LERP = 0.18;
const SWEEP_MS = 350; // left-to-right stagger window across the word
const POP_MS = 320; // each dot's own r:1->2.5 pop transition
const CLEAR_MS = 450; // fade lit dots back to the normal grid

interface Dot { x: number; y: number }
interface LitDot { delay: number }

const canvas = document.getElementById('dotfield') as HTMLCanvasElement | null;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const ctx = canvas?.getContext('2d') ?? null;

let dpr = Math.max(1, window.devicePixelRatio || 1);
let width = window.innerWidth;
let height = window.innerHeight;
let dots: Dot[] = [];

let hasMouseMoved = false;
let mouseX = width * 0.5;
let mouseY = height * 0.3; // matches the old default mask position (50%, 30%)
let curX = mouseX;
let curY = mouseY;
let rafId: number | null = null;

let litDots: Map<number, LitDot> = new Map();
let wordPhase: 'idle' | 'popping' | 'clearing' = 'idle';
let phaseStart = 0;
let resolveDraw: (() => void) | null = null;
let resolveClear: (() => void) | null = null;

function buildGrid(): void {
  if (!canvas || !ctx) return;
  width = Math.max(1, window.innerWidth);
  height = Math.max(1, window.innerHeight);
  dpr = Math.max(1, window.devicePixelRatio || 1);
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  dots = [];
  const cols = Math.ceil(width / GRID) + 1;
  const rows = Math.ceil(height / GRID) + 1;
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) dots.push({ x: i * GRID, y: j * GRID });
  }
}

function spotlightAlpha(dx: number, dy: number): number {
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist >= SPOTLIGHT_RADIUS) return BASE_ALPHA;
  const t = 1 - dist / SPOTLIGHT_RADIUS;
  const eased = t * t * (3 - 2 * t); // smoothstep, mirrors the old radial mask falloff
  return BASE_ALPHA + (SPOTLIGHT_MAX_ALPHA - BASE_ALPHA) * eased;
}

function paint(now: number): void {
  if (!ctx) return;
  ctx.clearRect(0, 0, width, height);
  for (let i = 0; i < dots.length; i++) {
    const d = dots[i];
    const lit = litDots.get(i);
    if (lit) {
      const raw = wordPhase === 'clearing'
        ? 1 - Math.min(1, (now - phaseStart) / CLEAR_MS)
        : Math.min(1, Math.max(0, (now - phaseStart - lit.delay) / POP_MS));
      const eased = raw * raw * (3 - 2 * raw);
      if (eased > 0) {
        ctx.beginPath();
        ctx.fillStyle = `rgba(${BUTTER_RGB}, ${eased})`;
        ctx.arc(d.x, d.y, 1 + eased * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
      if (eased < 1) {
        ctx.beginPath();
        ctx.fillStyle = `rgba(${DOT_RGB}, ${BASE_ALPHA * (1 - eased)})`;
        ctx.arc(d.x, d.y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
      continue;
    }
    const alpha = reduced ? REDUCED_ALPHA : spotlightAlpha(d.x - curX, d.y - curY);
    ctx.beginPath();
    ctx.fillStyle = `rgba(${DOT_RGB}, ${alpha})`;
    ctx.arc(d.x, d.y, 1, 0, Math.PI * 2);
    ctx.fill();
  }
}

function render(): void {
  paint(performance.now());
}

function loop(now: number): void {
  rafId = null;

  const dx = mouseX - curX;
  const dy = mouseY - curY;
  if (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05) {
    curX += dx * LERP;
    curY += dy * LERP;
  } else {
    curX = mouseX;
    curY = mouseY;
  }

  if (wordPhase === 'popping' && now - phaseStart >= SWEEP_MS + POP_MS) {
    wordPhase = 'idle';
    const r = resolveDraw;
    resolveDraw = null;
    r?.();
  } else if (wordPhase === 'clearing' && now - phaseStart >= CLEAR_MS) {
    wordPhase = 'idle';
    litDots.clear();
    const r = resolveClear;
    resolveClear = null;
    r?.();
  }

  paint(now);

  const stillMoving = Math.abs(mouseX - curX) > 0.05 || Math.abs(mouseY - curY) > 0.05;
  const stillAnimating = wordPhase === 'popping' || wordPhase === 'clearing';
  if (!reduced && (stillMoving || stillAnimating)) rafId = requestAnimationFrame(loop);
}

function ensureLoop(): void {
  if (rafId == null && !reduced) rafId = requestAnimationFrame(loop);
}

async function sampleWord(text: string): Promise<(x: number, y: number) => boolean> {
  try { await document.fonts.ready; } catch { /* best-effort */ }
  const off = document.createElement('canvas');
  off.width = Math.max(1, width);
  off.height = Math.max(1, height);
  const octx = off.getContext('2d');
  if (!octx) return () => false;

  const targetWidth = width * 0.7;
  const probeSize = 100;
  octx.font = `800 ${probeSize}px "Bricolage Grotesque", sans-serif`;
  const measured = octx.measureText(text).width || 1;
  const fontSize = Math.max(12, (targetWidth / measured) * probeSize);
  octx.font = `800 ${fontSize}px "Bricolage Grotesque", sans-serif`;
  octx.fillStyle = '#fff';
  octx.textAlign = 'center';
  octx.textBaseline = 'middle';
  octx.fillText(text, width / 2, height / 2);

  const img = octx.getImageData(0, 0, off.width, off.height);
  return (x: number, y: number) => {
    const ix = Math.round(x);
    const iy = Math.round(y);
    if (ix < 0 || iy < 0 || ix >= off.width || iy >= off.height) return false;
    return img.data[(iy * off.width + ix) * 4 + 3] > 128;
  };
}

export const dotfield = {
  /** Lights up the dots that fall under `text`, sweeping left to right. */
  async drawWord(text: string): Promise<void> {
    if (!canvas || !ctx || reduced) return;
    const has = await sampleWord(text);
    const litIdx: number[] = [];
    let minX = Infinity;
    let maxX = -Infinity;
    for (let i = 0; i < dots.length; i++) {
      if (has(dots[i].x, dots[i].y)) {
        litIdx.push(i);
        minX = Math.min(minX, dots[i].x);
        maxX = Math.max(maxX, dots[i].x);
      }
    }
    litDots = new Map();
    if (litIdx.length === 0) return;
    const spanX = Math.max(1, maxX - minX);
    for (const i of litIdx) litDots.set(i, { delay: ((dots[i].x - minX) / spanX) * SWEEP_MS });

    wordPhase = 'popping';
    phaseStart = performance.now();
    ensureLoop();
    return new Promise((resolve) => { resolveDraw = resolve; });
  },

  /** Fades lit word-dots back into the normal grid. */
  async clearWord(): Promise<void> {
    if (!canvas || !ctx) return;
    if (litDots.size === 0) { wordPhase = 'idle'; return; }
    wordPhase = 'clearing';
    phaseStart = performance.now();
    ensureLoop();
    return new Promise((resolve) => { resolveClear = resolve; });
  },
};

buildGrid();
if (!reduced) {
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    hasMouseMoved = true;
    ensureLoop();
  }, { passive: true });
}
window.addEventListener('resize', () => {
  buildGrid();
  if (!hasMouseMoved) { mouseX = width * 0.5; mouseY = height * 0.3; curX = mouseX; curY = mouseY; }
  render();
});
render();
