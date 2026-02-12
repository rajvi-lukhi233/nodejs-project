import { client } from '../../config/redisConfig.js';

export const set = async (key, value, expiry = null) => {
  try {
    const data = JSON.stringify(value);
    await client.set(key, data, { EX: expiry });
  } catch (error) {
    console.error('Redis SET Error:', error);
  }
};

export const get = async (key) => {
  try {
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Redis GET Error:', error);
    return null;
  }
};

export const hashSet = async (key, field, value) => {
  try {
    await client.hSet(key, field, JSON.stringify(value));
  } catch (error) {
    console.error('Redis HSET Error:', error);
  }
};

export const hashGet = async (key, field) => {
  try {
    const data = await client.hGet(key, field);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Redis HGET Error:', error);
    return null;
  }
};

export const hashGetAll = async (key) => {
  try {
    const data = await client.hGetAll(key);

    // Parse each field value from JSON
    const parsedData = {};
    for (const field in data) {
      parsedData[field] = JSON.parse(data[field]);
    }

    return parsedData;
  } catch (error) {
    console.error('Redis HGETALL Error:', error);
    return null;
  }
};

export const redisDelete = async (key) => {
  try {
    await client.del(key);
  } catch (error) {
    console.error('Redis HGETALL Error:', error);
  }
};
