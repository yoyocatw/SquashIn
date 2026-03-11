import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

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
        slug: body.slug
      }
    });

    return Response.json(court);

  } catch (err) {
    console.error(err);
    return new Response("Error creating court", { status: 500 });
  }
}