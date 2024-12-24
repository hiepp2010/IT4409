import { Card } from "@/components/ui/card"
import { Package2, ShoppingCart, CheckCircle, RotateCcw } from 'lucide-react'
import { MetricCard } from "@/components/admin/MetricCard"
import { SalesChart } from "@/components/admin/SalesChart"
import { BestSellers } from "@/components/admin/BestSellers"
import { RecentOrders } from "@/components/admin/RecentOrders"
import AdminSidebar from "@/components/admin/AdminSidebar"

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="text-gray-500">Home {">"} Dashboard</p>
          </div>
          <div className="text-sm text-gray-500">
            Oct 11,2023 / Nov 11,2023
          </div>
        </div>

        

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Sale Graph</h2>
                <div className="flex gap-2">
                  <button className="px-4 py-1 text-sm rounded-full bg-primary text-white">WEEKLY</button>
                  <button className="px-4 py-1 text-sm rounded-full hover:bg-gray-100">MONTHLY</button>
                  <button className="px-4 py-1 text-sm rounded-full hover:bg-gray-100">YEARLY</button>
                </div>
              </div>
              <SalesChart />
            </Card>
          </div>
          
        </div>

        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
          </div>
          <RecentOrders />
        </Card>
      </div>
    </div>
  )
}

