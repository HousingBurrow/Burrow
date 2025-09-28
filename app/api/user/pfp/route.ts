import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { put } from "@vercel/blob"; // if using Vercel Blob

// GET - fetch user's current pfp
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("id");
  if (!userId) return NextResponse.json({ error: "User ID required" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
  return NextResponse.json({ pfp: user?.pfp ?? null });
}

// POST - upload new profile picture
export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const userId = formData.get("userId") as string;

  if (!file || !userId) {
    return NextResponse.json({ error: "Missing file or userId" }, { status: 400 });
  }

  // Upload to Vercel Blob
  const blob = await put(`pfp/${userId}-${file.name}`, file, { access: "public" });

  // Save URL in DB
  const user = await prisma.user.update({
    where: { id: Number(userId) },
    data: { pfp: blob.url },
  });

  return NextResponse.json({ success: true, pfp: user.pfp });
}
