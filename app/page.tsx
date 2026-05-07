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
        <div className="mt-12 flex flex-col sm:flex-row gap-5 justify-center">

          <Link href="/menu">
            <button className="bg-[#060d57] text-white px-10 py-5 rounded-2xl font-bold text-xl hover:scale-105 transition">
              ORDER NOW
            </button>
          </Link>

          <Link href="/menu">
            <button className="border-2 border-[#060d57] text-[#060d57] px-10 py-5 rounded-2xl font-bold text-xl hover:bg-[#060d57] hover:text-white transition">
              VIEW MENU
            </button>
          </Link>

        </div>

      </div>
    </main>
  );
}