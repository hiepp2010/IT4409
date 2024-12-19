import { getCustomers } from "@/lib/customers"
import { CustomerList } from "@/components/admin/CustomerList"
import AdminSidebar from "@/components/admin/AdminSidebar"

interface CustomersPageProps {
  searchParams: Promise<{ page?: string; phone?: string }>
}

export default async function CustomersPage({ searchParams }: CustomersPageProps) {
  const {page , phone} = await searchParams;
  const currentPage = Number(page) || 1
  const limit = 10
  const { customers, total } = await getCustomers(currentPage, limit, phone)

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1">
        <div className="p-8">
          <CustomerList 
            customers={customers} 
            total={total} 
            currentPage={currentPage} 
            phoneSearch={phone || ""}
          />
        </div>
      </div>
    </div>
  )
}

