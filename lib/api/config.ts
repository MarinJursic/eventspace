const baseApiRoute = "api";
const apiVersion = "v1";
type Endpoint = "accounts" | "bookings" | "info" | "services" | "transactions" | "users" | "venues" | "enums";
const protectedEndpoints: Array<Endpoint> = ["accounts", "transactions", "users"];

export const API_CONFIG = {
    BASE_API_ROUTE: baseApiRoute,
    API_VERSION: apiVersion,
    PROTECTED_ENDPOINTS: protectedEndpoints,
    getApiRoute: ({ endpoint }: { endpoint?: Endpoint }): string => {
        return `/${baseApiRoute}/${apiVersion}/${endpoint ?? "info"}`;
    },
    getApiRouteWithSearchParams: ({ endpoint, searchParam }: { endpoint?: Endpoint, searchParam: string }): string => {
        return `/${baseApiRoute}/${apiVersion}/${endpoint ?? "info"}${searchParam ? "?"+searchParam : ""}`;
    },
    getApiRouteWithIdEndpoint: ({ endpoint, id }: { endpoint?: Endpoint, id: string }): string => {
        return `/${baseApiRoute}/${apiVersion}/${endpoint ?? "info"}/${id}`;
    },
    getBaseApiRoute: (): string => {
        return `/${baseApiRoute}/${apiVersion}`;
    }
}