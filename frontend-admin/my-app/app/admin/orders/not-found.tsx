import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">404 - Order Not Found</h1>
      <p className="text-xl mb-8">The order you're looking for doesn't exist or has been removed.</p>
      <Button asChild>
        <Link href="/admin/orders">
          Return to Orders
        </Link>
      </Button>
    </div>
  )
}

