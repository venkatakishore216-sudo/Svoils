import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

const ADMINS = [
  {
    username: "rajashekar",
    // password: 9573770967
    hash: "$2a$10$jkIexuSx9rCTgxOrjdKmuu.TxqXeZ89wXpOVa9/VXR0Jb9MUWwv4G",
  },
  {
    username: "parameswari",
    // password: 6302036173
    hash: "$2a$10$vvj08vg6jMR.zbR4/BYnKuz5ephv3TZb.jIQhFwyYycEvilkCqduq",
  },
];

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    const admin = ADMINS.find((a) => a.username === username);
    if (!admin) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const valid = await bcrypt.compare(password, admin.hash);
    if (!valid) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const token = await signToken({ username });
    const response = NextResponse.json({ success: true });
    response.cookies.set("sv_token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 8,
      path: "/",
      sameSite: "lax",
    });
    return response;
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
