import { createClient } from "redis";

export async function GET() {
  const client = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT)
    }
  });

  await client.connect();

  try {
    const rotationKey = '0005-ROTATION-ORDER';
    
    const rotationOrder = await client.lRange(rotationKey, 0, -1);
    
    const allBatteries: string[] = [];
    for await (const key of client.scanIterator({
      MATCH: '0001-*',
      TYPE: 'hash'
    })) {
      if (Array.isArray(key)) {
        allBatteries.push(...key);
      } else {
        allBatteries.push(key);
      }
    }
    
    if (rotationOrder.length === 0) {
      await client.del(rotationKey);
      for (const battery of allBatteries) {
        await client.rPush(rotationKey, battery);
      }
      return Response.json({ keys: allBatteries });
    }
    
    const newBatteries = allBatteries.filter(b => !rotationOrder.includes(b));
    for (const newBattery of newBatteries) {
      await client.rPush(rotationKey, newBattery);
    }
    
    const validRotation = rotationOrder.filter(b => allBatteries.includes(b));
    const finalOrder = [...validRotation, ...newBatteries];
    
    return Response.json({ keys: finalOrder });
  } catch (error) {
    console.error("Redis Error", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return Response.json({ error: errorMessage }, { status: 500 });
  } finally {
    await client.quit();
  }
}