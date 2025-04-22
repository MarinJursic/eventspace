export type RouteEndpoint =
    | "booking-confirmation"
    | "bookings"
    | "favorites"
    | "reviews"
    | "settings"
    | "approvals"
    | "reports"
    | "services"
    | "users"
    | "venues"
    | "create-service"
    | "create-venue"
    | "earnings"
    | "messages"
    | "profile"
    ;

export interface Route {
    value: string;
    endpoints: ReadonlyArray<RouteEndpoint>;
}