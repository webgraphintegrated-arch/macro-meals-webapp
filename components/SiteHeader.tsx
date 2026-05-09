"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteHeader() {
  const pathname = usePathname();

  // Hide logo header on homepage
  if (pathname === "/") {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-3">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Macro Meals On Wheels"
            width={120}
            height={120}
            priority
            className="h-auto w-auto object-contain"
          />
        </Link>
      </div>
    </header>
  );
}