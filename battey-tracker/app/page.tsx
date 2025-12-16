"use client"
import BatteryCard from "@/components/ui/batteryCard";
import { useEffect, useState } from 'react'

export default function Home() {
  const [keys, setKeys] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/getBattries')
      .then(res => res.json())
      .then(data => {
        const flatKeys = data.keys.flat()
        setKeys(flatKeys)
        setLoading(false)
      })
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-gray-200 w-full h-16 flex items-center px-4">
        <h1 className="text-red-300 text-2xl font-bold">
          BadgerBOTS 1306
        </h1>
      </div>
      {keys.map((key, index) => (
        <BatteryCard key={index} battery={key} />
      ))}
    </div>
  );
}