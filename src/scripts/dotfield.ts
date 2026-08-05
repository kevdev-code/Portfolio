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
const POP_MS = 320; // each dot's own pop-in transition
const CLEAR_MS = 450; // fade lit dots back to the normal grid

// Hand-defined 5x7 bitmap font — the only glyphs the egg needs ("kevindlv").
// Sampling real text glyphs at 28px grid resolution lost thin strokes and
// read as noise; a hand-tuned bitmap guarantees every letter is legible.
const FONT_W = 5;
const FONT_H = 7;
const FONT: Record<string, string[]> = {
  k: ['10001', '10010', '10100', '11000', '10100', '10010', '10001'],
  e: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  v: ['10001', '10001', '10001', '10001', '10001', '01010', '00100'],
  i: ['01110', '00100', '00100', '00100', '00100', '00100', '01110'],
  n: ['10001', '11001', '10101', '10011', '10001', '10001', '10001'],
  d: ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
  l: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
};
const LETTER_GAP = 1; // columns of blank space between letters

interface Dot { x: number; y: number }
interface WordDot { x: number; y: number; delay: number }

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

let wordDots: WordDot[] = [];
let wordRadius = 2.5;
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
    const alpha = reduced ? REDUCED_ALPHA : spotlightAlpha(d.x - curX, d.y - curY);
    ctx.beginPath();
    ctx.fillStyle = `rgba(${DOT_RGB}, ${alpha})`;
    ctx.arc(d.x, d.y, 1, 0, Math.PI * 2);
    ctx.fill();
  }

  if (wordDots.length === 0) return;
  const rMin = Math.max(0.6, wordRadius * 0.3);
  for (let i = 0; i < wordDots.length; i++) {
    const w = wordDots[i];
    const raw = wordPhase === 'clearing'
      ? 1 - Math.min(1, (now - phaseStart) / CLEAR_MS)
      : Math.min(1, Math.max(0, (now - phaseStart - w.delay) / POP_MS));
    const eased = raw * raw * (3 - 2 * raw);
    if (eased <= 0) continue;
    ctx.beginPath();
    ctx.fillStyle = `rgba(${BUTTER_RGB}, ${eased})`;
    ctx.arc(w.x, w.y, rMin + eased * (wordRadius - rMin), 0, Math.PI * 2);
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
    wordDots = [];
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

/** Builds the lit-dot positions for `text` using the hand-drawn 5x7 FONT, sized to fill ~85% of the viewport width (bumped to 2x grid spacing when there's room to spare, shrunk continuously below 1x when the viewport is too narrow — e.g. mobile). */
function buildWordDots(text: string): WordDot[] {
  const letters = text.split('').map((c) => FONT[c.toLowerCase()]).filter((g): g is string[] => !!g);
  if (letters.length === 0) return [];

  const cols = letters.length * FONT_W + (letters.length - 1) * LETTER_GAP;
  const rows = FONT_H;
  const targetWidth = width * 0.85;

  let spacing = GRID;
  if ((cols - 1) * GRID * 2 <= targetWidth) spacing = GRID * 2; // room to spare -> bolder
  if ((cols - 1) * spacing > targetWidth) spacing = targetWidth / (cols - 1); // too wide (e.g. mobile) -> shrink to fit
  spacing = Math.max(3, spacing);
  wordRadius = Math.max(1, spacing * 0.35);

  const totalW = (cols - 1) * spacing;
  const totalH = (rows - 1) * spacing;
  const originX = (width - totalW) / 2;
  const originY = (height - totalH) / 2;

  const out: WordDot[] = [];
  letters.forEach((glyph, li) => {
    const colOffset = li * (FONT_W + LETTER_GAP);
    for (let r = 0; r < FONT_H; r++) {
      for (let c = 0; c < FONT_W; c++) {
        if (glyph[r][c] !== '1') continue;
        const col = colOffset + c;
        out.push({ x: originX + col * spacing, y: originY + r * spacing, delay: 0 });
      }
    }
  });

  const maxCol = cols - 1;
  for (const w of out) w.delay = maxCol > 0 ? ((w.x - originX) / totalW) * SWEEP_MS : 0;
  return out;
}

export const dotfield = {
  /** Lights up dots forming `text` (hand-drawn bitmap font), sweeping left to right. */
  async drawWord(text: string): Promise<void> {
    if (!canvas || !ctx || reduced) return;
    wordDots = buildWordDots(text);
    if (wordDots.length === 0) return;

    wordPhase = 'popping';
    phaseStart = performance.now();
    ensureLoop();
    return new Promise((resolve) => { resolveDraw = resolve; });
  },

  /** Fades lit word-dots back into the normal grid. */
  async clearWord(): Promise<void> {
    if (!canvas || !ctx) return;
    if (wordDots.length === 0) { wordPhase = 'idle'; return; }
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
