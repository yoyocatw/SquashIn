'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

interface Court {
  id: string
  name: string
  city: string
  slug: string
}

export default function SavedCourts({ userId }: { userId: string }) {
  const [courts, setCourts] = useState<Court[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchSavedCourts = async () => {
      const { data, error } = await supabase
        .from('saved_courts')
        .select(`
          courts (
            id,
            name,
            city,
            slug
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (!error && data) {
        const extractedCourts = data.map((item: any) => item.courts).filter(Boolean)
        setCourts(extractedCourts)
      }
      setLoading(false)
    }

    fetchSavedCourts()
  }, [userId, supabase])

  if (loading) {
    return <p className="text-gray-500">Loading saved courts...</p>
  }

  if (courts.length === 0) {
    return (
      <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
        <p className="text-gray-500">No saved courts yet.</p>
        <p className="text-sm text-gray-400 mt-1">Follow courts to see them here.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {courts.map((court) => (
        <Link
          key={court.id}
          href={`/courts/${(court.city || '').toLowerCase()}/${court.slug}`}
          className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <span className="font-medium">{court.name}</span>
        </Link>
      ))}
    </div>
  )
}
