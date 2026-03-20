'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

export default function SearchBar() {
  const [search, setSearch] = useState('')
  const router = useRouter()

  const handleSearch = () => {
    if (!search) return
    router.push(`/map?squashin=${encodeURIComponent(search)}`)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="w-96 flex rounded-2xl border-2 border-muted-foreground focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all overflow-hidden">
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Search for courts..."
        className="border-0 focus-visible:ring-0 placeholder:font-extralight placeholder:text-gray-400"
      />

      <button
        onClick={handleSearch}
        className="px-4 flex items-center justify-center text-white bg-primary hover:bg-primary/90 transition-colors cursor-pointer"
      >
        <Search className="h-5 w-5" />
      </button>
    </div>
  )
}
