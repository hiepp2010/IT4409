export interface Size {
    name: string;
    quantity: number;
  }
  
  export interface Color {
    name: string;
    sizes: Size[];
    images: string[];
  }
  
  export interface Product {
    id: string;
    name: string;
    description: string;
    category: string;
    brand: string;
    sku: string;
    regularPrice: number;
    salePrice: number;
    tags: string[];
    colors: Color[];
  }
  
  const generateRandomColor = (): Color => {
    const colorNames = ['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White'];
    const sizes = ['XS', 'S', 'M', 'L', 'XL'];
    return {
      name: colorNames[Math.floor(Math.random() * colorNames.length)],
      sizes: sizes.map(size => ({ name: size, quantity: Math.floor(Math.random() * 50) + 10 })),
      images: ['/placeholder.svg']
    };
  };
  
  export const products: Product[] = Array.from({ length: 20 }, (_, i) => ({
    id: `PRD${String(i + 1).padStart(5, '0')}`,
    name: `Product ${i + 1}`,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    category: ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports'][Math.floor(Math.random() * 5)],
    brand: ['Nike', 'Adidas', 'Apple', 'Samsung', 'Sony'][Math.floor(Math.random() * 5)],
    sku: `SKU${String(i + 1).padStart(5, '0')}`,
    regularPrice: Math.floor(Math.random() * 900) + 100,
    salePrice: Math.floor(Math.random() * 800) + 50,
    tags: ['tag1', 'tag2', 'tag3'].slice(0, Math.floor(Math.random() * 3) + 1),
    colors: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, generateRandomColor),
  }));
  
  export async function getProducts(): Promise<Product[]> {
    // In a real application, this would be an API call
    return products;
  }
  
  export async function getProductById(id: string): Promise<Product | null> {
    // In a real application, this would be an API call
    const product = products.find(p => p.id === id);
    return product || null;
  }
  
  