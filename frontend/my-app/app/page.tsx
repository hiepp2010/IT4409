"use client"

import GreyBCarousel from "./component/carousel"
import Category from "./category"
import Product from "./component/product"
import { getProducts } from "@/lib/product"

export default async function Page(){
  const products = await getProducts()
  return (
    <div className="flex flex-col min-h-screen">
    
      <main className="flex-grow">
        <GreyBCarousel />
        <Category/>
        <Product products ={products}></Product>
      </main>
    </div>
  )

}
