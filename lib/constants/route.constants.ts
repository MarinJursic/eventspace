import { Route } from '@/types/route.types';

export const rootRoute: Route = {
    value: "/",
    endpoints: [],
} satisfies Route;

export const accountRoute: Route = {
    value: "/account",
    endpoints: ["booking-confirmation", "bookings", "favorites", "reviews", "settings"],
} satisfies Route;

export const adminRoute: Route = {
    value: "/admin",
    endpoints: ["approvals", "reports", "services", "settings", "users", "venues"],
} satisfies Route;

export const cartRoute: Route = {
    value: "/cart",
    endpoints: [],
} satisfies Route;

export const completeProfileRoute: Route = {
    value: "/complete-profile",
    endpoints: [],
} satisfies Route;

export const paymentRoute: Route = {
    value: "/payment",
    endpoints: [],
} satisfies Route;

export const servicesRoute: Route = {
    value: "/services",
    endpoints: [],
} satisfies Route;

export const thankYouRoute: Route = {
    value: "/thank-you",
    endpoints: [],
} satisfies Route;

export const vendorRoute: Route = {
    value: "/vendor",
    endpoints: ["bookings", "create-service", "create-venue", "earnings", "messages", "profile", "reviews", "venues"],
} satisfies Route;

export const venuesRoute: Route = {
    value: "/venues",
    endpoints: [],
} satisfies Route;

export const vendorVenueServiceRoute: Route = {
    value: `${vendorRoute.value}${venuesRoute.value}`,
    endpoints: ["create-venue", "create-service"]
} satisfies Route;

export const createVenueRoute: Route = {
    value: `${vendorVenueServiceRoute.value}/create-venue`,
    endpoints: [],
} satisfies Route;

export const createServiceRoute: Route = {
    value: `${vendorVenueServiceRoute.value}/create-service`,
    endpoints: [],
} satisfies Route;