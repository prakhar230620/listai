"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Loader2,
  Search,
  ShoppingCart,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Menu,
  X,
  ArrowLeft,
  ChevronRight,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { generateRecipe, adjustServings, type Recipe } from "@/app/actions/recipe-actions"
import RecipeDisplay from "@/components/recipe-display"
import ShoppingList from "@/components/shopping-list"
import RecipeCategories from "@/components/recipe-categories"
import BottomNavigation from "@/components/bottom-navigation"
import Favorites from "@/components/favorites"
import PantryInventory from "@/components/pantry-inventory"
import LoadingSpinner from "@/components/loading-spinner"

export default function RecipeGenerator() {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [showShoppingList, setShowShoppingList] = useState(false)
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState("home")
  const [favorites, setFavorites] = useState<Recipe[]>([])
  const [recentlyViewed, setRecentlyViewed] = useState<Recipe[]>([])
  const [showSearch, setShowSearch] = useState(false)

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

  // Add recipe to recently viewed when it changes
  useEffect(() => {
    if (recipe) {
      const updatedRecent = [recipe, ...recentlyViewed.filter((r) => r.title !== recipe.title)].slice(0, 5)
      setRecentlyViewed(updatedRecent)
      localStorage.setItem("recentlyViewedRecipes", JSON.stringify(updatedRecent))
    }
  }, [recipe])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    try {
      const generatedRecipe = await generateRecipe(query)
      setRecipe(generatedRecipe)
      setSelectedItems(new Set(generatedRecipe.ingredients.map((i) => i.name)))

      // Add to recently viewed
      const updatedRecent = [generatedRecipe, ...recentlyViewed.filter((r) => r.title !== generatedRecipe.title)].slice(
        0,
        5,
      )
      setRecentlyViewed(updatedRecent)
      localStorage.setItem("recentlyViewedRecipes", JSON.stringify(updatedRecent))
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
      setShowSearch(false)
    }
  }

  const handleServingsChange = async (newServings: number) => {
    if (!recipe || newServings < 1) return

    try {
      const adjustedRecipe = await adjustServings(recipe, newServings)
      setRecipe(adjustedRecipe)
    } catch (error) {
      console.error("Error adjusting servings:", error)
    }
  }

  const toggleIngredient = (ingredientName: string) => {
    const newSelectedItems = new Set(selectedItems)
    if (newSelectedItems.has(ingredientName)) {
      newSelectedItems.delete(ingredientName)
    } else {
      newSelectedItems.add(ingredientName)
    }
    setSelectedItems(newSelectedItems)

    // Add haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }
  }

  const toggleFavorite = (recipe: Recipe) => {
    const isFavorite = favorites.some((fav) => fav.title === recipe.title)
    let updatedFavorites

    if (isFavorite) {
      updatedFavorites = favorites.filter((fav) => fav.title !== recipe.title)
    } else {
      updatedFavorites = [...favorites, recipe]

      // Add haptic feedback if available
      if (navigator.vibrate) {
        navigator.vibrate([50, 50, 150])
      }
    }

    setFavorites(updatedFavorites)
    localStorage.setItem("favoriteRecipes", JSON.stringify(updatedFavorites))
  }

  const handleCategorySelect = async (category: string) => {
    setQuery(`${category} recipe`)
    setLoading(true)

    try {
      const generatedRecipe = await generateRecipe(`${category} recipe`)
      setRecipe(generatedRecipe)
      setSelectedItems(new Set(generatedRecipe.ingredients.map((i) => i.name)))

      // Add to recently viewed
      const updatedRecent = [generatedRecipe, ...recentlyViewed.filter((r) => r.title !== generatedRecipe.title)].slice(
        0,
        5,
      )
      setRecentlyViewed(updatedRecent)
      localStorage.setItem("recentlyViewedRecipes", JSON.stringify(updatedRecent))
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectRecipe = (selectedRecipe: Recipe) => {
    setRecipe(selectedRecipe)
    setSelectedItems(new Set(selectedRecipe.ingredients.map((i) => i.name)))
    setActiveTab("home")
  }

  const renderHomeTab = () => (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold gradient-text">Recipe Finder</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowSearch(true)}
          className="rounded-full h-10 w-10 bg-primary/10 text-primary hover:bg-primary/20"
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>

      <RecipeCategories onSelectCategory={handleCategorySelect} />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {recipe ? (
            <div className="space-y-6 animate-slide-in">
              <RecipeDisplay
                recipe={recipe}
                onServingsChange={handleServingsChange}
                selectedItems={selectedItems}
                onToggleIngredient={toggleIngredient}
                onToggleFavorite={toggleFavorite}
                isFavorite={favorites.some((fav) => fav.title === recipe.title)}
              />

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Button
                  onClick={() => setShowShoppingList(!showShoppingList)}
                  className="w-full py-6 text-lg bg-gradient-to-r from-accent to-accent/70 hover:from-accent/90 hover:to-accent/60 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  whileTap={{ scale: 0.98 }}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {showShoppingList ? "Hide Shopping List" : "View Shopping List"}
                  {showShoppingList ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </Button>
              </motion.div>

              <AnimatePresence>
                {showShoppingList && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <ShoppingList ingredients={recipe.ingredients.filter((i) => selectedItems.has(i.name))} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="space-y-6">
              {recentlyViewed.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold mb-3">Recently Viewed</h2>
                  <div className="space-y-3">
                    {recentlyViewed.slice(0, 3).map((recentRecipe) => (
                      <motion.div
                        key={recentRecipe.title}
                        className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-md cursor-pointer hover:shadow-lg transition-all touch-card"
                        onClick={() => handleSelectRecipe(recentRecipe)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <h3 className="font-medium">{recentRecipe.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                          {recentRecipe.ingredients.length} ingredients • {recentRecipe.prepTime} prep
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              <PantryInventory />
            </div>
          )}
        </>
      )}
    </div>
  )

  const renderSearchTab = () => (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="icon" onClick={() => setActiveTab("home")} className="rounded-full h-10 w-10">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Search Recipes</h1>
      </div>

      <Card className="border-2 border-primary/30 shadow-lg">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="What would you like to cook?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 pr-4 py-6 text-lg border-2 border-primary/20 focus:border-primary rounded-xl"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" size={20} />
            </div>
            <Button
              type="submit"
              disabled={loading || !query.trim()}
              className="w-full py-6 text-lg bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Recipe...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Recipe
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Popular Searches</h2>
        <div className="flex flex-wrap gap-2">
          {["Pasta", "Chicken", "Vegan", "Quick Dinner", "Dessert", "Breakfast", "Healthy", "Soup"].map(
            (suggestion) => (
              <motion.button
                key={suggestion}
                onClick={() => {
                  setQuery(suggestion)
                  handleSubmit(new Event("submit") as any)
                }}
                className="bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {suggestion}
              </motion.button>
            ),
          )}
        </div>
      </div>
    </div>
  )

  const renderFavoritesTab = () => (
    <div className="space-y-6 animate-fade-in pb-20">
      <h1 className="text-3xl font-bold gradient-text">My Favorites</h1>
      <Favorites onSelectRecipe={handleSelectRecipe} />
    </div>
  )

  const renderProfileTab = () => (
    <div className="space-y-6 animate-fade-in pb-20">
      <h1 className="text-3xl font-bold gradient-text">My Profile</h1>
      <Card className="border-2 border-primary/30 shadow-lg">
        <CardContent className="pt-6 space-y-4">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white text-3xl font-bold mb-4">
              U
            </div>
            <h2 className="text-xl font-bold">User</h2>
            <p className="text-gray-500">Food enthusiast</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-primary/10 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-primary">{favorites.length}</p>
              <p className="text-sm text-gray-600">Saved Recipes</p>
            </div>
            <div className="bg-secondary/10 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-secondary">{recentlyViewed.length}</p>
              <p className="text-sm text-gray-600">Recently Viewed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <PantryInventory />
    </div>
  )

  const renderMoreTab = () => (
    <div className="space-y-6 animate-fade-in pb-20">
      <h1 className="text-3xl font-bold gradient-text">More Options</h1>

      <div className="grid gap-4">
        {[
          { title: "Settings", icon: Menu, color: "bg-gray-100 text-gray-600" },
          { title: "Help & Support", icon: Menu, color: "bg-blue-100 text-blue-600" },
          { title: "About", icon: Menu, color: "bg-purple-100 text-purple-600" },
          { title: "Privacy Policy", icon: Menu, color: "bg-green-100 text-green-600" },
          { title: "Terms of Service", icon: Menu, color: "bg-yellow-100 text-yellow-600" },
        ].map((item) => (
          <motion.div
            key={item.title}
            className={`${item.color} p-4 rounded-xl flex items-center justify-between cursor-pointer`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center">
              <item.icon className="h-5 w-5 mr-3" />
              <span className="font-medium">{item.title}</span>
            </div>
            <ChevronRight className="h-5 w-5" />
          </motion.div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen">
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 bg-white dark:bg-gray-900 z-50 p-4 overflow-auto"
          >
            <div className="max-w-md mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Search Recipes</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSearch(false)}
                  className="rounded-full h-10 w-10"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="What would you like to cook?"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-10 pr-4 py-6 text-lg border-2 border-primary/20 focus:border-primary rounded-xl"
                    autoFocus
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" size={20} />
                </div>
                <Button
                  type="submit"
                  disabled={loading || !query.trim()}
                  className="w-full py-6 text-lg bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating Recipe...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Generate Recipe
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 space-y-4">
                <h3 className="font-bold">Popular Searches</h3>
                <div className="flex flex-wrap gap-2">
                  {["Pasta", "Chicken", "Vegan", "Quick Dinner", "Dessert", "Breakfast", "Healthy", "Soup"].map(
                    (suggestion) => (
                      <motion.button
                        key={suggestion}
                        onClick={() => {
                          setQuery(suggestion)
                          handleSubmit(new Event("submit") as any)
                        }}
                        className="bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {suggestion}
                      </motion.button>
                    ),
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container max-w-md mx-auto px-4 py-8">
        {activeTab === "home" && renderHomeTab()}
        {activeTab === "search" && renderSearchTab()}
        {activeTab === "favorites" && renderFavoritesTab()}
        {activeTab === "profile" && renderProfileTab()}
        {activeTab === "menu" && renderMoreTab()}
      </div>

      <BottomNavigation onNavigate={setActiveTab} activeTab={activeTab} />
    </div>
  )
}
