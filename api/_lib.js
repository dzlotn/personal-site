import { Redis } from '@upstash/redis';

const { env } = process;

export const redis = new Redis({
  url: env.KV_REST_API_URL || env.UPSTASH_REDIS_REST_URL,
  token: env.KV_REST_API_TOKEN || env.UPSTASH_REDIS_REST_TOKEN,
});

export const INDEX_KEY = 'pv:index';
export const RETENTION_DAYS = 180;
export const pvKey = (id) => `pv:${id}`;
