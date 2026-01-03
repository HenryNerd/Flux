import { createClient } from "redis";

export async function getRedisClient() {
  const client = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT)
    }
  });
  await client.connect();
  return client;
}

export async function getBatteryData(id: string): Promise<any> {
  const client = await getRedisClient();
  try {
    const data = await client.hGetAll(id);
    console.log(`Fetching battery data for ${id}:`, data);
    return { key: id, ...data };
  } finally {
    await client.quit();
  }
}

export async function getBatteryEvents(batteryId: string) {
  const client = await getRedisClient();
  try {
    const keys = await client.keys(`*${batteryId}*`);
    return keys.sort((a: string, b: string) => b.localeCompare(a));
  } finally {
    await client.quit();
  }
}