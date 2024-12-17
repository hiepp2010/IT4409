"use client"

import GreyBCarousel from "../components/clients/carousel"
import Category from "./category"
import Product from "../components/clients/product"
import { getProducts } from "@/lib/product"

export default async function Page(){
  // const products = await getProducts()
  return (
    <div className="flex flex-col min-h-screen">
    
      <main className="flex-grow">
        <GreyBCarousel />
        {/* <Category/> */}
      </main>
    </div>
  )

}
