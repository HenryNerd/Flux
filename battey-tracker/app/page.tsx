"use client"
import BatteryCard from "@/components/ui/batteryCard";
import { useEffect, useState } from 'react'
import Navbar from "@/components/ui/navbar";

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
      <Navbar></Navbar>
      {keys.map((key, index) => (
        <BatteryCard key={index} battery={key} />
      ))}
    </div>
  );
}