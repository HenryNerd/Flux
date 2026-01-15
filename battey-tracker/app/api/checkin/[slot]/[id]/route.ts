import { createClient } from "redis";
import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    let client;
    
    try {
        const { id } = await params;

        client = createClient({
            username: 'default',
            password: process.env.REDIS_PASSWORD,
            socket: {
                host: process.env.REDIS_HOST,
                port: Number(process.env.REDIS_PORT)
            }
        });

        await client.connect();
        
        const data = await client.hGetAll(`0004-S${id}`);
        
        const entries = Object.entries(data).map(([key, value]) => {
            const parsedValue = JSON.parse(value);
            
            const timestamp = parsedValue.timestamp;
            
            return {
                key,
                value: parsedValue,
                timestamp,
                date: timestamp ? new Date(timestamp) : null
            };
        });
        
        const sortedEntries = entries.sort((a, b) => {
            if (!a.date || !b.date) return 0;
            return b.date.getTime() - a.date.getTime();
        });
        
        return NextResponse.json({ 
            success: true, 
            data: sortedEntries,
        });
        
    } catch (error) {
        console.error("Redis error:", error);
        
        return NextResponse.json(
            { success: false, error: "Failed to fetch data" },
            { status: 500 }
        );
    } finally {
        if (client) {
            try {
                await client.disconnect();
            } catch (disconnectError) {
                console.error("Error disconnecting:", disconnectError);
            }
        }
    }
}