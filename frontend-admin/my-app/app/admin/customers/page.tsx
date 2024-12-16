import { getCustomers } from "@/lib/customers"
import { CustomerList } from "@/components/admin/CustomerList"
import AdminSidebar from "@/components/admin/AdminSidebar"

interface CustomersPageProps {
  searchParams: { page?: string; phone?: string }
}

export default async function CustomersPage({ searchParams }: CustomersPageProps) {
  const currentPage = Number(searchParams.page) || 1
  const limit = 10
  const { customers, total } = await getCustomers(currentPage, limit, searchParams.phone)

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1">
        <div className="p-8">
          <CustomerList 
            customers={customers} 
            total={total} 
            currentPage={currentPage} 
            phoneSearch={searchParams.phone || ""}
          />
        </div>
      </div>
    </div>
  )
}

