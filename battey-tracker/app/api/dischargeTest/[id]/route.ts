import { createClient } from "redis";
import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const { battery, mesuredAh, mesuredWh, testTime } = await request.json();

    let realBatteryID = id.replace("0001-", "");

    const timestamp = new Date().toISOString();
    const sanitizedTimestamp = timestamp.replace(/[:.]/g, '-');

    const client = createClient({
        username: 'default',
        password: process.env.REDIS_PASSWORD,
        socket: {
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT)
        }
    });

    try {
        await client.connect();

        await client.hSet(`0002-${realBatteryID}-${sanitizedTimestamp}`, {
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
