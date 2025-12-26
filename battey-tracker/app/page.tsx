"use client"
import BatteryCard from "@/components/ui/batteryCard";
import { useEffect, useState } from 'react'
import Navbar from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";

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
      <Button className="bg-slate-200 mt-4 mb-5 ml-4" variant="outline">New Battery</Button>
      {keys.map((key, index) => (
        <BatteryCard key={index} battery={key} />
      ))}
    </div>
  );
}