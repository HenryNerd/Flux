import { createClient } from "redis";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  
  const client = createClient({
    username: "default",
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: process.env.REDIS_HOST || "redis-17916.c1.us-central1-2.gce.cloud.redislabs.com",
      port: Number(process.env.REDIS_PORT) || 17916,
    },
  });

  try {
    await client.connect();
    const data = await client.hGetAll(`${id}`);
    await client.quit();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("Redis error:", error);
    if (client.isOpen) {
      await client.quit();
    }
    return NextResponse.json(
      { success: false, error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}