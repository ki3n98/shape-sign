"use client";
import React, { useState } from 'react';
import Link from 'next/link';

const TypingGameDisplay = () => {
  // Images for the carousel
  const carouselImages = [
    { id: 1,src:"Typing-game1.png", alt: "Game Demo Image 1" }, //Insert images here after KIEN and SYN demo placeholders text for now
  ];

  // State for carousel
  const [currentSlide, setCurrentSlide] = useState(0);

  // Carousel navigation functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? carouselImages.length - 1 : prev - 1));
  };

  return (
    <section id="typing-display" className="bg-blue-50 py-16">
      <div className="max-w-4xl mx-auto text-center px-4">
        <h2 className="text-4xl font-bold text-blue-600 mb-6">
          Typing Game
        </h2>

        <p className="text-lg text-gray-700 mb-10 max-w-2xl mx-auto">
          Test our model through a typing game, where you can use sign language to type out words that appear on the screen to win!
        </p>

        {/* Carousel */}
        <div className="relative mb-12 bg-white rounded-xl shadow-lg p-4 mx-auto">
          <div className="overflow-hidden rounded-lg h-64 relative">
            {carouselImages.map((image, index) => (
              <div
                key={image.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${currentSlide === index ? 'opacity-100' : 'opacity-0'}`}
              >
                <img src={image.src} alt={image.alt} className="w-full h-full object-cover rounded-lg" />
              </div>
            ))}
          </div>

        </div>

        {/* Play Button For Users */}
        <Link href="/games/typing-game" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors shadow-lg">
          Try It Out!
        </Link>
      </div>
    </section>
  );
};

export default TypingGameDisplay;