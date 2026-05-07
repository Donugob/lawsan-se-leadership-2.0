import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { isRateLimited } from "@/lib/rate-limit";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "anonymous";
    
    // Limit: 5 registrations per hour per IP
    if (isRateLimited(`reg_${ip}`, 5, 60 * 60 * 1000)) {
      return NextResponse.json({ 
        success: false, 
        error: "Too many registration attempts. Please try again later." 
      }, { status: 429 });
    }

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
    const regId = existing?.regId || `LLC-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

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
