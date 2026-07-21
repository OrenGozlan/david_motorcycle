import { routing } from "@/i18n/routing";

// Static export has no middleware to redirect "/". This page is prerendered to
// out/index.html and bounces visitors to the default locale via meta-refresh + JS.
const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
const target = `${base}/${routing.defaultLocale}/`;

export default function RootRedirect() {
  return (
    <html lang={routing.defaultLocale}>
      <head>
        <meta httpEquiv="refresh" content={`0; url=${target}`} />
        <link rel="canonical" href={target} />
        <script dangerouslySetInnerHTML={{ __html: `location.replace(${JSON.stringify(target)})` }} />
      </head>
      <body style={{ background: "#0d0b0a", color: "#efe8db", fontFamily: "system-ui" }}>
        <a href={target} style={{ color: "#f2681c" }}>
          David Motorcycles →
        </a>
      </body>
    </html>
  );
}
