"use client"
import BatteryCard from "@/components/ui/batteryCard";
import { useEffect, useState } from 'react'
import Navbar from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
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
            const response = await fetch(`/api/dischargeTest/${battery}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })

            const result = await response.json()
            console.log('Success:', result)

        } catch (error) {
            console.error('Error:', error)
        }

        setMesuredAh('');
        setMesuredWh('');
        setTestTime('');
    }

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

    
    const handleClick = (batteryId: string) => {
        router.push(`/battery/${batteryId}`)
    }

  return (
    <div className="bg-white min-h-screen">
      <Navbar></Navbar>
      <Sheet>
        <SheetTrigger>
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
    </div >
  );
}