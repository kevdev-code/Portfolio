export type Lang = 'en' | 'es';

const en = {
  'meta.title': 'Kevin David Lopez Verdin — Full-stack & mobile developer',
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
  'hero.intro.pre': "I'm Kevin, full-stack developer and member of",
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
  'stack.backend': 'backend & data',
  'stack.mobile': 'mobile',
  'stack.services': 'integrations',
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
  'meta.title': 'Kevin David Lopez Verdin — Desarrollador full-stack y móvil',
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
  'hero.intro.pre': 'Soy Kevin, desarrollador full-stack y miembro de',
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
  'stack.backend': 'backend y datos',
  'stack.mobile': 'móvil',
  'stack.services': 'integraciones',
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
