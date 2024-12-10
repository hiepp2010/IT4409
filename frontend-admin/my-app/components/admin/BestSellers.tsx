import Image from "next/image"

const bestSellers = [
  {
    id: 1,
    name: "Lorem ipsum",
    price: "₹126.50",
    sales: "999 sales",
    image: "/placeholder.svg"
  },
  {
    id: 2,
    name: "Lorem ipsum",
    price: "₹126.50",
    sales: "999 sales",
    image: "/placeholder.svg"
  },
  {
    id: 3,
    name: "Lorem ipsum",
    price: "₹126.50",
    sales: "999 sales",
    image: "/placeholder.svg"
  }
]

export function BestSellers() {
  return (
    <div className="space-y-4">
      {bestSellers.map((product) => (
        <div key={product.id} className="flex items-center gap-4">
          <div className="h-12 w-12 relative">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="rounded object-cover"
            />
          </div>
          <div>
            <h3 className="font-medium">{product.name}</h3>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">{product.price}</span>
              <span className="text-gray-500">{product.sales}</span>
            </div>
          </div>
        </div>
      ))}
      <button className="w-full py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700">
        REPORT
      </button>
    </div>
  )
}

