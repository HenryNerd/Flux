import { createClient } from "redis";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const client = createClient({
    url: "redis://127.0.0.1:6969",
  });

  try {
    await client.connect();
    
    const keys = await client.keys(`*${id}*`);
    console.log(keys);
    
    await client.quit();
    
    return NextResponse.json({
      success: true,
      keys: keys,
      id: id
    });
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