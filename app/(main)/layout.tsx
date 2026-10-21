import type { ReactNode } from "react";

export default function MainLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <div className="mt-16 min-h-[calc(100vh-4rem)]">{children}</div>;
}

