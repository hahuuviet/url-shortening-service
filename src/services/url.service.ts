import { findByShortened } from "../dao/url.dao";
import { generateRandomString } from "../utils/helper";

const MAX_RETRIES = 5;

export const generateUniqueShortenUrl = async (): Promise<string | null> => {
    for (let i = 0; i < MAX_RETRIES; i++) {
        const finalShortenUrl = generateRandomString(7);
        if (!(await findByShortened(finalShortenUrl))) {
          return finalShortenUrl;
        }
      }
      return null;
};
