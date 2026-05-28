import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Stock } from "@/lib/models";
import { verifyToken, getToken } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const items = await Stock.find();
    const result = {};
    items.forEach((s) => { result[s.key] = s; });
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const token = getToken(request);
    if (!await verifyToken(token)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { key, stock, available } = await request.json();
    await Stock.findOneAndUpdate(
      { key },
      { stock: Number(stock), available },
      { upsert: true, new: true }
    );
    const items = await Stock.find();
    const result = {};
    items.forEach((s) => { result[s.key] = s; });
    return NextResponse.json({ success: true, stock: result });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
