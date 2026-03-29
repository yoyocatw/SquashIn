'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Users } from 'lucide-react'
import Link from 'next/link'
import { Badge } from "@/components/ui/badge"

interface CourtFollowersProps {
  courtId: string
  initialCount?: number
}

interface Follower {
  user_id: string
  display_name: string | null
}

export default function CourtFollowers({ courtId }: CourtFollowersProps) {
  const [followers, setFollowers] = useState<Follower[]>([])
  const [loading, setLoading] = useState(true)
  console.log("CourtFollowers mounted with courtId:", courtId)
  useEffect(() => {
    const fetchFollowers = async () => {
      const supabase = createClient()
      
      if (courtId) {
        const { data: savedCourts, error: savedError } = await supabase
          .from('saved_courts')
          .select('user_id')
          .eq('court_id', courtId)

        if (savedError) {
          console.error("Error fetching saved courts:", savedError)
          setLoading(false)
          return
        }
        console.log("users that saved courts:", savedCourts)
        if (savedCourts && savedCourts.length > 0) {
          const userIds = savedCourts.map(sc => sc.user_id)

          const { data: profilesData, error: profileError } = await supabase
            .from('user_profiles')
            .select('user_id, display_name')
            .in('user_id', userIds)

          if (!profileError && profilesData) {
            setFollowers(profilesData)
          }
        } else {
          setFollowers([])
        }
      }
      setLoading(false)
    }

    fetchFollowers()
  }, [courtId])

  if (loading) {
    return <div className="mt-6 text-gray-400">Loading followers...</div>
  }

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-3">
        <Users className="w-5 h-5 text-gray-500" />
        <span className="font-semibold text-gray-600">
          {followers.length} player{followers.length !== 1 ? 's' : ''} following this court
        </span>
      </div>
      
      {followers.length === 0 ? (
        <p className="text-gray-400 text-sm">No one is following this court yet</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {followers.map((follower) => (
            <Link
              key={follower.user_id}
              href={`/profile/${follower.user_id}`}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-semibold text-primary">
                  {follower.display_name ? follower.display_name.charAt(0).toUpperCase() : '?'}
                </span>
              </div>
              <span className="text-sm font-medium">
                {follower.display_name || 'Unknown'}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}