import { createClient } from "redis";

export async function GET() {
  const client = createClient({
    username: "default",
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: process.env.REDIS_HOST || "redis-17916.c1.us-central1-2.gce.cloud.redislabs.com",
      port: Number(process.env.REDIS_PORT) || 17916,
    },
  });

  await client.connect();

  try {
    const matchingKeys = [];
    for await (const key of client.scanIterator({
      MATCH: '0001-*',
      TYPE: 'hash'
    })) {
      matchingKeys.push(key);
    }

    return Response.json({ keys: matchingKeys });
  } catch (error) {
    console.error("Redis Error", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return Response.json({ error: errorMessage }, { status: 500 });
  } finally {
    await client.quit();
  }
}