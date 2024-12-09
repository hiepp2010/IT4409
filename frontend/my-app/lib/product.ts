export interface Size {
  color_id: string;
  size: string;
  quantity: number;
}

export interface Color {
  id: string;
  color_name: string;
  size: Size[];
  image: string[];
}

export interface Product {
  id: string;
  color: Color[];
  name: string;
  price: number;
}

const products:Product[] = [
  {
    id: "1",
    name: "Classic T-shirt",
    price: 19.99,
    color: [
      {
        id: "c1",
        color_name: "White",
        image: ["/images/classic-tshirt-white-1.jpg", "/images/classic-tshirt-white-2.jpg"],
        size: [
          { color_id: "c1", size: "S", quantity: 25 },
          { color_id: "c1", size: "M", quantity: 30 },
          { color_id: "c1", size: "L", quantity: 20 },
          { color_id: "c1", size: "XL", quantity: 15 }
        ]
      },
      {
        id: "c2",
        color_name: "Black",
        image: ["/images/classic-tshirt-black-1.jpg", "/images/classic-tshirt-black-2.jpg"],
        size: [
          { color_id: "c2", size: "S", quantity: 20 },
          { color_id: "c2", size: "M", quantity: 25 },
          { color_id: "c2", size: "L", quantity: 30 },
          { color_id: "c2", size: "XL", quantity: 18 }
        ]
      }
    ]
  },
  {
    id: "2",
    name: "Comfort Hoodie",
    price: 39.99,
    color: [
      {
        id: "c3",
        color_name: "Grey",
        image: ["/images/comfort-hoodie-grey-1.jpg", "/images/comfort-hoodie-grey-2.jpg"],
        size: [
          { color_id: "c3", size: "S", quantity: 15 },
          { color_id: "c3", size: "M", quantity: 20 },
          { color_id: "c3", size: "L", quantity: 25 },
          { color_id: "c3", size: "XL", quantity: 10 }
        ]
      },
      {
        id: "c4",
        color_name: "Navy",
        image: ["/images/comfort-hoodie-navy-1.jpg", "/images/comfort-hoodie-navy-2.jpg"],
        size: [
          { color_id: "c4", size: "S", quantity: 18 },
          { color_id: "c4", size: "M", quantity: 22 },
          { color_id: "c4", size: "L", quantity: 20 },
          { color_id: "c4", size: "XL", quantity: 12 }
        ]
      }
    ]
  },
  {
    id: "3",
    name: "Slim Fit Jeans",
    price: 49.99,
    color: [
      {
        id: "c5",
        color_name: "Blue Denim",
        image: ["https://pos.nvncdn.com/be5dfe-25943/ps/20241022_51wzFVFUpz.jpeg", "https://pos.nvncdn.com/be5dfe-25943/ps/20241022_QcWeN6xcjl.png"],
        size: [
          { color_id: "c5", size: "30", quantity: 10 },
          { color_id: "c5", size: "32", quantity: 15 },
          { color_id: "c5", size: "34", quantity: 12 },
          { color_id: "c5", size: "36", quantity: 8 }
        ]
      },
      {
        id: "c6",
        color_name: "Black",
        image: ["https://pos.nvncdn.com/be5dfe-25943/ps/20241123_nfuHwVNk66.jpeg", "https://pos.nvncdn.com/be5dfe-25943/ps/20241123_VHavZuKrnN.jpeg"],
        size: [
          { color_id: "c6", size: "30", quantity: 8 },
          { color_id: "c6", size: "32", quantity: 12 },
          { color_id: "c6", size: "34", quantity: 10 },
          { color_id: "c6", size: "36", quantity: 6 }
        ]
      }
    ]
  }
];

export async function getProducts(): Promise<Product[]> {
  // In a real application, this would be an API call
  return products
}


export async function getProductById(id: string): Promise<Product | undefined> {
  // Simulate an API call with a delay
  await new Promise(resolve => setTimeout(resolve, 200))
  
  return products.find(product => product.id === id)
}
