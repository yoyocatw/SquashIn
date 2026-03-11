'use client';
import maplibregl from 'maplibre-gl';
import { use, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function Map({ search, courts }: { search: string | null; courts: any[] }) {
    const mapRef = useRef<maplibregl.Map | null>(null);
    const router = useRouter();
    useEffect(() => {
        mapRef.current = new maplibregl.Map({
            container: 'map',
            style: 'https://tiles.stadiamaps.com/styles/alidade_smooth.json',
            center: [-74.5, 40],
            zoom: 2
        });
    }, []);
    useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    const handleMoveEnd = () => {
        const bounds = map.getBounds();
        const params = new URLSearchParams();
        params.set('swLat', bounds.getSouth().toString());
        params.set('swLng', bounds.getWest().toString());
        params.set('neLat', bounds.getNorth().toString());
        params.set('neLng', bounds.getEast().toString());
        router.push(`/map?${params.toString()}`, { scroll: false });
    };

    map.on('moveend', handleMoveEnd);
    return () => { map.off('moveend', handleMoveEnd); };
}, [router]);
    useEffect(() => {
        if (!mapRef.current || !search || !courts) return;
        const map = mapRef.current;
        const markerElement = document.createElement('div');
        markerElement.className = 'cursor-pointer';
        markerElement.innerHTML = `<img src="/marker.png" style="width: 30px; height: 30px; cursor: move;" alt="Marker" />`;
        courts.forEach(court => {
            if (court.lon && court.lat) {
                new maplibregl.Marker({ element: markerElement })
                    .setLngLat([court.lon, court.lat])
                    .setPopup(new maplibregl.Popup().setHTML(`<h3>${court.name}</h3><p>${court.address}, ${court.city}</p>`))
                    .addTo(map);
            }
        });
        const getLocation = async () => {
            const result = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(search)}&format=json&limit=1`);

            const data = await result.json();
            console.log(data);
            if (data.length === 0) return;
            const lon = parseFloat(data[0].lon);
            const lat = parseFloat(data[0].lat);

            map.flyTo({
                center: [lon, lat],
                zoom: 10
            });
        };
        getLocation();
    }, [search]);

    return (
        <div id='map' className='w-full h-full'></div>
    );
}