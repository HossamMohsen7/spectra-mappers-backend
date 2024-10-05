import express from "express";
import mapService from "../services/mapService.js";

const router = express.Router();

router.post("/data", async (req, res) => {
  const { longitude, latitude, startDate, endDate, cloudCoverage } = req.body;

  // Call the service

  const metadata = await mapService.getMetadata(
    longitude,
    latitude,
    startDate,
    endDate,
    cloudCoverage
  );

  res.status(200).json({
    success: true,
    data: metadata,
  });
});

export default router;
