"use client"
import GameSection from "../components/GameSection"
import AutoCarousel from "../components/AutoCarousel"

const MusicDisplay = () => {
  // Images for the carousel
  const carouselImages = [
    { id: 1, src: "/Music1.png", alt: "Music Control Demo 1" },
    { id: 2, src: "/volumn_up.png", alt: "Music Control Demo 2" },
    { id: 3, src: "/volumn_down.png", alt: "Music Control Demo 3" },
  ]

  return (
    <GameSection
      id="music-control-display"
      title="Music Control"
      description="Try out our model with an engaging and interactive music display! Use hand gestures to control the volume (up and down) and toggle play/pause, all through your webcam!"
      cardColor="music"
      gameLink="/games/music-game"
      icon="/shapensign2.png" // Pass the image path as a prop
      iconSize="w-26 h-26" // Pass the size as a prop
    >
      <AutoCarousel images={carouselImages} interval={4500} accentColor="green" />
    </GameSection>
  )
}

export default MusicDisplay