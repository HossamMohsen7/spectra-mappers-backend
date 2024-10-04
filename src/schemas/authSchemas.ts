import z from "zod";
import {
  emailValidation,
  passwordValidation,
  fullNameValidation,
  phoneNumberValidation,
  nameValidation,
} from "./globalSchemas.js";

export const loginSchema = z.object({
  email: emailValidation,
  password: passwordValidation,
});

export const registerSchema = z.object({
  firstName: nameValidation,
  lastName: nameValidation,
  email: emailValidation,
  password: passwordValidation,
  phoneNumber: phoneNumberValidation,
});

export const requestResetPasswordSchema = z.object({
  email: emailValidation,
});

export const verifyResetPasswordSchema = z.object({
  email: emailValidation,
  token: z.string(),
});

export const confirmResetPasswordSchema = z.object({
  email: emailValidation,
  token: z.string(),
  password: passwordValidation,
});

export const verifyEmailSchema = z.object({
  token: z.string(),
});

export const resendEmailSchema = z.object({
  email: emailValidation,
});
