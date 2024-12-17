"use client"

import GreyBCarousel from "../components/clients/carousel"
import Category from "./category"

export default async function Page(){
  // const products = await getProducts()
  return (
    <div className="flex flex-col min-h-screen">
    
      <main className="flex-grow">
        <GreyBCarousel />
        <Category/>
      </main>
    </div>
  )

}
