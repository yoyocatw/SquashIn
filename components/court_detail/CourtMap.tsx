'use client';
import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function CourtMap({ court }: { court: any }) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=(${encodeURIComponent(court.name)})`;
    useEffect(() => {
        if (!mapContainerRef.current || !court) return;

        const map = new maplibregl.Map({
            container: mapContainerRef.current,
            style: 'https://tiles.openfreemap.org/styles/liberty',
            center: [court.lon, court.lat],
            zoom: 15,
            interactive: false, 
            attributionControl: false
        });

       const el = document.createElement('div');
        el.className = 'custom-marker';
        el.style.backgroundImage = 'url(/marker.png)';
        el.style.width = '35px';
        el.style.height = '35px';
        el.style.backgroundSize = '100%';
        el.style.cursor = 'pointer';

        new maplibregl.Marker({ element: el })
            .setLngLat([court.lon, court.lat])
            .setPopup(
                new maplibregl.Popup({ offset: 25 }).setHTML(
                    `<h3 style="font-weight: bold;">${court.name}</h3><p>${court.address}</p>`
                )
            )
            .addTo(map);

        // Add navigation controls (zoom +/-)
        map.addControl(new maplibregl.NavigationControl(), 'top-right');

        return () => map.remove();
    }, [court]);

    return (
        <div className="w-full max-w-lg mx-auto">
            <a 
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"   >
                <div ref={mapContainerRef} className="w-full h-75 pointer-events-none"/>
            </a>
        </div>
    );
}