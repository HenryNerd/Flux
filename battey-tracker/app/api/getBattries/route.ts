import { createClient } from "redis";

export async function GET() {
  const client = createClient({
    url: "redis://127.0.0.1:6969",
  });

  await client.connect();

  try {
    const matchingKeys = [];
    for await (const key of client.scanIterator({
      MATCH: '*0001*',
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