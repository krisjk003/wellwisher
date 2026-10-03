import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wellwisher — your life, leveled up",
  description: "A calm, local-first life RPG for making progress visible."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
