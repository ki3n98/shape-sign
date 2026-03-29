"use client"

import type React from "react"
import { useEffect, useState } from "react"
import MusicNote from "./MusicNote"
import HandShape from "./HandShape"

interface CssAnimatedBackgroundProps {
  type: "shapes" | "music" | "asl"
}

const CssAnimatedBackground: React.FC<CssAnimatedBackgroundProps> = ({ type }) => {
  const [shapes, setShapes] = useState<Array<{
    id: number
    size: number
    left: number
    top: number
    shapeType: string
    animationClass: string
    shouldRotate: boolean
    delay: number
  }>>([])

  useEffect(() => {
    // Generate different shapes based on the type
    const generatedShapes = []

    // Number of shapes to generate
    const count = 15

    for (let i = 0; i < count; i++) {
      // Randomize shape properties
      const size = 20 + Math.floor(Math.random() * 40)
      const left = Math.floor(Math.random() * 100)
      const top = Math.floor(Math.random() * 100)

      // Determine shape type based on card type
      let shapeType = "circle"
      if (type === "shapes") {
        // For shapes card, use various geometric shapes
        const shapeTypes = ["circle", "square", "triangle", "diamond"]
        shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)]
      } else if (type === "music") {
        // For music card, use music notes or circles
        const shapeTypes = ["circle", "note"]
        shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)]
      } else if (type === "asl") {
        // For ASL card, use hand shapes or letters
        const shapeTypes = ["circle", "hand", "letter"]
        shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)]

        // If it's a letter, choose a random letter A-Z
        if (shapeType === "letter") {
          shapeType = `letter-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`
        }
      }

      // Determine animation type
      const animationTypes = [
        "shape-float-up",
        "shape-float-down",
        "shape-float-left",
        "shape-float-right",
        "shape-pulse",
      ]

      // Add rotation for some shapes
      const shouldRotate = Math.random() > 0.7

      const animationClass = animationTypes[Math.floor(Math.random() * animationTypes.length)]

      // Add delay to make animations staggered
      const delay = Math.floor(Math.random() * 5)

      generatedShapes.push({
        id: i,
        size,
        left,
        top,
        shapeType,
        animationClass,
        shouldRotate,
        delay,
      })
    }

    setShapes(generatedShapes)
  }, [type])

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${type}-bg`}>
      {shapes.length > 0 && shapes.map((shape) => {
        // Base animation classes
        const animationClasses = `${shape.animationClass} ${shape.shouldRotate ? "shape-rotate" : ""}`

        // Base style
        const style = {
          width: `${shape.size}px`,
          height: `${shape.size}px`,
          left: `${shape.left}%`,
          top: `${shape.top}%`,
          animationDelay: `${shape.delay}s`,
        }

        // Render different shape types
        if (shape.shapeType === "note") {
          return <MusicNote key={shape.id} className={`animated-shape ${animationClasses}`} style={style} />
        } else if (shape.shapeType === "hand") {
          return <HandShape key={shape.id} className={`animated-shape ${animationClasses}`} style={style} />
        } else if (shape.shapeType.startsWith("letter-")) {
          // Extract the letter from the shape type
          const letter = shape.shapeType.split("-")[1]
          return (
            <div
              key={shape.id}
              className={`animated-shape ${animationClasses} flex items-center justify-center font-bold`}
              style={{
                ...style,
                fontSize: `${shape.size * 0.7}px`,
              }}
            >
              {letter}
            </div>
          )
        } else {
          // Regular geometric shapes
          let shapeClass = "shape-circle"
          if (shape.shapeType === "square") shapeClass = "shape-square"
          if (shape.shapeType === "triangle") shapeClass = "shape-triangle"
          if (shape.shapeType === "diamond") shapeClass = "shape-diamond"

          return <div key={shape.id} className={`animated-shape ${shapeClass} ${animationClasses}`} style={style} />
        }
      })}
    </div>
  )
}

export default CssAnimatedBackground

