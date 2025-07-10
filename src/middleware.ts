import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Routes open to everyone
const publicRoutes = createRouteMatcher([
  "/contact(.*)",
  "/terms(.*)",
  "/privacy(.*)",
]);

// Routes only for unauthenticated users
const nonLoginRoutes = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

// Routes only for authenticated users
const protectedRoutes = createRouteMatcher(["/cover(.*)", "/profile(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // Public: accessible to everyone
  if (publicRoutes(req)) return;

  // Non-login pages (e.g., /sign-in) should redirect logged-in users to /cover
  if (nonLoginRoutes(req)) {
    if (userId) {
      return NextResponse.redirect(new URL("/cover", req.url));
    }
    return;
  }

  // Protected pages: must be logged in
  if (protectedRoutes(req)) {
    if (!userId) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
    return;
  }
  
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/(api|trpc)(.*)"],
};
