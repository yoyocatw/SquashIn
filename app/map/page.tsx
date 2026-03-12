import prisma from '@/lib/prisma';
import MapClient from '@/components/map/MapClient';

interface MapPageProps {
  searchParams: Promise<{
    swLat?: string;
    swLng?: string;
    neLat?: string;
    neLng?: string;
  }>;
}

export default async function MapPage({ searchParams }: MapPageProps) {
  const params = await searchParams;
  
  const { swLat, swLng, neLat, neLng } = params;
  const courts = await prisma.court.findMany({
    where: swLat ? {
      lat: { 
        gte: parseFloat(swLat!), 
        lte: parseFloat(neLat!) 
      },
      lon: { 
        gte: parseFloat(swLng!), 
        lte: parseFloat(neLng!) 
      },
    } : {},
    orderBy: { createdAt: 'desc' },
  });

  return <MapClient courts={courts} />;
}