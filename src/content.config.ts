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
      url: z.url().optional(),
      repo: z.url().optional(),
      date: z.coerce.date(),
      featured: z.boolean().default(false),
    }),
});

export const collections = { projects };
