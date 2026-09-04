import { z } from 'zod';

export const isoDateSchema = z.string().refine(
  (value) => !value || (/^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`))),
  'Usa una fecha válida con formato AAAA-MM-DD',
);

export const productSchema = z.object({
  name: z.string().trim().min(1, 'Escribe un nombre'), brand: z.string(), description: z.string(),
  establishmentId: z.string().min(1, 'Selecciona un establecimiento'),
  rating: z.number().min(0.5).max(5).refine((value) => Number.isInteger(value * 2), 'La valoración debe avanzar de media estrella en media estrella'),
  reviewText: z.string(), price: z.string().refine((value) => !value || (!Number.isNaN(Number(value)) && Number(value) >= 0), 'Introduce un precio válido'),
  triedAt: isoDateSchema, isFavorite: z.boolean(), images: z.array(z.string()), categoryIds: z.array(z.string()),
});

export const establishmentSchema = z.object({
  name: z.string().trim().min(1, 'Escribe un nombre'),
  type: z.enum(['supermarket', 'restaurant', 'cafe', 'ice_cream_shop', 'bakery', 'bar', 'food_shop', 'other']),
  locationText: z.string(), website: z.string().refine((value) => !value || /^https?:\/\//.test(value), 'Usa una URL que empiece por http'),
  description: z.string(), images: z.array(z.string()),
});

export const categorySchema = z.object({ name: z.string().trim().min(1, 'Escribe un nombre'), description: z.string(), parentId: z.string(), imageUri: z.string() });
export type ProductValues = z.infer<typeof productSchema>;
export type EstablishmentValues = z.infer<typeof establishmentSchema>;
export type CategoryValues = z.infer<typeof categorySchema>;
