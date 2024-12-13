'use client'

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Order } from "@/lib/orders"
import Link from "next/link"

interface OrderListProps {
  orders: Order[]
}

export default function OrderList({ orders }: OrderListProps) {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])

  const toggleOrder = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    )
  }

  const toggleAll = () => {
    setSelectedOrders(prev => 
      prev.length === orders.length ? [] : orders.map(order => order.id)
    )
  }

  return (
    <div className="bg-white rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox 
                checked={selectedOrders.length === orders.length}
                onCheckedChange={toggleAll}
              />
            </TableHead>
            <TableHead>Order ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Customer Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} className="cursor-pointer hover:bg-gray-50">
              <TableCell className="w-12" onClick={(e) => e.stopPropagation()}>
                <Checkbox 
                  checked={selectedOrders.includes(order.id)}
                  onCheckedChange={() => toggleOrder(order.id)}
                />
              </TableCell>
              <TableCell>
                <Link href={`/admin/orders/${order.id}`} className="block w-full h-full">
                  #{order.id}
                </Link>
              </TableCell>
              <TableCell>
                <Link href={`/admin/orders/${order.id}`} className="block w-full h-full">
                  {new Date(order.date).toLocaleDateString()}
                </Link>
              </TableCell>
              <TableCell>
                <Link href={`/admin/orders/${order.id}`} className="block w-full h-full">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={order.customer.avatar} />
                      <AvatarFallback>{order.customer.name[0]}</AvatarFallback>
                    </Avatar>
                    {order.customer.name}
                  </div>
                </Link>
              </TableCell>
              <TableCell>
                <Link href={`/admin/orders/${order.id}`} className="block w-full h-full">
                  <Badge 
                    variant={
                      order.status === 'delivered' ? 'success' : 
                      order.status === 'cancelled' ? 'destructive' : 
                      'default'
                    }
                  >
                    {order.status}
                  </Badge>
                </Link>
              </TableCell>
              <TableCell className="text-right">
                <Link href={`/admin/orders/${order.id}`} className="block w-full h-full">
                  ${order.total.toFixed(2)}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

