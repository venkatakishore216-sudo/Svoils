import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Video } from "@/lib/models";
import { verifyToken, getToken } from "@/lib/auth";

export async function DELETE(request, { params }) {
  try {
    const token = getToken(request);
    if (!await verifyToken(token)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    await Video.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
