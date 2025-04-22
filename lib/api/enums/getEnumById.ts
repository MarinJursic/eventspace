import { IEnum } from "@/lib/database/schemas/enum";
import { API_CONFIG } from "@/lib/api/config";

export default async function getEnumById(enumId: string): Promise<IEnum> {
    const response: Response = await fetch(
        API_CONFIG.getApiRouteWithIdEndpoint({ endpoint: "enums", id: enumId })
    );
    const data: IEnum = await response.json();
    return data;
}