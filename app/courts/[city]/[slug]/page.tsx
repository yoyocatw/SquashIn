import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { House, UserStar, Phone, Mail, Link } from "lucide-react";
import 'maplibre-gl/dist/maplibre-gl.css';
import CourtMap from '@/components/court_detail/CourtMap';


const accessLabels: Record<string, string> = {
    PUBLIC: 'Public Access',
    PRIVATE: 'Private Court',
    MEMBERSHIP_REQUIRED: 'Membership Required',
    ONE_TIME_FEE: 'Pay to Play',
    UNKNOWN: 'Contact for Access',
};

export default async function CourtPage({
    params
}: {
    params: Promise<{ city: string; slug: string }>
}) {

    
    const { city, slug } = await params;

    const court = await prisma.court.findUnique({
        where: { slug: slug }
    });

    if (!court) notFound();

    return (
        <div className='flex w-full h-screen'>
            <div className="w-2/3 p-8 flex flex-col items-start">
                <h1 className="text-4xl font-bold">{court.name}</h1>
                <div className="mt-6 space-y-4 pl-2">
                    <div className='flex gap-2'>
                        <House />
                        <p className='font-semibold'>{court.numOfCourts} squash courts</p>
                    </div>
                    <div className='flex gap-2'>
                        <UserStar />
                        <p className='font-semibold'>{accessLabels[court.access]}</p>
                    </div>
                </div>
                <div>
                    <p className="mt-6 text-gray-600">{court.description}</p>
                </div>
            </div>
            <div className='w-1/3 p-8 border-l'>
                <CourtMap court={court} />
                <div className='flex flex-col gap-2 mt-8'>
                    <div className='flex gap-2'>
                        <Mail />
                        <p>{court.email}</p>
                    </div>
                    <div className='flex gap-2'>
                        <Phone />
                        <p>{court.phone}</p>
                    </div>
                    <div className='flex gap-2'>
                        <Link />
                        <a href={court.website ?? undefined} target="_blank" rel="noopener noreferrer" className='underline'>
                            {court.website}
                        </a>
                    </div>
                </div>
            </div>
        </div>

    );
}