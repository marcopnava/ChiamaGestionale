import { z } from "zod";

export const CustomerCreateSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  status: z.enum(["lead", "active", "churn"]).default("lead"),
  joinedAt: z.string().datetime().optional().nullable(),
});

export const CustomerUpdateSchema = CustomerCreateSchema.partial();

export type CustomerCreateInput = z.infer<typeof CustomerCreateSchema>;
export type CustomerUpdateInput = z.infer<typeof CustomerUpdateSchema>; 