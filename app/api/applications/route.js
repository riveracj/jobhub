import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const { searchParams } = new URL(req.url);

  let where;

  if (session.role === "employer") {
    const jobId = searchParams.get("jobId");
    where = {
      job: { employerId: session.id },
      ...(jobId ? { jobId } : {}),
    };
  } else {
    where = { seekerId: session.id };
  }

  const applications = await prisma.application.findMany({
    where,
    include: {
      seeker: { select: { id: true, name: true, email: true, avatar: true, skills: true, phone: true } },
      job: { select: { id: true, title: true, employer: { select: { name: true, company: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  return Response.json({ applications });
}

export async function PATCH(req) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });
  if (session.role !== "employer") return Response.json({ error: "Unauthorized" }, { status: 403 });

  const { id, status } = await req.json();
  if (!["reviewed", "accepted", "rejected"].includes(status)) {
    return Response.json({ error: "Invalid status" }, { status: 400 });
  }

  const app = await prisma.application.findUnique({
    where: { id },
    include: { job: true },
  });
  if (!app) return Response.json({ error: "Application not found" }, { status: 404 });
  if (app.job.employerId !== session.id) return Response.json({ error: "Unauthorized" }, { status: 403 });

  const updated = await prisma.application.update({
    where: { id },
    data: { status },
  });

  return Response.json({ application: updated });
}
