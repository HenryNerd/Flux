import { createClient } from "redis";

export async function GET(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params 
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
    const data = await client.hGetAll(id);
    console.log('Fetching key:', id);
    console.log('Data received:', data);
    
    return Response.json({
      key: id,
      ...data
    });
  } catch (error) {
    console.error("Redis Error", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return Response.json({ error: errorMessage }, { status: 500 });
  } finally {
    await client.quit();
  }
}