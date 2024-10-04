import express from "express";
import {
  authTokenMiddleware,
  authUserMiddleware,
} from "../middlewares/auth.js";
import { errors } from "../config/errors.js";
import { userModel } from "../models/user.js";

const router = express.Router();

router.get("/me", authTokenMiddleware, authUserMiddleware, async (req, res) => {
  const user = req.user;
  if (!user) {
    throw errors.invalidAuth;
  }

  res.status(200).json({
    success: true,
    data: userModel(user),
  });
});

export default router;
