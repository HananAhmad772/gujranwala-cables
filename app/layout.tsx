import type { Metadata } from "next";
import { AppProviders } from "@/components/providers/app-providers";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://gujranwalaelectric.com"),
  title: {
    default: "Gujranwala Electric Wires",
    template: "%s",
  },
  description: "Premium electrical wires and cable manufacturing website for Gujranwala Electric Wires.",
  openGraph: {
    title: "Gujranwala Electric Wires",
    description: "Premium electrical wires, cables, brands, manufacturing quality, and project support.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
