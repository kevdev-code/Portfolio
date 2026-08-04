# Design

Sistema visual del portafolio. Dirección elegida por el autor tras exploración de 8 mockups: **"Precisión con chispa"** (mockup G). Referencia viva: [`mockups/g-hibrido-turbo.html`](mockups/g-hibrido-turbo.html). Registro: brand. Seed de marca original: `oklch(0.550 0.119 160.0)` (seed-158, hue 160 conservado en todo el sistema).

## Mood

"Taller de noche": oscuro de precisión con tinte verde de marca, donde los stickers brillantes (menta, mantequilla, coral) son los golpes de luz. La base es orden de ingeniero (retícula, líneas finas, etiquetas mono); el juego está dosificado en lugares asignados, nunca regado.

## Color

Estrategia: base **restrained** (oscuro + menta contenida) con acentos **full-palette** (menta, mantequilla, coral) reservados para los momentos juguetones.

```css
:root {
  --bg:      oklch(0.14 0.015 160);   /* oscuro de precisión, tinte de marca */
  --surface: oklch(0.18 0.02 160);    /* paneles, tarjetas, marquee */
  --border:  oklch(0.30 0.02 160);    /* líneas finas de sección */
  --text:    oklch(0.93 0.005 160);   /* cuerpo, ≥7:1 vs bg */
  --muted:   oklch(0.64 0.015 160);   /* secundario, ≥4.5:1 vs bg */
  --mint:    oklch(0.80 0.13 160);    /* primario: CTAs, links, glows */
  --coral:   oklch(0.58 0.16 45);     /* juego: squiggle, sombras duras, subrayado mail */
  --butter:  oklch(0.88 0.11 95);     /* juego: logo sticker, resaltado, flotantes */
}
```

Reglas:

- Fills pálidos (menta L0.80, mantequilla L0.88): **texto oscuro** (`--bg`). Fill coral (L0.58, saturado): **texto blanco**. Nunca texto oscuro sobre coral.
- Sombras duras de color (`3-7px offset, 0 blur`) en stickers y botones; nunca sombras negras difusas en elementos juguetones.
- El coral y la mantequilla no son colores de texto largo; solo acentos cortos.
- Nada de beige de fondo, nada de negro puro sin tinte, nada de verde neón terminal.

## Typography

Par en eje de contraste: grotesca con carácter + monoespaciada técnica.

- **Bricolage Grotesque** (variable): display y cuerpo. Hero peso 800, `clamp(2.6rem, 7vw, 5rem)`, letter-spacing -0.03em, `text-wrap: balance`. Cuerpo 400, 16-18px, máx 65-75ch.
- **JetBrains Mono** (400/600): voz técnica en dosis pequeñas: nav, etiquetas de sección (`// quién soy`), metadatos, chips, fechas, footer, badge de disponibilidad.
- Headings de sección: 800, escala modular ratio ≥1.25.

## Layout

- One-page, contenedor `max-width: 1060px`, alineación izquierda (asimétrica, no centrada).
- Secciones separadas por `border-top: 1px` fino; cabecera de sección = h2 + etiqueta mono al lado.
- Orden: Hero → marquee → Sobre mí → Stack → Proyecto destacado → Experiencia → Contacto → footer.
- Fondo global: retícula de puntos revelada solo alrededor del cursor (spotlight con `mask-image`) + grano de impresión al 3.5%.

## Components

- **Badge disponibilidad:** píldora mono menta con punto pulsante, arriba del titular.
- **Resaltados de marcador:** 2-3 palabras del titular con fondo menta/coral/mantequilla y rotación ±1.5°; se enderezan al hover.
- **Squiggle:** subrayado ondulado coral (SVG) que se dibuja al cargar.
- **Stickers flotantes del hero:** 3 píldoras (mantequilla/menta/surface) con deriva senoidal permanente y parallax de profundidad al mouse; ocultos <980px.
- **Marquee:** franja inclinada -1° con términos en mono y separadores ✦ alternando coral/mantequilla; pausa al hover; estática con reduced-motion.
- **Stickers de stack:** píldoras rotadas con sombra dura de color, pop en cascada (stagger 55ms) al entrar en viewport. Solo en la sección Stack.
- **Panel de proyecto:** borde fino, glow radial interior que sigue al cursor, captura con rotación 2.5° que se endereza al revelarse y al hover.
- **Botones:** primario menta con sombra dura coral; magnéticos (siguen al cursor ≤6px, retorno expo-out).
- **Experiencia:** lista limpia de dos columnas (fecha mono / contenido), separadores finos.
- **Contacto:** correo gigante con subrayado coral animado; links sociales píldora que se pintan cada uno de un color distinto al hover (menta/mantequilla/coral) con ladeo de sticker.
- **Toggle ES/EN:** switch mono compacto en la nav; conserva la sección visible al cambiar.

## Motion

- Entrada del hero: titular palabra por palabra (translateY + rotación que se asienta, stagger 60ms), luego intro y CTAs (fade-up), squiggle dibujándose, stickers brotando en secuencia.
- Curvas: ease-out exponencial (`cubic-bezier(0.22,1,0.36,1)` general, `cubic-bezier(0.16,1,0.3,1)` para pops). **Prohibido bounce/elastic.**
- Reveals de scroll con IntersectionObserver sobre contenido visible por defecto (funciona sin JS).
- `prefers-reduced-motion: reduce` → todo instantáneo, retícula estática, marquee detenido.
- CSS + vanilla JS; sin librería de animación salvo necesidad demostrada.
