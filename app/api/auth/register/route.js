import { prisma } from "@/lib/prisma";
import { hashPassword, createToken, setSession } from "@/lib/auth";

export async function POST(req) {
  try {
    const { email, name, password, role, company, phone } = await req.json();

    if (!email || !name || !password) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (password.length < 6) {
      return Response.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return Response.json({ error: "Email already registered" }, { status: 409 });
    }

    const hashed = await hashPassword(password);

    const user = await prisma.user.create({
      data: { email, name, password: hashed, role: role || "seeker", company, phone },
    });

    const token = await createToken({ id: user.id, email: user.email, role: user.role });
    await setSession(token);

    return Response.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (error) {
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
