import { createClient } from "redis";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  let client;

  const userKey = `8888-${id}`;

  try {
    client = createClient({
      username: "default",
      password: process.env.REDIS_PASSWORD,
      socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    });

    await client.connect();

    console.log("Fetching key:", userKey);

    const data = await client.hGetAll(userKey);

    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    console.log("Data received:", data);

    return NextResponse.json({
      success: true,
      key: userKey,
      ...data,
    });

  } catch (error) {
    console.error("Redis Error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.quit();
    }
  }
}
