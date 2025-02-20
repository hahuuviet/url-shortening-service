import { REGEX_CONSTANT } from "../constants/regex.constant";

export const isValidUrl = (url: string): boolean => {
  return REGEX_CONSTANT.URL.test(url);
};

export const isValidShortenUrl = (url: string): boolean => {
  return REGEX_CONSTANT.SHORTEN_URL.test(url);
};

export const isValidPath = (path: string): boolean => {
  return REGEX_CONSTANT.PATH.test(path);
}
