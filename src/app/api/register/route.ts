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

    // Create or update delegate (incase they try again)
    const delegate = await prisma.delegate.upsert({
      where: { email },
      update: {
        firstName, lastName, phone, isStudent, isLawStudent, isSouthEast,
        university, level, profession, organization,
        status: "pending"
      },
      create: {
        firstName, lastName, email, phone, isStudent, isLawStudent, isSouthEast,
        university, level, profession, organization,
        status: "pending"
      }
    });

    return NextResponse.json({ success: true, delegateId: delegate.id });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ success: false, error: "Failed to save registration" }, { status: 500 });
  }
}
