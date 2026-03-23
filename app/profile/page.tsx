import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProfileForm from '@/components/ProfileForm'
export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };


  return (
    <div className="container mx-auto max-w-5xl p-6">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
      
      <ProfileForm user={user} />
      
      
    </div>
  )
}
