"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    /* OWNER LOGIN */
    if (password === "owner2026") {
      localStorage.setItem("macroMealsRole", "owner");
      window.location.href = "/admin/orders";
      return;
    }

    /* STAFF LOGIN */
    if (password === "staff2026") {
      localStorage.setItem("macroMealsRole", "staff");
      window.location.href = "/admin/staff";
      return;
    }

    alert("Incorrect password.");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f3f3f3] px-4">
      <section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">

        {/* LOGO */}

        <img
          src="/logo.png"
          alt="Macro Meals"
          className="mx-auto mb-6 w-32"
        />

        {/* TITLE */}

        <h1 className="text-center text-4xl font-black text-[#060d57]">
          Admin Login
        </h1>

        <p className="mt-3 text-center font-semibold text-gray-600">
          Owner and staff access portal.
        </p>

        {/* FORM */}

        <form
          onSubmit={handleLogin}
          className="mt-8 space-y-5"
        >
          {/* PASSWORD */}

          <div>
            <label className="mb-2 block text-sm font-black text-[#060d57]">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 text-base font-semibold text-[#060d57] placeholder:text-gray-500 outline-none focus:border-[#75a62f]"
            />
          </div>

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="w-full rounded-2xl bg-[#060d57] py-4 text-base font-black text-white transition hover:opacity-90"
          >
            Login
          </button>
        </form>

        {/* LOGIN INFO */}

        <div className="mt-6 rounded-2xl bg-[#f3f3f3] p-4 text-sm font-semibold text-gray-600">
          <p>Owner dashboard access available.</p>
          <p className="mt-1">Staff dashboard access available.</p>
        </div>
      </section>
    </main>
  );
}