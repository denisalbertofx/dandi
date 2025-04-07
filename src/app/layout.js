import { Geist, Geist_Mono } from "next/font/google";
import { NotificationProvider } from '@/shared/hooks/useNotification';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-900 to-black`}
      >
        <NotificationProvider>
          <div className="fixed inset-0 pointer-events-none z-0">
            <div className="absolute inset-0 grid-background opacity-[0.03]" />
            <div className="absolute top-0 -left-48 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-[128px] opacity-20" />
            <div className="absolute top-0 -right-48 w-96 h-96 bg-indigo-500/30 rounded-full mix-blend-multiply filter blur-[128px] opacity-20" />
          </div>
          <div className="relative z-10">
            {children}
          </div>
        </NotificationProvider>
      </body>
    </html>
  );
}
