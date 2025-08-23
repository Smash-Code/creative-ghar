// schemas/productSchema.js
import { z } from "zod";

export const productSchema = z.object({
  title: z.string(),
  priority: z.number().min(0).max(4).optional().default(0).optional(),
  description: z.string(),
  orignal_price: z.number(),
  discounted_price: z.number(),
  stock: z.number(),
  estimated_delivery_time: z.string(),
  return_or_exchange_time: z.number(),
  category: z.string(),
  images: z.array(z.string().url()),
  createdAt: z.date(),
  updatedAt: z.date(),
  hasVariants: z.boolean().optional(),
  sizes: z.array(
    z.object({
      name: z.string(),
      stock: z.number()
    })
  ).optional(),
  colors: z.array(
    z.object({
      name: z.string(),
      hex: z.string()
    })
  ).optional()
});
