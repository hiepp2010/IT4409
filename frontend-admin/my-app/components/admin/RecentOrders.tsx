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
import { orders } from "@/lib/orders"

const ITEMS_PER_PAGE = 6

export function RecentOrders() {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const recentOrders = orders.slice(0, ITEMS_PER_PAGE)

  const toggleOrder = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    )
  }

  const toggleAll = () => {
    setSelectedOrders(prev => 
      prev.length === recentOrders.length ? [] : recentOrders.map(order => order.id)
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">
            <Checkbox 
              checked={selectedOrders.length === recentOrders.length}
              onCheckedChange={toggleAll}
            />
          </TableHead>
          <TableHead>Product</TableHead>
          <TableHead>Order ID</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Customer Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recentOrders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>
              <Checkbox 
                checked={selectedOrders.includes(order.id)}
                onCheckedChange={() => toggleOrder(order.id)}
              />
            </TableCell>
            <TableCell>{order.productName}</TableCell>
            <TableCell>#{order.id}</TableCell>
            <TableCell>{order.date}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={order.customer.avatar} />
                  <AvatarFallback>{order.customer.name[0]}</AvatarFallback>
                </Avatar>
                {order.customer.name}
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
            <TableCell className="text-right">₹{order.amount.toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

