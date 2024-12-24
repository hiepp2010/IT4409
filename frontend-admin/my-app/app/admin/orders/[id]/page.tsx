'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Package, Truck, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

const BACKEND_URL = 'https://maixuanhieu20215576-web.onrender.com'

interface OrderItem {
  id: number
  productId: number
  productName: string
  quantity: number
  price: number
  color: string
  size: string
}

interface Order {
  id: number
  userId: number
  totalAmount: string
  address: string
  phoneNumber: string
  paymentMethod: 'cod' | 'bank_transfer'
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'
  createdAt: string
  updatedAt: string
  orderItems: OrderItem[]
}

const statusIcons = {
  Pending: Clock,
  Processing: Package,
  Shipped: Truck,
  Delivered: CheckCircle,
  Cancelled: XCircle
}

const statusColors = {
  Pending: 'bg-yellow-500',
  Processing: 'bg-blue-500',
  Shipped: 'bg-purple-500',
  Delivered: 'bg-green-500',
  Cancelled: 'bg-red-500'
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    fetchOrderDetails()
  }, [params.id])

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/${params.id}`)
      if (!response.ok) throw new Error('Failed to fetch order details')
      const data = await response.json()
      setOrder(data)
      console.log("abc")
      console.log(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch order details',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusUpdate = async (newStatus: string) => {
    if (!order) return

    setIsUpdating(true)
    try {
      const response = await fetch(`${BACKEND_URL}/${order.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus
        }),
      })

      // if (!response.ok) throw new Error('Failed to update order status')
      router.push("/admin/orders")

      // const updatedOrder = await response.json()
      // setOrder(updatedOrder)
      
      toast({
        title: 'Success',
        description: 'Order status updated successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update order status',
        variant: 'destructive',
      })
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <AdminSidebar />
        <div className="flex-1 p-6">
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex h-screen">
        <AdminSidebar />
        <div className="flex-1 p-6">
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <h2 className="text-xl font-semibold">Order not found</h2>
            <Button onClick={() => router.push('/admin/orders')}>
              Back to Orders
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const StatusIcon = statusIcons[order.status]

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Order #{order.id}</h1>
            <p className="text-muted-foreground">
              Created at {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <Button onClick={() => router.push('/admin/orders')}>
            Back to Orders
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <StatusIcon className={`h-8 w-8 ${statusColors[order.status]} text-white p-1.5 rounded-full`} />
                <div className="flex-1">
                  <Select
                    value={order.status}
                    onValueChange={handleStatusUpdate}
                    disabled={isUpdating}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Processing">Processing</SelectItem>
                      <SelectItem value="Shipped">Shipped</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Last updated: {new Date(order.updatedAt).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Shipping Address</h3>
                <p className="text-muted-foreground">{order.address}</p>
              </div>
              <div>
                <h3 className="font-medium">Customer ID</h3>
                <p className="text-muted-foreground">{order.userId}</p>
              </div>
              <div>
                <h3 className="font-medium">Phone Number</h3>
                <p className="text-muted-foreground">{order.phoneNumber}</p>
              </div>
              <div>
                <h3 className="font-medium">Payment Method</h3>
                <p className="text-muted-foreground">{order.paymentMethod}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.orderItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium">{item.productName}</h3>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="secondary">{item.color}</Badge>
                      <Badge variant="secondary">{item.size}</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${item.price}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between items-center pt-4">
                <h3 className="font-semibold">Total Amount</h3>
                <p className="text-xl font-bold">${order.totalAmount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

