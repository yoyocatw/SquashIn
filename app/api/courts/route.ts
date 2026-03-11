import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function POST(req: Request) {
  try {
    const body = await req.json();

    const court = await prisma.court.create({
      data: {
        name: body.name,
        address: body.address,
        city: body.city,
        lat: body.lat,
        lon: body.lon,
        numOfCourts: body.numOfCourts,
        access: body.access,
        slug: body.slug,
        description: body.description,
        email: body.email,
        phone: body.phone,
        website: body.website,
      },
    });

    return NextResponse.json(court, { status: 201 });
  } catch (error) {
    console.error("Request error", error);
    return NextResponse.json({ error: "Error creating court" }, { status: 500 });
  }
}