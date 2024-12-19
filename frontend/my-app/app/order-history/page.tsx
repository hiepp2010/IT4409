'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function OrderHistoryPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        router.push('/auth')
        return
      }

      try {
        const response = await fetch(`${API_URL}/user/${userId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch orders')
        }
        const data = await response.json()
        setOrders(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch order history. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [router])

  if (isLoading) {
    return <div className="text-center mt-8">Loading order history...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Order History</h1>
      {orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <CardTitle>Order #{order.id}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Total: ₫{order.total}</p>
                <p>Status: {order.status}</p>
                <Button 
                  className="mt-4" 
                  onClick={() => router.push(`/order-details/${order.id}`)}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

