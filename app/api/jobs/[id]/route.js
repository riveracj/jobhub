import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req, { params }) {
  const { id } = await params;

  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      employer: { select: { id: true, name: true, company: true, avatar: true, location: true } },
      _count: { select: { applications: true } },
    },
  });

  if (!job) return Response.json({ error: "Job not found" }, { status: 404 });

  return Response.json({ job });
}

export async function PATCH(req, { params }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const job = await prisma.job.findUnique({ where: { id } });
  if (!job) return Response.json({ error: "Job not found" }, { status: 404 });
  if (job.employerId !== session.id) return Response.json({ error: "Unauthorized" }, { status: 403 });

  const data = await req.json();
  const updated = await prisma.job.update({ where: { id }, data });

  return Response.json({ job: updated });
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const job = await prisma.job.findUnique({ where: { id } });
  if (!job) return Response.json({ error: "Job not found" }, { status: 404 });
  if (job.employerId !== session.id) return Response.json({ error: "Unauthorized" }, { status: 403 });

  await prisma.job.update({ where: { id }, data: { status: "deleted" } });

  return Response.json({ ok: true });
}
