import { z } from "zod";

export const generateSummarySchema = z.object({
  body: z.object({
    appointmentId: z
      .string({ required_error: "Appointment ID is required" })
      .uuid("Invalid appointment ID format"),
  }),
});
