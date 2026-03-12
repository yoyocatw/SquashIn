'use client';
import MapComponent from '@/components/map/Map';
import CourtList from '@/components/map/CourtList';
import { useSearchParams } from 'next/navigation';

export default function MapClient({ courts }: { courts: any[] }) {
    const searchParams = useSearchParams();
    const search = searchParams.get('squashin');

    return (
        <div className='flex h-screen w-full'>
            <div className="w-1/3 p-4 bg-white border-r overflow-y-auto">
                <CourtList courts={courts} />
            </div>
            <div className="flex-1 relative">
                <MapComponent
                    search={search}
                    courts={courts}
                />
            </div>
        </div>
    );
}