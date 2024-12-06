"use client"

import NavBar from "./component/navbar"
import GreyBCarousel from "./carousel"
import Category from "./category"
import Product from "./product"
import Footer from "./footer"

export default function Page(){
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 bg-grey shadow-md">
        <NavBar></NavBar>
      </header>
      <main className="flex-grow">
        <GreyBCarousel />
        <Category/>
        <Product></Product>
      </main>
      <Footer></Footer>
    </div>
  )

}
