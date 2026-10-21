import { clerkMiddleware } from "@clerk/nextjs/server";

const protectedPaths = ["/workspace", "/projects"];

export default clerkMiddleware(
  async (auth, request) => {
    const pathname = request.nextUrl.pathname;
    const isProtectedRoute = protectedPaths.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`),
    );

    if (isProtectedRoute) {
      await auth.protect();
    }
  },
  {
    signInUrl: "/sign-in",
    signUpUrl: "/sign-up",
  },
);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for Clerk's auto-proxy path
    '/__clerk/:path*',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
