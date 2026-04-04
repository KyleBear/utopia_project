import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Utopia — 고민상담 익명 커뮤니티",
  description: "당신의 고민을 익명으로 나눠보세요. 따뜻한 위로와 조언을 받을 수 있습니다.",
  keywords: ["고민상담", "익명", "커뮤니티", "utopia"],
  openGraph: {
    title: "Utopia",
    description: "익명 고민상담 커뮤니티",
    type: "website",
  },
};

// Runs before React hydration — sets the correct dark/light class immediately
// so there is no flash of wrong theme and no hydration mismatch on <html>.
const themeScript = `
(function(){
  try {
    var t = localStorage.getItem('theme') || 'system';
    var dark = t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', dark);
  } catch(e){}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
