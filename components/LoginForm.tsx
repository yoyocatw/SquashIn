'use client';
import { useState, SubmitEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginForm() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isRegistering) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              clublocker_rating: null,
              squashlevels_rating: null,
            },
          },
        });

        if (signUpError) {
          throw new Error(signUpError.message);
        }

        router.push('/confirm_signup');
        router.refresh();
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          throw new Error('Invalid email or password');
        }

        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  }

  return (
    <div className="flex flex-col gap-6 rounded-lg border p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-center">
        {isRegistering ? 'Create an account' : 'Welcome back'}
      </h1>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {isRegistering && (
          <div>
            <label htmlFor="name" className="text-sm font-medium">Name</label>
            <Input
              className='rounded-md border'
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}
        
        <div>
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <Input
            className='rounded-md border'
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className="text-sm font-medium">Password</label>
          <Input
            className='border rounded-md'
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        <Button type="submit" disabled={isLoading} className='cursor-pointer'>
          {isLoading ? 'Loading...' : isRegistering ? 'Sign up' : 'Sign in'}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Or</span>
        </div>
      </div>

      <Button
        variant="outline"
        className='cursor-pointer'
        onClick={() => {
          setIsRegistering(!isRegistering);
          setError('');
        }}
      >
        {isRegistering ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
      </Button>

      {!isRegistering && (
        <>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <Button
            variant="outline"
            className='cursor-pointer'
            onClick={handleGoogleSignIn}
          >
            Google
          </Button>
        </>
      )}
    </div>
  );
}
