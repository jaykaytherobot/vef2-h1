import dotenv from 'dotenv';

dotenv.config();

const {
  BASE_URL: url = 'http://localhost:3000',
} = process.env;

export function getLinks(path = '', lengthString, offsetString, limitString) {
  const length = Number(lengthString);
  const offset = Number(offsetString);
  const limit = Number(limitString);
  let next; let prev;
  if (length > limit + offset) {
    next = { href: new URL(`${path}?offset=${offset + limit}&limit=${limit}`, url) };
  } else {
    next = undefined;
  }
  if (offset > 0) {
    prev = { href: new URL(`/${path}?offset=${Math.max(offset - limit, 0)}&limit=${limit}`, url) };
  } else {
    prev = undefined;
  }
  const href = new URL(`${path}?offset=${offset}&limit=${limit}`, url);

  return {
    next,
    prev,
    href,
  };
}
