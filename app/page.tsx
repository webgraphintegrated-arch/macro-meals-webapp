"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [showPopup, setShowPopup] = useState(true);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#eef7f1] px-6 py-8">
      {/* Bubble Gradient Background */}
      <div className="absolute left-[-120px] top-[-120px] h-96 w-96 rounded-full bg-[#75a62f]/25 blur-3xl" />
      <div className="absolute right-[-120px] top-20 h-96 w-96 rounded-full bg-[#060d57]/20 blur-3xl" />
      <div className="absolute bottom-[-140px] left-1/3 h-[500px] w-[500px] rounded-full bg-[#75a62f]/20 blur-3xl" />

      {/* Coming Soon Popup */}
      {showPopup && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm rounded-3xl bg-white p-5 shadow-2xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase text-[#75a62f]">
                New Features Coming Soon
              </p>

              <p className="mt-3 text-sm font-bold leading-relaxed text-gray-700">
                Customer accounts, suggested meals based on fitness goals,
                loyalty rewards, saved meal plans and more are on the way.
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

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl flex-col justify-between">
        {/* Top Login Buttons */}
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

        {/* Main Card */}
        <section className="flex flex-1 items-center justify-center py-10">
          <div className="w-full rounded-[3rem] bg-white/85 p-10 text-center shadow-2xl backdrop-blur">
            {/* Logo */}
            <Image
              src="/logo.png"
              alt="Macro Meals On Wheels"
              width={220}
              height={220}
              className="mx-auto mb-6"
            />

            {/* Heading */}
            <h1 className="text-6xl font-black leading-none text-[#060d57] md:text-8xl">
              FUEL YOUR
              <br />
              BODY
            </h1>

            {/* Subheading */}
            <p className="mt-6 text-2xl font-bold text-[#75a62f]">
              Healthy Meals Made Simple
            </p>

            {/* Description */}
            <p className="mx-auto mt-5 max-w-2xl text-base font-semibold leading-relaxed text-gray-700">
              Order fresh daily meals or request weekly packed meals with 7 or
              more meals prepared ahead for pickup.
            </p>

            {/* Cards */}
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              <a
                href="/menu"
                className="rounded-3xl bg-[#f3f3f3] p-8 shadow-lg transition hover:scale-[1.02]"
              >
                <p className="text-sm font-black uppercase tracking-wide text-[#75a62f]">
                  Daily Ordering
                </p>

                <p className="mt-3 text-4xl font-black text-[#060d57]">
                  Order Now
                </p>

                <p className="mt-3 text-sm font-semibold text-gray-600">
                  Browse the full menu and place your order instantly.
                </p>
              </a>

              <a
                href="/request-packed-meals"
                className="rounded-3xl bg-[#060d57] p-8 text-white shadow-lg transition hover:scale-[1.02]"
              >
                <p className="text-sm font-black uppercase tracking-wide text-white/70">
                  Weekly Meal Prep
                </p>

                <p className="mt-3 text-4xl font-black">
                  Packed Meals
                </p>

                <p className="mt-3 text-sm font-semibold text-white/80">
                  Request 7+ meals in advance and save on weekly prep.
                </p>
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
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