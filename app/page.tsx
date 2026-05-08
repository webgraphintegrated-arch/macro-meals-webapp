"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [showPopup, setShowPopup] = useState(true);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#eef7f1] px-6 py-8">
      <div className="absolute left-[-80px] top-[-80px] h-72 w-72 rounded-full bg-[#75a62f]/30 blur-3xl" />
      <div className="absolute right-[-90px] top-24 h-80 w-80 rounded-full bg-[#060d57]/20 blur-3xl" />
      <div className="absolute bottom-[-120px] left-1/3 h-96 w-96 rounded-full bg-[#75a62f]/20 blur-3xl" />

      {showPopup && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm rounded-3xl bg-white p-5 shadow-2xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase text-[#75a62f]">
                New Features Coming Soon
              </p>
              <p className="mt-2 text-sm font-bold text-gray-700">
                Customer accounts, saved meal plans, loyalty rewards and more are on the way.
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

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col justify-between">
        <div className="flex justify-end gap-3">
          <a
            href="/admin/login"
            className="rounded-2xl border-2 border-[#060d57] bg-white/80 px-5 py-3 text-sm font-black text-[#060d57] shadow-lg backdrop-blur transition hover:bg-[#060d57] hover:text-white"
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

        <section className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-2">
          <div className="rounded-[2.5rem] bg-white/85 p-8 text-center shadow-2xl backdrop-blur lg:text-left">
            <Image
              src="/logo.png"
              alt="Macro Meals On Wheels"
              width={170}
              height={170}
              className="mx-auto mb-6 lg:mx-0"
            />

            <h1 className="text-6xl font-black leading-none text-[#060d57] md:text-8xl">
              FUEL YOUR
              <br />
              BODY
            </h1>

            <p className="mt-6 text-2xl font-bold text-[#75a62f]">
              Healthy Meals Made Simple
            </p>

            <p className="mx-auto mt-4 max-w-xl text-base font-semibold leading-relaxed text-gray-700 lg:mx-0">
              Order fresh daily meals or request weekly packed meals with 7 or more meals prepared ahead for pickup.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <a
                href="/menu"
                className="rounded-2xl bg-[#75a62f] px-8 py-4 text-center text-base font-black text-white shadow-xl transition hover:scale-105"
              >
                Order Now
              </a>

              <a
                href="/request-packed-meals"
                className="rounded-2xl border-2 border-[#060d57] bg-white px-8 py-4 text-center text-base font-black text-[#060d57] shadow-xl transition hover:scale-105 hover:bg-[#060d57] hover:text-white"
              >
                Weekly Packed Meals
              </a>
            </div>
          </div>

          <div className="rounded-[2.5rem] bg-white/85 p-8 text-center shadow-2xl backdrop-blur">
            <Image
              src="/logo.png"
              alt="Macro Meals On Wheels"
              width={230}
              height={230}
              className="mx-auto mb-6"
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <a
                href="/menu"
                className="rounded-3xl bg-[#f3f3f3] p-6 shadow-lg transition hover:scale-105"
              >
                <p className="text-sm font-black uppercase text-[#75a62f]">
                  Daily
                </p>
                <p className="mt-2 text-3xl font-black text-[#060d57]">
                  Meals
                </p>
                <p className="mt-2 text-sm font-semibold text-gray-600">
                  Order from the regular menu.
                </p>
              </a>

              <a
                href="/request-packed-meals"
                className="rounded-3xl bg-[#060d57] p-6 text-white shadow-lg transition hover:scale-105"
              >
                <p className="text-sm font-black uppercase text-white/70">
                  Weekly
                </p>
                <p className="mt-2 text-3xl font-black">
                  Prep
                </p>
                <p className="mt-2 text-sm font-semibold text-white/80">
                  Request 7+ meals in advance.
                </p>
              </a>
            </div>
          </div>
        </section>

        <footer className="border-t border-white/60 py-6 text-center">
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