import type { Metadata, Viewport } from "next";
import { SITE_URL } from "@/lib/site";
import "@/styles/globals.css";

export const viewport: Viewport = { themeColor: "#0d0b0a" };

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "David Motorcycles — Denimotoparts",
  description: "Adventure-riding gear & parts for motorcycles and scooters.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
