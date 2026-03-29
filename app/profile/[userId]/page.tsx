'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { User as UserIcon, Users } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface UserProfile {
  id: string
  display_name: string | null
}

export default function UserProfilePage() {
  const params = useParams()
  const userId = params.userId as string
  
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const [followerCount, setFollowerCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)
  const [loading, setLoading] = useState(true)
  
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)

      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      setProfile(profileData)

      if (user) {
        const { data: followData } = await supabase
          .from('player_follows')
          .select('id')
          .eq('follower_id', user.id)
          .eq('following_id', userId)
          .single()
        setIsFollowing(!!followData)
      }

      const { count: followers } = await supabase
        .from('player_follows')
        .select('id', { count: 'exact', head: true })
        .eq('following_id', userId)
      setFollowerCount(followers || 0)

      const { count: following } = await supabase
        .from('player_follows')
        .select('id', { count: 'exact', head: true })
        .eq('follower_id', userId)
      setFollowingCount(following || 0)

      setLoading(false)
    }

    fetchData()
  }, [userId, supabase])

  const toggleFollow = async () => {
    if (!currentUser) {
      window.location.href = '/login'
      return
    }

    setLoading(true)

    if (isFollowing) {
      const { error } = await supabase
        .from('player_follows')
        .delete()
        .eq('follower_id', currentUser.id)
        .eq('following_id', userId)

      if (!error) {
        setIsFollowing(false)
        setFollowerCount(prev => prev - 1)
      }
    } else {
      const { error } = await supabase
        .from('player_follows')
        .insert({ follower_id: currentUser.id, following_id: userId })

      if (!error) {
        setIsFollowing(true)
        setFollowerCount(prev => prev + 1)
      }
    }

    setLoading(false)
  }

  if (loading) {
    return (
      <div className="container mx-auto max-w-5xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="container mx-auto max-w-5xl p-6">
        <p>User not found</p>
      </div>
    )
  }

  const isOwnProfile = currentUser?.id === userId

  return (
    <div className="container mx-auto max-w-5xl p-6">
      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
            {profile.display_name ? (
              <span className="text-3xl font-bold text-primary">
                {profile.display_name.charAt(0).toUpperCase()}
              </span>
            ) : (
              <UserIcon className="w-12 h-12 text-gray-400" />
            )}
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold">
              {profile.display_name || 'Unknown User'}
            </h1>
            
            <div className="flex gap-6 mt-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-500" />
                <span className="font-semibold">{followerCount}</span>
                <span className="text-gray-500">followers</span>
              </div>
              <div className="flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-gray-500" />
                <span className="font-semibold">{followingCount}</span>
                <span className="text-gray-500">following</span>
              </div>
            </div>
          </div>

          {!isOwnProfile && (
            <Button
              onClick={toggleFollow}
              disabled={loading}
              className={isFollowing ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : ''}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </Button>
          )}
        </div>

        {isOwnProfile && (
          <div className="pt-4 border-t">
            <Link href="/profile">
              <Button variant="outline">Edit Profile</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
