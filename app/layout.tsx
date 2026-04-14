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

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://utopia.kr";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Utopia — 익명 고민상담 커뮤니티",
    template: "%s | Utopia",
  },
  description: "당신의 고민을 익명으로 자유롭게 나눠보세요. 따뜻한 위로와 진심 어린 조언을 받을 수 있어요.",
  keywords: ["고민상담", "익명 커뮤니티", "익명 게시판", "고민", "상담", "위로", "조언", "utopia"],
  authors: [{ name: "Utopia" }],
  creator: "Utopia",
  openGraph: {
    title: "Utopia — 익명 고민상담 커뮤니티",
    description: "당신의 고민을 익명으로 자유롭게 나눠보세요.",
    url: APP_URL,
    siteName: "Utopia",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Utopia — 익명 고민상담 커뮤니티",
    description: "당신의 고민을 익명으로 자유롭게 나눠보세요.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1 },
  },
  alternates: { canonical: APP_URL },
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
