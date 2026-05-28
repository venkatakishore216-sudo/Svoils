import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Subscription } from "@/lib/models";

export async function POST(request) {
  try {
    await connectDB();
    const sub = await request.json();
    if (!sub?.endpoint) return NextResponse.json({ error: "Invalid" }, { status: 400 });
    await Subscription.findOneAndUpdate(
      { endpoint: sub.endpoint },
      { endpoint: sub.endpoint, keys: sub.keys },
      { upsert: true, new: true }
    );
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await connectDB();
    const { endpoint } = await request.json();
    await Subscription.deleteOne({ endpoint });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
