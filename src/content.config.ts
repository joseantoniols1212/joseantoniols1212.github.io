import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  // Load Markdown and MDX files in the `src/content/blog/` directory.
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  // Type-check frontmatter using a schema
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      // Transform string to Date object
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      heroImage: z.optional(image()),
      thumbnail: z.optional(image()),
      draft: z.boolean().optional(),
    }),
});

const experience = defineCollection({
  loader: glob({ base: "./src/content/experience", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    company: z.string(),
    role: z.string(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(), // undefined = present
    location: z.string().optional(),
    url: z.string().optional(),
    order: z.number().default(0), // lower = shown first
  }),
});

const studies = defineCollection({
  loader: glob({ base: "./src/content/studies", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    institution: z.string(),
    degree: z.string(),
    field: z.string().optional(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    location: z.string().optional(),
    order: z.number().default(0),
  }),
});

export const collections = { blog, experience, studies };
