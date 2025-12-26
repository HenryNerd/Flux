import { createClient } from "redis";

export async function GET(
    _: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params

    const client = createClient({
        url: "redis://127.0.0.1:6969",
    });

    await client.connect();

     try {
            await client.connect();
    
            await client.hSet(`0002-${realBatteryID}-${currentTime}`, {
                timestamp
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