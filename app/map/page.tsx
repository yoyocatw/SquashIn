'use client';
import MapComponent from '@/components/Map';
import CourtList from '@/components/CourtList';
import { useSearchParams } from 'next/navigation';
export default function Map() {
    const searchParams = useSearchParams();
    const search: string | null = searchParams.get('squashin');




    return (
        <div className=' flex h-screen'>
            <a href="/">Home</a>
            <div className="w-1/3 p-4 bg-background">
                <CourtList />
            </div>
            <div className="flex-1">
                <MapComponent 
                    search={search}
                />
            </div>
        </div>
    );
}
