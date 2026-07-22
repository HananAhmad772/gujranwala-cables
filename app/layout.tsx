import type { Metadata } from "next";
import { AppProviders } from "@/components/providers/app-providers";
import { SiteSettingsProvider } from "@/components/providers/site-settings-provider";
import { fetchSiteSettings } from "@/services/site-settings.service";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let settings = null;

  try {
    settings = await fetchSiteSettings();
  } catch {
    // If the database is unavailable or settings do not exist yet,
    // fall back to hardcoded defaults in the client components.
  }

  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <SiteSettingsProvider initialSettings={settings}>
          <AppProviders>{children}</AppProviders>
        </SiteSettingsProvider>
      </body>
    </html>
  );
}
