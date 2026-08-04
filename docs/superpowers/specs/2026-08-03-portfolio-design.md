# Spec: Portafolio personal one-page bilingüe

Fecha: 2026-08-03 · Estado: aprobado en diseño, pendiente de plan de implementación

## Objetivo

Portafolio web personal de un desarrollador full-stack (web + móvil), miembro de The Dev Nest (thedevnest.com). Propósito: marca personal + captar clientes freelance. El sitio se enlazará desde The Dev Nest.

Éxito: un visitante entiende quién es el autor y qué hace, ve calidad real en el proyecto destacado, y lo contacta por un link directo.

## Alcance

One-page con cinco secciones, bilingüe EN/ES. **Fuera de alcance** (decisiones explícitas, no omisiones): página de listado de proyectos (con 1 proyecto sería cascarón vacío), blog, formulario de contacto, CMS, modo oscuro. Todas pueden agregarse después sin refactor.

## Estrategia y visual

Definidos en [`PRODUCT.md`](../../../PRODUCT.md) (registro brand, personalidad "juguetón, artesanal, seguro", anti-referencias, WCAG AA) y [`DESIGN.md`](../../../DESIGN.md) (dirección "Precisión con chispa": oscuro de precisión con tinte verde, acentos menta/mantequilla/coral, Bricolage Grotesque + JetBrains Mono, sistema de motion definido). La referencia visual viva es `mockups/g-hibrido-turbo.html`, elegida por el autor entre 8 exploraciones. Este spec no los duplica; ambos son fuente de verdad para la implementación.

## Arquitectura

- **Stack:** Astro 5, salida estática (`output: 'static'`). Sin frameworks de UI; islas solo si una interacción lo exige (el toggle de idioma y los hovers son CSS/JS vanilla).
- **i18n:** routing nativo de Astro. Inglés en `/` (default, alineado con The Dev Nest y clientes internacionales), español en `/es/`. Textos de UI en diccionarios TypeScript por idioma (`src/i18n/en.ts`, `src/i18n/es.ts`). `hreflang` alternates en el `<head>`. El toggle conserva la sección visible (ancla) al cambiar idioma.
- **Contenido de proyectos:** content collection `projects` con un archivo por proyecto. Schema: `title`, `description_en`, `description_es`, `stack` (array), `images` (array), `url` (opcional), `repo` (opcional), `date`, `featured` (boolean). La sección "proyecto destacado" renderiza el `featured` más reciente. Agregar el proyecto #2 = crear un archivo Markdown.
- **Fuentes:** `@fontsource-variable/bricolage-grotesque`, self-hosted (sin Google Fonts CDN).
- **Assets:** capturas del proyecto en `src/assets/`, optimizadas con `astro:assets` (`<Image>`).

## Secciones (orden del one-page, según mockup G)

1. **Hero:** badge "disponible para proyectos", titular grande con palabras resaltadas estilo marcador, squiggle coral, stickers flotantes con parallax, intro breve, dos CTAs magnéticos. Coreografía de entrada única.
2. **Marquee:** franja inclinada con términos del oficio (decorativa, `aria-hidden`).
3. **Sobre mí:** párrafo breve con voz y humor, mención de The Dev Nest con link.
4. **Stack:** stickers rotados con sombra dura de color, agrupados en web y móvil. Sin barras de porcentaje, sin grid de íconos.
5. **Proyecto destacado:** panel con glow al cursor. Nombre, problema→solución en 2-3 líneas, capturas reales, stack, links a demo/repo si existen.
6. **Experiencia:** lista limpia fecha/contenido (The Dev Nest, freelance).
7. **Contacto:** correo gigante con subrayado animado + botones sociales directos (GitHub, LinkedIn, WhatsApp), sin formulario. Footer con link a The Dev Nest.

Extra: página 404 con chiste (por idioma).

## Manejo de errores y casos borde

- Sitio estático: sin estados de carga ni errores de red propios.
- Imágenes del proyecto con `alt` descriptivo por idioma; `loading="lazy"` fuera del viewport inicial.
- JS deshabilitado: todo el contenido visible y navegable (los reveals parten de contenido visible; el toggle de idioma es un link normal).
- `prefers-reduced-motion`: alternativa instantánea o crossfade en toda animación.

## Verificación

- Build de Astro sin warnings; `astro check` limpio.
- Lighthouse ≥95 en Performance, A11y, Best Practices y SEO (móvil).
- Contraste verificado con los valores de DESIGN.md (ink/bg ≥7:1, muted/bg ≥4.5:1).
- Revisión visual en browser (screenshots) por breakpoint: 375px, 768px, 1440px — sin overflow de titulares.
- Ambos idiomas revisados por separado: el humor se escribe por idioma, no se traduce literal.

## Contenido requerido del autor (antes del build)

Checklist de inputs que solo el autor puede dar; se recolectan al iniciar la implementación:

- [ ] Nombre público / handle a mostrar
- [ ] Titular del hero (o aprobación del que se proponga) en EN y ES
- [ ] Texto base de "sobre mí" (bullets sueltos bastan; la redacción se pule en el build)
- [ ] Lista de tecnologías reales (web y móvil)
- [ ] Proyecto #1: nombre, descripción, capturas, stack, links
- [ ] Links de contacto: email, WhatsApp, GitHub, LinkedIn
- [ ] Foto o avatar (opcional)

## Deploy

Vercel, sitio estático, plan gratuito. El CLI de Vercel no está instalado (`npm i -g vercel` cuando toque publicar). Dominio: el subdominio `*.vercel.app` por defecto; dominio propio queda como decisión futura del autor.
