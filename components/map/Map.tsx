'use client';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { use, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function Map({ search, courts }: { search: string | null; courts: any[] }) {
    const mapRef = useRef<maplibregl.Map | null>(null);
    const markersRef = useRef<maplibregl.Marker[]>([]);
    const router = useRouter();
    useEffect(() => {
        const map = new maplibregl.Map({
            container: 'map',
            style: 'https://tiles.openfreemap.org/styles/liberty',
            center: [-74.5, 40],
            zoom: 1
        });
        map.on("moveend", () => {
            const map = mapRef.current;
            if (!map) return;
            const path = window.location.pathname;
            if (path !== '/map') return;

            const bounds = map.getBounds();
            const sw = bounds.getSouthWest();
            const ne = bounds.getNorthEast();

            router.push(
                `/map?swLat=${sw.lat}&swLng=${sw.lng}&neLat=${ne.lat}&neLng=${ne.lng}`,
                {scroll: false}
            );
        });
        mapRef.current = map;
        return () => {
            map.remove();
        }
    }, []);
    useEffect(() => {
        if (!mapRef.current || !courts) return;
        
        const map = mapRef.current;
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        courts.forEach(court => {
            console.log(court.name, court.lat, court.lon);
            const markerElement = document.createElement('div');
            markerElement.className = 'cursor-pointer';
            markerElement.innerHTML = `<img src="/marker.png" style="width:30px;height:30px;" />`;
            const marker = new maplibregl.Marker({ element: markerElement })
                .setLngLat([court.lon, court.lat])
                .setPopup(
                    new maplibregl.Popup().setHTML(
                        `<h3>${court.name}</h3><p>${court.address}, ${court.city}</p>`
                    )
                )
                .addTo(map);
            markersRef.current.push(marker);
        });
    }, [courts]);
    useEffect(() => {
        if (!mapRef.current || !search) return;
        const map = mapRef.current;

        const getLocation = async () => {
            const result = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(search)}&format=json&limit=1`);
            const data = await result.json();
            if (data.length === 0) return;
            const lon = parseFloat(data[0].lon);
            const lat = parseFloat(data[0].lat);

            map.jumpTo({
                center: [lon, lat],
                zoom: 11
            });
        };
        getLocation();
    }, [search]);
    return (
        <div id='map' className='w-full h-full'></div>
    );
}