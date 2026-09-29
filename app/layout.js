import { Geist } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/providers/ThemeProvider";

const geist = Geist({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body className={geist.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}