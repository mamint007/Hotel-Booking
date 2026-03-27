// pages/_app.tsx
import type { AppProps } from "next/app";
import { Poppins, Sarabun } from "next/font/google";
import "@/styles/globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const sarabun = Sarabun({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sarabun",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={`${poppins.variable} ${sarabun.variable}`}>
      <Component {...pageProps} />
    </main>
  );
}
