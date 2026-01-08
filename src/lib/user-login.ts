import { redirect } from "next/navigation";
import { getSession } from "./session";


export async function UserLogin(userId: string, tId: string, brand : string, redirectUrl?: string) {
  const session = await getSession();
  session.id = userId;
  session.tId = tId;
  session.brand = brand;
  await session.save();

  if (redirectUrl) {
    return redirect(redirectUrl);
  }
}
