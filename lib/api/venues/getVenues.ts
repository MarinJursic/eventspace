import { IVenue } from "@/lib/database/schemas/venue";
import { API_CONFIG } from "@/lib/config/apiConfig";

export default async function getVenues(): Promise<Array<IVenue>> {
  const response: Response = await fetch(
    API_CONFIG.getApiRoute({ endpoint: "venues" })
  );
  const data: Array<IVenue> = await response.json();
  return data;
}
