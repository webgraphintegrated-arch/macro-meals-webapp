import type { Metadata } from "next";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Macro Meals On Wheels",
  description: "Healthy Meals Made Simple",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>

        {/* Top Header */}
        <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-3">

            <Link href="/">
              <Image
                src="/logo.png"
                alt="Macro Meals On Wheels"
                width={130}
                height={130}
                priority
                className="h-auto w-auto object-contain"
              />
            </Link>

          </div>
        </header>

        {children}

      </body>
    </html>
  );
}