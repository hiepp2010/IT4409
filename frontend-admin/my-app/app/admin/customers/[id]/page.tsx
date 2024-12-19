import { getCustomerById } from "@/lib/customers"
import { CustomerDetail } from "@/components/admin/CustomerDetail"
import AdminSidebar from "@/components/admin/AdminSidebar"
import { notFound } from "next/navigation"

interface CustomerDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  const {id} = await params;
  const customer = await getCustomerById(id)

  if (!customer) {
    notFound()
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold">Customer Detail</h1>
          </div>
          <CustomerDetail customer={customer} />
        </div>
      </div>
    </div>
  )
}

