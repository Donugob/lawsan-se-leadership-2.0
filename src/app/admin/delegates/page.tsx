export const dynamic = 'force-dynamic';

import prisma from "@/lib/prisma";
import { Delegate } from "@prisma/client";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import DelegatesListClient from "@/components/admin/delegates/DelegatesListClient";

// Explicitly type the return as Promise<Delegate[]>
async function getDelegates(status?: string, type?: string): Promise<Delegate[]> {
  try {
    const where: any = {};
    
    if (status === 'pending') {
      where.status = 'pending';
    } else if (status === 'all') {
      // Show all
    } else {
      where.status = 'paid';
    }

    if (type === 'student') {
      where.isStudent = true;
    } else if (type === 'professional') {
      where.isStudent = false;
    }

    const delegates = await prisma.delegate.findMany({
      where,
      orderBy: { createdAt: "desc" }
    });
    return delegates;
  } catch (e) {
    return [];
  }
}

export default async function DelegatesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const params = await searchParams;
  const status = typeof params.status === 'string' ? params.status : 'paid';
  const type = typeof params.type === 'string' ? params.type : 'all';
  
  // We no longer query text search on the backend to allow instant client-side filtering
  const delegates = await getDelegates(status, type);

  return (
    <DelegatesListClient 
      initialDelegates={delegates} 
      status={status} 
      type={type} 
    />
  );
}
