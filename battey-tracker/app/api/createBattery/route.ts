import { createClient } from "redis";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { season, mounth, name, nfc, capacity } = await request.json();

  console.log("Trigered Create")
  
  const timestamp = new Date().toISOString();
  const batteryKey = `0001-${nfc}`;
  
  const client = createClient({
    url: "redis://127.0.0.1:6969",
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