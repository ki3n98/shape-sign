"use client"
import GameSection from "../components/GameSection"
import AutoCarousel from "../components/AutoCarousel"

const ShapeMatchingDisplay = () => {
  const carouselImages = [
    { id: 1, src: "/Shape-matching1.png", alt: "Shape Matching Demo 1" },
    { id: 2, src: "/Shape-matching2.png", alt: "Shape Matching Demo 2" },
    { id: 3, src: "/Shape-matching3.png", alt: "Shape Matching Demo 3" },
  ]

  return (
    <GameSection
      id="shape-matching-display"
      title="Shape Matching Game"
      description="Test our model through a fun and interactive matching shapes game! Drag and drop each shape to its corresponding label using your webcam to win!"
      cardColor="shapes"
      gameLink="/games/shape-matching"
      icon="/shapensign3.png" // Pass the image path as a prop
      iconSize="w-26 h-26" // Pass the size as a prop
    >
      <AutoCarousel images={carouselImages} interval={4500} accentColor="blue" />
    </GameSection>
  )
}

export default ShapeMatchingDisplay
