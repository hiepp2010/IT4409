export interface Order {
    id: string
    productName: string
    date: string
    customer: {
      name: string
      avatar: string
    }
    status: 'delivered' | 'cancelled' | 'pending'
    amount: number
  }
  
  const customerNames = [
    'John Doe', 'Jane Smith', 'Michael Johnson', 'Emily Brown', 'David Wilson',
    'Sarah Davis', 'James Miller', 'Lisa Anderson', 'Robert Taylor', 'Jennifer Thomas',
    'William Martinez', 'Elizabeth Robinson', 'Joseph Lee', 'Margaret White', 'Charles King',
    'Patricia Wright', 'Thomas Scott', 'Sandra Adams', 'Daniel Baker', 'Nancy Garcia'
  ]
  
  export const orders: Order[] = Array.from({ length: 20 }, (_, i) => ({
    id: `ORD${String(i + 1).padStart(5, '0')}`,
    productName: `Product ${Math.floor(Math.random() * 20) + 1}`,
    date: new Date(2023, 10, Math.floor(Math.random() * 30) + 1).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }),
    customer: {
      name: customerNames[i],
      avatar: '/placeholder.svg'
    },
    status: ['delivered', 'cancelled', 'pending'][Math.floor(Math.random() * 3)] as 'delivered' | 'cancelled' | 'pending',
    amount: Math.floor(Math.random() * 900) + 100
  }))
  
  export async function getOrders(): Promise<Order[]> {
    // In a real application, this would be an API call
    return orders
  }
  
  