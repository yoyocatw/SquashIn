'use client';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function Map({
    search,
    courts
}: {
    search: string | null;
    courts: any[];
}) {
    const mapRef = useRef<maplibregl.Map | null>(null);
    const markersRef = useRef<maplibregl.Marker[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (mapRef.current) return;

        const map = new maplibregl.Map({
            container: 'map',
            style: 'https://tiles.openfreemap.org/styles/liberty',
            center: [-74.5, 40],
            zoom: 1
        });

        mapRef.current = map;

        const handleMoveEnd = () => {
            if (!mapRef.current) return;
            if (window.location.pathname !== '/map') return;

            const params = new URLSearchParams(window.location.search);
            const currentSearch = params.get('squashin');

            const bounds = mapRef.current.getBounds();
            const sw = bounds.getSouthWest();
            const ne = bounds.getNorthEast();

            if (currentSearch) {
                router.push(`/map?squashin=${encodeURIComponent(currentSearch)}&swLat=${sw.lat}&swLng=${sw.lng}&neLat=${ne.lat}&neLng=${ne.lng}`, { scroll: false });
            } else {
                router.push(`/map?swLat=${sw.lat}&swLng=${sw.lng}&neLat=${ne.lat}&neLng=${ne.lng}`, { scroll: false });
            }
        };

        map.on('load', () => setIsLoaded(true));
        map.on('moveend', handleMoveEnd);

        return () => {
            map.off('moveend', handleMoveEnd); 
            map.remove();
            mapRef.current = null;
        };
    }, [router]);

    useEffect(() => {
        if (!isLoaded || !mapRef.current || !courts) return;

        const map = mapRef.current;

        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        courts.forEach(court => {
            const lon = Number(court.lon);
            const lat = Number(court.lat);

            if (isNaN(lon) || isNaN(lat)) return;

            const markerElement = document.createElement('div');
            markerElement.className = 'cursor-pointer';
            markerElement.innerHTML =
                `<img src="/marker.png" style="width:30px;height:30px;" />`;

            const marker = new maplibregl.Marker({ element: markerElement })
                .setLngLat([lon, lat])
                .setPopup(
                    new maplibregl.Popup().setHTML(
                        `<h3>${court.name}</h3><p>${court.address}, ${court.city}</p>`
                    )
                )
                .addTo(map);

            markersRef.current.push(marker);
        });
    }, [courts, isLoaded]);

    useEffect(() => {
        if (!mapRef.current || !search) return;

        const map = mapRef.current;

        const fetchLocation = async () => {
            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
                        search
                    )}&format=json&limit=1`
                );

                const data = await res.json();
                if (!data.length) return;

                const lon = Number(data[0].lon);
                const lat = Number(data[0].lat);

                if (isNaN(lon) || isNaN(lat)) return;

                map.jumpTo({
                    center: [lon, lat],
                    zoom: 11
                });
            } catch (err) {
                console.error('Search error:', err);
            }
        };

        fetchLocation();
    }, [search]);

    return <div id="map" className="w-full h-full" />;
}