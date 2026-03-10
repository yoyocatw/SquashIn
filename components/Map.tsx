'use client';
import maplibregl from 'maplibre-gl';
import { use, useEffect, useRef } from 'react';

export default function Map({ search }: { search: string | null }) {
    const mapRef = useRef<maplibregl.Map | null>(null);
    useEffect(() => {
        mapRef.current = new maplibregl.Map({
            container: 'map',
            style: 'https://tiles.stadiamaps.com/styles/alidade_smooth.json', 
            center: [-74.5, 40], 
            zoom: 2
        });
    }, []);

    useEffect(() => {
        if (!mapRef.current || !search) return;
        const map = mapRef.current;

        const getLocation = async() => {
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