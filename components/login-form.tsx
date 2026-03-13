'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isRegistering) {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Registration failed');
        }

        const signInResult = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });

        if (signInResult?.error) {
          throw new Error('Failed to sign in after registration');
        }

        router.push('/dashboard');
        router.refresh();
      } else {
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          throw new Error('Invalid email or password');
        }

        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 rounded-lg border bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-center">
        {isRegistering ? 'Create an account' : 'Welcome back'}
      </h1>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {isRegistering && (
          <div>
            <label htmlFor="name" className="text-sm font-medium">Name</label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>
        )}
        
        <div>
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className="text-sm font-medium">Password</label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={6}
          />
        </div>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        <Button type="submit" disabled={isLoading}>
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
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          >
            Google
          </Button>
        </>
      )}
    </div>
  );
}
