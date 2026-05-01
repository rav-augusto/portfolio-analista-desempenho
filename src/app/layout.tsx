import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Augusto Nunes | Analista de Desempenho - Olhar da Base",
  description: "Analista de Desempenho de Futebol especializado em categorias de base. Formacao CBF.",
  keywords: ["analista de desempenho", "futebol", "categorias de base", "CBF", "analise tatica"],
  authors: [{ name: "Augusto Nunes" }],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
