import { createClient } from "redis";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const client = createClient({
        username: 'default',
        password: process.env.REDIS_PASSWORD,
        socket: {
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT)
        }
      });

      await client.connect();

      const data = await client.hGetAll(`0004-S${id}`);
      




    }
