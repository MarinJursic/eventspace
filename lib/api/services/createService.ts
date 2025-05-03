import { IService } from "@/lib/database/schemas/service";
import { API_CONFIG } from "@/lib/config/apiConfig";

export default async function createService(
  service: IService
): Promise<boolean> {
  const response: Response = await fetch(
    API_CONFIG.getApiRoute({ endpoint: "services" }),
    {
      method: "POST",
      body: JSON.stringify(service),
    }
  );
  const responseParsed = await response.json();
  const data: boolean = responseParsed.status === 201;
  return data;
}
