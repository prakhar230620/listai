"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Printer, Download, Share2, ShoppingCart, Trash2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import ConfettiEffect from "./confetti-effect"
import SuccessAnimation from "./success-animation"

interface Ingredient {
  name: string
  quantity: string
  unit?: string
}

interface ShoppingListProps {
  ingredients: Ingredient[]
}

export default function ShoppingList({ ingredients }: ShoppingListProps) {
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set())
  const [showConfetti, setShowConfetti] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [listName, setListName] = useState("My Shopping List")
  const [isEditing, setIsEditing] = useState(false)
  const [isAllChecked, setIsAllChecked] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Set isClient to true once component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Check if all items are checked
  useEffect(() => {
    if (ingredients.length > 0 && checkedItems.size === ingredients.length && !isAllChecked) {
      setIsAllChecked(true)
      setShowConfetti(true)
      setTimeout(() => {
        setShowSuccess(true)
      }, 500)
    } else if (checkedItems.size !== ingredients.length) {
      setIsAllChecked(false)
    }
  }, [checkedItems, ingredients.length, isAllChecked])

  const toggleItem = (index: number) => {
    const newCheckedItems = new Set(checkedItems)

    if (newCheckedItems.has(index)) {
      newCheckedItems.delete(index)
    } else {
      // Add haptic feedback if available
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(50)
      }
      newCheckedItems.add(index)
    }

    setCheckedItems(newCheckedItems)
  }

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print()
    }
  }

  const handleDownload = () => {
    const content = `${listName}\n\n${ingredients
      .map((i, index) => {
        const checked = checkedItems.has(index) ? "[✓] " : "[ ] "
        return `${checked}${i.quantity} ${i.unit || ""} ${i.name}`.trim()
      })
      .join("\n")}`

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${listName.replace(/\s+/g, "-").toLowerCase()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleShare = async () => {
    const content = `${listName}\n\n${ingredients
      .map((i, index) => {
        const checked = checkedItems.has(index) ? "✓ " : "• "
        return `${checked}${i.quantity} ${i.unit || ""} ${i.name}`.trim()
      })
      .join("\n")}`

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: listName,
          text: content,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      alert("Web Share API not supported in your browser")
    }
  }

  const clearCheckedItems = () => {
    setCheckedItems(new Set())
  }

  const checkAllItems = () => {
    const allItems = new Set(ingredients.map((_, index) => index))
    setCheckedItems(allItems)
  }

  // Don't render anything until we confirm we're on the client
  if (!isClient) {
    return null
  }

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card className="border-2 border-accent/30 shadow-lg overflow-hidden rounded-2xl">
          <CardHeader className="bg-gradient-to-r from-accent to-accent/70 text-white p-6">
            <div className="flex justify-between items-center">
              {isEditing ? (
                <input
                  type="text"
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                  onBlur={() => setIsEditing(false)}
                  onKeyDown={(e) => e.key === "Enter" && setIsEditing(false)}
                  autoFocus
                  className="bg-white/20 text-white text-2xl font-bold p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              ) : (
                <CardTitle className="text-2xl font-bold cursor-pointer" onClick={() => setIsEditing(true)}>
                  {listName}
                </CardTitle>
              )}
              <ShoppingCart className="h-6 w-6" />
            </div>

            <motion.div
              className="flex flex-wrap gap-2 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white"
                onClick={handlePrint}
              >
                <Printer className="h-4 w-4 mr-1" /> Print
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4 mr-1" /> Save
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4 mr-1" /> Share
              </Button>
            </motion.div>

            <div className="flex justify-between mt-4">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white"
                onClick={clearCheckedItems}
              >
                <Trash2 className="h-4 w-4 mr-1" /> Clear
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white"
                onClick={checkAllItems}
              >
                <Check className="h-4 w-4 mr-1" /> Check All
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-4">
            {ingredients.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No items in shopping list</p>
              </motion.div>
            ) : (
              <motion.ul
                className="space-y-2"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.05,
                    },
                  },
                }}
              >
                <AnimatePresence>
                  {ingredients.map((ingredient, index) => (
                    <motion.li
                      key={index}
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      exit={{
                        opacity: 0,
                        x: -100,
                        transition: { duration: 0.2 },
                      }}
                      className={`flex items-center p-4 rounded-xl transition-all active:scale-95 ${
                        checkedItems.has(index) ? "bg-accent/5" : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      } cursor-pointer`}
                      onClick={() => toggleItem(index)}
                    >
                      <div className="mr-3">
                        <motion.div
                          initial={false}
                          animate={
                            checkedItems.has(index)
                              ? {
                                  scale: [1, 1.2, 1],
                                  backgroundColor: "rgb(16, 185, 129)",
                                }
                              : {
                                  scale: 1,
                                  backgroundColor: "transparent",
                                }
                          }
                          transition={{ duration: 0.3 }}
                          className={`h-7 w-7 rounded-md flex items-center justify-center border-2 ${
                            checkedItems.has(index) ? "border-accent bg-accent" : "border-accent/30"
                          }`}
                        >
                          {checkedItems.has(index) && <Check className="h-5 w-5 text-white" />}
                        </motion.div>
                      </div>
                      <div className={`flex-1 ${checkedItems.has(index) ? "line-through text-gray-400" : ""}`}>
                        <span className="font-medium">{ingredient.quantity} </span>
                        {ingredient.unit && <span>{ingredient.unit} </span>}
                        <span>{ingredient.name}</span>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </motion.ul>
            )}

            <motion.div
              className="mt-6 text-center text-sm text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {checkedItems.size > 0 && (
                <p>
                  {checkedItems.size} of {ingredients.length} items checked
                </p>
              )}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {showConfetti && <ConfettiEffect duration={3000} />}

      <AnimatePresence>
        {showSuccess && <SuccessAnimation message="Shopping Complete!" onComplete={() => setShowSuccess(false)} />}
      </AnimatePresence>
    </>
  )
}