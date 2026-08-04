# Portafolio One-Page Bilingüe (Astro) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir el portafolio one-page bilingüe (EN en `/`, ES en `/es/`) en Astro con la dirección visual "Precisión con chispa" (mockup G), listo para deploy estático en Vercel.

**Architecture:** Sitio estático Astro. Un layout base con head/i18n/fondos globales, componentes de sección puros (reciben `lang` como prop), textos de UI en diccionarios TypeScript, proyectos como content collection. Motion en CSS + vanilla JS por componente, portado del mockup G.

**Tech Stack:** Astro ^6 (estático), TypeScript strict, `@fontsource-variable/bricolage-grotesque`, `@fontsource/jetbrains-mono`, `@astrojs/sitemap`, `sharp` (solo dev, para OG image).

## Global Constraints

- **Fuente de verdad visual:** `mockups/g-hibrido-turbo.html` (en el repo). Cuando un paso diga "portar selectores X del mockup", copiar esos bloques CSS/JS **verbatim** de ese archivo y solo adaptar lo indicado.
- **Tokens de color/tipografía/motion:** los de `DESIGN.md`, sin invención. OKLCH siempre, nunca hex.
- **Rutas i18n:** `defaultLocale: "en"` sin prefijo (`/`), español en `/es/`. `hreflang` alternates en toda página.
- **Motion:** curvas `cubic-bezier(0.22,1,0.36,1)` y `cubic-bezier(0.16,1,0.3,1)` únicamente. Prohibido bounce/elastic. Todo animado debe tener alternativa en `@media (prefers-reduced-motion: reduce)`. El contenido debe ser visible y navegable sin JavaScript.
- **Copy:** máximo 2 rayas (—) en el copy visible por página. El humor se escribe por idioma, no se traduce literal.
- **Contenido placeholder:** todo dato personal pendiente lleva el marcador exacto `KEVIN-TODO` en un comentario adyacente. La Task 12 los reemplaza con datos reales del autor.
- **Accesibilidad:** WCAG AA. Texto cuerpo ≥4.5:1 vs fondo. Elementos decorativos con `aria-hidden="true"`. HTML semántico (`header/main/section/footer`, un solo `h1`).
- **Verificación por task:** cada task termina con `npm run build` (y `npx astro check` donde se indique) en verde y un commit.

## File Structure

```
astro.config.mjs               — i18n, site, sitemap
package.json / tsconfig.json   — scripts y TS strict
src/
  styles/global.css            — tokens, reset, base compartida, fondos, reveals
  i18n/ui.ts                   — diccionarios en/es + helpers (paridad de claves por tipo)
  data/skills.ts               — listas web/móvil (datos, no UI)
  data/experience.ts           — filas de experiencia por idioma
  content.config.ts            — colección `projects`
  content/projects/proyecto-uno.md
  assets/proyecto-uno-shot.svg — captura placeholder
  layouts/Base.astro           — head, fuentes, hreflang, fondos, Header/Footer
  components/Header.astro      — nav + toggle ES/EN
  components/Footer.astro
  components/Hero.astro        — badge, titular, squiggle, flotantes, CTAs
  components/Marquee.astro
  components/About.astro
  components/Stack.astro       — stickers
  components/FeaturedProject.astro
  components/Experience.astro
  components/Contact.astro
  pages/index.astro            — EN
  pages/es/index.astro         — ES
  pages/404.astro              — bilingüe
public/favicon.svg
scripts/og.mjs                 — genera public/og.png desde SVG con sharp
```

---

### Task 1: Scaffold Astro

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/pages/index.astro`, `.gitignore`

**Interfaces:**
- Produces: proyecto Astro que compila; scripts npm `dev`, `build`, `preview`, `check`.

- [ ] **Step 1: Crear archivos base** (scaffold manual: el directorio no está vacío y el scaffolder interactivo estorba)

`package.json`:
```json
{
  "name": "portfolio",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check"
  }
}
```

`astro.config.mjs`:
```js
// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://portfolio-kevin.vercel.app', // KEVIN-TODO: dominio real al hacer deploy
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: { prefixDefaultLocale: false },
  },
});
```

`tsconfig.json`:
```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "src/**/*"],
  "exclude": ["dist"]
}
```

`src/pages/index.astro`:
```astro
---
---
<html lang="en">
  <head><meta charset="utf-8" /><title>ok</title></head>
  <body><h1>scaffold ok</h1></body>
</html>
```

`.gitignore`:
```
node_modules/
dist/
.astro/
```

- [ ] **Step 2: Instalar dependencias**

Run: `npm install astro @fontsource-variable/bricolage-grotesque @fontsource/jetbrains-mono && npm install -D @astrojs/check typescript sharp`
Expected: instala sin errores (Astro ^6).

- [ ] **Step 3: Verificar build**

Run: `npm run build`
Expected: `dist/index.html` generado, exit 0.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "chore: scaffold Astro con i18n en/es"
```

---

### Task 2: Tokens y estilos globales

**Files:**
- Create: `src/styles/global.css`

**Interfaces:**
- Produces: variables CSS (`--bg`, `--surface`, `--border`, `--text`, `--muted`, `--mint`, `--mint-dim`, `--coral`, `--butter`, `--ease`, `--ease-pop`, `--mono`), clases compartidas `.wrap`, `.sec-head`, `.btn`/`.btn-solid`/`.btn-line`, `.dots`, `.grain`, `.reveal`/`.reveal-stagger`, keyframes `word-in`, `sticker-in`, `draw`, `pulse`, `drift`, `scroll-x`.

- [ ] **Step 1: Crear `src/styles/global.css`**

Portar **verbatim** del `<style>` de `mockups/g-hibrido-turbo.html` estos bloques, en este orden, dentro del archivo nuevo:

1. El bloque `:root { ... }` completo (tokens).
2. El reset `* { margin: 0; padding: 0; box-sizing: border-box; }`, `html { scroll-behavior: smooth; }` y el bloque `body { ... }`.
3. Los bloques `.dots { ... }` y `.grain { ... }`.
4. `main, header, footer, .marquee { position: relative; z-index: 1; }`.
5. `.wrap { ... }`.
6. Los bloques `section { ... }`, `.sec-head { ... }` y `.sec-head h2 { ... }`, `.sec-head .meta { ... }`.
7. Los bloques `.btn { ... }`, `.btn-solid { ... }`, `.btn-solid:hover`, `.btn-line`, `.btn-line:hover`.
8. Los bloques `.js .reveal { ... }`, `.js .reveal.in { ... }` y los keyframes `word-in`, `sticker-in`, `draw`, `pulse`, `drift`, `scroll-x` (búscalos por nombre en el mockup).
9. El bloque completo `@media (prefers-reduced-motion: reduce) { ... }` del final del mockup.

No portar aquí los estilos de secciones específicas (hero, stickers, proj, xp, contact, marquee, header/logo/nav): esos van scoped en sus componentes.

Eliminar del archivo la clase `.tag-variant` (era solo para etiquetar mockups).

- [ ] **Step 2: Verificar que compila**

Run: `npm run build`
Expected: exit 0 (el CSS aún no se importa; esto valida solo que nada se rompió).

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css && git commit -m "feat: tokens y estilos globales de DESIGN.md"
```

---

### Task 3: i18n — diccionarios y helpers

**Files:**
- Create: `src/i18n/ui.ts`

**Interfaces:**
- Produces: `type Lang = 'en' | 'es'`; `getLangFromUrl(url: URL): Lang`; `useTranslations(lang: Lang): (key: UIKey) => string`; `localizePath(lang: Lang, path?: string): string`; diccionario `ui` con paridad de claves entre idiomas garantizada por el tipo `es: Record<UIKey, string>`.

- [ ] **Step 1: Crear `src/i18n/ui.ts`**

```ts
export type Lang = 'en' | 'es';

const en = {
  'meta.title': 'Kevin López — Full-stack & mobile developer', // KEVIN-TODO nombre real
  'meta.description': 'Full-stack developer building web and mobile apps, member of The Dev Nest.',
  'nav.about': 'about',
  'nav.stack': 'stack',
  'nav.work': 'work',
  'nav.contact': 'contact',
  'hero.avail': 'available for projects',
  'hero.h1.pre': 'I build',
  'hero.h1.web': 'web apps',
  'hero.h1.and': 'and',
  'hero.h1.mobile': 'mobile apps',
  'hero.h1.post': 'that feel',
  'hero.h1.alive': 'alive.',
  'hero.intro.pre': "I'm Kevin, full-stack developer and member of", // KEVIN-TODO
  'hero.intro.post': 'From the database to the last pixel: I obsess over details (spacing, timing, feedback).',
  'hero.cta.talk': "Let's talk",
  'hero.cta.work': 'See my work',
  'float.fullstack': 'full-stack 🌱',
  'float.webmobile': 'web + mobile 📱',
  'float.nest': 'the dev nest 🪺',
  'about.title': 'About me',
  'about.meta': '// who I am',
  'about.body.strong': 'Full-stack developer by day, and also by night',
  'about.body.rest': '(coffee helps). I build complete, fast, carefully-made products. The interface should confirm every user intention with',
  'about.body.strong2': 'subtle motion, never distraction',
  'stack.title': 'Stack',
  'stack.meta': '// what I work with',
  'stack.web': 'web',
  'stack.mobile': 'mobile',
  'work.title': 'Featured project',
  'work.meta': '// selected work',
  'work.demo': 'demo ↗',
  'work.code': 'code ↗',
  'xp.title': 'Experience',
  'xp.meta': '// the road',
  'contact.title': 'Contact',
  'contact.meta': "// let's talk",
  'contact.body': 'Got an idea or a project? Write me, I answer fast.',
  'footer.made': 'handmade, no templates harmed',
  'footer.member': 'member of',
  'e404.title': 'Page not found',
  'e404.joke': "This page returned 404. Unlike me, it doesn't answer fast.",
  'e404.back': 'Back home',
  'marquee.items': 'web|mobile|frontend|backend|apis|ui that feels right',
} as const;

export type UIKey = keyof typeof en;

const es: Record<UIKey, string> = {
  'meta.title': 'Kevin López — Desarrollador full-stack y móvil', // KEVIN-TODO nombre real
  'meta.description': 'Desarrollador full-stack de apps web y móviles, miembro de The Dev Nest.',
  'nav.about': 'sobre mí',
  'nav.stack': 'stack',
  'nav.work': 'trabajo',
  'nav.contact': 'contacto',
  'hero.avail': 'disponible para proyectos',
  'hero.h1.pre': 'Construyo',
  'hero.h1.web': 'apps web',
  'hero.h1.and': 'y',
  'hero.h1.mobile': 'móviles',
  'hero.h1.post': 'que se sienten',
  'hero.h1.alive': 'vivas.',
  'hero.intro.pre': 'Soy Kevin, desarrollador full-stack y miembro de', // KEVIN-TODO
  'hero.intro.post': 'De la base de datos al último pixel: me obsesionan los detalles (espaciado, timing, feedback).',
  'hero.cta.talk': 'Hablemos',
  'hero.cta.work': 'Ver mi trabajo',
  'float.fullstack': 'full-stack 🌱',
  'float.webmobile': 'web + móvil 📱',
  'float.nest': 'the dev nest 🪺',
  'about.title': 'Sobre mí',
  'about.meta': '// quién soy',
  'about.body.strong': 'Desarrollador full-stack de día y también de noche',
  'about.body.rest': '(el café ayuda). Construyo productos completos, rápidos y cuidados. La interfaz debe confirmar cada intención del usuario con',
  'about.body.strong2': 'movimiento sutil, nunca distracción',
  'stack.title': 'Stack',
  'stack.meta': '// con qué trabajo',
  'stack.web': 'web',
  'stack.mobile': 'móvil',
  'work.title': 'Proyecto destacado',
  'work.meta': '// selected work',
  'work.demo': 'demo ↗',
  'work.code': 'código ↗',
  'xp.title': 'Experiencia',
  'xp.meta': '// trayecto',
  'contact.title': 'Contacto',
  'contact.meta': '// hablemos',
  'contact.body': '¿Tienes una idea o un proyecto? Escríbeme, respondo rápido.',
  'footer.made': 'hecho a mano, sin plantillas',
  'footer.member': 'miembro de',
  'e404.title': 'Página no encontrada',
  'e404.joke': 'Esta página devolvió 404. A diferencia de mí, no responde rápido.',
  'e404.back': 'Volver al inicio',
  'marquee.items': 'web|móvil|frontend|backend|apis|ui que se siente bien',
};

export const ui: Record<Lang, Record<UIKey, string>> = { en, es };

export function getLangFromUrl(url: URL): Lang {
  return url.pathname === '/es' || url.pathname.startsWith('/es/') ? 'es' : 'en';
}

export function useTranslations(lang: Lang) {
  return (key: UIKey): string => ui[lang][key];
}

/** Ruta localizada: localizePath('es') -> '/es/', localizePath('en') -> '/' */
export function localizePath(lang: Lang, path: string = '/'): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return lang === 'en' ? clean : `/es${clean === '/' ? '/' : clean}`;
}
```

La paridad de claves entre idiomas es un test de tipos: si a `es` le falta una clave de `en`, `astro check` falla. No se necesita test de runtime.

- [ ] **Step 2: Verificar tipos**

Run: `npx astro check`
Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/i18n/ui.ts && git commit -m "feat: diccionarios i18n en/es con paridad por tipos"
```

---

### Task 4: Base layout, Header y Footer

**Files:**
- Create: `src/layouts/Base.astro`, `src/components/Header.astro`, `src/components/Footer.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `getLangFromUrl`, `useTranslations`, `localizePath`, `Lang` de Task 3; clases globales de Task 2.
- Produces: `<Base lang={Lang}>` con slot; Header con toggle de idioma que conserva el hash; fondos `.dots`/`.grain` y su script de spotlight ya montados para todas las páginas.

- [ ] **Step 1: Crear `src/layouts/Base.astro`**

```astro
---
import '@fontsource-variable/bricolage-grotesque';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/600.css';
import '../styles/global.css';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import { useTranslations, localizePath, type Lang } from '../i18n/ui';

interface Props { lang: Lang }
const { lang } = Astro.props;
const t = useTranslations(lang);
const site = Astro.site ?? new URL('http://localhost:4321');
---
<!doctype html>
<html lang={lang} class="no-js">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{t('meta.title')}</title>
    <meta name="description" content={t('meta.description')} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="alternate" hreflang="en" href={new URL(localizePath('en'), site)} />
    <link rel="alternate" hreflang="es" href={new URL(localizePath('es'), site)} />
    <link rel="alternate" hreflang="x-default" href={new URL(localizePath('en'), site)} />
    <meta property="og:title" content={t('meta.title')} />
    <meta property="og:description" content={t('meta.description')} />
    <meta property="og:type" content="website" />
    <meta property="og:image" content={new URL('/og.png', site)} />
    <script is:inline>document.documentElement.classList.replace('no-js', 'js');</script>
  </head>
  <body>
    <div class="dots" aria-hidden="true"></div>
    <div class="grain" aria-hidden="true"></div>
    <Header lang={lang} />
    <slot />
    <Footer lang={lang} />
    <script>
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const io = new IntersectionObserver(
        (es) => es.forEach((e) => e.isIntersecting && e.target.classList.add('in')),
        { threshold: 0.12 },
      );
      document.querySelectorAll('.reveal, .reveal-stagger').forEach((el) => io.observe(el));
      if (!reduced) {
        const root = document.documentElement;
        addEventListener('mousemove', (e) => {
          root.style.setProperty('--sx', e.clientX + 'px');
          root.style.setProperty('--sy', e.clientY + 'px');
        }, { passive: true });
        document.querySelectorAll('.magnetic').forEach((btn) => {
          const b = btn as HTMLElement;
          b.addEventListener('mousemove', (e) => {
            const r = b.getBoundingClientRect();
            b.style.translate = `${(e.clientX - r.left - r.width / 2) * 0.16}px ${(e.clientY - r.top - r.height / 2) * 0.28}px`;
          });
          b.addEventListener('mouseleave', () => {
            b.style.transition = 'translate 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
            b.style.translate = '0px 0px';
            setTimeout(() => (b.style.transition = ''), 400);
          });
        });
      }
    </script>
  </body>
</html>
```

- [ ] **Step 2: Crear `src/components/Header.astro`**

Estructura (los estilos: portar verbatim del mockup G los selectores `header`, `.header-in`, `.logo`, `.logo:hover`, `nav`, `nav > a`, `nav > a:hover`, `.lang` y sus hijos, dentro del `<style>` del componente):

```astro
---
import { useTranslations, localizePath, type Lang } from '../i18n/ui';
interface Props { lang: Lang }
const { lang } = Astro.props;
const t = useTranslations(lang);
const otherLang: Lang = lang === 'en' ? 'es' : 'en';
---
<header>
  <div class="wrap header-in">
    <a class="logo" href={localizePath(lang)}>kevin.dev</a><!-- KEVIN-TODO nombre/handle real -->
    <nav>
      <a href="#about">{t('nav.about')}</a>
      <a href="#skills">{t('nav.stack')}</a>
      <a href="#work">{t('nav.work')}</a>
      <a href="#contact">{t('nav.contact')}</a>
      <a class="lang" href={localizePath(otherLang)} data-lang-switch aria-label={otherLang === 'es' ? 'Cambiar a español' : 'Switch to English'}>
        <b>{lang.toUpperCase()}</b><i>{otherLang.toUpperCase()}</i>
      </a>
    </nav>
  </div>
</header>
<style>
  /* portar selectores del mockup G aquí (ver instrucción arriba) */
</style>
<script>
  // el toggle conserva la sección visible: anexa el hash actual al href
  const sw = document.querySelector('[data-lang-switch]') as HTMLAnchorElement | null;
  if (sw) sw.addEventListener('click', () => { if (location.hash) sw.href = sw.href.split('#')[0] + location.hash; });
</script>
```

Nota: `.lang` en el mockup es un `div`; aquí es `<a>` para funcionar sin JS. Conservar el estilo, añadir `text-decoration: none;` al selector `.lang`.

- [ ] **Step 3: Crear `src/components/Footer.astro`**

Estilos: portar selectores `footer`, `footer .wrap` (renombrado a `.foot`), `footer a` del mockup G.

```astro
---
import { useTranslations, type Lang } from '../i18n/ui';
interface Props { lang: Lang }
const { lang } = Astro.props;
const t = useTranslations(lang);
const year = new Date().getFullYear();
---
<footer>
  <div class="wrap foot">
    <span>© {year} Kevin López · {t('footer.made')}</span><!-- KEVIN-TODO nombre real -->
    <span>{t('footer.member')} <a href="https://www.thedevnest.com/">the dev nest</a></span>
  </div>
</footer>
<style>
  /* portar selectores del mockup G aquí; .foot = display flex, space-between, wrap, mono 0.78rem */
</style>
```

- [ ] **Step 4: Conectar en `src/pages/index.astro`**

```astro
---
import Base from '../layouts/Base.astro';
---
<Base lang="en">
  <main class="wrap"><h1 style="padding:4rem 0">sections coming</h1></main>
</Base>
```

- [ ] **Step 5: Verificar**

Run: `npx astro check && npm run build`
Expected: 0 errors; `dist/index.html` contiene `hreflang="es"` y el header.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: layout base con fondos, header con toggle de idioma y footer"
```

---

### Task 5: Content collection de proyectos

**Files:**
- Create: `src/content.config.ts`, `src/content/projects/proyecto-uno.md`, `src/assets/proyecto-uno-shot.svg`

**Interfaces:**
- Produces: colección `projects` consultable con `getCollection('projects')`; schema: `title: string`, `tagline_en: string`, `tagline_es: string`, `stack: string[]`, `image: ImageMetadata`, `imageAlt_en: string`, `imageAlt_es: string`, `url?: string`, `repo?: string`, `date: Date`, `featured: boolean`.

- [ ] **Step 1: Crear `src/content.config.ts`**

```ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      tagline_en: z.string(),
      tagline_es: z.string(),
      stack: z.array(z.string()),
      image: image(),
      imageAlt_en: z.string(),
      imageAlt_es: z.string(),
      url: z.string().url().optional(),
      repo: z.string().url().optional(),
      date: z.coerce.date(),
      featured: z.boolean().default(false),
    }),
});

export const collections = { projects };
```

- [ ] **Step 2: Crear la captura placeholder `src/assets/proyecto-uno-shot.svg`**

Copiar el `<svg viewBox="0 0 480 320" ...>` completo del `.proj-shot` del mockup G a un archivo standalone (añadir `xmlns` ya lo trae; quitar `role`/`aria-label`, que van en el `<Image>`).

- [ ] **Step 3: Crear `src/content/projects/proyecto-uno.md`**

```markdown
---
title: "Proyecto Uno"
tagline_en: "The problem: [one real line]. The solution: an app that solves it fast and to the point." # KEVIN-TODO
tagline_es: "El problema: [una línea real]. La solución: una app que lo resuelve rápida y al grano." # KEVIN-TODO
stack: ["react", "node", "postgres"]
image: "../../assets/proyecto-uno-shot.svg"
imageAlt_en: "Screenshot of Proyecto Uno" # KEVIN-TODO
imageAlt_es: "Captura de Proyecto Uno" # KEVIN-TODO
date: 2026-01-01
featured: true
---
```

- [ ] **Step 4: Verificar**

Run: `npm run build`
Expected: exit 0, sin errores de schema.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: coleccion de proyectos con placeholder de Proyecto Uno"
```

---

### Task 6: Hero y Marquee

**Files:**
- Create: `src/components/Hero.astro`, `src/components/Marquee.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `useTranslations`, `Lang`; clases globales `.wrap`, `.btn*`, keyframes.
- Produces: `<Hero lang={Lang} />`, `<Marquee lang={Lang} />`.

- [ ] **Step 1: Crear `src/components/Hero.astro`**

Estilos scoped: portar del mockup G los selectores `.hero`, `.avail` (+`.dot`, keyframe uso), `.hero h1`, `.hero h1 .word` (y su variante `.js`), `.hl`, `.hl-mint`, `.hl-coral`, `.hl-butter`, `.hl:hover`, `.squiggle` (+path), `.hero p.intro`, `.fade-up` (variantes `.js`), `.cta-row`, `.float` (+`.inner`, `.f1`, `.f2`, `.f3`, media query). Nota Astro: los selectores que dependen de `html.js` deben escribirse `:global(.js) .hero h1 .word { ... }` etc., porque `.js` vive fuera del componente.

```astro
---
import { useTranslations, type Lang } from '../i18n/ui';
interface Props { lang: Lang }
const { lang } = Astro.props;
const t = useTranslations(lang);
---
<section class="hero" id="top">
  <span class="float f1" aria-hidden="true"><span class="inner">{t('float.fullstack')}</span></span>
  <span class="float f2" aria-hidden="true"><span class="inner">{t('float.webmobile')}</span></span>
  <span class="float f3" aria-hidden="true"><span class="inner">{t('float.nest')}</span></span>
  <span class="avail"><span class="dot"></span> {t('hero.avail')}</span>
  <h1 id="headline">
    {t('hero.h1.pre')} <span class="hl hl-mint">{t('hero.h1.web')}</span> {t('hero.h1.and')}
    <span class="hl hl-coral">{t('hero.h1.mobile')}</span> {t('hero.h1.post')}
    <span class="hl hl-butter">{t('hero.h1.alive')}</span>
  </h1>
  <svg class="squiggle" width="170" height="14" viewBox="0 0 180 14" fill="none" aria-hidden="true">
    <path d="M2 8 Q 15 2, 30 8 T 60 8 T 90 8 T 120 8 T 150 8 T 178 8" stroke="oklch(0.58 0.16 45)" stroke-width="4" stroke-linecap="round"/>
  </svg>
  <p class="intro fade-up">
    {t('hero.intro.pre')} <a href="https://www.thedevnest.com/">The Dev Nest</a>. {t('hero.intro.post')}
  </p>
  <div class="cta-row fade-up">
    <a class="btn btn-solid magnetic" href="#contact">{t('hero.cta.talk')}</a>
    <a class="btn btn-line magnetic" href="#work">{t('hero.cta.work')}</a>
  </div>
</section>
<style>/* portar selectores indicados arriba */</style>
<script>
  // titular palabra por palabra conservando resaltados — portar VERBATIM el bloque
  // "const h = document.getElementById('headline') ... setProperty('--i', i))" del mockup G.
  // Portar también el bloque de parallax de flotantes (const floats = ... requestAnimationFrame(loop))
  // envuelto en: if (!matchMedia('(prefers-reduced-motion: reduce)').matches) { ... }
</script>
```

- [ ] **Step 2: Crear `src/components/Marquee.astro`**

Estilos: portar selectores `.marquee`, `.marquee-track`, `.marquee span`, `.marquee span b` y variantes del mockup G.

```astro
---
import { useTranslations, type Lang } from '../i18n/ui';
interface Props { lang: Lang }
const { lang } = Astro.props;
const items = useTranslations(lang)('marquee.items').split('|');
---
<div class="marquee" aria-hidden="true">
  <div class="marquee-track">
    {[0, 1].map(() => items.map((item) => <span>{item} <b>✦</b></span>))}
  </div>
</div>
<style>/* portar selectores indicados arriba */</style>
```

- [ ] **Step 3: Montar en `index.astro`** (reemplazar el `<main>` placeholder)

```astro
---
import Base from '../layouts/Base.astro';
import Hero from '../components/Hero.astro';
import Marquee from '../components/Marquee.astro';
---
<Base lang="en">
  <main class="wrap">
    <Hero lang="en" />
  </main>
  <Marquee lang="en" />
</Base>
```

- [ ] **Step 4: Verificar**

Run: `npm run build && npm run dev`
Expected: build 0 errors; en `http://localhost:4321` el hero anima palabra por palabra, squiggle se dibuja, flotantes derivan y siguen el mouse, marquee corre y pausa al hover.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: hero con coreografia de entrada y marquee"
```

---

### Task 7: About y Stack

**Files:**
- Create: `src/components/About.astro`, `src/components/Stack.astro`, `src/data/skills.ts`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Produces: `<About lang={Lang} />`, `<Stack lang={Lang} />`; `skills: { web: string[]; mobile: string[] }`.

- [ ] **Step 1: Crear `src/data/skills.ts`**

```ts
// KEVIN-TODO: tecnologías reales del autor
export const skills = {
  web: ['React', 'TypeScript', 'Node.js', 'Astro', 'PostgreSQL'],
  mobile: ['React Native', 'Flutter', 'Expo'],
} as const;
```

- [ ] **Step 2: Crear `src/components/About.astro`** (estilos: portar selectores `.about`, `.about p`, `.about strong`, `.about a` del mockup G)

```astro
---
import { useTranslations, type Lang } from '../i18n/ui';
interface Props { lang: Lang }
const { lang } = Astro.props;
const t = useTranslations(lang);
---
<section class="about reveal" id="about">
  <div class="sec-head"><h2>{t('about.title')}</h2><span class="meta">{t('about.meta')}</span></div>
  <p><strong>{t('about.body.strong')}</strong> {t('about.body.rest')} <strong>{t('about.body.strong2')}</strong>.</p>
</section>
<style>/* portar selectores indicados arriba */</style>
```

- [ ] **Step 3: Crear `src/components/Stack.astro`** (estilos: portar selectores `.stickers`, `.sticker` con TODAS sus variantes `nth-child` y estados `.js .reveal-stagger`, y `.skills h3`; recordar el prefijo `:global(.js)` para las variantes `.js`)

```astro
---
import { useTranslations, type Lang } from '../i18n/ui';
import { skills } from '../data/skills';
interface Props { lang: Lang }
const { lang } = Astro.props;
const t = useTranslations(lang);
---
<section class="skills" id="skills">
  <div class="sec-head reveal"><h2>{t('stack.title')}</h2><span class="meta">{t('stack.meta')}</span></div>
  <h3>{t('stack.web')}</h3>
  <div class="stickers reveal-stagger">
    {skills.web.map((s, i) => <span class="sticker" style={`--i:${i}`}>{s}</span>)}
  </div>
  <h3>{t('stack.mobile')}</h3>
  <div class="stickers reveal-stagger">
    {skills.mobile.map((s, i) => <span class="sticker" style={`--i:${i}`}>{s}</span>)}
  </div>
</section>
<style>/* portar selectores indicados arriba */</style>
```

- [ ] **Step 4: Montar ambos en `index.astro`** después de `<Marquee>`, dentro de un segundo `<main class="wrap">` (el marquee corta el main, igual que en el mockup G):

```astro
<main class="wrap">
  <About lang="en" />
  <Stack lang="en" />
</main>
```
(con sus imports en el frontmatter)

- [ ] **Step 5: Verificar**

Run: `npm run build`
Expected: 0 errors; en dev los stickers hacen pop escalonado al entrar en viewport.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: secciones sobre-mi y stack con stickers"
```

---

### Task 8: FeaturedProject y Experience

**Files:**
- Create: `src/components/FeaturedProject.astro`, `src/components/Experience.astro`, `src/data/experience.ts`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: colección `projects` de Task 5.
- Produces: `<FeaturedProject lang={Lang} />` (renderiza el proyecto `featured` más reciente), `<Experience lang={Lang} />`; `experience: Array<{ when: string; role_en: string; role_es: string; org: string; desc_en: string; desc_es: string }>`.

- [ ] **Step 1: Crear `src/data/experience.ts`**

```ts
// KEVIN-TODO: fechas y descripciones reales
export const experience = [
  {
    when: '2025 – hoy',
    role_en: 'Developer', role_es: 'Developer',
    org: '@ The Dev Nest',
    desc_en: 'Web and mobile development at the studio; client projects end to end.',
    desc_es: 'Desarrollo web y móvil en el estudio; proyectos de clientes de principio a fin.',
  },
  {
    when: '2024 – hoy',
    role_en: 'Freelance', role_es: 'Freelance',
    org: 'full-stack',
    desc_en: 'Custom web and mobile apps for direct clients.',
    desc_es: 'Apps a medida para clientes directos, web y móvil.',
  },
] as const;
```

- [ ] **Step 2: Crear `src/components/FeaturedProject.astro`** (estilos: portar selectores `.proj`, `.proj::before`, `.proj:hover::before`, `.proj-info` y descendientes, `.chips`, `.chip` con variantes, `.proj-links`, `.proj-shot` y media queries del mockup G; el glow-al-cursor requiere el script de abajo)

```astro
---
import { Image } from 'astro:assets';
import { getCollection } from 'astro:content';
import { useTranslations, type Lang } from '../i18n/ui';
interface Props { lang: Lang }
const { lang } = Astro.props;
const t = useTranslations(lang);
const all = await getCollection('projects', ({ data }) => data.featured);
const project = all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())[0];
if (!project) throw new Error('No featured project found in src/content/projects');
const d = project.data;
const tagline = lang === 'en' ? d.tagline_en : d.tagline_es;
const alt = lang === 'en' ? d.imageAlt_en : d.imageAlt_es;
---
<section class="reveal" id="work">
  <div class="sec-head"><h2>{t('work.title')}</h2><span class="meta">{t('work.meta')}</span></div>
  <div class="proj">
    <div class="proj-info">
      <div class="meta">{d.date.getFullYear()} · web app</div>
      <h3>{d.title}</h3>
      <p>{tagline}</p>
      <div class="chips">{d.stack.map((s) => <span class="chip">{s}</span>)}</div>
      <div class="proj-links">
        {d.url && <a href={d.url}>{t('work.demo')}</a>}
        {d.repo && <a href={d.repo}>{t('work.code')}</a>}
      </div>
    </div>
    <div class="proj-shot"><Image src={d.image} alt={alt} /></div>
  </div>
</section>
<style>/* portar selectores indicados arriba */</style>
<script>
  document.querySelectorAll('.proj').forEach((el) => {
    (el as HTMLElement).addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      (el as HTMLElement).style.setProperty('--mx', (e as MouseEvent).clientX - r.left + 'px');
      (el as HTMLElement).style.setProperty('--my', (e as MouseEvent).clientY - r.top + 'px');
    });
  });
</script>
```

Nota: `.proj-shot svg` del mockup pasa a ser `.proj-shot img` (mismo bloque de estilos, cambiar el selector).

- [ ] **Step 3: Crear `src/components/Experience.astro`** (estilos: portar `.xp`, `.xp-row`, `.xp-when`, `.xp-what` y descendientes + media query)

```astro
---
import { useTranslations, type Lang } from '../i18n/ui';
import { experience } from '../data/experience';
interface Props { lang: Lang }
const { lang } = Astro.props;
const t = useTranslations(lang);
---
<section class="reveal" id="xp">
  <div class="sec-head"><h2>{t('xp.title')}</h2><span class="meta">{t('xp.meta')}</span></div>
  <div class="xp">
    {experience.map((x) => (
      <div class="xp-row">
        <div class="xp-when">{x.when}</div>
        <div class="xp-what">
          <strong>{lang === 'en' ? x.role_en : x.role_es} <span>{x.org}</span></strong>
          <p>{lang === 'en' ? x.desc_en : x.desc_es}</p>
        </div>
      </div>
    ))}
  </div>
</section>
<style>/* portar selectores indicados arriba */</style>
```

- [ ] **Step 4: Montar en `index.astro`** después de `<Stack>`, verificar

Run: `npx astro check && npm run build`
Expected: 0 errors; la sección muestra Proyecto Uno con su captura.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: proyecto destacado desde coleccion y experiencia"
```

---

### Task 9: Contact y 404

**Files:**
- Create: `src/components/Contact.astro`, `src/data/links.ts`, `src/pages/404.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Produces: `<Contact lang={Lang} />`; `links: { email: string; github: string; linkedin: string; whatsapp: string }`.

- [ ] **Step 1: Crear `src/data/links.ts`**

```ts
// KEVIN-TODO: links reales del autor
export const links = {
  email: 'hola@example.com',
  github: 'https://github.com/example',
  linkedin: 'https://linkedin.com/in/example',
  whatsapp: 'https://wa.me/5210000000000',
} as const;
```

- [ ] **Step 2: Crear `src/components/Contact.astro`** (estilos: portar `.contact p`, `.mail`, `.mail::after`, `.mail:hover::after`, `.socials`, `.socials a` y sus tres variantes `nth-child` de hover del mockup G)

```astro
---
import { useTranslations, type Lang } from '../i18n/ui';
import { links } from '../data/links';
interface Props { lang: Lang }
const { lang } = Astro.props;
const t = useTranslations(lang);
---
<section class="contact reveal" id="contact">
  <div class="sec-head"><h2>{t('contact.title')}</h2><span class="meta">{t('contact.meta')}</span></div>
  <p>{t('contact.body')}</p>
  <a class="mail" href={`mailto:${links.email}`}>{links.email}</a>
  <div class="socials">
    <a href={links.github}>github ↗</a>
    <a href={links.linkedin}>linkedin ↗</a>
    <a href={links.whatsapp}>whatsapp ↗</a>
  </div>
</section>
<style>/* portar selectores indicados arriba */</style>
```

- [ ] **Step 3: Crear `src/pages/404.astro`** (bilingüe en una sola página, estático)

```astro
---
import Base from '../layouts/Base.astro';
import { useTranslations } from '../i18n/ui';
const tEn = useTranslations('en');
const tEs = useTranslations('es');
---
<Base lang="en">
  <main class="wrap" style="padding: 6rem 0; text-align: center;">
    <h1 style="font-size: clamp(3rem, 10vw, 6rem); font-weight: 800;">404</h1>
    <p style="margin-top: 1rem;">{tEn('e404.joke')}</p>
    <p style="margin-top: 0.5rem;" lang="es">{tEs('e404.joke')}</p>
    <div style="margin-top: 2rem; display: flex; gap: 1rem; justify-content: center;">
      <a class="btn btn-solid" href="/">{tEn('e404.back')}</a>
      <a class="btn btn-line" href="/es/">{tEs('e404.back')}</a>
    </div>
  </main>
</Base>
```

- [ ] **Step 4: Montar `<Contact lang="en" />` en `index.astro`, verificar**

Run: `npm run build`
Expected: 0 errors; `dist/404.html` existe.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: contacto con links directos y 404 bilingue"
```

---

### Task 10: Página en español

**Files:**
- Create: `src/pages/es/index.astro`

**Interfaces:**
- Consumes: todos los componentes de sección (Tasks 6-9), que ya reciben `lang`.

- [ ] **Step 1: Crear `src/pages/es/index.astro`**

Copia exacta de `src/pages/index.astro` cambiando **todas** las apariciones de `"en"` por `"es"` (el prop `lang` de `Base`, `Hero`, `Marquee`, `About`, `Stack`, `FeaturedProject`, `Experience`, `Contact`).

- [ ] **Step 2: Verificar**

Run: `npm run build`
Expected: existen `dist/index.html` (inglés) y `dist/es/index.html` (español); ambos contienen los 3 `hreflang`.

- [ ] **Step 3: Verificación manual del toggle**

En `npm run dev`: navegar a `/#skills`, click al toggle → debe aterrizar en `/es/#skills` con la sección Stack visible, y viceversa.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: ruta /es/ en espanol completa"
```

---

### Task 11: SEO — sitemap, favicon, OG image

**Files:**
- Create: `public/favicon.svg`, `scripts/og.mjs`
- Modify: `astro.config.mjs`, `package.json`

- [ ] **Step 1: Sitemap**

Run: `npx astro add sitemap --yes`
Verificar que `astro.config.mjs` quedó con `import sitemap from '@astrojs/sitemap'` y `integrations: [sitemap()]` (el comando lo hace solo).

- [ ] **Step 2: Crear `public/favicon.svg`** (sticker mantequilla con la K, girado como el logo)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect x="4" y="4" width="56" height="56" rx="14" fill="oklch(0.88 0.11 95)" transform="rotate(-4 32 32)"/>
  <text x="32" y="44" text-anchor="middle" font-family="Arial Black, sans-serif" font-size="34" font-weight="900" fill="oklch(0.14 0.015 160)">K.</text>
</svg>
```

- [ ] **Step 3: Crear `scripts/og.mjs`** (genera `public/og.png` 1200×630 con sharp)

```js
import sharp from 'sharp';

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="oklch(0.14 0.015 160)"/>
  <rect x="80" y="150" width="330" height="90" rx="18" fill="oklch(0.80 0.13 160)" transform="rotate(-2 245 195)"/>
  <text x="100" y="212" font-family="Arial Black, sans-serif" font-size="52" font-weight="900" fill="oklch(0.14 0.015 160)">web apps</text>
  <rect x="440" y="150" width="300" height="90" rx="18" fill="oklch(0.58 0.16 45)" transform="rotate(2 590 195)"/>
  <text x="462" y="212" font-family="Arial Black, sans-serif" font-size="52" font-weight="900" fill="#fff">mobile</text>
  <text x="80" y="360" font-family="Arial Black, sans-serif" font-size="72" font-weight="900" fill="oklch(0.93 0.005 160)">Kevin López</text>
  <text x="80" y="430" font-family="Arial, sans-serif" font-size="34" fill="oklch(0.64 0.015 160)">full-stack developer · the dev nest</text>
</svg>`;
// KEVIN-TODO: nombre real en el texto de arriba

await sharp(Buffer.from(svg)).png().toFile('public/og.png');
console.log('public/og.png generado');
```

- [ ] **Step 4: Ejecutar y registrar el script**

Run: `node scripts/og.mjs`
Expected: crea `public/og.png`.
Añadir a `package.json` scripts: `"og": "node scripts/og.mjs"`.

- [ ] **Step 5: Verificar**

Run: `npm run build`
Expected: `dist/sitemap-index.xml` existe; `dist/og.png` y `dist/favicon.svg` copiados.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: sitemap, favicon y og image"
```

---

### Task 12: Contenido real del autor ⚠️ REQUIERE INPUT DEL USUARIO

No ejecutar sin los datos. Pedir al autor la checklist del spec y aplicar cada dato donde indica el marcador:

| Dato | Dónde |
|---|---|
| Nombre público / handle | `src/i18n/ui.ts` (`meta.title`, `hero.intro.pre`), `Header.astro` (logo), `Footer.astro`, `scripts/og.mjs` (+ regenerar con `npm run og`) |
| Tecnologías reales | `src/data/skills.ts` |
| Proyecto #1 (nombre, descripción EN/ES, capturas, stack, links, fecha) | `src/content/projects/proyecto-uno.md` + reemplazar `src/assets/proyecto-uno-shot.svg` por capturas reales (png/webp) |
| Experiencia real (fechas, roles) | `src/data/experience.ts` |
| Email, GitHub, LinkedIn, WhatsApp | `src/data/links.ts` |
| Dominio final (si hay) | `astro.config.mjs` (`site`) |

- [ ] **Step 1: Aplicar todos los datos y borrar cada marcador `KEVIN-TODO`**
- [ ] **Step 2: Verificar que no queda ninguno**

Run: `Select-String -Path src\*,src\**\*,scripts\* -Pattern "KEVIN-TODO"` (PowerShell)
Expected: sin resultados.

- [ ] **Step 3: Build + revisión visual de ambos idiomas**

Run: `npx astro check && npm run build`

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: contenido real del autor"
```

---

### Task 13: Verificación final (spec: sección Verificación)

- [ ] **Step 1:** `npx astro check && npm run build` → 0 errors, 0 warnings.
- [ ] **Step 2: Rayas en copy:** `Select-String -Path dist\index.html,dist\es\index.html -Pattern "—"` → máximo 2 apariciones visibles por página.
- [ ] **Step 3: Breakpoints:** con `npm run preview`, revisar 375px / 768px / 1440px en ambos idiomas: sin overflow horizontal, titulares completos, flotantes ocultos <980px.
- [ ] **Step 4: Reduced motion:** activar "reducir movimiento" en el SO (o emularlo en DevTools → Rendering) y recargar: sin animaciones, retícula estática, marquee detenido, todo el contenido visible.
- [ ] **Step 5: Sin JS:** desactivar JavaScript en DevTools: todo el contenido visible, navegación y toggle de idioma funcionan.
- [ ] **Step 6: Lighthouse (móvil) en `npm run preview`:** Performance, Accessibility, Best Practices y SEO ≥95. Si algo baja, corregir antes de cerrar (causas típicas: imagen del proyecto sin dimensiones, contraste de `--muted`, falta de `aria-label` en el toggle).
- [ ] **Step 7: Commit de los ajustes** `git add -A && git commit -m "fix: ajustes de verificacion final"`

---

### Task 14: Deploy a Vercel ⚠️ REQUIERE AL USUARIO (login)

- [ ] **Step 1:** `npm i -g vercel` (el CLI no está instalado en esta máquina).
- [ ] **Step 2:** `vercel login` (interactivo, lo hace el autor).
- [ ] **Step 3:** `vercel` (preview) → revisar la URL → `vercel --prod`.
- [ ] **Step 4:** Actualizar `site` en `astro.config.mjs` con la URL final si cambió, rebuild y re-deploy. Commit.
