'use client'

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"

interface Order {
  id: string
  productName: string
  date: string
  customer: {
    name: string
    avatar: string
  }
  status: 'delivered' | 'cancelled' | 'pending'
  amount: number
}

const orders: Order[] = [
  {
    id: '425436',
    productName: 'Classic T-Shirt',
    date: 'Nov 05, 2023',
    customer: {
      name: 'Kevin Smith',
      avatar: '/placeholder.svg'
    },
    status: 'delivered',
    amount: 29.99
  },
  {
    id: '425435',
    productName: 'Leather Jacket',
    date: 'Nov 04, 2023',
    customer: {
      name: 'Vincent Chase',
      avatar: '/placeholder.svg'
    },
    status: 'cancelled',
    amount: 199.99
  },
  {
    id: '425434',
    productName: 'Running Shoes',
    date: 'Nov 03, 2023',
    customer: {
      name: 'Emily Johnson',
      avatar: '/placeholder.svg'
    },
    status: 'pending',
    amount: 89.99
  },
  {
    id: '425433',
    productName: 'Classic T-Shirt',
    date: 'Nov 02, 2023',
    customer: {
      name: 'Michael Brown',
      avatar: '/placeholder.svg'
    },
    status: 'delivered',
    amount: 29.99
  },
  {
    id: '425432',
    productName: 'Running Shoes',
    date: 'Nov 01, 2023',
    customer: {
      name: 'Sarah Davis',
      avatar: '/placeholder.svg'
    },
    status: 'pending',
    amount: 89.99
  }
]

const ITEMS_PER_PAGE = 10

export default function OrderList() {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  const toggleOrder = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    )
  }

  const toggleAll = () => {
    setSelectedOrders(prev => 
      prev.length === paginatedOrders.length ? [] : paginatedOrders.map(order => order.id)
    )
  }

  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE)
  const paginatedOrders = orders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <div className="bg-white rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox 
                checked={selectedOrders.length === paginatedOrders.length}
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
          {paginatedOrders.map((order) => (
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
              <TableCell className="text-right">${order.amount.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between px-4 py-4 border-t">
        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
          {currentPage < totalPages && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            >
              Next
            </Button>
          )}
        </div>
        <div className="text-sm text-gray-500">
          Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, orders.length)} of {orders.length} entries
        </div>
      </div>
    </div>
  )
}

