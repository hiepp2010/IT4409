'use client'

import { useState } from 'react'
import { Customer } from "@/lib/customers"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, ChevronDown, ChevronUp, Printer } from 'lucide-react'

interface CustomerDetailProps {
  customer: Customer
}

export function CustomerDetail({ customer }: CustomerDetailProps) {
  const [expandedOrders, setExpandedOrders] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState('all')

  const toggleOrder = (orderId: string) => {
    setExpandedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    )
  }

  const filteredOrders = customer.orders.filter(order => {
    if (activeTab === 'completed') return order.status === 'completed'
    if (activeTab === 'cancelled') return order.status === 'cancelled'
    return true
  })

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-2 p-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={customer.avatar} />
              <AvatarFallback>{customer.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold mb-4">{customer.name}</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-4">PERSONAL INFORMATION</h3>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-sm text-gray-500">Contact Number</span>
                      <span className="text-sm">{customer.phone}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-sm text-gray-500">Gender</span>
                      <span className="text-sm">{customer.personalInfo.gender}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-sm text-gray-500">Date of Birth</span>
                      <span className="text-sm">
                        {new Date(customer.personalInfo.dateOfBirth).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-sm text-gray-500">Member Since</span>
                      <span className="text-sm">
                        {new Date(customer.personalInfo.memberSince).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-4">SHIPPING ADDRESS</h3>
                  <p className="text-sm">{customer.shippingAddress}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-semibold">{customer.stats.totalOrders}</div>
              <div className="text-sm text-gray-500">Total Order</div>
            </div>
            <div>
              <div className="text-2xl font-semibold">{customer.stats.completedOrders}</div>
              <div className="text-sm text-gray-500">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-semibold">{customer.stats.cancelledOrders}</div>
              <div className="text-sm text-gray-500">Cancelled</div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Search by order id" className="pl-10" />
              </div>
              <Button variant="outline">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ORDER ID</TableHead>
                <TableHead>CREATED</TableHead>
                <TableHead>TOTAL</TableHead>
                <TableHead>PAYMENT</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <>
                  <TableRow key={order.id} className="cursor-pointer" onClick={() => toggleOrder(order.id)}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>
                      {new Date(order.created).toLocaleString()}
                    </TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell>{order.payment}</TableCell>
                    <TableCell>
                      <Badge variant={
                        order.status === 'completed' ? 'success' :
                        order.status === 'cancelled' ? 'destructive' :
                        'default'
                      }>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {expandedOrders.includes(order.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </TableCell>
                  </TableRow>
                  {expandedOrders.includes(order.id) && (
                    <TableRow>
                      <TableCell colSpan={6} className="bg-gray-50">
                        <div className="py-4">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[50px]">#</TableHead>
                                <TableHead>SKU</TableHead>
                                <TableHead>NAME</TableHead>
                                <TableHead>PRICE</TableHead>
                                <TableHead>QTY</TableHead>
                                <TableHead>DISC.</TableHead>
                                <TableHead className="text-right">TOTAL</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {order.items.map((item, index) => (
                                <TableRow key={index}>
                                  <TableCell>{index + 1}</TableCell>
                                  <TableCell>{item.sku}</TableCell>
                                  <TableCell>{item.name}</TableCell>
                                  <TableCell>${item.price.toFixed(2)}</TableCell>
                                  <TableCell>x{item.quantity}</TableCell>
                                  <TableCell>{item.discount}</TableCell>
                                  <TableCell className="text-right">${item.total.toFixed(2)}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                          <div className="mt-4 space-y-2 text-sm">
                            <div className="flex justify-end">
                              <span className="w-24">Subtotal:</span>
                              <span className="w-24 text-right">${order.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-end">
                              <span className="w-24">Shipping:</span>
                              <span className="w-24 text-right">${order.shipping.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-end">
                              <span className="w-24">Discount:</span>
                              <span className="w-24 text-right text-red-500">-${order.discount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-end font-medium">
                              <span className="w-24">Total:</span>
                              <span className="w-24 text-right">${order.total.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </Tabs>
      </Card>
    </div>
  )
}

