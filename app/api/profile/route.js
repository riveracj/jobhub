import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function PATCH(req) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const data = await req.json();
  const allowed = ["name", "phone", "bio", "skills", "location", "lat", "lng", "company", "avatar", "resume"];

  const updateData = {};
  for (const key of allowed) {
    if (data[key] !== undefined) updateData[key] = data[key];
  }

  const user = await prisma.user.update({
    where: { id: session.id },
    data: updateData,
    select: { id: true, email: true, name: true, role: true, company: true, phone: true, avatar: true, bio: true, skills: true, location: true, lat: true, lng: true, verified: true, resume: true },
  });

  return Response.json({ user });
}
