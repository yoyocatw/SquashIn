'use client';
import MapComponent from '@/components/Map';
import CourtList from '@/components/CourtList';
import { useSearchParams } from 'next/navigation';

// 1. Accept 'courts' as a prop from the Server Page
// 2. Remove 'async'
export default function MapClient({ courts }: { courts: any[] }) {
    const searchParams = useSearchParams();
    const search = searchParams.get('squashin');

    return (
        <div className='flex h-screen w-full'>
            <div className="w-1/3 p-4 bg-white border-r overflow-y-auto">
                <a href="/" className="text-blue-500 hover:underline mb-4 block">← Home</a>
                <h1 className="text-xl font-bold mb-4">Squash Courts</h1>
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