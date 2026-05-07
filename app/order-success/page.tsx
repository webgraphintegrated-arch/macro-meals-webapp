"use client";

export default function OrderSuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f3f3f3] px-4 py-10">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-8 text-center shadow-2xl">

        {/* LOGO */}
        <img
          src="/logo.png"
          alt="Macro Meals On Wheels"
          className="mx-auto mb-6 w-32"
        />

        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#060d57] shadow-lg">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-12 w-12 text-white"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={3}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 13l4 4L19 7"
    />
  </svg>
</div>

        {/* TITLE */}
        <h1 className="mt-6 text-4xl font-black text-[#060d57] md:text-5xl">
          Order Sent!
        </h1>

        {/* DESCRIPTION */}
        <p className="mt-4 text-lg font-semibold leading-relaxed text-gray-600">
          Your order has been prepared and sent through WhatsApp.
          <br />
          Please complete or confirm the message in WhatsApp.
        </p>

        {/* PICKUP INFO */}
        <div className="mt-8 rounded-3xl bg-[#060d57] p-6 text-white">
          <p className="text-xl font-black">
            Pickup Location
          </p>

          <p className="mt-2 text-lg leading-relaxed">
            National Fitness Centre Campsite
            <br />
            (Barrows Gym)
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-8 grid gap-4 md:grid-cols-2">

          <a
            href="/menu"
            className="rounded-2xl border-2 border-[#060d57] py-4 text-center text-lg font-black text-[#060d57]"
          >
            Back to Menu
          </a>

          <a
            href="/cart"
            className="rounded-2xl bg-[#060d57] py-4 text-center text-lg font-black text-white"
          >
            View Cart
          </a>

        </div>

      </div>
    </main>
  );
}