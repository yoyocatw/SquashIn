import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <div className="relative group w-full">
      
      <input
        type="text"
        placeholder="Search for courts"
        data-slot="input"
        className={cn(
          "h-16 w-full bg-transparent pl-4 pr-4 text-lg outline-none placeholder:text-black  placeholder:font-light disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        {...props}
      />
      
    </div>
  )
}

export { Input }
