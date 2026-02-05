import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { CompareProvider } from "@/context/CompareContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CompareBar } from "@/components/features/CompareBar";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Terry Town RV | World's Largest Indoor RV Showroom",
  description:
    "Shop the world's largest indoor RV showroom. Browse travel trailers, fifth wheels, motorhomes, and more from top brands.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="font-sans flex flex-col min-h-screen">
        <QueryProvider>
          <FavoritesProvider>
            <CompareProvider>
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
              <CompareBar />
            </CompareProvider>
          </FavoritesProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
