import dayjs from "dayjs";
import got from "got";
import { redis } from "./redisService.js";
const getMetadata = async (
  longitude: number,
  latitude: number,
  startDate: string,
  endDate: string,
  cloudCoverage: number = 100
) => {
  const key = `${longitude}-${latitude}-${startDate}-${endDate}-${cloudCoverage}`;
  const cachedMetadata = await redis.get(key);

  if (cachedMetadata) {
    return JSON.parse(cachedMetadata);
  }

  const response = await got
    .post("https://nasa-map.elyra.games/search", {
      json: {
        longitude,
        latitude,
        start_date: startDate,
        end_date: endDate,
        cloud_cover: cloudCoverage,
      },
    })
    .json<any>();

  await redis.set(key, JSON.stringify(response)).then(() => {
    redis.expire(key, 60 * 60 * 24);
  });

  return response;
};

const getMostRecentMetadata = async (
  longitude: number,
  latitude: number,
  startDate: string,
  endDate: string,
  cloudCoverage: number = 100
) => {
  const metadata = await getMetadata(
    longitude,
    latitude,
    startDate,
    endDate,
    cloudCoverage
  );

  //sort to get most recent metadata
  const sortedMetadata = metadata.scenes.sort((a: any, b: any) => {
    return new Date(b.start_time).getTime() - new Date(a.start_time).getTime();
  });

  const mostRecentMetadata = sortedMetadata[0];
  return mostRecentMetadata;
};

const getNextAquisition = async (longitude: number, latitude: number) => {
  //now as 2024-01-05
  const now = new Date();
  const nowString = dayjs(now).format("YYYY-MM-DD");

  const before16Days = dayjs(now).subtract(16, "day").toDate();
  const before16DaysString = dayjs(before16Days).format("YYYY-MM-DD");

  const metadata = await getMetadata(
    longitude,
    latitude,
    before16DaysString,
    nowString
  );

  const sortedMetadata = metadata.scenes.sort((a: any, b: any) => {
    return new Date(b.start_time).getTime() - new Date(a.start_time).getTime();
  });

  const mostRecentMetadata = sortedMetadata[0];
  const secondMostRecentMetadata = sortedMetadata[1];

  const nextAquisition = dayjs(mostRecentMetadata.start_time).add(8, "day");

  return nextAquisition.toISOString();
};

export default {
  getMetadata,
  getMostRecentMetadata,
  getNextAquisition,
};
