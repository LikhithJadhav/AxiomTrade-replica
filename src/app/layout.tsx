// src/app/layout.tsx
// src/app/layout.tsx  (server)
// import "./globals.css";
// import Providers from "../components/Providers";

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html><body><Providers>{children}</Providers></body></html>
//   );
// }

// src/app/layout.tsx (temporary dev layout using Tailwind CDN)
import "./globals.css"; // keep for when you fix Tailwind build
import React from "react";
import Providers from "../components/Providers"; // optional if you have Providers

export const metadata = {
  title: "Axiom Token Table (dev)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Tailwind CDN - dev only. Remove when PostCSS pipeline is fixed */}
        <script src="https://cdn.tailwindcss.com"></script>
        {/* Optional: quick config override
        <script
          dangerouslySetInnerHTML={{
            __html: `tailwind.config = { theme: { extend: { colors: { accent: '#5b6df6' } } } }`,
          }}
        /> */}
      </head>
      <body className="bg-neutral-900 text-white min-h-screen">
        <Providers>  <div className="w-full max-w-[1400px] mx-auto px-6 py-6">{children}</div></Providers>

      </body>
    </html>
  );
}

