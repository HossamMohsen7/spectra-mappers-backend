import express, { Request, Response } from "express";
import {
  authMiddleware,
  authTokenMiddleware,
  authUserMiddleware,
} from "../middlewares/auth.js";
import { errors } from "../config/errors.js";
import { db } from "../db.js";
import {
  validateCreateLocation,
  validateEditLocation,
} from "../validators/locationValidators.js";

const router = express.Router();

router.get("/my", authTokenMiddleware, authUserMiddleware, async (req, res) => {
  const user = req.user;

  if (!user) {
    throw errors.invalidAuth;
  }

  const locations = await db.savedLocation.findMany({
    where: {
      userId: user.id,
    },
  });

  res.status(200).json({
    success: true,
    data: locations,
  });
});

router.post(
  "/:id",
  authTokenMiddleware,
  authUserMiddleware,
  validateEditLocation,
  async (req, res) => {
    const id = req.params.id;
    const { name, notificationEnabled } = req.body;

    const location = await db.savedLocation.findUnique({
      where: { id },
    });

    if (!location || location.userId !== req.user?.id) {
      throw errors.locationNotFound;
    }

    const updated = await db.savedLocation.update({
      where: {
        id: location.id,
      },
      data: {
        name: name ?? location.name,
        notificationEnabled: notificationEnabled,
      },
    });

    res.status(200).json({
      success: true,
      data: updated,
    });
  }
);

router.post(
  "/",
  authTokenMiddleware,
  authUserMiddleware,
  validateCreateLocation,
  async (req, res) => {
    if (!req.user) {
      throw errors.invalidAuth;
    }

    const { name, longitude, latitude, notificationEnabled } = req.body;

    const exists = await db.savedLocation.findFirst({
      where: {
        userId: req.user.id,
        longitude,
        latitude,
      },
    });

    if (exists) {
      throw errors.locationAlreadyExists;
    }

    const location = await db.savedLocation.create({
      data: {
        name,
        longitude,
        latitude,
        notificationEnabled,
        userId: req.user.id,
      },
    });

    res.status(201).json({
      success: true,
      data: location,
    });
  }
);

export default router;
