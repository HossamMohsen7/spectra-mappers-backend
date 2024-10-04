import { User } from "@prisma/client";

export const userModel = (user: User) => {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    verified: user.verified,
  };
};
