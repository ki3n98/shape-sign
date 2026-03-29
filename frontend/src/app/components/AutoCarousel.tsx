"use client"
import { useState, useEffect, useRef } from "react"

export interface CarouselImage {
  id: number
  src: string
  alt: string
}

export interface AutoCarouselProps {
  images: CarouselImage[]
  interval?: number
  accentColor?: string
}

const AutoCarousel = ({ images, interval = 5000, accentColor = "blue" }: AutoCarouselProps) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    timerRef.current = setInterval(() => {
      if (!isPaused) {
        setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1))
      }
    }, interval)
  }

  useEffect(() => {
    startTimer()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPaused, interval, images.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    startTimer() // Reset timer when manually navigating
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    startTimer() // Reset timer when manually navigating
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    startTimer() // Reset timer when manually navigating
  }

  return (
    <div className="relative" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
      <div className="overflow-hidden rounded-lg h-64 md:h-80 relative">
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`absolute inset-0 transition-opacity duration-1000 flex justify-center items-center ${
              currentSlide === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              className="max-w-full max-h-full w-auto h-auto object-contain"
            />
          </div>
        ))}

        <div className="absolute bottom-4 left-4 bg-white bg-opacity-70 px-2 py-1 rounded-md text-xs">
          {isPaused ? "Paused" : "Auto-playing"} • {currentSlide + 1}/{images.length}
        </div>

        <button
          onClick={prevSlide}
          className={`absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-2 text-${accentColor}-600 transition-all`}
          aria-label="Previous slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          className={`absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-2 text-${accentColor}-600 transition-all`}
          aria-label="Next slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center mt-4 space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 w-2 rounded-full transition-all ${
              currentSlide === index ? `bg-${accentColor}-600 w-4` : "bg-gray-300"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default AutoCarousel
