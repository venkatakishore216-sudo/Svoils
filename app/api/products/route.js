import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/lib/models";
import { verifyToken, getToken } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json(await Product.find());
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const token = getToken(request);
    if (!await verifyToken(token)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const body = await request.json();
    const p = await Product.create({ ...body, price: Number(body.price) });
    return NextResponse.json(p, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
