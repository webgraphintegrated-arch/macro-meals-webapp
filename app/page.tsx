"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [showPopup, setShowPopup] = useState(true);

  return (
    <main className="relative min-h-screen overflow-hidden px-5 py-6">
  {/* Background Image */}
  <div className="absolute inset-0">
    <Image
      src="/background.jpg"
      alt="Background"
      fill
      priority
      className="object-cover"
    />

    {/* Dark/soft overlay */}
    <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px]" />
  </div>

      {showPopup && (
        <div className="fixed bottom-5 right-5 z-50 max-w-xs rounded-2xl bg-white/95 p-4 shadow-2xl backdrop-blur">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase text-[#75a62f]">
                Coming Soon
              </p>
              <p className="mt-1 text-sm font-bold text-gray-700">
                Customer accounts and goal-based meal suggestions.
              </p>
            </div>

            <button
              onClick={() => setShowPopup(false)}
              className="rounded-full bg-[#f3f3f3] px-3 py-1 font-black text-[#060d57]"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-3xl flex-col justify-between">
        <div className="flex justify-end gap-2">
          <a
            href="/admin/login"
            className="rounded-xl border-2 border-[#060d57] bg-white/85 px-4 py-2 text-xs font-black text-[#060d57] shadow-md transition hover:bg-[#060d57] hover:text-white"
          >
            Staff Login
          </a>

          <a
            href="/admin/login"
            className="rounded-xl bg-[#060d57] px-4 py-2 text-xs font-black text-white shadow-md transition hover:opacity-90"
          >
            Owner Login
          </a>
        </div>

        <section className="flex flex-1 items-center justify-center py-6">
          <div className="w-full max-w-xl rounded-[2rem] bg-white/90 p-6 text-center shadow-2xl backdrop-blur md:p-8">
            <Image
  src="/logo.png"
  alt="Macro Meals On Wheels"
  width={170}
  height={170}
  className="mx-auto mb-5"
/>

            <h1 className="text-3xl font-black tracking-[-0.03em] text-[#060d57] sm:text-5xl md:text-6xl">
  FUEL YOUR BODY
</h1>

            <p className="mt-3 text-sm font-black uppercase tracking-wide text-[#75a62f]">
              Powered by Health Addictions
            </p>

            <p className="mt-3 text-lg font-bold text-[#75a62f]">
              Healthy Meals Made Simple
            </p>

            <p className="mx-auto mt-3 max-w-md text-sm font-semibold leading-relaxed text-gray-700">
              Order fresh daily meals or request 7+ packed meals prepared ahead
              for pickup.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <a
                href="/menu"
                className="rounded-2xl bg-[#75a62f] px-6 py-4 text-center text-lg font-black text-white shadow-lg transition hover:scale-[1.01]"
              >
                Order Now
              </a>

              <a
                href="/request-packed-meals"
                className="rounded-2xl bg-[#060d57] px-6 py-4 text-center text-lg font-black text-white shadow-lg transition hover:scale-[1.01]"
              >
                Weekly Packed Meals
              </a>
            </div>
          </div>
        </section>

        <footer className="border-t border-white/70 py-4 text-center">
          <p className="text-xs font-semibold text-gray-600">
            Designed &Developed by{" "}
            <a
              href="https://webgraphintegrated.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-black text-[#060d57] hover:text-[#75a62f]"
            >
              Webgraph Integrated
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}