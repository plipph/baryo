import { redirect } from "next/navigation";
import { getAccountContext } from "@/lib/account-context";

export default async function AccountSettingsPage() {
  const { user } = await getAccountContext();

  if (!user) {
    redirect("/login");
  }

  redirect("/settings");
}
