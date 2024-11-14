import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"], {
    errorMap: () => ({
      message: "Status must be one of: PENDING, IN_PROGRESS, COMPLETED",
    }),
  }),
});
