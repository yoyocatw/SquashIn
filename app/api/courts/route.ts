import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const body = await req.json();

    const { data, error } = await supabase
      .from('courts')
      .insert({
        name: body.name,
        address: body.address,
        city: body.city,
        lat: body.lat,
        lon: body.lon,
        num_of_courts: body.numOfCourts,
        access: body.access,
        slug: body.slug,
        description: body.description,
        email: body.email,
        phone: body.phone,
        website: body.website,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Request error", error);
    return NextResponse.json({ error: "Error creating court" }, { status: 500 });
  }
}
