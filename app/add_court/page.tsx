"use client";

import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css'
import { useState, useEffect, useRef, SubmitEvent } from "react";


export default function AddCourtForm() {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [lat, setLat] = useState<number | null>(null);
    const [lon, setLon] = useState<number | null>(null);
    const [numOfCourts, setNumOfCourts] = useState(1);
    const [access, setAccess] = useState("UNKNOWN");
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

    const mapRef = useRef<maplibregl.Map | null>(null);
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const markerRef = useRef<maplibregl.Marker | null>(null);

    // Use Photon API for suggesting address cause its faster
    async function fetchSuggestions(query: string) {
        if (!query) {
            setSuggestions([]);
            return;
        }

        try {
            const res = await fetch(
                `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5`
            );

            const data = await res.json();
            setSuggestions(data.features);
            setShowSuggestions(true);

        } catch (err) {
            console.error(err);
        }
    }
    useEffect(() => {
        if (!mapContainer.current) return;

        const map = new maplibregl.Map({
            container: mapContainer.current,
            style: "https://tiles.stadiamaps.com/styles/alidade_smooth.json",
            center: [-74.5, 40],
            zoom: 1
        });

        // Create custom marker element with image and "Drag me" text
        const markerElement = document.createElement('div');
        markerElement.style.display = 'flex';
        markerElement.style.flexDirection = 'column-reverse';
        markerElement.style.alignItems = 'center';
        markerElement.innerHTML = `
            <img src="/marker.png" style="width: 30px; height: 30px; cursor: move;" alt="Marker" />
            <span style="background: white; padding: 2px 4px; border-radius: 3px; font-size: 10px; margin-bottom: 2px; box-shadow: 0 1px 3px rgba(0,0,0,0.3);">Drag me</span>
        `;

        const marker = new maplibregl.Marker({ element: markerElement, draggable: true })
            .setLngLat([-74.5, 40])
            .addTo(map);

        marker.on("dragend", async () => {
            const lngLat = marker.getLngLat();
            setLat(lngLat.lat);
            setLon(lngLat.lng);

            reverseGeocode(lngLat.lat, lngLat.lng);
        });

        mapRef.current = map;
        markerRef.current = marker;

        return () => map.remove();
    }, []);

    // Use nominatim for revverse geocoding cause its more accurate but slower
    async function reverseGeocode(lat: number, lon: number) {
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`
            );

            const data = await res.json();

            if (!data) return;

            if (data.display_name) {
                setAddress(data.display_name);
            }

            const city =
                data.address?.city ||
                data.address?.town ||
                data.address?.village ||
                "";

            setCity(city);

        } catch (err) {
            console.error(err);
        }
    }
    async function geocodeAddress() {
        if (!address) return;

        const res = await fetch(
            `https://photon.komoot.io/api/?q=${encodeURIComponent(address)}&limit=1`
        );

        const data = await res.json();

        if (!data.features || !data.features[0]) return;

        const coords = data.features[0].geometry.coordinates;
        const newLon = coords[0];
        const newLat = coords[1];

        setLat(newLat);
        setLon(newLon);

        // Also set city if available from geocoding
        const props = data.features[0].properties;
        if (props.city) setCity(props.city);

        if (mapRef.current && markerRef.current) {
            mapRef.current.flyTo({
                center: [newLon, newLat],
                zoom: 15
            });

            markerRef.current.setLngLat([newLon, newLat]);
        }
    }

    async function handleSubmit(e: SubmitEvent) {
        e.preventDefault();

        const res = await fetch("/api/courts", {
            method: "POST",
            body: JSON.stringify({
                name,
                address,
                city,
                numOfCourts,
                lat,
                lon,
                access,
                slug: name.toLowerCase().replace(/ /g, "-")
            }),
        });

        const data = await res.json();
        if (res.ok) {
            alert("Court submitted successfully!");
        }
        console.log(data);
    }

    return (
        <div className="max-w-3/4 mx-auto p-6">
            <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-12">
                <div className="grid grid-cols-3 gap-10 border-b pb-10">
                    <div>
                        <h2 className="text-lg font-semibold">Title</h2>
                        <p className="text-sm text-description mt-1">
                            The name of this location or facility. Please don’t include other
                            information like schedules or contact details.
                        </p>
                    </div>
                    <div className="col-span-2">
                        <label className="text-sm font-semibold">Court Title <span className='text-red-600'>*</span></label>
                        <input
                            className="mt-2 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                </div>
                <div className="grid grid-cols-3 gap-10 border-b pb-10">
                    <div>
                        <h2 className="text-lg font-semibold">Location</h2>
                        <p className="text-sm text-description mt-1">
                            The street address and city of the location. Used for directions.
                        </p>
                    </div>

                    <div className="col-span-2 space-y-4">

                        <div>
                            <label className="text-sm font-semibold">Street Address <span className='text-red-600'>*</span></label>
                            <div className='relative'>
                                <input
                                    className="mt-2 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    value={address}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setAddress(value);
                                        if (debounceTimer) clearTimeout(debounceTimer);
                                        const timer = setTimeout(() => {
                                            fetchSuggestions(value);
                                        }, 500);
                                        setDebounceTimer(timer);
                                    }}
                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); geocodeAddress(); } }}
                                    onBlur={() => { setTimeout(() => setShowSuggestions(false), 200); }}
                                />
                                {showSuggestions && suggestions.length > 0 && (
                                    <ul className="border rounded-md mt-1 bg-white shadow absolute z-20 w-full max-h-60 overflow-y-auto" >
                                        {suggestions.map((place) => {
                                            const [lon, lat] = place.geometry.coordinates;
                                            const props = place.properties;

                                            return (
                                                <li
                                                    key={`${lat}-${lon}`}
                                                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                                    onClick={() => {
                                                        setLat(lat);
                                                        setLon(lon);

                                                        reverseGeocode(lat, lon);

                                                        setSuggestions([]);
                                                        setShowSuggestions(false);

                                                        if (mapRef.current && markerRef.current) {
                                                            mapRef.current.flyTo({
                                                                center: [lon, lat],
                                                                zoom: 15
                                                            });

                                                            markerRef.current.setLngLat([lon, lat]);
                                                        }
                                                    }}
                                                >
                                                    <div className="font-medium">
                                                        {props.name ||
                                                            [props.housenumber, props.street].filter(Boolean).join(" ")}
                                                    </div>

                                                    <div className="text-sm text-gray-500">
                                                        {[props.city, props.state, props.country].filter(Boolean).join(", ")}
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </div>
                        </div>
                        <div className="h-64 w-full rounded-md overflow-hidden relative">
                            <div ref={mapContainer} className="h-full w-full" />

                        </div>

                    </div>

                </div>

                <div className="grid grid-cols-3 gap-10">

                    <div>
                        <h2 className="text-lg font-semibold">Courts</h2>
                        <p className="text-sm text-description mt-1">
                            How many squash courts are at this facility?
                        </p>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-semibold">Number of Courts <span className='text-red-600'>*</span></label>
                        <input
                            type="number"
                            className="mt-2 w-40 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            value={numOfCourts}
                            onChange={(e) => setNumOfCourts(Number(e.target.value))}
                        />
                    </div>

                </div>


                <div className="grid grid-cols-3 gap-10">
                    <div><h2 className="text-lg font-semibold">Access <span className='text-red-600'>*</span></h2></div>
                    <div className="col-span-2 flex gap-4">
                        <select
                            value={access}
                            onChange={(e) => setAccess(e.target.value)}
                            className="border p-2 rounded-md">

                            <option>Select Access</option>
                            <option value="UNKNOWN">Select Access</option>
                            <option value="PUBLIC">Public</option>
                            <option value="PRIVATE">Private</option>
                            <option value="MEMBERS_ONLY"> MEMBERSHIP_REQUIRED</option>
                            <option value="ONE_TIME_FEE">ONE_TIME_FEE</option>

                        </select>

                    </div>
                </div>

                <div className="pt-6">
                    <button
                        type="submit"
                        className="bg-black text-white px-6 py-3 rounded-lg hover:opacity-90"
                    >
                        Submit Court
                    </button>
                </div>

            </form>
        </div>
    );
}