// pages/_app.tsx
import type { AppProps } from "next/app";
import { Poppins } from "next/font/google";
import { createGlobalStyle } from "styled-components";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const GlobalStyle = createGlobalStyle`
  body {
    font-family: var(--font-poppins), sans-serif;
  }
`;

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={poppins.className}>
      <GlobalStyle />
      <Component {...pageProps} />
    </main>
  );
}
