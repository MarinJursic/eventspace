import { IEnum } from "@/lib/database/schemas/enum";
import { API_CONFIG } from "@/lib/api/config";

export default async function getEnums(): Promise<Array<IEnum>> {
    const response: Response = await fetch(API_CONFIG.getApiRoute({ endpoint: "enums" }));
    const data: Array<IEnum> = await response.json();
    return data;
}