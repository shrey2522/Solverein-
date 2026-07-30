import type { Metadata } from "next";
import "./globals.css";
import "./motion.css";
import "./tuning.css";

export const metadata: Metadata = { title: "Solverein — Care, connected", description: "Healthcare data made human." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
