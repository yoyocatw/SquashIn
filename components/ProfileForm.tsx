'use client'

import { useState, useEffect, SubmitEvent } from 'react'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ProfileFormProps {
  user: {
    id: string
    email?: string
    user_metadata: {
      name?: string
      clublocker_rating?: number
      squashlevels_rating?: number
    }
  }
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const initialName = user.user_metadata?.name || ''
  const initialClublockerRating = user.user_metadata?.clublocker_rating?.toString() || ''
  const initialSquashlevelsRating = user.user_metadata?.squashlevels_rating?.toString() || ''

  const [name, setName] = useState(initialName)
  const [clublockerRating, setClublockerRating] = useState(initialClublockerRating)
  const [squashlevelsRating, setSquashlevelsRating] = useState(initialSquashlevelsRating)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const hasUnsavedChanges =
    name !== initialName ||
    clublockerRating !== initialClublockerRating ||
    squashlevelsRating !== initialSquashlevelsRating ||
    currentPassword !== '' ||
    newPassword !== '' ||
    confirmPassword !== ''

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

  const supabase = createClient()

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (newPassword || currentPassword || confirmPassword) {
      if (!currentPassword) {
        setMessage({ type: 'error', text: 'Current password is required to change password' })
        setLoading(false)
        return
      }
      if (!newPassword) {
        setMessage({ type: 'error', text: 'New password is required' })
        setLoading(false)
        return
      }
      if (newPassword !== confirmPassword) {
        setMessage({ type: 'error', text: 'New passwords do not match' })
        setLoading(false)
        return
      }
    }

    if (newPassword && currentPassword) {
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email || '',
        password: currentPassword
      })
      if (verifyError) {
        setMessage({ type: 'error', text: 'Current password is incorrect' })
        setLoading(false)
        return
      }
    }

    const { error: metadataError } = await supabase.auth.updateUser({
      data: {
        name,
        clublocker_rating: clublockerRating ? Number(clublockerRating) : null,
        squashlevels_rating: squashlevelsRating ? Number(squashlevelsRating) : null
      }
    })

    if (metadataError) {
      setMessage({ type: 'error', text: metadataError.message })
      setLoading(false)
      return
    }

    if (newPassword) {
      const { error: passwordError } = await supabase.auth.updateUser({
        password: newPassword
      })
      if (passwordError) {
        setMessage({ type: 'error', text: passwordError.message })
        setLoading(false)
        return
      }
    }

    setMessage({ type: 'success', text: 'Profile updated successfully!' })
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setLoading(false)
  }
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-4 border-b-2 border-dashed space-y-4">
          <h3 className="font-semibold">Account</h3>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <p className="text-sm border border-gray-300 rounded-md p-3 bg-muted">
              {user.email || 'No email provided'}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="p-4 border-b-2 border-dashed space-y-4">
          <h3 className="font-semibold">Ratings</h3>
          
          <div className="space-y-2">
            <Label htmlFor="clublocker">ClubLocker Rating</Label>
            <Input
              id="clublocker"
              type="number"
              min="1"
              max="10"
              value={clublockerRating}
              onChange={(e) => setClublockerRating(e.target.value)}
              className="border border-gray-300 rounded-md"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="squashlevels">SquashLevels Rating</Label>
            <Input
              id="squashlevels"
              type="number"
              min="1"
              max="10"
              value={squashlevelsRating}
              onChange={(e) => setSquashlevelsRating(e.target.value)}
              className="border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="p-4 border-b-2 border-dashed space-y-4">
          <h3 className="font-semibold">Change Password</h3>
          
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="border border-gray-300 rounded-md"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border border-gray-300 rounded-md"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {message && (
          <p className={`text-sm ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
            {message.text}
          </p>
        )}

        <Button type="submit" disabled={loading} className="w-full cursor-pointer">
          {loading ? 'Updating...' : 'Update Profile'}
        </Button>
      </form>
      <div className='mt-4'>
        <Button className='underline bg-transparent text-black cursor-pointer hover:text-primary' onClick={handleSignOut}>Sign Out</Button>
      </div>
      
    </div>

  )
}
