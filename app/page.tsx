import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-gradient-to-br from-[#e8fff0] via-[#f3f3f3] to-[#d9f5ff] px-6 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col justify-between">
        {/* Top Admin Links */}
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

        {/* Hero */}
        <section className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <div className="mb-6 inline-flex rounded-full bg-white/80 px-5 py-3 shadow-lg backdrop-blur">
              <p className="text-sm font-black uppercase tracking-wide text-[#75a62f]">
                Macro Meals On Wheels
              </p>
            </div>

            <h1 className="text-6xl font-black leading-none text-[#060d57] md:text-8xl">
              FUEL YOUR
              <br />
              BODY
            </h1>

            <p className="mt-6 text-2xl font-bold text-[#75a62f]">
              Healthy Meals Made Simple
            </p>

            <p className="mx-auto mt-4 max-w-xl text-base font-semibold leading-relaxed text-gray-700 lg:mx-0">
              Order fresh daily meals or request weekly packed meals with 7 or more
              meals prepared ahead for pickup.
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

          {/* Card Visual */}
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -left-8 -top-8 h-40 w-40 rounded-full bg-[#75a62f]/30 blur-2xl" />
            <div className="absolute -bottom-8 -right-8 h-40 w-40 rounded-full bg-[#060d57]/20 blur-2xl" />

            <div className="relative rounded-[2.5rem] bg-white/85 p-8 text-center shadow-2xl backdrop-blur">
              <Image
                src="/logo.png"
                alt="Macro Meals On Wheels"
                width={260}
                height={260}
                className="mx-auto"
              />

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-3xl bg-[#f3f3f3] p-4">
                  <p className="text-sm font-black uppercase text-[#75a62f]">
                    Daily
                  </p>
                  <p className="mt-1 text-xl font-black text-[#060d57]">
                    Meals
                  </p>
                </div>

                <div className="rounded-3xl bg-[#060d57] p-4 text-white">
                  <p className="text-sm font-black uppercase text-white/70">
                    Weekly
                  </p>
                  <p className="mt-1 text-xl font-black">Prep</p>
                </div>
              </div>
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