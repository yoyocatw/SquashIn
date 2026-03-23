'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Heart } from 'lucide-react'

interface FollowerCountProps {
  courtId: string
  initialCount: number
}

export default function FollowerCount({ courtId, initialCount }: FollowerCountProps) {
  const [count, setCount] = useState(initialCount)
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel('saved_courts_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'saved_courts',
          filter: `court_id=eq.${courtId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setCount((prev) => prev + 1)
          } else if (payload.eventType === 'DELETE') {
            setCount((prev) => prev - 1)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [courtId, supabase])

  return (
    <div className='flex gap-2'>
      <Heart />
      <p className='font-semibold'>{count} followers</p>
    </div>
  )
}