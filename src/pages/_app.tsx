import "../styles/globals.css";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      {/* Handy quer: Browser lassen sich nicht auf Hochkant festlegen, also Hinweis drüberlegen.
          Sichtbar nur per CSS (.rotate-hint in globals.css), daher auf allen Bildschirmen. */}
      <div className="rotate-hint" role="alert">
        <svg
          width="56"
          height="56"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="7" y="2" width="10" height="20" rx="2" />
          <line x1="11" y1="18" x2="13" y2="18" />
        </svg>
        <p>Please turn your phone upright.</p>
      </div>
    </>
  );
}

export default MyApp;
