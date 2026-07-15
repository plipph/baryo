import { redirect } from "next/navigation";
import { getAccountContext } from "@/lib/account-context";

export default async function AccountPage() {
  const { user, business } = await getAccountContext();

  if (!user) {
    redirect("/login");
  }

  redirect(business ? "/dashboard" : "/profile");
}
