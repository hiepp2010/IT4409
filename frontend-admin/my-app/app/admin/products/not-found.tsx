import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">404 - Product Not Found</h1>
      <p className="text-xl mb-8">The product you are looking for does not exist or has been removed.</p>
      <Button asChild>
        <Link href="/admin/products">
          Return to Products
        </Link>
      </Button>
    </div>
  )
}

