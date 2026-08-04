export type Skill = { name: string; icon: string };

export const skills: Record<'web' | 'backend' | 'mobile' | 'services', Skill[]> = {
  web: [
    { name: 'React', icon: 'simple-icons:react' },
    { name: 'Next.js', icon: 'simple-icons:nextdotjs' },
    { name: 'Astro', icon: 'simple-icons:astro' },
    { name: 'TypeScript', icon: 'simple-icons:typescript' },
    { name: 'Vite', icon: 'simple-icons:vite' },
  ],
  backend: [
    { name: 'Node.js', icon: 'simple-icons:nodedotjs' },
    { name: 'Bun', icon: 'simple-icons:bun' },
    { name: 'Express', icon: 'simple-icons:express' },
    { name: 'Fastify', icon: 'simple-icons:fastify' },
    { name: 'PHP', icon: 'simple-icons:php' },
    { name: 'Symfony', icon: 'simple-icons:symfony' },
    { name: 'PostgreSQL', icon: 'simple-icons:postgresql' },
    { name: 'Redis', icon: 'simple-icons:redis' },
    { name: 'Docker', icon: 'simple-icons:docker' },
  ],
  mobile: [
    { name: 'React Native', icon: 'simple-icons:react' },
    { name: 'Flutter', icon: 'simple-icons:flutter' },
    { name: 'Dart', icon: 'simple-icons:dart' },
  ],
  services: [
    { name: 'Stripe', icon: 'simple-icons:stripe' },
    { name: 'Shopify API', icon: 'simple-icons:shopify' },
    { name: 'WhatsApp Business API', icon: 'simple-icons:whatsapp' },
    { name: 'Claude API', icon: 'simple-icons:claude' },
  ],
};
