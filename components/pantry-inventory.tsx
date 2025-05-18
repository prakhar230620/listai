"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, X, Check, Search } from "lucide-react"

interface PantryItem {
  id: string
  name: string
  inStock: boolean
}

export default function PantryInventory() {
  const [items, setItems] = useState<PantryItem[]>([])
  const [newItem, setNewItem] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isAdding, setIsAdding] = useState(false)

  // Load items from localStorage on mount
  useEffect(() => {
    const savedItems = localStorage.getItem("pantryItems")
    if (savedItems) {
      setItems(JSON.parse(savedItems))
    }
  }, [])

  // Save items to localStorage when they change
  useEffect(() => {
    localStorage.setItem("pantryItems", JSON.stringify(items))
  }, [items])

  const addItem = () => {
    if (newItem.trim()) {
      setItems([...items, { id: Date.now().toString(), name: newItem.trim(), inStock: true }])
      setNewItem("")
      setIsAdding(false)
    }
  }

  const toggleItemStatus = (id: string) => {
    setItems(items.map((item) => (item.id === id ? { ...item, inStock: !item.inStock } : item)))
  }

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const filteredItems = items.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">My Pantry</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsAdding(!isAdding)}
          className="rounded-full h-10 w-10 bg-primary/10 text-primary hover:bg-primary/20"
        >
          {isAdding ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
        </Button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Add new item..."
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                className="flex-1"
                onKeyDown={(e) => e.key === "Enter" && addItem()}
              />
              <Button onClick={addItem} className="shrink-0">
                Add
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          type="text"
          placeholder="Search pantry items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-1">
        <AnimatePresence>
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800"
              >
                <div className="flex items-center">
                  <button
                    onClick={() => toggleItemStatus(item.id)}
                    className={`h-6 w-6 rounded-md flex items-center justify-center mr-3 transition-colors ${
                      item.inStock ? "bg-green-500 text-white" : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  >
                    {item.inStock && <Check className="h-4 w-4" />}
                  </button>
                  <span className={item.inStock ? "" : "text-gray-400 line-through"}>{item.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(item.id)}
                  className="h-8 w-8 rounded-full hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900"
                >
                  <X className="h-4 w-4" />
                </Button>
              </motion.div>
            ))
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4 text-gray-500">
              {items.length === 0 ? "Your pantry is empty. Add some items!" : "No items match your search."}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
