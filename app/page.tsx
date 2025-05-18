import RecipeGenerator from "@/components/recipe-generator"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Recipe Shopping List Builder",
  description: "Generate recipes and create shopping lists with AI",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
  themeColor: "#9333EA",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Recipe App",
  },
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 dark:from-gray-900 dark:to-purple-950">
      <RecipeGenerator />
    </main>
  )
}
