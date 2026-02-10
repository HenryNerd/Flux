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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogClose,
  DialogTitle,
  DialogHeader
} from "@/components/ui/dialog"
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"
import { Crown, Wrench } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { toast } from "sonner"

export default function Home() {
  const router = useRouter();
  const [keys, setKeys] = useState([])
  const [loading, setLoading] = useState(true)
  const [season, setseason] = useState('');
  const [mounth, setmounth] = useState('');
  const [name, setname] = useState('');
  const [nfc, setnfc] = useState('');
  const [capacity, setcapacity] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('member');
  const isPreview = process.env.VERCEL_ENV === "preview";
  const [authFirstName, setAuthFirstName] = useState<string | null>(null);
  const [authLastName, setAuthLastName] = useState<string | null>(null);
  const [authUserRole, setAuthUserRole] = useState<string | null>(null);


  useEffect(() => {
    setAuthFirstName(localStorage.getItem("auth_firstName"));
    setAuthLastName(localStorage.getItem("auth_lastName"));
    setAuthUserRole(localStorage.getItem("auth_userRole"));
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

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const userData = {
      firstName: firstName,
      lastName: lastName,
      userName: userName,
      userRole: userRole
    }

    try {
      const response = await fetch('/api/createUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      })

      const result = await response.json()

      if (result.success) {
        toast.success(`User ${userName} created successfully`)
        setFirstName('');
        setLastName('');
        setUserName('');
        setUserRole('member');
      } else {
        toast.error('Failed to create user: ' + result.error)
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to create user')
    }
  }

  const handleClick = (batteryId: string) => {
    router.push(`/battery/${batteryId}`)
  }

  const normalSite = () => {
    window.location.href = "https://flux.echo-labs.xyz/";
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar></Navbar>
      {isPreview && (
        <Dialog defaultOpen={true}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Development Build</DialogTitle>
              <DialogDescription>
                This site contains features that are in beta and have not been tested or verified.
                Some features may be broken. If you want a reliable experience, please proceed
                to the normal site.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 mt-4">
              <Button onClick={normalSite}>Go to Normal Site</Button>
              <DialogClose asChild>
                <Button variant="ghost">Continue to Beta Site</Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      )}
      <Card className="m-4 p-4 bg-red-300">
        <div className="flex gap-2">
          <h1 className="text-4xl font-medium font-sans text-slate-100">Hey, {authFirstName}</h1>
          <Badge className="m-2 bg-red-150 border-3 border-slate-100 text-slate-100"><Wrench></Wrench>Pit Member</Badge>
          <Badge className="m-2 bg-red-150 border-3 border-slate-100 text-slate-100"><Crown></Crown>Pit Admin</Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          <Drawer>
            <DrawerTrigger asChild>
              <Button className="bg-slate-100 text-color-black" variant="outline">Scan Battery</Button>
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
              <Button className="bg-slate-100" variant="outline">New Battery</Button>
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
          <Button className="bg-slate-100 text-color-black hidden md:block" variant="outline" onClick={() => router.push(`pit`)}>Pit View</Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button className="bg-slate-100 text-color-black" variant="outline">Add User</Button>
            </SheetTrigger>
            <SheetContent className="p-3">
              <SheetTitle className="text-center">Add User</SheetTitle>
              <form onSubmit={handleUserSubmit}>
                <Label className="mt-3 mb-2" htmlFor="firstName">First Name:</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <Label className="mt-3 mb-2" htmlFor="lastName">Last Name:</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
                <Label className="mt-3 mb-2" htmlFor="username">Username:</Label>
                <Input
                  className="mb-5"
                  id="username"
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
                <Label className="mt-3 mb-2" htmlFor="userRole">Role:</Label>
                <RadioGroup
                  value={userRole}
                  onValueChange={setUserRole}
                  className="max-w-sm"
                  id="userRole"
                >
                  <FieldLabel htmlFor="admin">
                    <Field orientation="horizontal">
                      <FieldContent>
                        <FieldTitle><Crown></Crown>Pit Admin</FieldTitle>
                        <FieldDescription>
                          Can manange batteries and users
                        </FieldDescription>
                      </FieldContent>
                      <RadioGroupItem value="admin" id="admin" />
                    </Field>
                  </FieldLabel>
                  <FieldLabel htmlFor="member">
                    <Field orientation="horizontal">
                      <FieldContent>
                        <FieldTitle><Wrench></Wrench>Pit Member</FieldTitle>
                        <FieldDescription>Can manange batteries</FieldDescription>
                      </FieldContent>
                      <RadioGroupItem value="member" id="member" />
                    </Field>
                  </FieldLabel>
                </RadioGroup>
                <SheetClose asChild>
                  <Button className="mt-5 bg-red-300 text-slate-100 w-full" variant="outline" type="submit">Add User</Button>
                </SheetClose>
              </form>
            </SheetContent>
          </Sheet>
        </div>
      </Card>
      {
        keys.map((key, index) => (
          <BatteryCard key={index} battery={key} />
        ))
      }
    </div>
  );
}