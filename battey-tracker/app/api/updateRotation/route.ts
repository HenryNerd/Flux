import { createClient } from "redis";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    let client;
    
    try {
        const { batteryID } = await request.json();
        
        client = createClient({
            username: 'default',
            password: process.env.REDIS_PASSWORD,
            socket: {
                host: process.env.REDIS_HOST,
                port: Number(process.env.REDIS_PORT)
            }
        });

        await client.connect();
        
        const rotationKey = '0005-ROTATION-ORDER';
        
        await client.lRem(rotationKey, 0, batteryID);
        await client.rPush(rotationKey, batteryID);
        
        return NextResponse.json({ 
            success: true,
            message: 'Rotation order updated'
        });
        
    } catch (error) {
        console.error("Redis error:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to update rotation";
        
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    } finally {
        if (client) {
            await client.close();
        }
    }
}