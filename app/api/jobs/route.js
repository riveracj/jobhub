import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const session = await getSession();

  const where = { status: "active" };

  if (searchParams.get("mine") === "true" && session) {
    where.employerId = session.id;
    delete where.status;
  }

  if (searchParams.get("search")) {
    where.OR = [
      { title: { contains: searchParams.get("search") } },
      { description: { contains: searchParams.get("search") } },
      { tags: { contains: searchParams.get("search") } },
      { location: { contains: searchParams.get("search") } },
    ];
  }

  const jobs = await prisma.job.findMany({
    where,
    include: {
      employer: { select: { id: true, name: true, company: true, avatar: true, location: true } },
      _count: { select: { applications: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return Response.json({ jobs });
}

export async function POST(req) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });
  if (session.role !== "employer") return Response.json({ error: "Only employers can post jobs" }, { status: 403 });

  const { title, description, location, tags, type, salary, lat, lng, radius } = await req.json();

  if (!title || !description) {
    return Response.json({ error: "Title and description are required" }, { status: 400 });
  }

  const job = await prisma.job.create({
    data: {
      title,
      description,
      location,
      tags,
      type: type || "full-time",
      salary,
      lat: lat ? parseFloat(lat) : null,
      lng: lng ? parseFloat(lng) : null,
      radius: radius ? parseInt(radius) : null,
      employerId: session.id,
    },
    include: {
      _count: { select: { applications: true } },
    },
  });

  return Response.json({ job }, { status: 201 });
}
