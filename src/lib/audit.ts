import prisma from "./prisma";
import { getSession } from "./auth";
import { headers } from "next/headers";

export async function logAdminAction(action: string, details?: any, systemContext?: { adminId?: string, adminName: string }) {
  try {
    let adminId = systemContext?.adminId;
    let adminName: string = systemContext?.adminName || "";

    if (!adminName) {
      const session = await getSession();
      adminId = session?.admin.id;
      adminName = session?.admin.name || "SYSTEM";
    }

    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "unknown";

    await prisma.auditLog.create({
      data: {
        adminId,
        adminName,
        action,
        details: details || {},
        ip,
      },
    });
  } catch (error) {
    console.error("Failed to log admin action:", error);
  }
}
