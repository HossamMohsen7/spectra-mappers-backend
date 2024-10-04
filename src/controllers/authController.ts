import { Request, Response } from "express";
import {
  LoginController,
  RegisterController,
  ResendController,
  VerifyEmailController,
} from "../validators/authValidators.js";
import { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import env from "../env.js";
import { v4 as uuidv4 } from "uuid";
import argon2 from "argon2";
import { db } from "../db.js";
import { errors } from "../config/errors.js";
import { userModel } from "../models/user.js";
import { sha256, sixDigit } from "../utils/utils.js";
import { mailService } from "../services/mailService.js";

const generateToken = (user: User): [string, string] => {
  const tokenId = uuidv4();
  const token = jwt.sign({}, env.JWT_SECRET, {
    subject: user.id,
    expiresIn: "7d",
    jwtid: tokenId,
  });

  return [token, tokenId];
};

const login: LoginController = async (req, res) => {
  const { email, password } = req.body;

  const user = await db.user.findUnique({ where: { email } });

  if (!user) {
    throw errors.invalidLogin;
  }

  const passValid = await argon2.verify(user.password, password);

  if (passValid !== true) {
    throw errors.invalidLogin;
  }

  const [token, tokenId] = generateToken(user);

  await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      tokenIds: {
        push: tokenId,
      },
    },
  });

  res.status(200).json({
    success: true,
    token,
    ...userModel(user),
  });
};

const register: RegisterController = async (req, res) => {
  const { email, password, firstName, lastName, phoneNumber } = req.body;

  const user = await db.user.findFirst({
    where: {
      OR: [{ email }, { phoneNumber }],
    },
  });

  if (user) {
    throw errors.userExists;
  }

  const hashedPassword = await argon2.hash(password);

  const verificationCode = sixDigit();
  const verificationCodeHash = sha256(verificationCode);

  const newUser = await db.user.create({
    data: {
      email,
      password: hashedPassword,
      fullName: firstName + " " + lastName,
      phoneNumber,
    },
  });

  const [token, tokenId] = await generateToken(newUser);

  await db.user.update({
    where: {
      id: newUser.id,
    },
    data: {
      tokenIds: {
        push: tokenId,
      },
      verificationToken: verificationCodeHash,
      verificationRequestAt: new Date(),
      verificationExpiry: new Date(Date.now() + 1000 * 60 * 15),
    },
  });

  mailService.sendVerificationEmail(newUser.email, verificationCode);

  res.status(201).json({
    success: true,
    token,
    ...userModel(newUser),
  });
};

const verify: VerifyEmailController = async (req, res) => {};

const verifyResend: ResendController = async (req, res) => {};

export default {
  login,
  register,
  verify,
  verifyResend,
};
