'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import Image from 'next/image';

export default function Nav() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  
  const displayName = user?.user_metadata?.name || user?.email?.split('@')[0]

  return (
    <nav className="w-full p-4 bg-white border-b shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src="/marker.png" alt="SquashHeads Logo" width={32} height={32} className="inline-block" />
          <a href="/" className="text-xl font-bold text-gray-800 font-roboto">SquashHeads</a>
        </div>
        

        {user ? (
          <div className="flex items-center gap-4">
            <a 
              href="/profile" 
              className="text-sm font-medium hover:underline"
            >
              {displayName}
            </a>
          </div>
        ) : (
          <a href="/login" className="text-sm font-medium hover:underline">Login</a>
        )}
      </div>
    </nav>
  );
}
