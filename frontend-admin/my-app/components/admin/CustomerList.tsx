'use client'

import { useState } from "react"
import { Customer } from "@/lib/customers"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Pagination } from "@/components/ui/pagination"

interface CustomerListProps {
  customers: Customer[]
  total: number
  currentPage: number
  phoneSearch: string
}

export function CustomerList({ customers, total, currentPage, phoneSearch }: CustomerListProps) {
  const router = useRouter()
  const [phoneSearchInput, setPhoneSearchInput] = useState(phoneSearch)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/admin/customers?page=1&phone=${phoneSearchInput}`)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Customers</h2>
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <Input
            placeholder="Search by phone number"
            value={phoneSearchInput}
            onChange={(e) => setPhoneSearchInput(e.target.value)}
          />
          <Button type="submit">Search</Button>
        </form>
      </div>

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>NAME</TableHead>
              <TableHead>PHONE NUMBER</TableHead>
              <TableHead>JOIN DATE</TableHead>
              <TableHead className="w-[100px]">ACTION</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow 
                key={customer.id} 
                className="cursor-pointer"
                onClick={() => router.push(`/admin/customers/${customer.id}`)}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={customer.avatar} />
                      <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-gray-500">{customer.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>
                  {new Date(customer.joinDate).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/customers/${customer.id}`}>
                          <Pencil className="h-4 w-4 mr-2" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(total / 10)}
          searchParams={{ phone: phoneSearch }}
        />
      </div>
    </div>
  )
}

