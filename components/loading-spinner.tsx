import { Loader2 } from "lucide-react"

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <Loader2 className="h-12 w-12 text-purple-500 animate-spin" />
      <p className="text-purple-700 font-medium">Cooking up something delicious...</p>
    </div>
  )
}
