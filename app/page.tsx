import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f3f3f3] flex items-center justify-center px-6">
      <div className="text-center">

        {/* Logo */}
        <Image
          src="/logo.png"
          alt="Macro Meals On Wheels"
          width={260}
          height={260}
          className="mx-auto mb-6"
        />

        {/* Heading */}
        <h1 className="text-6xl md:text-8xl font-black text-[#060d57] leading-none">
          FUEL YOUR
          <br />
          BODY
        </h1>

        {/* Subheading */}
        <p className="mt-8 text-2xl font-bold text-[#75a62f]">
          Healthy Meals Made Simple
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
  <a
    href="/menu"
    className="rounded-2xl bg-[#75a62f] px-8 py-4 text-center text-base font-black text-white shadow-lg transition hover:opacity-90"
  >
    Order Now
  </a>

  <a
    href="/request-packed-meals"
    className="rounded-2xl border-2 border-[#060d57] bg-white px-8 py-4 text-center text-base font-black text-[#060d57] shadow-lg transition hover:bg-[#060d57] hover:text-white"
  >
    Weekly Packed Meals
  </a>
</div>

      </div>
    </main>
  );
}