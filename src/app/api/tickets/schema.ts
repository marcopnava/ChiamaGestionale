import { z } from "zod";

export const TicketCreateSchema = z.object({
  customerId: z.string().min(1),
  title: z.string().min(3),
  description: z.string().optional().nullable(),
  assigneeId: z.string().optional().nullable(),
});

export const TicketUpdateSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional().nullable(),
  status: z.enum(["open","pending","closed"]).optional(),
  assigneeId: z.string().optional().nullable(),
}); 