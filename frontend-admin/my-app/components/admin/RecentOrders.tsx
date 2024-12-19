'use client'

import { useState, useEffect } from "react"
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
import { Order, getOrders } from "@/lib/orders"

export function RecentOrders() {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { orders } = await getOrders(1, 6) // Fetch first 6 orders
        setOrders(orders)
      } catch (error) {
        console.error('Error fetching orders:', error)
      }
    }
    fetchOrders()
  }, [])

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
          <TableRow key={order.id}>
            <TableCell>
              <Checkbox 
                checked={selectedOrders.includes(order.id)}
                onCheckedChange={() => toggleOrder(order.id)}
              />
            </TableCell>
            <TableCell>#{order.id}</TableCell>
            <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={order.user?.avatar} />
                  <AvatarFallback>{order.user?.name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                {order.user?.name || 'Unknown User'}
              </div>
            </TableCell>
            <TableCell>
              <Badge 
                variant={
                  order.status === 'delivered' ? 'success' : 
                  order.status === 'cancelled' ? 'destructive' : 
                  'default'
                }
              >
                {order.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">${order.totalAmount.toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

