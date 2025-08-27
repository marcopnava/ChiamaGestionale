import { z } from "zod";

export const ProductCreateSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional().nullable(),
  monthly: z.preprocess((v) => (typeof v === "string" ? parseFloat(v) : v), z.number().nonnegative()),
  kind: z.enum(["SaaS", "Platform"]),
  isActive: z.boolean().default(true),
});

export const ProductUpdateSchema = ProductCreateSchema.partial();

export type ProductCreateInput = z.infer<typeof ProductCreateSchema>;
export type ProductUpdateInput = z.infer<typeof ProductUpdateSchema>; 