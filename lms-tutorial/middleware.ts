import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);
const publicRoutes = ["/test", "/test1", "/api/webhook"]; // Gộp tất cả public routes

export default clerkMiddleware(async (auth, request) => {
  if (
    !isPublicRoute(request) &&
    !publicRoutes.some((route) => request.url?.includes(route))
  ) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
