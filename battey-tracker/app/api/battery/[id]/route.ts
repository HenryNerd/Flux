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
    const data = await client.hGetAll(id);
    console.log('Fetching key:', id);
    console.log('Data received:', data);
    
    return Response.json({
      key: id,
      season: data.season,
      month: data.month,
      friendlyName: data.friendlyName,
      batteryID: data.batteryID,
      capacity: data.capacity
    });
  } catch (error) {
    console.error("Redis Error", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return Response.json({ error: errorMessage }, { status: 500 });
  } finally {
    await client.quit();
  }
}