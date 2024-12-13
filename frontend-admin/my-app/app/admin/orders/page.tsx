import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'
import OrderList from "@/components/admin/OrderList"
import AdminSidebar from "@/components/admin/AdminSidebar"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getOrders } from "@/lib/orders"
import { Pagination } from "@/components/ui/pagination"

interface OrdersPageProps {
  searchParams: { page?: string }
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const currentPage = Number(searchParams.page) || 1
  const limit = 10
  const { orders, total } = await getOrders(currentPage, limit)

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1">
        <div className="p-8">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold">Orders List</h1>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    placeholder="Search orders..." 
                    className="pl-10 w-[300px]"
                  />
                </div>
                <DateRangePicker />
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <OrderList orders={orders} />
            <div className="mt-8 flex justify-center">
              <Pagination 
                currentPage={currentPage} 
                totalPages={Math.ceil(total / limit)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

