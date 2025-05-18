"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Beef, Fish, Salad, Pizza, Coffee, Cake, Apple, Soup, Sandwich, Egg, Carrot, Sparkles } from "lucide-react"

interface Category {
  id: string
  name: string
  icon: React.ElementType
  color: string
}

interface RecipeCategoriesProps {
  onSelectCategory: (category: string) => void
}

export default function RecipeCategories({ onSelectCategory }: RecipeCategoriesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories: Category[] = [
    { id: "beef", name: "Beef", icon: Beef, color: "bg-red-100 text-red-600" },
    { id: "seafood", name: "Seafood", icon: Fish, color: "bg-blue-100 text-blue-600" },
    { id: "salad", name: "Salad", icon: Salad, color: "bg-green-100 text-green-600" },
    { id: "pizza", name: "Pizza", icon: Pizza, color: "bg-yellow-100 text-yellow-600" },
    { id: "breakfast", name: "Breakfast", icon: Coffee, color: "bg-orange-100 text-orange-600" },
    { id: "dessert", name: "Dessert", icon: Cake, color: "bg-pink-100 text-pink-600" },
    { id: "fruit", name: "Fruit", icon: Apple, color: "bg-purple-100 text-purple-600" },
    { id: "soup", name: "Soup", icon: Soup, color: "bg-amber-100 text-amber-600" },
    { id: "sandwich", name: "Sandwich", icon: Sandwich, color: "bg-indigo-100 text-indigo-600" },
    { id: "vegetarian", name: "Vegetarian", icon: Carrot, color: "bg-emerald-100 text-emerald-600" },
    { id: "quick", name: "Quick", icon: Egg, color: "bg-cyan-100 text-cyan-600" },
    { id: "trending", name: "Trending", icon: Sparkles, color: "bg-rose-100 text-rose-600" },
  ]

  const handleSelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
    onSelectCategory(categoryId)
  }

  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold mb-3 pl-1">Categories</h2>
      <div className="overflow-x-auto pb-2 no-scrollbar">
        <div className="flex space-x-3 px-1 py-2 w-max">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => handleSelect(category.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl ${category.color} transition-all touch-card`}
              whileTap={{ scale: 0.95 }}
              animate={{
                scale: selectedCategory === category.id ? 1.05 : 1,
                boxShadow:
                  selectedCategory === category.id ? "0 4px 12px rgba(0,0,0,0.1)" : "0 2px 4px rgba(0,0,0,0.05)",
              }}
            >
              <category.icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{category.name}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}
