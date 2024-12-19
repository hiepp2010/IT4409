import AdminSidebar from "@/components/admin/AdminSidebar"
import { OrderDetails } from "@/components/admin/OrderDetails"
import { getOrderById } from "@/lib/orders"
import { notFound } from "next/navigation"

interface OrderDetailsPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const {id} = await params
  const order = await getOrderById(id)

  if (!order) {
    notFound()
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">Order Details</h1>
          <p className="text-gray-500">
            Home {">"} Order List {">"} Order Details
          </p>
        </div>
        <OrderDetails order={order} />
      </div>
    </div>
  )
}

