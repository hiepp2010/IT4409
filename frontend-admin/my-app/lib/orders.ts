export interface OrderItem {
  id: string;
  orderHistoryId: string;
  productId: string;
  quantity: number;
  price: number;
  product?: {
    id: string;
    name: string;
    imagePaths: string[];
  };
}

export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  address: string;
  paymentMethod: string;
  status: 'pending' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
  user?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getOrders(): Promise<{ orders: Order[], total: number }> {
  const response = await fetch(`${API_URL}/all`);
  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }
  const data = await response.json();

  const orders: Order[] = data.orders.map((order: any) => ({
    id: order.id,
    userId: order.userId,
    totalAmount: order.totalAmount,
    address: order.address,
    paymentMethod: order.paymentMethod,
    status: order.status,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    orderItems: order.orderItems.map((item: any) => ({
      id: item.id,
      orderHistoryId: item.orderHistoryId,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      product: item.product ? {
        id: item.product.id,
        name: item.product.name,
        imagePaths: item.product.imagePaths,
      } : undefined,
    })),
    user: order.user ? {
      id: order.user.id,
      name: order.user.name,
      email: order.user.email,
      phone: order.user.phone,
      avatar: order.user.avatar || '/placeholder.svg',
    } : undefined,
  }));

  return {
    orders,
    total: data.total
  };
}

export async function getOrderById(id: string): Promise<Order | null> {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch order');
  }
  const order = await response.json();

  return {
    id: order.id,
    userId: order.userId,
    totalAmount: order.totalAmount,
    address: order.address,
    paymentMethod: order.paymentMethod,
    status: order.status,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    orderItems: order.orderItems.map((item: any) => ({
      id: item.id,
      orderHistoryId: item.orderHistoryId,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      product: item.product ? {
        id: item.product.id,
        name: item.product.name,
        imagePaths: item.product.imagePaths,
      } : undefined,
    })),
    user: order.user ? {
      id: order.user.id,
      name: order.user.name,
      email: order.user.email,
      phone: order.user.phone,
      avatar: order.user.avatar || '/placeholder.svg',
    } : undefined,
  };
}

