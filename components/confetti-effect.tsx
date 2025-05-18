"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface ConfettiProps {
  duration?: number
}

interface ConfettiPiece {
  id: number
  color: string
  x: number
  delay: number
}

export default function ConfettiEffect({ duration = 3000 }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])
  const [show, setShow] = useState(true)

  useEffect(() => {
    // Generate random confetti pieces only on the client side
    const colors = [
      "bg-pink-500",
      "bg-purple-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-indigo-500",
    ]

    const newPieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      color: colors[Math.floor(Math.random() * colors.length)],
      x: Math.random() * 100,
      delay: Math.random() * 0.5,
    }))

    setPieces(newPieces)

    // Hide confetti after duration
    const timer = setTimeout(() => {
      setShow(false)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration]) // Only run once on mount and when duration changes

  if (!show) return null

  return (
    <div className="confetti-container">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          className={`confetti ${piece.color}`}
          initial={{
            top: -20,
            left: `${piece.x}vw`,
            opacity: 1,
            scale: 0.5,
          }}
          animate={{
            top: "100vh",
            rotate: 360,
            opacity: 0,
          }}
          transition={{
            duration: 2,
            delay: piece.delay,
            ease: "easeOut",
          }}
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
          }}
        />
      ))}
    </div>
  )
}