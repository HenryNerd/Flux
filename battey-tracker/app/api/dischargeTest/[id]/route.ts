import { createClient } from "redis";
import { NextResponse } from "next/server";
import { timeStamp } from "console";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const { battery, mesuredAh, mesuredWh, testTime } = await request.json();

    let realBatteryID = id.replace("0001-", "");

    let currentTime = new Date().toISOString()

    const timestamp = new Date().toISOString();

    const client = createClient({
        url: "redis://127.0.0.1:6969",
    });

    try {
        await client.connect();

        await client.hSet(`0002-${realBatteryID}-${currentTime}`, {
            battery,
            mesuredAh,
            mesuredWh,
            testTime,
            timestamp: timestamp,
        });

        await client.quit();

        return NextResponse.json({
            success: true,
            message: "Test data saved",
            id,
        });
    } catch (error) {
        console.error("Redis error:", error);

        if (client.isOpen) {
            await client.quit();
        }

        return NextResponse.json(
            { success: false, error: "Failed to save data" },
            { status: 500 }
        );
    }
}
