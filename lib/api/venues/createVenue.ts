import { IVenue } from "@/lib/database/schemas/venue";
import { API_CONFIG } from "@/lib/api/config";

export default async function createVenue(venue: IVenue): Promise<boolean> {
    const response: Response = await fetch(
        API_CONFIG.getApiRoute({ endpoint: "venues" }),
        {
            method: "POST",
            body: JSON.stringify(venue)
        }
    );
    const responseParsed = await response.json();
    const data: boolean = responseParsed.status === 201;
    return data;
}