import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Video, Subscription } from "@/lib/models";
import { verifyToken, getToken } from "@/lib/auth";

async function sendPush(title, body, url) {
  try {
    const webpush = (await import("web-push")).default;
    webpush.setVapidDetails(
      "mailto:svoils@gmail.com",
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
    );
    const subs = await Subscription.find();
    const payload = JSON.stringify({ title, body, url, icon: "/icon-192.png" });
    for (const sub of subs) {
      try {
        await webpush.sendNotification({ endpoint: sub.endpoint, keys: sub.keys }, payload);
      } catch (err) {
        if (err.statusCode === 410 || err.statusCode === 404) {
          await Subscription.deleteOne({ endpoint: sub.endpoint });
        }
      }
    }
  } catch (err) {
    console.log("Push error:", err.message);
  }
}

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json(await Video.find().sort({ addedAt: -1 }));
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
    const video = await Video.create(body);

    // Auto notify all subscribers
    await sendPush(
      "New Video on SV Oils! 🌿",
      `${video.title} — Watch now!`,
      "/videos"
    );

    return NextResponse.json(video, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
