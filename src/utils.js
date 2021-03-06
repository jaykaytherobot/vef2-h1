import dotenv from 'dotenv';
import xss from 'xss';

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
  const self = { href: new URL(`${path}?offset=${offset}&limit=${limit}`, url) };

  return {
    self,
    next,
    prev,
  };
}

export function sanitize(...request) {
  const req = request[0];
  for (const value in req) {
    req[value] = xss(req[value]);
  }
  return req;
}

export function intToWatch(i) {
  switch (i) {
    case 0: return 'Langar að horfa';
    case 1: return 'Er að horfa';
    case 2: return 'Hef horft';
    default: return null;
  }
}
