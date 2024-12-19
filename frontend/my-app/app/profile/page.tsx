'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"

interface UserProfile {
  username: string;
  email: string;
  fullName: string;
  phone: string;
  address: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile>({
    username: '',
    email: '',
    fullName: '',
    phone: '',
    address: '',
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        router.push('/auth')
        return
      }

      try {
        const response = await fetch(`${API_URL}/users/${userId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch user profile')
        }
        const data = await response.json()
        setProfile(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch user profile. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const userId = localStorage.getItem('userId')
    if (!userId) {
      router.push('/auth')
      return
    }

    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      toast({
        title: "Success",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div className="text-center mt-8">Loading profile...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={profile.username}
                onChange={handleInputChange}
                disabled
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                value={profile.fullName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={profile.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                value={profile.address}
                onChange={handleInputChange}
                required
                rows={3}
              />
            </div>
            <Button type="submit">Update Profile</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

