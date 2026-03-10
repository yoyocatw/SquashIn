'use client';
import maplibregl from 'maplibre-gl';
import { use, useEffect } from 'react';

export default function Map() {
    useEffect(() => {
        var map = new maplibregl.Map({
            container: 'map',
            style: 'https://tiles.stadiamaps.com/styles/alidade_smooth.json', 
            center: [-74.5, 40], 
            zoom: 2
        });
    }, []);
    return (
        <div id='map' className='w-full h-full'></div>
    );
}