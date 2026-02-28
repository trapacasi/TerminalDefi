import './globals.css'

export const metadata = {
  title: 'Pablo Terminal Pro',
  description: 'Análisis Web3 y Swing Trading',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="bg-[#F8FAFC]">{children}</body>
    </html>
  )
}
