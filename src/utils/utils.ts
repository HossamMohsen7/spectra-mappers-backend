import { randomUUID } from "node:crypto";
import { customAlphabet } from "nanoid";
import crypto from "node:crypto";

export const capitalizeFirstLetter = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

export const chunk = <T>(array: T[], size: number) =>
  Array.from({ length: Math.ceil(array.length / size) }, (_, index) =>
    array.slice(index * size, index * size + size)
  );

export const generateRequestId = () => randomUUID();

export const getRandomArbitrary = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min) + min);

export const sha256 = (data: string) => {
  return crypto.createHash("sha256").update(data).digest("hex");
};

export const sixDigit = customAlphabet("1234567890", 6);
export const eightDigit = customAlphabet("1234567890", 8);

export const exponentialBackoff = async <T>(
  action: () => Promise<T>,
  maxRetries: number,
  maxBackoffTime: number = 64000
): Promise<T> => {
  let retries = 0;

  const attempt = async (): Promise<T> => {
    try {
      return await action();
    } catch (error) {
      if (retries >= maxRetries) {
        console.error("Max retries reached", error);
        return Promise.reject(error);
      }
      retries++;
      const randomDelay = Math.floor(Math.random() * 1000);
      const backoffTime = Math.min(
        Math.pow(2, retries) * 1000 + randomDelay,
        maxBackoffTime
      );

      console.log(`Retrying in ${backoffTime} ms (Attempt ${retries})`);
      await new Promise((resolve) => setTimeout(resolve, backoffTime));
      return attempt();
    }
  };

  return attempt();
};
