'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { Package, Truck, Clock, CheckCircle, XCircle } from 'lucide-react'

interface OrderItem {
  productId: string;
  colorId: string;
  size: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    imagePath: string;
  };
}

interface Order {
  id: string;
  createdAt: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentMethod: 'cod' | 'vnpay';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  items: OrderItem[];
  shippingInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    province: string;
    district: string;
    ward: string;
    notes?: string;
  };
  subtotal: number;
  shipping: number;
  total: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default async function OrderDetailsPage({ params }: { params: Promise<{ orderId: string }> }) {
  const {orderId} = await params;
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const userId = localStorage.getItem('userId')
        if (!userId) {
          router.push('/auth')
          return
        }

        const response = await fetch(`${API_URL}/order/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch order details')
        }

        const data = await response.json()
        setOrder(data)
      } catch (error) {
        setError('Failed to load order details. Please try again later.')
        toast({
          title: "Error",
          description: "Could not load order details",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrderDetails()
  }, [orderId, router])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-lg">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <XCircle className="w-12 h-12 text-red-500 mb-4" />
            <p className="text-lg mb-4">{error || 'Order not found'}</p>
            <Button onClick={() => router.push('/order-history')}>
              Return to Order History
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-500'
      case 'PROCESSING':
        return 'bg-blue-500'
      case 'SHIPPED':
        return 'bg-purple-500'
      case 'DELIVERED':
        return 'bg-green-500'
      case 'CANCELLED':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getPaymentStatusColor = (status: Order['paymentStatus']) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-500'
      case 'PENDING':
        return 'bg-yellow-500'
      case 'FAILED':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/order-history')}
          className="mb-4"
        >
          ← Back to Order History
        </Button>
        <h1 className="text-3xl font-bold">Order #{order.id}</h1>
        <p className="text-gray-600">
          Placed on {new Date(order.createdAt).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Status and Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Badge className={`${getStatusColor(order.status)} text-white`}>
                  {order.status}
                </Badge>
                <Badge className={`${getPaymentStatusColor(order.paymentStatus)} text-white`}>
                  {order.paymentStatus}
                </Badge>
              </div>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col items-center p-4 border rounded-lg">
                  <Package className="w-6 h-6 mb-2" />
                  <span className="text-sm text-center">Order Placed</span>
                </div>
                <div className="flex flex-col items-center p-4 border rounded-lg">
                  <Clock className="w-6 h-6 mb-2" />
                  <span className="text-sm text-center">Processing</span>
                </div>
                <div className="flex flex-col items-center p-4 border rounded-lg">
                  <Truck className="w-6 h-6 mb-2" />
                  <span className="text-sm text-center">Shipped</span>
                </div>
                <div className="flex flex-col items-center p-4 border rounded-lg">
                  <CheckCircle className="w-6 h-6 mb-2" />
                  <span className="text-sm text-center">Delivered</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex gap-4 py-4">
                    <div className="relative w-24 h-24">
                      <Image
                        src={item.product.imagePath || '/placeholder.svg'}
                        alt={item.product.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-sm text-gray-600">
                        Color: {item.colorId}, Size: {item.size}
                      </p>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${item.price.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">
                        Total: ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary and Shipping Info */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>
                    {order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}
                  </span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    Payment Method: {order.paymentMethod.toUpperCase()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Name:</strong> {order.shippingInfo.fullName}</p>
                <p><strong>Email:</strong> {order.shippingInfo.email}</p>
                <p><strong>Phone:</strong> {order.shippingInfo.phone}</p>
                <p><strong>Address:</strong> {order.shippingInfo.address}</p>
                <p>
                  <strong>Location:</strong> {order.shippingInfo.ward}, {order.shippingInfo.district}, {order.shippingInfo.province}
                </p>
                {order.shippingInfo.notes && (
                  <div className="mt-4 pt-4 border-t">
                    <p><strong>Notes:</strong></p>
                    <p className="text-sm text-gray-600">{order.shippingInfo.notes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

