import { createClient } from "redis";
import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ slot: string; id: string }> }
) {
    let client;
    
    try {
        const { slot, id } = await params;

        const batteryID = id.includes('-') ? id.split('-')[1] : id;

        client = createClient({
            username: 'default',
            password: process.env.REDIS_PASSWORD,
            socket: {
                host: process.env.REDIS_HOST,
                port: Number(process.env.REDIS_PORT)
            }
        });

        await client.connect();
        
        const timestamp = new Date().toISOString();
        const eventKey = `${Date.now()}-${batteryID}`;
        
        const checkInEvent = {
            eventType: 'Battery Check In',
            slot: slot,
            batteryID: batteryID,
            timestamp: timestamp,
            season: '2026',
            month: new Date().toLocaleString('en-US', { month: 'long' })
        };
        
        await client.hSet(
            `0004-S${slot}`,
            eventKey,
            JSON.stringify(checkInEvent)
        );
        
        return NextResponse.json({ 
            success: true, 
            message: 'Battery checked in successfully',
            data: checkInEvent
        });
        
    } catch (error) {
        console.error("Redis error:", error);
        
        return NextResponse.json(
            { success: false, error: "Failed to check in battery" },
            { status: 500 }
        );
    } finally {
        if (client) {
            try {
                await client.close();
            } catch (disconnectError) {
                console.error("Error disconnecting:", disconnectError);
            }
        }
    }
}