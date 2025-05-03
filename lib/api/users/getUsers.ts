import { IUser } from "@/lib/database/schemas/user";
import { API_CONFIG } from "@/lib/config/apiConfig";

export default async function getUsers(): Promise<Array<IUser>> {
  const response: Response = await fetch(
    API_CONFIG.getApiRoute({ endpoint: "users" })
  );
  const data: Array<IUser> = await response.json();
  return data;
}
