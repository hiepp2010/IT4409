'use client'

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Download, CreditCard, User, MapPin, Printer } from 'lucide-react'
import Image from "next/image"
import { useState } from "react"

interface OrderDetailsProps {
  order: any // We'll define the proper type in the next step
}

export function OrderDetails({ order }: OrderDetailsProps) {
  const [status, setStatus] = useState(order.status)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-xl">Orders ID: #{order.id}</h2>
          <Badge variant={
            status === 'delivered' ? 'success' :
            status === 'cancelled' ? 'destructive' :
            'default'
          }>
            {status}
          </Badge>
        </div>
        <div className="flex items-center gap-4">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Change Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button>
            Save
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <User className="h-5 w-5" />
            <h3 className="font-semibold">Customer</h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="font-medium">{order.customer.name}</p>
              <p className="text-sm text-gray-500">{order.customer.email}</p>
              <p className="text-sm text-gray-500">+{order.customer.phone}</p>
            </div>
            <Button variant="outline" className="w-full">
              View Profile
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <CreditCard className="h-5 w-5" />
            <h3 className="font-semibold">Order Info</h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Shipping: {order.shipping}</p>
              <p className="text-sm text-gray-500">Payment Method: {order.paymentMethod}</p>
              <p className="text-sm text-gray-500">Status: {status}</p>
            </div>
            <Button variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download Info
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <MapPin className="h-5 w-5" />
            <h3 className="font-semibold">Deliver To</h3>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-gray-500">{order.shippingAddress}</p>
            <Button variant="outline" className="w-full">
              View Profile
            </Button>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Payment Info</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-500 rounded" />
            <span>Mastercard **** **** **** {order.paymentInfo.last4}</span>
          </div>
          <p className="text-sm text-gray-500">Business name: {order.paymentInfo.businessName}</p>
          <p className="text-sm text-gray-500">Phone: {order.paymentInfo.phone}</p>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Note</h3>
        <Textarea 
          placeholder="Type some notes"
          className="min-h-[100px]"
          defaultValue={order.note}
        />
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-6">Products</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.products.map((product: any) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="w-10 h-10 relative">
                    <Image
                      src={product.image || '/placeholder.svg'}
                      alt={product.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>#{product.orderId}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell className="text-right">₹{product.total.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>₹{order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax (20%)</span>
            <span>₹{order.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Discount</span>
            <span>₹{order.discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping Rate</span>
            <span>₹{order.shippingRate.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg pt-4 border-t">
            <span>Total</span>
            <span>₹{order.total.toFixed(2)}</span>
          </div>
        </div>
      </Card>
    </div>
  )
}

