"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface ConfettiProps {
  duration?: number
}

export default function ConfettiEffect({ duration = 3000 }: ConfettiProps) {
  const [pieces, setPieces] = useState<Array<{ id: number; color: string; x: number; delay: number }>>([])
  const [show, setShow] = useState(true)

  useEffect(() => {
    // Generate random confetti pieces
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
      x: Math.random() * 100, // random horizontal position
      delay: Math.random() * 0.5, // random delay
    }))

    setPieces(newPieces)

    // Hide confetti after duration
    const timer = setTimeout(() => {
      setShow(false)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

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
            scale: Math.random() * 0.6 + 0.4,
          }}
          animate={{
            top: "100vh",
            rotate: Math.random() * 360,
            opacity: 0,
          }}
          transition={{
            duration: Math.random() * 2 + 1,
            delay: piece.delay,
            ease: "easeOut",
          }}
          style={{
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
            borderRadius: Math.random() > 0.5 ? "50%" : "0",
          }}
        />
      ))}
    </div>
  )
}
