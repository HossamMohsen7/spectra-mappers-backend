import got from "got";
const getMetadata = async (
  longitude: number,
  latitude: number,
  startDate: string,
  endDate: string,
  cloudCoverage: number = 100
) => {
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
    .json();

  return response;
};

export default {
  getMetadata,
};
