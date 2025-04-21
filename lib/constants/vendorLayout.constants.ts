import { createServiceRoute, createVenueRoute } from "./route.constants";

export const excludeVenueSidebarOnRoute = [
    createVenueRoute.value,
    createServiceRoute.value,    
]

export function isExcludedFromVenueSidebar(value: string): boolean {
    for(const excludedRoute of excludeVenueSidebarOnRoute){
        if(excludedRoute === value) return true;
    }
    return false;
}