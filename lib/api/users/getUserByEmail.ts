import { IUser } from "@/lib/database/schemas/user";
import { API_CONFIG } from "@/lib/api/config";

export default async function getUserByEmail(email: string): Promise<Array<IUser>> {
    const response: Response = await fetch(
        API_CONFIG.getApiRouteWithSearchParams({ endpoint: "users", searchParam: `email=${email}` })
    );
    const data: Array<IUser> = await response.json();
    return data;
}