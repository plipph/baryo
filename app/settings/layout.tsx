import { ReactNode } from "react";

import { AccountShell } from "@/components/layout/account-shell";

export default function SettingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AccountShell>{children}</AccountShell>;
}
