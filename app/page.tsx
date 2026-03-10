'use client';
import TypewriterCity from "@/components/TypewriterCity";
import { Input } from "@/components/ui/input";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    if (!search) return;
    router.push(`/map?search=${encodeURIComponent(search)}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
   <div className="flex w-full flex-col items-center justify-center p-4 h-screen">
      <div className="flex w-full max-w-4xl flex-col items-center justify-center gap-6 ">
        
        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-x-2 gap-y-2 w-full items-center whitespace-nowrap">
          <h1 className=" text-5xl font-bold text-center">
            Squash in
          </h1>
          <div className="flex justify-center">
            <TypewriterCity />   
          </div>
        </div>
        <div className="w-96">
            <Input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyPress}
            />
        </div>
      </div>
    </div>
  );
}
