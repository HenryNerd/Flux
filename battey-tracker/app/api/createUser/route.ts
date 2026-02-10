import { createClient } from "redis";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { firstName, lastName, userName, userRole } = await request.json();
    let client;

    try {
        client = createClient({
            username: 'default',
            password: process.env.REDIS_PASSWORD,
            socket: {
                host: process.env.REDIS_HOST,
                port: Number(process.env.REDIS_PORT)
            }
        });


        const timestamp = new Date().toISOString();
        const userKey = `8888-${userName}`;

        await client.hSet(userKey, {
            eventType: "New User",
            firstName: firstName,
            lastName: lastName,
            userName: userName,
            userRole: userRole,
            timestamp: timestamp,
        });

        await client.close();

        return NextResponse.json({
            success: true,
            message: "User created successfully",
            userName: userName
        });

    } catch (error) {
        console.error("Redis error:", error);
        
        return NextResponse.json(
            { success: false, error: "Failed to create user" },
            { status: 500 }
        );
    } finally {
        if (client) {
            await client.close();
        }
    }
}