import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

const publicPaths = ["/login", "/register", "/jobs", "/api/auth/login", "/api/auth/register", "/api/jobs"];

const protectedPrefixes = ["/dashboard", "/employer", "/account"];

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  if (publicPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  if (protectedPrefixes.some((p) => pathname.startsWith(p))) {
    const token = req.cookies.get("session")?.value;
    if (!token) {
      if (pathname.startsWith("/api/")) {
        return Response.json({ error: "Not authenticated" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/login", req.url));
    }
    const payload = await verifyToken(token);
    if (!payload) {
      if (pathname.startsWith("/api/")) {
        return Response.json({ error: "Invalid session" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (pathname.startsWith("/employer") && payload.role !== "employer") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/dashboard/:path*", "/employer/:path*", "/account/:path*", "/jobs/:path*"],
};
