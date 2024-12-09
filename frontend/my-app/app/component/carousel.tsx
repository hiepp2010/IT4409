'use client'

import * as React from "react"
import { useEffect } from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
// import "./grey-b-carousel.css"

const carouselItems = [
  { image: "https://pos.nvncdn.com/be5dfe-25943/bn/20241024_tG0bXnUl.gif", alt: "Model wearing grey hoodie and blue jeans" },
  { image: "https://pos.nvncdn.com/be5dfe-25943/bn/20241024_tG0bXnUl.gif", alt: "Model wearing navy top and grey pants" },
  { image: "https://pos.nvncdn.com/be5dfe-25943/bn/20241024_tG0bXnUl.gif", alt: "Model wearing grey sweatshirt and blue jeans" },
  { image: "https://pos.nvncdn.com/be5dfe-25943/bn/20241024_tG0bXnUl.gif", alt: "Model wearing beige hoodie and khaki pants" },
  { image: "https://pos.nvncdn.com/be5dfe-25943/bn/20241024_tG0bXnUl.gif", alt: "Model wearing dark grey sweatshirt and white pants" },
  { image: "https://pos.nvncdn.com/be5dfe-25943/bn/20241024_tG0bXnUl.gif", alt: "Model wearing pink top and white skirt" },
  { image: "https://pos.nvncdn.com/be5dfe-25943/bn/20241024_tG0bXnUl.gif", alt: "Model wearing black hoodie and white pants" },
  { image: "https://pos.nvncdn.com/be5dfe-25943/bn/20241024_tG0bXnUl.gif", alt: "Model wearing white t-shirt and pink pants" },
]

export default function GreyBCarousel() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)

  useEffect(() => {
    if (!api) {
      return
    }

    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  return (
    <div className="carousel-container">
      <Carousel setApi={setApi} className="w-full h-full">
        <CarouselContent>
          {carouselItems.map((item, index) => (
            <CarouselItem key={index} className="carousel-item">
              <Card>
                <CardContent className="p-0">
                  <img src={item.image} alt={item.alt} className="carousel-image" />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
        {/* <div className="absolute top-4 left-4 z-10">
          <h1 className="text-4xl font-bold text-white">GREY.B</h1>
        </div>
        <div className="absolute top-4 right-4 z-10">
          <h2 className="text-2xl font-semibold text-white">FALL / WINTER 24</h2>
        </div> */}
        <div className="carousel-dots">
          {carouselItems.map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${index === current ? 'active' : ''}`}
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </div>
  )
}