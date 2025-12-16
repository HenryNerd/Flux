import { useEffect, useState } from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface BatteryData {
  season: string
  mounth: string
  friendlyName: string
  batteryID: string
  capacity: string
}

export default function BatteryCard({battery}: {battery: string}) {
  const [data, setData] = useState<BatteryData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/battery/${battery}`)
      .then(res => res.json())
      .then(batteryData => {
        setData(batteryData)
        setLoading(false)
        console.log(batteryData)
      })
      .catch(error => {
        console.error('Error fetching battery:', error)
        setLoading(false)
      })
  }, [battery])

  if (loading) return <div>Loading...</div>
  if (!data) return <div>No data</div>

  return (
    <div>
      <Card className="m-3">
        <CardHeader>
          <CardTitle className="text-red-300 font-bold text-xl">
            {data.friendlyName || 'Battery'}
          </CardTitle>
          <CardDescription className="text-gray-500">
            {data.mounth} {data.season}
          </CardDescription>
          <CardAction className="text-black">Open</CardAction>
        </CardHeader>
        <CardFooter>
          <h4 className="text-sm text-black">{data.batteryID}</h4>
        </CardFooter>
      </Card>
    </div>
  )
}