import { createClient } from '@/lib/supabase/server';
import MapClient from '@/components/map/MapClient';

interface MapPageProps {
  searchParams: Promise<{
    squashin?: string;
    swLat?: string;
    swLng?: string;
    neLat?: string;
    neLng?: string;
  }>;
}

export default async function MapPage({ searchParams }: MapPageProps) {
  const params = await searchParams;
  
  const { swLat, swLng, neLat, neLng, squashin } = params;
  const supabase = await createClient();

  let query = supabase
    .from('courts')
    .select('*')
    .order('created_at', { ascending: false });

  if (swLat && neLat && swLng && neLng) {
    query = query
      .gte('lat', parseFloat(swLat))
      .lte('lat', parseFloat(neLat))
      .gte('lon', parseFloat(swLng))
      .lte('lon', parseFloat(neLng));
  } else if (squashin) {
    query = query.ilike('city', `%${squashin}%`);
  }

  const { data: courts } = await query;

  return <MapClient courts={courts || []} search={squashin || null} />;
}
