"use client"
import BatteryCard from "@/components/ui/batteryCard";
import { useEffect, useState } from 'react'
import Navbar from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Home() {
  const router = useRouter();
  const [keys, setKeys] = useState([])
  const [loading, setLoading] = useState(true)
  const [hydrated, setHydrated] = useState(false)
  const [season, setSeason] = useState('');
  const [month, setMonth] = useState('');
  const [name, setName] = useState('');
  const [nfc, setNfc] = useState('');
  const [capacity, setCapacity] = useState('');

  useEffect(() => {
    setHydrated(true)
    fetch('/api/getBattries')
      .then(res => res.json())
      .then(data => {
        const flatKeys = data.keys.flat()
        setKeys(flatKeys)
        setLoading(false)
      })
  }, [])

  if (!hydrated || loading) return <div>Loading...</div>

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', { season, month, name, nfc, capacity })
    
    const formData = {
      season: season,
      month: month,
      name: name,
      nfc: nfc,
      capacity: capacity
    }

    try {
      const response = await fetch(`/api/createBattery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      
      const result = await response.json()
      console.log('Success:', result)
      
      setSeason('');
      setMonth('');
      setName('');
      setNfc('');
      setCapacity('');
      
      fetch('/api/getBattries')
        .then(res => res.json())
        .then(data => {
          const flatKeys = data.keys.flat()
          setKeys(flatKeys)
        })
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleClick = (batteryId: string) => {
    router.push(`/battery/${batteryId}`)
  }

  return (
    <div className="bg-white min-h-screen">
      <Navbar></Navbar>
      <Sheet>
        <SheetTrigger asChild>
          <Button className="bg-slate-200 mt-4 mb-5 ml-4" variant="outline">New Battery</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <form onSubmit={handleSubmit}>
              <Label htmlFor="season">Season Purchased: </Label>
              <Input value={season} onChange={(e) => setSeason(e.target.value)} id="season"></Input>
              
              <Label htmlFor="month">Month Purchased: </Label>
              <Input value={month} onChange={(e) => setMonth(e.target.value)} id="month"></Input>
              
              <Label htmlFor="name">Battery Name: </Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} id="name"></Input>
              
              <Label htmlFor="nfc">NFC Tag: </Label>
              <Input value={nfc} onChange={(e) => setNfc(e.target.value)} id="nfc"></Input>
              
              <Label htmlFor="capacity">Battery Capacity (Ah): </Label>
              <Input value={capacity} onChange={(e) => setCapacity(e.target.value)} id="capacity"></Input>
              
              <SheetClose>
                <Button type='submit' variant="outline" className="bg-slate-200 mt-4 w-full">Add Battery</Button>
              </SheetClose>
            </form>
          </SheetHeader>
        </SheetContent>
      </Sheet>
      {
        keys.map((key, index) => (
          <BatteryCard key={index} battery={key} />
        ))
      }
    </div>
  );
}