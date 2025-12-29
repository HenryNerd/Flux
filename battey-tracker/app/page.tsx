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
import { Scanner } from '@yudiel/react-qr-scanner';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

export default function Home() {
  const router = useRouter(); // Add this
  const [keys, setKeys] = useState([])
  const [loading, setLoading] = useState(true)
  const [season, setseason] = useState('');
  const [mounth, setmounth] = useState('');
  const [name, setname] = useState('');
  const [nfc, setnfc] = useState('');
  const [capacity, setcapacity] = useState('');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', { season, mounth, name, nfc, capacity })

    const formData = {
      season: season,
      mounth: mounth,
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

      setseason('');
      setmounth('');
      setname('');
      setnfc('');
      setcapacity('');

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
      <Drawer>
        <DrawerTrigger>
          <Button>QR Code Scanner</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerTitle>Qr Code Scaner</DrawerTitle>
          <Scanner
            onScan={(result) => console.log(result)}
            components={{
              torch: true,
              zoom: true,
            }}
          />
        </DrawerContent>
      </Drawer>
      <Sheet>
        <SheetTrigger asChild>
          <Button className="bg-slate-200 mt-4 mb-5 ml-4" variant="outline">New Battery</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <form onSubmit={handleSubmit}>
              <Label htmlFor="season">Season Purchased: </Label>
              <Input value={season} onChange={(e) => setseason(e.target.value)} id="season"></Input>

              <Label htmlFor="mounth">Mounth Purchased: </Label>
              <Input value={mounth} onChange={(e) => setmounth(e.target.value)} id="mounth"></Input>

              <Label htmlFor="name">Battery Name: </Label>
              <Input value={name} onChange={(e) => setname(e.target.value)} id="name"></Input>

              <Label htmlFor="nfc">NFC Tag: </Label>
              <Input value={nfc} onChange={(e) => setnfc(e.target.value)} id="nfc"></Input>

              <Label htmlFor="capacity">Battery Capaciy (Ah): </Label>
              <Input value={capacity} onChange={(e) => setcapacity(e.target.value)} id="capacity"></Input>

              <SheetClose asChild>
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