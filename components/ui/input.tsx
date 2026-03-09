import * as React from "react"
import { Search } from "lucide-react" // Install lucide-react if you haven't
import { cn } from "@/lib/utils"

function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <div className="relative group w-full">
      <Search 
        className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" 
      />
      <input
        type="text"
        placeholder="Search for courts"
        data-slot="input"
        className={cn(
          "h-16 w-full rounded-2xl border-2 border-muted bg-background pl-12 pr-4 text-lg transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 placeholder:text-muted-foreground placeholder:font-light disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        {...props}
      />
      
    </div>
  )
}

export { Input }
