import { Card } from "@/components/ui/card"
import { ArrowUp } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string
  change: number
  icon: React.ReactNode
  description: string
}

export function MetricCard({
  title,
  value,
  change,
  icon,
  description
}: MetricCardProps) {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="text-2xl font-semibold mt-2">{value}</h3>
        </div>
        <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
          {icon}
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <div className="flex items-center text-green-600">
          <ArrowUp className="h-4 w-4" />
          <span className="text-sm font-medium">{change}%</span>
        </div>
        <span className="text-sm text-gray-500">{description}</span>
      </div>
    </Card>
  )
}

