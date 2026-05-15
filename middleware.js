import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  const token = request.cookies.get("admin_token")?.value;

  if (request.nextUrl.pathname.startsWith("/admin/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch (err) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};
