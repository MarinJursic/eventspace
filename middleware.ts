// middleware.ts
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

// --- Configuration ---
const LOGIN_PATH = "/"; // Redirect to homepage if unauthorized as requested
const COMPLETE_PROFILE_PATH = "/complete-profile";
const UNAUTHORIZED_REDIRECT_PATH = "/"; // Redirect to homepage for insufficient role

// Define path prefixes or exact paths
const publicPaths = [
  "/",
  "/venues", // Public listing
  "/services", // Public listing
  // Add other specific public pages like /about, /contact, etc. if they exist
];
const publicApiPrefixes = [
  "/api/webhooks", // Stripe webhook must be public
  "/api/v1/enums", // Assuming enums are public
  // Add prefixes for public GET requests if needed (e.g., GET /api/v1/venues)
  // Be careful not to expose sensitive data APIs here
];
const authPaths = ["/api/auth"]; // NextAuth internal paths

const adminPaths = ["/admin", "/api/admin"]; // Includes sub-paths like /admin/users
const vendorPaths = ["/vendor", "/api/vendor"]; // Includes sub-paths like /vendor/bookings
const authenticatedUserPaths = [
  "/account", // User dashboard
  "/api/v1/checkout_sessions", // Creating checkout needs auth
  "/api/v1/upload", // Uploading needs auth
  "/api/v1/bookings", // Creating/viewing own bookings needs auth
  "/api/v1/reviews", // Creating/managing reviews needs auth (adjust if GET is public)
  "/api/v1/accounts", // Managing account info needs auth
  "/api/v1/transactions", // Viewing transactions needs auth
  // Add other specific API routes or pages requiring login
];

// --- Middleware Logic ---
export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  // --- Allow Public Paths & Assets ---
  // Check for static assets first (more specific)
  const isPublicAsset =
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon.ico") ||
    /\.(.*)$/.test(pathname); // Basic check for file extensions

  // Check if it's an explicitly public route or API prefix
  const isPublicRoute =
    publicPaths.some(
      (p) => pathname === p || (p !== "/" && pathname.startsWith(p))
    ) || publicApiPrefixes.some((p) => pathname.startsWith(p));

  // Check if it's an internal NextAuth route
  const isAuthRoute = authPaths.some((p) => pathname.startsWith(p));

  if (isPublicAsset || isPublicRoute || isAuthRoute) {
    // console.log(`Middleware: Allowing public/asset/auth path: ${pathname}`);
    return NextResponse.next();
  }

  // --- Authentication Check ---
  // If it's not public/auth and there's no token, redirect
  if (!token) {
    console.log(
      `Middleware: No token, redirecting from ${pathname} to ${LOGIN_PATH}`
    );
    return NextResponse.redirect(new URL(LOGIN_PATH, req.url));
  }

  // --- Profile Completion Check ---
  const userRole = token.role as string | undefined;

  if (!userRole) {
    // User is logged in but has no role
    if (pathname.startsWith(COMPLETE_PROFILE_PATH)) {
      // Allow access to the complete profile page
      // console.log(`Middleware: Allowing access to ${COMPLETE_PROFILE_PATH} for role completion.`);
      return NextResponse.next();
    } else {
      // Redirect any other request to the complete profile page
      console.log(
        `Middleware: Role missing, redirecting from ${pathname} to ${COMPLETE_PROFILE_PATH}`
      );
      return NextResponse.redirect(new URL(COMPLETE_PROFILE_PATH, req.url));
    }
  }

  // --- Role Exists: Prevent access to /complete-profile ---
  if (pathname.startsWith(COMPLETE_PROFILE_PATH)) {
    console.log(
      `Middleware: Role exists, redirecting from ${COMPLETE_PROFILE_PATH} to /`
    );
    return NextResponse.redirect(new URL("/", req.url));
  }

  // --- Role-Based Access Control ---

  // Admin Routes
  if (adminPaths.some((p) => pathname.startsWith(p))) {
    if (userRole !== "admin") {
      console.log(
        `Middleware: Forbidden access to ADMIN path ${pathname} for role ${userRole}. Redirecting.`
      );
      return NextResponse.redirect(
        new URL(UNAUTHORIZED_REDIRECT_PATH, req.url)
      );
    }
    // console.log(`Middleware: Allowing ADMIN access to ${pathname} for role ${userRole}.`);
    return NextResponse.next(); // Allow admin
  }

  // Vendor Routes
  if (vendorPaths.some((p) => pathname.startsWith(p))) {
    if (!["admin", "vendor"].includes(userRole)) {
      console.log(
        `Middleware: Forbidden access to VENDOR path ${pathname} for role ${userRole}. Redirecting.`
      );
      return NextResponse.redirect(
        new URL(UNAUTHORIZED_REDIRECT_PATH, req.url)
      );
    }
    // console.log(`Middleware: Allowing VENDOR/ADMIN access to ${pathname} for role ${userRole}.`);
    return NextResponse.next(); // Allow vendor or admin
  }

  // General Authenticated User Routes
  if (authenticatedUserPaths.some((p) => pathname.startsWith(p))) {
    // User is authenticated and has a role, allow access
    // console.log(`Middleware: Allowing AUTHENTICATED access to ${pathname} for role ${userRole}.`);
    return NextResponse.next();
  }

  // --- Default Deny ---
  // If the path didn't match any allowed public, auth, or role-specific rules,
  // redirect to home as a safe default.
  console.log(
    `Middleware: Path ${pathname} not explicitly allowed for role ${userRole}. Redirecting.`
  );
  return NextResponse.redirect(new URL(LOGIN_PATH, req.url));
}

// --- Matcher Configuration (Simplified) ---
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Files with extensions (e.g., .png, .jpg, .css)
     * This aims to run the middleware on pages and API routes.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
