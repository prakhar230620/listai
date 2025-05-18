"use client"

import { useState } from "react"
import type { Recipe } from "@/app/actions/recipe-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Users, ChevronUp, ChevronDown, Check, Heart, Share2, Printer, Info, AlertTriangle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface RecipeDisplayProps {
  recipe: Recipe
  onServingsChange: (servings: number) => void
  selectedItems: Set<string>
  onToggleIngredient: (name: string) => void
  onToggleFavorite?: (recipe: Recipe) => void
  isFavorite?: boolean
}

export default function RecipeDisplay({
  recipe,
  onServingsChange,
  selectedItems,
  onToggleIngredient,
  onToggleFavorite,
  isFavorite = false,
}: RecipeDisplayProps) {
  const [activeTab, setActiveTab] = useState("ingredients")
  const [showTips, setShowTips] = useState(false)
  const [showNutrition, setShowNutrition] = useState(false)

  // Simulate a swipe gesture to change tabs
  const handleSwipe = (direction: "left" | "right") => {
    if (direction === "left" && activeTab === "ingredients") {
      setActiveTab("instructions")
    } else if (direction === "right" && activeTab === "instructions") {
      setActiveTab("ingredients")
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="border-2 border-primary/20 shadow-lg overflow-hidden rounded-2xl">
        <CardHeader className="bg-gradient-to-r from-primary to-secondary text-white p-6">
          <div className="flex justify-between items-start">
            <CardTitle className="text-2xl font-bold">{recipe.title}</CardTitle>
            {onToggleFavorite && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                className={`p-2 rounded-full ${isFavorite ? "bg-white/30" : "bg-white/10"}`}
                onClick={() => onToggleFavorite(recipe)}
              >
                <Heart className={`h-6 w-6 ${isFavorite ? "fill-white text-white" : "text-white"}`} />
              </motion.button>
            )}
          </div>
          <motion.p
            className="text-white/90 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {recipe.description}
          </motion.p>

          <motion.div
            className="flex items-center justify-between mt-4 bg-white/10 p-3 rounded-xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div className="flex items-center space-x-2" whileHover={{ scale: 1.05 }}>
              <Clock className="h-5 w-5" />
              <span>Prep: {recipe.prepTime}</span>
            </motion.div>
            <motion.div className="flex items-center space-x-2" whileHover={{ scale: 1.05 }}>
              <Clock className="h-5 w-5" />
              <span>Cook: {recipe.cookTime}</span>
            </motion.div>
            <motion.div className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <div className="flex items-center">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onServingsChange(recipe.servings - 1)}
                  disabled={recipe.servings <= 1}
                  className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center disabled:opacity-50"
                >
                  <ChevronDown className="h-5 w-5" />
                </motion.button>
                <span className="mx-2 min-w-[1.5rem] text-center">{recipe.servings}</span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onServingsChange(recipe.servings + 1)}
                  className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center"
                >
                  <ChevronUp className="h-5 w-5" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex space-x-2 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              variant="secondary"
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-white"
              onClick={() => setShowTips(!showTips)}
            >
              <Info className="h-4 w-4 mr-1" /> Tips
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-white"
              onClick={() => window.print()}
            >
              <Printer className="h-4 w-4 mr-1" /> Print
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-white"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: recipe.title,
                    text: `Check out this recipe for ${recipe.title}!`,
                  })
                }
              }}
            >
              <Share2 className="h-4 w-4 mr-1" /> Share
            </Button>
          </motion.div>
        </CardHeader>

        <Tabs defaultValue="ingredients" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2 p-0 rounded-none">
            <TabsTrigger
              value="ingredients"
              className="text-lg py-4 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-none border-b-2 data-[state=active]:border-primary border-transparent transition-all"
            >
              Ingredients
            </TabsTrigger>
            <TabsTrigger
              value="instructions"
              className="text-lg py-4 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-none border-b-2 data-[state=active]:border-primary border-transparent transition-all"
            >
              Instructions
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="ingredients"
            className="p-0 mt-0"
            onTouchStart={(e) => {
              const touch = e.touches[0]
              const startX = touch.clientX

              const handleTouchMove = (e: TouchEvent) => {
                const touch = e.touches[0]
                const diffX = touch.clientX - startX

                if (diffX < -50) {
                  // Swipe left
                  handleSwipe("left")
                  document.removeEventListener("touchmove", handleTouchMove)
                }
              }

              document.addEventListener("touchmove", handleTouchMove, { passive: true })

              const handleTouchEnd = () => {
                document.removeEventListener("touchmove", handleTouchMove)
                document.removeEventListener("touchend", handleTouchEnd)
              }

              document.addEventListener("touchend", handleTouchEnd, { passive: true })
            }}
          >
            <CardContent className="p-4">
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
                {recipe.ingredients.map((ingredient, index) => (
                  <motion.li
                    key={index}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    className="flex items-center p-4 rounded-xl hover:bg-primary/5 transition-colors cursor-pointer active:bg-primary/10"
                    onClick={() => onToggleIngredient(ingredient.name)}
                  >
                    <div className="mr-3">
                      <motion.div
                        initial={false}
                        animate={
                          selectedItems.has(ingredient.name)
                            ? {
                                scale: [1, 1.2, 1],
                                backgroundColor: "rgb(147, 51, 234)",
                              }
                            : {
                                scale: 1,
                                backgroundColor: "transparent",
                              }
                        }
                        transition={{ duration: 0.3 }}
                        className={`h-6 w-6 rounded-md flex items-center justify-center border-2 ${
                          selectedItems.has(ingredient.name) ? "border-primary bg-primary" : "border-primary/30"
                        }`}
                      >
                        {selectedItems.has(ingredient.name) && <Check className="h-4 w-4 text-white" />}
                      </motion.div>
                    </div>
                    <div className={selectedItems.has(ingredient.name) ? "" : "text-gray-400"}>
                      <span className="font-medium">{ingredient.quantity} </span>
                      {ingredient.unit && <span>{ingredient.unit} </span>}
                      <span>{ingredient.name}</span>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>

              <AnimatePresence>
                {showNutrition && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 overflow-hidden"
                  >
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-xl border border-yellow-200 dark:border-yellow-800">
                      <div className="flex items-center mb-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mr-2" />
                        <h3 className="font-bold text-yellow-800 dark:text-yellow-500">Nutrition Information</h3>
                      </div>
                      <p className="text-yellow-700 dark:text-yellow-400 text-sm mb-2">Estimated values per serving:</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex justify-between">
                          <span>Calories:</span>
                          <span className="font-medium">350 kcal</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Protein:</span>
                          <span className="font-medium">15g</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Carbs:</span>
                          <span className="font-medium">40g</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Fat:</span>
                          <span className="font-medium">12g</span>
                        </div>
                      </div>
                      <p className="text-yellow-600 dark:text-yellow-400 text-xs mt-2 italic">
                        Values are approximate and may vary based on specific ingredients used.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-4 flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNutrition(!showNutrition)}
                  className="text-primary"
                >
                  {showNutrition ? "Hide Nutrition Info" : "Show Nutrition Info"}
                </Button>
              </div>
            </CardContent>
          </TabsContent>

          <TabsContent
            value="instructions"
            className="p-0 mt-0"
            onTouchStart={(e) => {
              const touch = e.touches[0]
              const startX = touch.clientX

              const handleTouchMove = (e: TouchEvent) => {
                const touch = e.touches[0]
                const diffX = touch.clientX - startX

                if (diffX > 50) {
                  // Swipe right
                  handleSwipe("right")
                  document.removeEventListener("touchmove", handleTouchMove)
                }
              }

              document.addEventListener("touchmove", handleTouchMove, { passive: true })

              const handleTouchEnd = () => {
                document.removeEventListener("touchmove", handleTouchMove)
                document.removeEventListener("touchend", handleTouchEnd)
              }

              document.addEventListener("touchend", handleTouchEnd, { passive: true })
            }}
          >
            <CardContent className="p-4">
              <motion.ol
                className="space-y-6"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1,
                    },
                  },
                }}
              >
                {recipe.instructions.map((step, index) => (
                  <motion.li
                    key={index}
                    className="flex"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    <div className="mr-4 flex-shrink-0">
                      <motion.div
                        className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {index + 1}
                      </motion.div>
                    </div>
                    <p className="pt-1">{step}</p>
                  </motion.li>
                ))}
              </motion.ol>

              <AnimatePresence>
                {showTips && recipe.tips && recipe.tips.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 overflow-hidden"
                  >
                    <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                      <h3 className="font-bold text-primary mb-2">Chef's Tips</h3>
                      <ul className="space-y-2">
                        {recipe.tips.map((tip, index) => (
                          <motion.li
                            key={index}
                            className="flex items-start"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <span className="inline-block h-5 w-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center mr-2 mt-0.5">
                              {index + 1}
                            </span>
                            <span>{tip}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </motion.div>
  )
}
