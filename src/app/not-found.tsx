import { routing } from "@/i18n/routing";

const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
const home = `${base}/${routing.defaultLocale}/`;

// Rendered to out/404.html. GitHub Pages serves it for unknown paths.
export default function NotFound() {
  return (
    <html lang={routing.defaultLocale}>
      <body
        style={{
          background: "#0d0b0a",
          color: "#efe8db",
          fontFamily: "system-ui, sans-serif",
          display: "flex",
          minHeight: "100vh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          margin: 0,
        }}
      >
        <h1 style={{ fontSize: "3rem", margin: 0, color: "#f2681c" }}>404</h1>
        <p>הדף לא נמצא · Page not found · Страница не найдена</p>
        <a href={home} style={{ color: "#f2681c" }}>
          → David Motorcycles
        </a>
      </body>
    </html>
  );
}
