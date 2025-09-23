// middleware.ts
import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";


export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public paths
  const privatePaths = ["/dashboard"];
  if (privatePaths.some((path) => pathname.startsWith(path))) {
    // Check JWT token from NextAuth
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/home";
      return NextResponse.redirect(url);
    }
  }
    
  return NextResponse.next();
}



export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
