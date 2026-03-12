'use client';
import TypewriterCity from "@/components/TypewriterCity";
import { Input } from "@/components/ui/input";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from "lucide-react";

export default function Home() {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    if (!search) return;
    router.push(`/map?squashin=${encodeURIComponent(search)}`);
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
        <div className="w-96 flex rounded-2xl border-2 border-muted-foreground focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all overflow-hidden">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Search courts..."
            className="border-0 focus-visible:ring-0"
          />

          <button
            onClick={handleSearch}
            className="px-4 flex items-center justify-center text-white bg-primary hover:bg-primary/90 transition-colors cursor-pointer"
          >
            <Search className="h-5 w-5" />
          </button>
          
        </div>
        <a href="/add_court" className="font-roboto underline text-sm">Add a Court</a>
      </div>
    </div>
  );
}
