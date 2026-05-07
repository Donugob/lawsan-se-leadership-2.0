import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      firstName, lastName, email, phone, 
      isStudent, isLawStudent, isSouthEast, 
      university, level, profession, organization 
    } = body;

    // 1. Check if already paid
    const existing = await prisma.delegate.findUnique({ where: { email } });
    if (existing?.status === "paid") {
      return NextResponse.json({ 
        success: false, 
        error: "This email address is already registered.",
        code: "ALREADY_REGISTERED",
        regId: existing.regId
      }, { status: 400 });
    }

    // 2. Generate LLC Reg ID if not exists
    const regId = existing?.regId || `LLC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // 3. Create or update delegate
    const delegate = await prisma.delegate.upsert({
      where: { email },
      update: {
        firstName, lastName, phone, isStudent, isLawStudent, isSouthEast,
        university, level, profession, organization,
        regId,
        status: "pending"
      },
      create: {
        firstName, lastName, email, phone, isStudent, isLawStudent, isSouthEast,
        university, level, profession, organization,
        regId,
        status: "pending"
      }
    });

    return NextResponse.json({ 
      success: true, 
      delegateId: delegate.id,
      regId: delegate.regId 
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ success: false, error: "Failed to process registration" }, { status: 500 });
  }
}
