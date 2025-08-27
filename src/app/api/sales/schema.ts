import { z } from "zod";

export const SaleCreateSchema = z.object({
  customerId: z.string().min(1),
  productId: z.string().min(1),
  months: z.number().int().positive().max(60),
  soldAt: z.string().datetime().optional(), // ISO
});

export const SaleUpdateSchema = z.object({
  months: z.number().int().positive().max(60).optional(),
  status: z.enum(["pending","paid","failed"]).optional(),
}); 