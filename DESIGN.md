# Design

Sistema visual del portafolio. Seed de marca: `oklch(0.550 0.119 160.0)` (seed-158). Registro: brand.

## Mood

"Taller-invernadero": blanco puro de fondo, verde musgo que carga toda la identidad, chispazos naranja coral. Fresco, hecho a mano, seguro de sí mismo.

## Color

Estrategia: **Committed** — el verde primario carga 30–60% de la superficie (hero, secciones enteras, botones). El coral aparece solo en los momentos juguetones.

```css
:root {
  --bg:      oklch(1.000 0.000 0);     /* blanco puro, sin tinte */
  --surface: oklch(0.960 0.010 160);   /* paneles y tarjetas */
  --ink:     oklch(0.220 0.020 160);   /* texto cuerpo, ≥7:1 vs bg */
  --muted:   oklch(0.480 0.020 160);   /* texto secundario, ≥4.5:1 vs bg */
  --primary: oklch(0.550 0.130 160);   /* verde musgo — identidad */
  --accent:  oklch(0.680 0.170 45);    /* coral — juego, badges, hovers */
}
```

Reglas:

- Texto sobre rellenos `--primary` o `--accent`: **blanco**, nunca oscuro (Helmholtz-Kohlrausch).
- El coral nunca es color de texto largo; solo acentos cortos (badges, subrayados, hovers).
- Nada de beige/crema. Nada de fondo oscuro global.

## Typography

Una sola familia con contraste fuerte de peso: **Bricolage Grotesque** (variable, vía `@fontsource-variable/bricolage-grotesque`).

- Display (hero): peso 800, `clamp(2.5rem, 8vw, 5.5rem)`, letter-spacing ≥ -0.03em, `text-wrap: balance`.
- Headings de sección: peso 700, escala modular ratio ≥1.25.
- Cuerpo: peso 400, 16–18px, líneas de 65–75ch máximo, `text-wrap: pretty`.
- Sin monospace decorativo, sin all-caps en cuerpo.

## Layout

- One-page, scroll largo, una idea dominante por viewport.
- Espaciado fluido con `clamp()`; separaciones generosas entre secciones, agrupaciones internas apretadas.
- Composición asimétrica en hero y proyecto destacado; romper la retícula con intención, no por sistema.
- Sin grid de tarjetas idénticas; sin eyebrows uppercase repetidos por sección; sin bordes laterales de acento.

## Components

- **Botón primario:** relleno `--primary`, texto blanco, radio moderado, hover con levantamiento sutil.
- **Stickers de skills:** píldoras con rotación ligera (−3° a 3°), borde `--ink`, fondo `--surface` o `--accent`, "pop" (scale + rotación a 0) al hover.
- **Toggle ES/EN:** interruptor visible y juguetón en la navegación; conserva la sección actual al cambiar de idioma.
- **Links de contacto:** botones grandes directos (email, WhatsApp, GitHub, LinkedIn), sin formulario.

## Motion

- Una coreografía de entrada en el hero (typographic reveal escalonado). El resto: reveals discretos con IntersectionObserver sobre contenido ya visible por defecto.
- Curvas ease-out exponenciales (quart/expo). Sin bounce, sin elastic.
- Micro-interacciones: stickers, palabras interactivas del hero (tilt + cambio a coral al hover), toggle de idioma.
- `prefers-reduced-motion: reduce` → crossfade o instantáneo en todo.
- CSS + IntersectionObserver; sin librería de animación salvo necesidad demostrada.
