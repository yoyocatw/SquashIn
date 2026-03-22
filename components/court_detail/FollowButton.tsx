'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Heart } from 'lucide-react'
import Swal from 'sweetalert2'

interface FollowButtonProps {
  courtId: string
  userId: string
}

export default function FollowButton({ courtId, userId }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!userId) return

    const checkFollow = async () => {
      const { data } = await supabase
        .from('saved_courts')
        .select('id')
        .eq('user_id', userId)
        .eq('court_id', courtId)
        .single()
      
      setIsFollowing(!!data)
      setLoading(false)
    }

    checkFollow()
  }, [courtId, userId, supabase])

  const toggleFollow = async () => {
    if (!userId) {
      Swal.fire({
        icon: 'info',
        title: 'Sign in required',
        text: 'Please sign in to follow courts',
      })
      return
    }

    setLoading(true)

    if (isFollowing) {
      const { error } = await supabase
        .from('saved_courts')
        .delete()
        .eq('user_id', userId)
        .eq('court_id', courtId)

      if (error) {
        Swal.fire({ icon: 'error', title: 'Error', text: error.message })
      } else {
        setIsFollowing(false)
        Swal.fire({
          icon: 'success',
          title: 'Unfollowed',
          text: 'Court removed from your list',
          timer: 1500,
          showConfirmButton: false,
        })
      }
    } else {
      const { error } = await supabase
        .from('saved_courts')
        .insert({ user_id: userId, court_id: courtId })

      if (error) {
        Swal.fire({ icon: 'error', title: 'Error', text: error.message })
      } else {
        setIsFollowing(true)
        Swal.fire({
          icon: 'success',
          title: 'Following!',
          text: 'Court added to your list',
          timer: 1500,
          showConfirmButton: false,
        })
      }
    }

    setLoading(false)
  }

  return (
    <button
      onClick={toggleFollow}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
        isFollowing
          ? 'bg-primary text-white hover:bg-primary/80'
          : 'border-2 border-primary text-primary hover:bg-primary hover:text-white'
      }`}
    >
      <Heart className={`h-5 w-5 ${isFollowing ? 'fill-current' : ''}`} />
      <span>{isFollowing ? 'Following' : 'Follow'}</span>
    </button>
  )
}
