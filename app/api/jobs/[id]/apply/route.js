import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req, { params }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });
  if (session.role !== "seeker") return Response.json({ error: "Only job seekers can apply" }, { status: 403 });

  const job = await prisma.job.findUnique({ where: { id } });
  if (!job) return Response.json({ error: "Job not found" }, { status: 404 });
  if (job.status !== "active") return Response.json({ error: "Job is not active" }, { status: 400 });

  const existing = await prisma.application.findUnique({
    where: { seekerId_jobId: { seekerId: session.id, jobId: id } },
  });
  if (existing) return Response.json({ error: "Already applied" }, { status: 409 });

  const { coverNote } = await req.json();

  const application = await prisma.application.create({
    data: { seekerId: session.id, jobId: id, coverNote },
  });

  return Response.json({ application }, { status: 201 });
}
