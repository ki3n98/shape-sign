"use client"
import { useEffect, useState } from "react"

interface Shape {
  id: number
  type: string
  x: number
  y: number
  size: number
  rotation: number
  color: string
}

interface FloatingShapesBackgroundProps {
  type: "shapes" | "music" | "asl" | "typing"
  count?: number
}

export default function FloatingShapesBackground({
  type,
  count = 15,
}: FloatingShapesBackgroundProps) {
  // Shapes are stored in state so they won't be generated on the server
  const [shapes, setShapes] = useState<Shape[]>([])

  useEffect(() => {
    // This code runs only in the browser
    const color =
      type === "shapes"
        ? "#ffeb3b"
        : type === "music"
        ? "#10b981"
        : type === "asl"
        ? "#f87171"
        : "#a78bfa"

    const shapeCount = type === "music" ? 25 : count
    const newShapes: Shape[] = []

    for (let i = 0; i < shapeCount; i++) {
      // pick shape types randomly, etc.
      const shapeType = "circle" // or "note", "hand", "letter", ...
      newShapes.push({
        id: i,
        type: shapeType,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 20 + Math.random() * 40,
        rotation: Math.random() * 360,
        color,
      })
    }

    setShapes(newShapes)
  }, [type, count])

  return (
    <div className="absolute inset-0 pointer-events-none">
      {shapes.map((shape) => {
        // Render your shapes
        return (
          <div
            key={shape.id}
            style={{
              position: "absolute",
              left: `${shape.x}%`,
              top: `${shape.y}%`,
              width: `${shape.size}px`,
              height: `${shape.size}px`,
              backgroundColor: shape.color,
              transform: `rotate(${shape.rotation}deg)`,
              opacity: 0.4,
            }}
          />
        )
      })}
    </div>
  )
}
