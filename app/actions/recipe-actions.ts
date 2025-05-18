"use server"

import { groq } from "@ai-sdk/groq"
import { generateObject } from "ai"
import { z } from "zod"

// Define the schema for our recipe
const recipeSchema = z.object({
  recipe: z.object({
    title: z.string(),
    description: z.string(),
    servings: z.number(),
    prepTime: z.string(),
    cookTime: z.string(),
    ingredients: z.array(
      z.object({
        name: z.string(),
        quantity: z.string(),
        unit: z.string().optional(),
      }),
    ),
    instructions: z.array(z.string()),
    tips: z.array(z.string()).optional(),
  }),
})

export type Recipe = z.infer<typeof recipeSchema>["recipe"]

export async function generateRecipe(query: string): Promise<Recipe> {
  try {
    const prompt = `Generate a detailed recipe for ${query}. 
    Include a title, brief description, number of servings, prep time, cook time, 
    ingredients with quantities and units, and step-by-step instructions. 
    Also include 2-3 cooking tips.`

    const result = await generateObject({
      model: groq("llama3-70b-8192"),
      schema: recipeSchema,
      prompt,
    })

    return result.object.recipe
  } catch (error) {
    console.error("Error generating recipe:", error)
    throw new Error("Failed to generate recipe")
  }
}

export async function adjustServings(recipe: Recipe, newServings: number): Promise<Recipe> {
  const servingRatio = newServings / recipe.servings

  const adjustedIngredients = recipe.ingredients.map((ingredient) => {
    // Extract the numeric part of the quantity
    const quantityMatch = ingredient.quantity.match(/^(\d*\.?\d+)/)
    if (!quantityMatch) return ingredient

    const numericQuantity = Number.parseFloat(quantityMatch[0])
    const adjustedQuantity = (numericQuantity * servingRatio).toFixed(2)

    // Replace the numeric part with the adjusted quantity
    const newQuantity = ingredient.quantity.replace(/^\d*\.?\d+/, adjustedQuantity)

    return {
      ...ingredient,
      quantity: newQuantity,
    }
  })

  return {
    ...recipe,
    servings: newServings,
    ingredients: adjustedIngredients,
  }
}
