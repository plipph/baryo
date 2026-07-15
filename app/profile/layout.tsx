import { ReactNode } from "react";

import { AccountShell } from "@/components/layout/account-shell";

export default function ProfileLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AccountShell>{children}</AccountShell>;
}
