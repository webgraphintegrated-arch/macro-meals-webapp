"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [showPopup, setShowPopup] = useState(true);

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#dff4e4] via-[#eaf7ef] to-[#ccefd9] px-6 py-8">
      {/* Soft bubble texture */}
      <div className="absolute inset-0 opacity-60">
        <div className="absolute left-[-60px] top-[-70px] h-80 w-80 rounded-full bg-white/40" />
        <div className="absolute left-[12%] top-[18%] h-28 w-28 rounded-full bg-white/35" />
        <div className="absolute right-[10%] top-[12%] h-44 w-44 rounded-full bg-[#75a62f]/20" />
        <div className="absolute bottom-[12%] left-[8%] h-52 w-52 rounded-full bg-white/30" />
        <div className="absolute bottom-[-90px] right-[-70px] h-96 w-96 rounded-full bg-[#75a62f]/25" />
        <div className="absolute left-[40%] top-[8%] h-24 w-24 rounded-full bg-white/25" />
      </div>

      {/* Wave lines */}
      <div className="absolute bottom-0 left-0 h-56 w-full opacity-30">
        <div className="h-full w-[140%] -translate-x-20 rounded-[50%] border-t border-white" />
        <div className="-mt-48 h-full w-[140%] -translate-x-10 rounded-[50%] border-t border-white" />
        <div className="-mt-48 h-full w-[140%] rounded-[50%] border-t border-white" />
      </div>

      {showPopup && (
        <div className="fixed bottom-6 right-6 z-50 max-w-xs rounded-3xl bg-white/95 p-4 shadow-2xl backdrop-blur">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase text-[#75a62f]">
                Coming Soon
              </p>
              <p className="mt-2 text-sm font-bold text-gray-700">
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

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-4xl flex-col justify-between">
        <div className="flex justify-end gap-3">
          <a
            href="/admin/login"
            className="rounded-2xl border-2 border-[#060d57] bg-white/85 px-5 py-3 text-sm font-black text-[#060d57] shadow-lg backdrop-blur transition hover:bg-[#060d57] hover:text-white"
          >
            Staff Login
          </a>

          <a
            href="/admin/login"
            className="rounded-2xl bg-[#060d57] px-5 py-3 text-sm font-black text-white shadow-lg transition hover:opacity-90"
          >
            Owner Login
          </a>
        </div>

        <section className="flex flex-1 items-center justify-center py-8">
          <div className="w-full max-w-3xl rounded-[2rem] bg-white/88 p-7 text-center shadow-2xl backdrop-blur md:p-10">
            <Image
              src="/logo.png"
              alt="Macro Meals On Wheels"
              width={150}
              height={150}
              className="mx-auto mb-5"
            />

            <h1 className="text-5xl font-black leading-none text-[#060d57] md:text-7xl">
              FUEL YOUR
              <br />
              BODY
            </h1>

            <p className="mt-5 text-xl font-bold text-[#75a62f]">
              Healthy Meals Made Simple
            </p>

            <p className="mx-auto mt-4 max-w-xl text-sm font-semibold leading-relaxed text-gray-700 md:text-base">
              Order fresh daily meals or request 7+ packed meals prepared ahead
              for pickup.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <a
                href="/menu"
                className="rounded-3xl bg-[#75a62f] p-6 text-white shadow-lg transition hover:scale-[1.02]"
              >
                <p className="text-sm font-black uppercase text-white/80">
                  Daily Ordering
                </p>
                <p className="mt-2 text-3xl font-black">Order Now</p>
              </a>

              <a
                href="/request-packed-meals"
                className="rounded-3xl bg-[#060d57] p-6 text-white shadow-lg transition hover:scale-[1.02]"
              >
                <p className="text-sm font-black uppercase text-white/70">
                  Weekly Meal Prep
                </p>
                <p className="mt-2 text-3xl font-black">Packed Meals</p>
              </a>
            </div>
          </div>
        </section>

        <footer className="border-t border-white/70 py-5 text-center">
          <p className="text-sm font-semibold text-gray-600">
            Developed by{" "}
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