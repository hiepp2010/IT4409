import { faker } from '@faker-js/faker';

export interface CustomerOrder {
  id: string;
  created: string;
  total: number;
  payment: 'CC' | 'COD';
  status: 'completed' | 'cancelled' | 'pending';
  items: {
    sku: string;
    name: string;
    price: number;
    quantity: number;
    discount: string;
    total: number;
  }[];
  subtotal: number;
  shipping: number;
  discount: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  avatar: string;
  personalInfo: {
    gender: 'Male' | 'Female' | 'Other';
    dateOfBirth: string;
    memberSince: string;
  };
  shippingAddress: string;
  stats: {
    totalOrders: number;
    completedOrders: number;
    cancelledOrders: number;
  };
  orders: CustomerOrder[];
}

// Generate customers with orders
export const customers: Customer[] = Array.from({ length: 50 }, () => {
  const orders = Array.from({ length: faker.number.int({ min: 3, max: 10 }) }, () => ({
    id: `#${faker.string.numeric(4)}`,
    created: new Date(faker.date.recent()).toISOString(),
    total: parseFloat(faker.commerce.price({ min: 100, max: 1000 })),
    payment: faker.helpers.arrayElement(['CC', 'COD']),
    status: faker.helpers.arrayElement(['completed', 'cancelled', 'pending']),
    items: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => ({
      sku: `#${faker.string.numeric(4)}`,
      name: faker.commerce.productName(),
      price: parseFloat(faker.commerce.price({ min: 10, max: 100 })),
      quantity: faker.number.int({ min: 1, max: 5 }),
      discount: '5%',
      total: parseFloat(faker.commerce.price({ min: 10, max: 500 }))
    })),
    subtotal: parseFloat(faker.commerce.price({ min: 100, max: 1000 })),
    shipping: 5.50,
    discount: parseFloat(faker.commerce.price({ min: 5, max: 50 })),
  }));

  const completedOrders = orders.filter(order => order.status === 'completed').length;
  const cancelledOrders = orders.filter(order => order.status === 'cancelled').length;

  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    phone: faker.phone.number(),
    joinDate: faker.date.past({ years: 1 }).toISOString(),
    avatar: faker.image.avatar(),
    personalInfo: {
      gender: faker.helpers.arrayElement(['Male', 'Female', 'Other']),
      dateOfBirth: faker.date.past({ years: 30 }).toISOString(),
      memberSince: faker.date.past({ years: 2 }).toISOString(),
    },
    shippingAddress: faker.location.streetAddress(true),
    stats: {
      totalOrders: orders.length,
      completedOrders,
      cancelledOrders,
    },
    orders
  };
});

export async function getCustomers(page: number = 1, limit: number = 10, phone?: string): Promise<{ customers: Customer[], total: number }> {
  let filteredCustomers = customers;

  if (phone) {
    filteredCustomers = filteredCustomers.filter(c => c.phone.includes(phone));
  }

  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedCustomers = filteredCustomers.slice(start, end);
  return {
    customers: paginatedCustomers,
    total: filteredCustomers.length
  };
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  const customer = customers.find(c => c.id === id);
  return customer || null;
}

