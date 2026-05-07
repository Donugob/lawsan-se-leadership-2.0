import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const regId = searchParams.get("regId");
    const email = searchParams.get("email");

    if (!regId || !email) {
      return NextResponse.json({ error: "Registration ID and Email are required" }, { status: 400 });
    }

    const delegate = await prisma.delegate.findUnique({
      where: { regId },
      select: { status: true, email: true }
    });

    if (!delegate || delegate.email.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json({ error: "Delegate not found or verification failed" }, { status: 404 });
    }

    return NextResponse.json({ status: delegate.status });
  } catch (error) {
    console.error("Status check error:", error);
    return NextResponse.json({ error: "Failed to check status" }, { status: 500 });
  }
}
