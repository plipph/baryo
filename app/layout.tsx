import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MyNegosyo Mindoro",
  description: "Discover Local. Support Mindoro.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full font-sans antialiased"
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">
  {children}
</body>
    </html>
  );
}
