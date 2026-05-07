"use client";

import { useEffect, useState } from "react";

const countryCodes = [
  { flag: "🇦🇬", label: "Antigua & Barbuda", code: "+1268" },
  { flag: "🇺🇸", label: "United States", code: "+1" },
  { flag: "🇨🇦", label: "Canada", code: "+1" },
  { flag: "🇬🇧", label: "United Kingdom", code: "+44" },
  { flag: "🇯🇲", label: "Jamaica", code: "+1876" },
  { flag: "🇹🇹", label: "Trinidad & Tobago", code: "+1868" },
  { flag: "🇧🇧", label: "Barbados", code: "+1246" },
  { flag: "🇬🇾", label: "Guyana", code: "+592" },
  { flag: "🇻🇨", label: "St. Vincent", code: "+1784" },
  { flag: "🇰🇳", label: "St. Kitts & Nevis", code: "+1869" },
  { flag: "🇩🇲", label: "Dominica", code: "+1767" },
  { flag: "🇱🇨", label: "St. Lucia", code: "+1758" },
  { flag: "🇬🇩", label: "Grenada", code: "+1473" },
  { flag: "🇧🇸", label: "Bahamas", code: "+1242" },
  { flag: "🇧🇿", label: "Belize", code: "+501" },
  { flag: "🇳🇬", label: "Nigeria", code: "+234" },
  { flag: "🇬🇭", label: "Ghana", code: "+233" },
  { flag: "🇮🇳", label: "India", code: "+91" },
  { flag: "🇵🇭", label: "Philippines", code: "+63" },
];

export default function CheckoutPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [fullName, setFullName] = useState("");
  const [countryCode, setCountryCode] = useState("+1268");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [notes, setNotes] = useState("");
  const [subscribe, setSubscribe] = useState(false);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("macroMealsCart") || "[]");
    setCart(savedCart);
  }, []);

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  function sendWhatsAppOrder() {
    if (!fullName || !whatsapp || !pickupDate || !pickupTime) {
      alert("Please fill in your name, WhatsApp number, pickup date and pickup time.");
      return;
    }

    if (cart.length === 0) {
      alert("Your order is empty.");
      return;
    }

    const orderItems = cart
      .map(
        (item) =>
          `${item.quantity}x ${item.category} - ${item.name} - $${item.price * item.quantity}`
      )
      .join("\n");

    const message = `
New Macro Meals Order

Customer: ${fullName}
WhatsApp: ${countryCode}${whatsapp}
Email: ${email || "N/A"}

Pickup Date: ${pickupDate}
Pickup Time: ${pickupTime}

Subscribe: ${subscribe ? "Yes" : "No"}

Order:
${orderItems}

Subtotal: $${subtotal}

Notes:
${notes || "None"}
`;

    window.open(
      `https://wa.me/12687808226?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  }

  return (
    <main className="min-h-screen bg-[#f3f3f3] px-4 py-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
        <section className="rounded-3xl bg-white p-6 shadow-xl">
          <h1 className="mb-6 text-3xl font-black text-[#060d57] md:text-4xl">
            Pickup Details
          </h1>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-black text-[#060d57]">
                Full Name *
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 text-base font-semibold text-[#060d57] placeholder:text-gray-500 outline-none focus:border-[#75a62f]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-[#060d57]">
                WhatsApp Number *
              </label>

              <div className="grid grid-cols-3 gap-3">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="rounded-2xl border border-gray-300 bg-white px-3 py-4 text-base font-semibold text-[#060d57] outline-none focus:border-[#75a62f]"
                >
                  {countryCodes.map((country) => (
                    <option key={`${country.label}-${country.code}`} value={country.code}>
                      {country.flag} {country.code}
                    </option>
                  ))}
                </select>

                <input
                  type="tel"
                  placeholder="780 8226"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="col-span-2 rounded-2xl border border-gray-300 bg-white px-5 py-4 text-base font-semibold text-[#060d57] placeholder:text-gray-500 outline-none focus:border-[#75a62f]"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-[#060d57]">
                Email Address (Optional)
              </label>
              <input
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 text-base font-semibold text-[#060d57] placeholder:text-gray-500 outline-none focus:border-[#75a62f]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-[#060d57]">
                Pickup Date *
              </label>
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 text-base font-semibold text-[#060d57] outline-none focus:border-[#75a62f]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-[#060d57]">
                Pickup Time *
              </label>
              <input
                type="time"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 text-base font-semibold text-[#060d57] outline-none focus:border-[#75a62f]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-[#060d57]">
                Notes / Allergies / Special Requests
              </label>
              <textarea
                placeholder="No onions, extra sauce, allergy notes, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="h-32 w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 text-base font-semibold text-[#060d57] placeholder:text-gray-500 outline-none focus:border-[#75a62f]"
              />
            </div>

            <label className="flex items-start gap-3 rounded-2xl bg-[#f3f3f3] p-4">
              <input
                type="checkbox"
                checked={subscribe}
                onChange={() => setSubscribe(!subscribe)}
                className="mt-1"
              />
              <span className="text-sm font-bold text-[#060d57]">
                Yes, I’d like to receive discounts, updates and special meal offers.
              </span>
            </label>

            <div className="rounded-3xl bg-[#060d57] p-5 text-white">
              <p className="text-lg font-black">Pickup Location</p>
              <p className="mt-1 text-base">
                National Fitness Centre Campsite
                <br />
                (Barrows Gym)
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-xl">
          <h2 className="mb-6 text-3xl font-black text-[#060d57] md:text-4xl">
            Order Summary
          </h2>

          {cart.length === 0 ? (
            <div className="rounded-2xl bg-[#f3f3f3] p-6 text-center">
              <p className="font-black text-[#060d57]">Your order is empty.</p>
              <a
                href="/menu"
                className="mt-4 inline-block rounded-2xl bg-[#060d57] px-6 py-3 font-black text-white"
              >
                View Menu
              </a>
            </div>
          ) : (
            <>
              <div className="space-y-5">
                {cart.map((item) => (
                  <div key={item.id} className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-black text-[#060d57]">
                      {item.quantity}x {item.category} - {item.name}
                    </h3>

                    <p className="mt-1 text-sm font-semibold text-gray-600">
                      ${item.price} each
                    </p>

                    <p className="mt-1 text-2xl font-black text-[#75a62f]">
                      ${item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center justify-between">
                <h3 className="text-2xl font-black text-[#060d57]">
                  Subtotal
                </h3>

                <p className="text-3xl font-black text-[#060d57]">
                  ${subtotal}
                </p>
              </div>

              <button
                onClick={sendWhatsAppOrder}
                className="mt-8 w-full rounded-2xl bg-[#060d57] py-4 text-base font-black text-white"
              >
                Send Order on WhatsApp
              </button>
            </>
          )}
        </section>
      </div>
    </main>
  );
}