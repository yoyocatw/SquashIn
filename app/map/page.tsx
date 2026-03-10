import MapComponent from '@/components/Map';
import CourtList from '@/components/CourtList';
export default function Map() {
    return (
        <div className=' flex h-screen'>
            <div className="w-1/3 p-4 bg-background">
                <CourtList />
            </div>
            <div className="flex-1">
                <MapComponent />
            </div>
        </div>
    );
}