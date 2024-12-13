import { faker } from '@faker-js/faker';

export interface OrderProduct {
  id: string;
  name: string;
  orderId: string;
  quantity: number;
  total: number;
  image: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'delivered' | 'cancelled' | 'pending';
  customer: {
    name: string;
    email: string;
    phone: string;
    avatar: string;
  };
  shipping: string;
  paymentMethod: string;
  shippingAddress: string;
  paymentInfo: {
    last4: string;
    businessName: string;
    phone: string;
  };
  note: string;
  products: OrderProduct[];
  subtotal: number;
  tax: number;
  discount: number;
  shippingRate: number;
  total: number;
  amount: number;
}

function generateRandomOrder(): Order {
  const productCount = faker.number.int({ min: 1, max: 5 });
  const products: OrderProduct[] = Array.from({ length: productCount }, () => ({
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    orderId: faker.string.alphanumeric(6).toUpperCase(),
    quantity: faker.number.int({ min: 1, max: 10 }),
    total: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
    image: faker.image.url(),
  }));

  const subtotal = products.reduce((sum, product) => sum + product.total, 0);
  const tax = subtotal * 0.1; // 10% tax
  const discount = subtotal * faker.number.float({ min: 0, max: 0.2 }); // 0-20% discount
  const shippingRate = faker.number.float({ min: 0, max: 50 });
  const total = subtotal + tax - discount + shippingRate;

  return {
    id: `ORD${faker.string.numeric(5)}`,
    date: faker.date.recent({ days: 30 }).toISOString(),
    status: faker.helpers.arrayElement(['delivered', 'cancelled', 'pending']),
    customer: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      avatar: faker.image.avatar(),
    },
    shipping: faker.helpers.arrayElement(['Standard', 'Express', 'Next Day']),
    paymentMethod: faker.helpers.arrayElement(['Credit Card', 'PayPal', 'Bank Transfer']),
    shippingAddress: faker.location.streetAddress(true),
    paymentInfo: {
      last4: faker.finance.creditCardNumber('####'),
      businessName: faker.company.name(),
      phone: faker.phone.number(),
    },
    note: "note",
    products,
    subtotal,
    tax,
    discount,
    shippingRate,
    total,
    amount: total,
  };
}

export const orders: Order[] = Array.from({ length: 100 }, generateRandomOrder);

export async function getOrders(page: number = 1, limit: number = 10): Promise<{ orders: Order[], total: number }> {
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedOrders = orders.slice(start, end);
  return {
    orders: paginatedOrders,
    total: orders.length
  };
}

export async function getOrderById(id: string): Promise<Order | null> {
  const order = orders.find(order => order.id === id);
  return order || null;
}

