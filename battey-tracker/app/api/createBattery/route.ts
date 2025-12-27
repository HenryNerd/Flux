import { createClient } from "redis";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { season, mounth, name, nfc, capacity } = await request.json();

  console.log("Trigered Create")
  
  const timestamp = new Date().toISOString();
  const batteryKey = `0001-${nfc}`;
  
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
    
    await client.hSet(batteryKey, {
      eventType: "Battery Created",
      season: season,
      mounth: mounth,
      friendlyName: name,
      batteryID: nfc,
      capacity: capacity,
      timestamp: timestamp,
    });
    
    await client.quit();
    
    return NextResponse.json({
      success: true,
      message: "Battery created successfully",
      batteryKey: batteryKey,
      data: {
        season,
        mounth,
        friendlyName: name,
        batteryID: nfc,
        capacity,
        timestamp
      }
    });
  } catch (error) {
    console.error("Redis error:", error);
    if (client.isOpen) {
      await client.quit();
    }
    return NextResponse.json(
      { success: false, error: "Failed to create battery" },
      { status: 500 }
    );
  }
}