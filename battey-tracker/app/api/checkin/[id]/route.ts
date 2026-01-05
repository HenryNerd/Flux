import { createClient } from "redis";
import { NextResponse } from "next/server";

let redisClient: ReturnType<typeof createClient> | null = null;

async function getRedisClient() {
    if (!redisClient) {
        redisClient = createClient({
            username: 'default',
            password: process.env.REDIS_PASSWORD,
            socket: {
                host: process.env.REDIS_HOST,
                port: Number(process.env.REDIS_PORT)
            }
        });
        await redisClient.connect();
    }
    return redisClient;
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    let realBatteryID = id.replace("0001-", "");

    const timestamp = new Date().toISOString();
    const sanitizedTimestamp = timestamp.replace(/[:.]/g, '-');

    try {
        const client = await getRedisClient();

        await client.hSet(`0004-${realBatteryID}-${sanitizedTimestamp}`, {
            battery: realBatteryID,
            timestamp: timestamp,
        });

        return NextResponse.json({
            success: true,
            message: "Battery Checked In",
            id,
        });
    } catch (error) {
        console.error("Redis error:", error);

        return NextResponse.json(
            { success: false, error: "Failed to save data" },
            { status: 500 }
        );
    }
}