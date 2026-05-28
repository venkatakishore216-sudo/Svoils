import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/lib/models";
import { verifyToken, getToken } from "@/lib/auth";

export async function PUT(request, { params }) {
  try {
    const token = getToken(request);
    if (!await verifyToken(token)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const body = await request.json();
    const p = await Product.findByIdAndUpdate(
      params.id,
      { ...body, price: Number(body.price) },
      { new: true }
    );
    return NextResponse.json(p);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const token = getToken(request);
    if (!await verifyToken(token)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    await Product.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
