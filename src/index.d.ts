import { User } from "@prisma/client";

export {};

declare global {
  namespace Express {
    interface Request {
      auth?: string;
      user?: User;
    }
  }
}
