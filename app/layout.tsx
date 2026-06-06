import "./globals.css";

export const metadata = {
  title: "Biblioteca",
  description: "Sistema de biblioteca con Next.js, Prisma y Supabase",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
