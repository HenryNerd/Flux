import { createClient } from "redis";
import { NextResponse } from "next/server";

export async function GET(
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
        
        const redisKey = `0004-S${id}`;
        const data = await client.hGetAll(redisKey);
        
        if (Object.keys(data).length === 0) {
            return NextResponse.json({ 
                success: true, 
                slot: id,
                latestCheckIn: null,
                totalCheckIns: 0,
                message: 'No check-in events found for this slot',
                isDeployed: false
            });
        }
        
        const allEvents = Object.entries(data).map(([key, value]) => {
            try {
                const parsedValue = JSON.parse(value);
                return {
                    key,
                    ...parsedValue,
                    timestamp: parsedValue.timestamp
                };
            } catch (e) {
                console.error('Failed to parse event:', key, value);
                return null;
            }
        }).filter(e => e !== null);
        
        const checkInEvents = allEvents
            .filter(event => event.eventType === 'Battery Check In')
            .sort((a, b) => {
                return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
            });
        
        const latestCheckIn = checkInEvents[0] || null;
        
        let isDeployed = false;
        if (latestCheckIn) {
            const batteryID = latestCheckIn.batteryID;
            const checkInTime = new Date(latestCheckIn.timestamp).getTime();
            
            const keys = await client.keys(`0003-${batteryID}-*`);
            
            for (const deployKey of keys) {
                const deployData = await client.hGetAll(deployKey);
                const deployTimestamp = deployData.timestamp;
                
                if (deployTimestamp) {
                    const deployTime = new Date(deployTimestamp).getTime();
                    if (deployTime > checkInTime) {
                        isDeployed = true;
                        break;
                    }
                }
            }
        }
        
        return NextResponse.json({ 
            success: true, 
            slot: id,
            latestCheckIn: latestCheckIn,
            totalCheckIns: checkInEvents.length,
            totalEvents: allEvents.length,
            isDeployed: isDeployed
        });
        
    } catch (error) {
        console.error("Redis error:", error);
        
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch data";
        
        return NextResponse.json(
            { 
                success: false, 
                error: errorMessage
            },
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