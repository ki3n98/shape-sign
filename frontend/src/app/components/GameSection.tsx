import type { ReactNode } from "react"
import Link from "next/link"
import CssAnimatedBackground from "./AnimatedBackground"

interface GameSectionProps {
  id: string
  title: string
  description: string
  cardColor: "shapes" | "music" | "asl"
  children: ReactNode
  gameLink: string
  icon: string
  iconSize?: string // Add iconSize prop for dynamic sizing
}

const GameSection = ({ id, title, description, cardColor, children, gameLink, icon, iconSize = "w-10 h-10" }: GameSectionProps) => {
  return (
    <section id={id} className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className={`game-card ${cardColor}-card bg-white p-6 md:p-8 relative overflow-hidden`}>
          {/* CSS Animated Background */}
          <CssAnimatedBackground type={cardColor} />

          <div className="pin bg-red-500 left-6"></div>
          <div className="pin bg-blue-500 right-6"></div>

          <div className="relative z-10">
            <div className="flex items-center mb-4">
              {/* Apply dynamic icon size */}
              <img src={icon || "/placeholder.svg"} alt={title} className={`${iconSize} mr-3`} />
              <h2 className="section-title m-0">{title}</h2>
            </div>

            <p className="section-description text-left mb-6">{description}</p>

            <div className="bg-gray-50 bg-opacity-90 rounded-lg p-4 mb-6 backdrop-blur-sm">{children}</div>

            <div className="text-center">
              <Link href={gameLink} className="btn-primary inline-block">
                Try It Out!
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default GameSection