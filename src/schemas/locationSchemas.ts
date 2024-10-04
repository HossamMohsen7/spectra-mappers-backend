import z from "zod";

export const createLocationSchema = z.object({
  name: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  notificationEnabled: z.boolean(),
});

export const editLocationSchema = z.object({
  name: z.string().optional(),
  notificationEnabled: z.boolean(),
});
