import { createClient } from "redis";
import { NextResponse } from "next/server";

export async function POST(_: Request,
    request: Request,
    context: { params: Promise<{ id: string }> }
) {

    const { id } = await context.params

    const { battery, mesuredAh, mesuredWh, testTime } = await request.json()

    const client = createClient({
        url: "redis://127.0.0.1:6969",
    });

    await client.connect();




}