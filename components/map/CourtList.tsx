'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from "lucide-react";
import Link from 'next/link';

export default function CourtList({ courts }: { courts: any[] }) {
    const [search, setSearch] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const router = useRouter();

    const handleSearch = () => {
        if (!search) return;
        setResults([]);
        router.push(`/map?squashin=${encodeURIComponent(search)}`);

    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSearch();
        setResults([]);
    };

    useEffect(() => {
        if (search.length < 2) {
            setResults([]);
            return;
        }

        const timeout = setTimeout(async () => {
            const res = await fetch(
                `https://photon.komoot.io/api/?q=${encodeURIComponent(search)}&limit=5&layer=city`
            );

            const data = await res.json();
            setResults(data.features);
        }, 300);

        return () => clearTimeout(timeout);
    }, [search]);

    const selectCity = (city: any) => {
        const name = city.properties.name;

        setSearch(name);
        setResults([]);

        router.push(`/map?squashin=${encodeURIComponent(name)}`);
    };

    return (
        <div className="w-full h-full flex flex-col">

            <div className="mb-4 flex gap-2 border rounded-md p-2 focus-within:ring-2 focus-within:ring-primary transition-all relative">
                <input
                    id='searchInput'
                    type="text"
                    placeholder="Search city..."
                    className="flex-1 outline-none"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onKeyDown={handleKeyPress}

                />

                <button
                    onClick={handleSearch}
                    className="px-4 rounded-full flex items-center justify-center text-white bg-primary hover:bg-primary/90 transition-colors cursor-pointer"
                >
                    <Search className="h-5 w-5" />
                </button>

                {results.length > 0 && (
                    <div className="absolute top-full left-0 w-full bg-white border rounded-md shadow z-50 mt-1">
                        {results.map((city, i) => (
                            <div
                                key={i}
                                onClick={() => selectCity(city)}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                            >
                                {city.properties.name}, {city.properties.country}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto">
                {courts.length === 0 ? (
                    <p className="text-gray-500 text-center mt-10">No courts found.</p>
                ) : (
                    courts.map((court) => (
                        <Link
                            href={`/courts/${court.city.toLowerCase()}/${court.slug}`}
                            key={court.id}
                            className="block p-4 mb-2 border rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                            <h3 className="text-lg font-semibold">{court.name}</h3>
                            <p className="text-sm text-gray-600">{court.numOfCourts} courts</p>
                            <p className="text-sm text-gray-600">{court.access?.toLowerCase()}</p>
                        </Link>
                    ))
                )}
            </div>

        </div>
    );
}