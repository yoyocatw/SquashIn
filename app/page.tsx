import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import TypewriterCity from "@/components/TypewriterCity"
import SearchBar from '@/components/SearchBar'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

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

        <SearchBar />
        
        <a href="/add_court" className="font-roboto underline text-sm">Add a Court</a>
      </div>
    </div>
  );
}
