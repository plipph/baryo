import { ReactNode } from "react";

import { AccountShell } from "@/components/layout/account-shell";

export default function FavoritesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AccountShell>{children}</AccountShell>;
}
