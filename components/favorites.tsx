"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Heart, Trash2, Clock, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Recipe } from "@/app/actions/recipe-actions"

interface FavoritesProps {
  onSelectRecipe: (recipe: Recipe) => void
}

export default function Favorites({ onSelectRecipe }: FavoritesProps) {
  const [favorites, setFavorites] = useState<Recipe[]>([])
  const [recentlyViewed, setRecentlyViewed] = useState<Recipe[]>([])

  // Load favorites and recently viewed from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favoriteRecipes")
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }

    const savedRecent = localStorage.getItem("recentlyViewedRecipes")
    if (savedRecent) {
      setRecentlyViewed(JSON.parse(savedRecent))
    }
  }, [])

  const removeFromFavorites = (recipeTitle: string) => {
    const updatedFavorites = favorites.filter((recipe) => recipe.title !== recipeTitle)
    setFavorites(updatedFavorites)
    localStorage.setItem("favoriteRecipes", JSON.stringify(updatedFavorites))
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="space-y-6">
      {favorites.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-3">Favorites</h2>
          <motion.div className="space-y-3" variants={container} initial="hidden" animate="show">
            {favorites.map((recipe) => (
              <motion.div
                key={recipe.title}
                variants={item}
                className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-md flex items-center justify-between touch-card"
                onClick={() => onSelectRecipe(recipe)}
              >
                <div className="flex-1">
                  <h3 className="font-medium">{recipe.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                    {recipe.ingredients.length} ingredients • {recipe.prepTime} prep
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFromFavorites(recipe.title)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      {recentlyViewed.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-3">Recently Viewed</h2>
          <motion.div className="space-y-3" variants={container} initial="hidden" animate="show">
            {recentlyViewed.map((recipe) => (
              <motion.div
                key={recipe.title}
                variants={item}
                className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-md flex items-center justify-between touch-card"
                onClick={() => onSelectRecipe(recipe)}
              >
                <div className="flex items-center text-gray-400 mr-3">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{recipe.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                    {recipe.ingredients.length} ingredients • {recipe.prepTime} prep
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      {favorites.length === 0 && recentlyViewed.length === 0 && (
        <div className="text-center py-8">
          <Heart className="h-12 w-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
          <h3 className="text-lg font-medium mb-1">No favorites yet</h3>
          <p className="text-gray-500 dark:text-gray-400">Save recipes you love for quick access</p>
        </div>
      )}
    </div>
  )
}
