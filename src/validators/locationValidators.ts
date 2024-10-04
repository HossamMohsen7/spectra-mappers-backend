import { validate } from "zod-express-validator";
import {
  createLocationSchema,
  editLocationSchema,
} from "../schemas/locationSchemas.js";

export const validateCreateLocation = validate({ body: createLocationSchema });
export type CreateLocationController = typeof validateCreateLocation;

export const validateEditLocation = validate({ body: editLocationSchema });
export type EditLocationController = typeof validateEditLocation;
