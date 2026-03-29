"use client"
import GameSection from "../components/GameSection"
import AutoCarousel from "../components/AutoCarousel"

const SignLanguageDisplay = () => {
  const carouselImages = [
    { id: 1, src: "/ASL1.png", alt: "ASL Demo 1" },
    { id: 2, src: "/ASL2.png", alt: "ASL Demo 2" },
    { id: 3, src: "/ASL3.png", alt: "ASL Demo 3" },
  ]

  return (
    <GameSection
      id="sign-language-display"
      title="ASL Learning Game"
      description="A minigame that can help you learn American Sign Language (ASL) through a fun and interactive experience. Use your webcam to control the game and learn sign language in a new way!"
      cardColor="asl"
      gameLink="/games/sign-language"
      icon="/shapensign4.png"
      iconSize="w-26 h-26"
    >
      <AutoCarousel images={carouselImages} interval={4500} accentColor="red" />
    </GameSection>
  )
}

export default SignLanguageDisplay
