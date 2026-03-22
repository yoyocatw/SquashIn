'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Search, MapPin } from 'lucide-react'

export default function SearchBar() {
  const [search, setSearch] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (search.length < 2) {
      setResults([])
      setShowDropdown(false)
      return
    }

    const timeout = setTimeout(async () => {
      const res = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(search)}&limit=6&layer=city`
      )
      const data = await res.json()
      setResults(data.features || [])
      setShowDropdown(true)
    }, 200)

    return () => clearTimeout(timeout)
  }, [search])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectCity = (city: any) => {
    const name = city.properties.name
    setSearch(name)
    setShowDropdown(false)
    router.push(`/map?squashin=${encodeURIComponent(name)}`)
  }

  const handleSearch = () => {
    if (!search) return
    setShowDropdown(false)
    router.push(`/map?squashin=${encodeURIComponent(search)}`)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="w-96 relative" ref={dropdownRef}>
      <div className="flex rounded-2xl border-2 border-muted-foreground focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all overflow-hidden">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyPress}
          onFocus={() => results.length > 0 && setShowDropdown(true)}
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

      {showDropdown && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-muted-foreground rounded-xl shadow-lg z-50 overflow-hidden">
          {results.map((city, i) => (
            <button
              key={i}
              onClick={() => selectCity(city)}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-100 transition-colors text-left"
            >
              <MapPin className="h-4 w-4 text-gray-400" />
              <div>
                <span className="font-medium">{city.properties.name}</span>
                <span className="text-gray-500 text-sm ml-2">{city.properties.country}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
