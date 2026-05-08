"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

const countryCodes = [
  { flag: "🇦🇬", label: "Antigua & Barbuda", code: "+1268" },
  { flag: "🇺🇸", label: "United States", code: "+1" },
  { flag: "🇨🇦", label: "Canada", code: "+1" },
  { flag: "🇬🇧", label: "United Kingdom", code: "+44" },
  { flag: "🇯🇲", label: "Jamaica", code: "+1876" },
  { flag: "🇹🇹", label: "Trinidad & Tobago", code: "+1868" },
  { flag: "🇧🇧", label: "Barbados", code: "+1246" },
  { flag: "🇬🇾", label: "Guyana", code: "+592" },
];

export default function PackedMealRequestPage() {
  const [fullName, setFullName] = useState("");
  const [countryCode, setCountryCode] = useState("+1268");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [mealsCount, setMealsCount] = useState("7");
  const [requestedStartDate, setRequestedStartDate] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const mealsNumber = Number(mealsCount);
  const isMemberCode = promoCode.trim().toUpperCase() === "HEALTHADDICT26";
  const discountPercent = isMemberCode ? 15 : 10;

  function isAtLeastTwoDaysAhead(dateValue: string) {
    const today = new Date();
    const selectedDate = new Date(dateValue + "T00:00:00");

    today.setHours(0, 0, 0, 0);

    const differenceInMs = selectedDate.getTime() - today.getTime();
    const differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);

    return differenceInDays >= 2;
  }

  async function submitRequest() {
    if (!fullName || !whatsapp || !requestedStartDate || !mealsCount) {
      alert("Please fill in your name, WhatsApp number, meal count and requested start date.");
      return;
    }

    if (mealsNumber < 7) {
      alert("Packed meal requests must be for 7 meals or more.");
      return;
    }

    if (!isAtLeastTwoDaysAhead(requestedStartDate)) {
      alert("Packed meal requests must be submitted at least 2 days in advance.");
      return;
    }

    setLoading(true);

    const fullWhatsapp = `${countryCode}${whatsapp}`;

    const { error } = await supabase.from("packed_meal_requests").insert([
      {
        customer_name: fullName,
        whatsapp: fullWhatsapp,
        email,
        meals_count: mealsNumber,
        requested_start_date: requestedStartDate,
        notes,
        promo_code: promoCode.trim(),
        discount_percent: discountPercent,
      },
    ]);

    if (error) {
      console.error(error);
      alert("Failed to submit packed meal request.");
      setLoading(false);
      return;
    }

    const message = `
New Packed Meal Request

Customer: ${fullName}
WhatsApp: ${fullWhatsapp}
Email: ${email || "N/A"}

Requested Start Date: ${requestedStartDate}
Number of Meals: ${mealsNumber}

Discount Applied: ${discountPercent}%
Promo Code: ${promoCode.trim() || "N/A"}

Notes / Meal Preferences:
${notes || "None"}

Important:
Packed meal requests must be submitted at least 2 days in advance.
`;

    window.open(
      `https://wa.me/12687808226?text=${encodeURIComponent(message)}`,
      "_blank"
    );

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#f3f3f3] px-4 py-8">
      <div className="mx-auto max-w-5xl">

        {/* HEADER */}
        <div className="mb-8 rounded-3xl bg-white p-6 text-center shadow-xl">
          <img
            src="/logo.png"
            alt="Macro Meals On Wheels"
            className="mx-auto mb-4 w-32"
          />

          <p className="text-sm font-black uppercase tracking-wide text-[#75a62f]">
            Weekly Meal Planning
          </p>

          <h1 className="mt-2 text-4xl font-black text-[#060d57] md:text-5xl">
            Request Packed Meals
          </h1>

          <p className="mx-auto mt-3 max-w-2xl font-semibold text-gray-600">
            Request 7 or more meals for the week ahead. Requests must be submitted
            at least 2 days in advance.
          </p>
        </div>

        {/* DISCOUNT INFO */}
        <div className="mb-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 shadow-xl">
            <p className="text-sm font-black uppercase tracking-wide text-[#75a62f]">
              Standard Packed Meal Discount
            </p>

            <h2 className="mt-2 text-4xl font-black text-[#060d57]">
              10% Off
            </h2>

            <p className="mt-2 font-semibold text-gray-600">
              Automatically applied when requesting 7 or more meals.
            </p>
          </div>

          <div className="rounded-3xl bg-[#060d57] p-6 text-white shadow-xl">
            <p className="text-sm font-black uppercase tracking-wide text-white/70">
              Health Addictions Members
            </p>

            <h2 className="mt-2 text-4xl font-black">
              15% Off
            </h2>

            <p className="mt-2 font-semibold text-white/80">
              Use code HEALTHADDICT26 to receive the member discount.
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">

          {/* FORM */}
          <section className="rounded-3xl bg-white p-6 shadow-xl">
            <h2 className="mb-6 text-3xl font-black text-[#060d57]">
              Request Details
            </h2>

            <div className="space-y-5">

              {/* NAME */}
              <div>
                <label className="mb-2 block text-sm font-black text-[#060d57]">
                  Full Name *
                </label>

                <input
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 font-semibold text-[#060d57] placeholder:text-gray-500 outline-none focus:border-[#75a62f]"
                />
              </div>

              {/* WHATSAPP */}
              <div>
                <label className="mb-2 block text-sm font-black text-[#060d57]">
                  WhatsApp Number *
                </label>

                <div className="grid grid-cols-3 gap-3">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="rounded-2xl border border-gray-300 bg-white px-3 py-4 font-semibold text-[#060d57] outline-none focus:border-[#75a62f]"
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
                    className="col-span-2 rounded-2xl border border-gray-300 bg-white px-5 py-4 font-semibold text-[#060d57] placeholder:text-gray-500 outline-none focus:border-[#75a62f]"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label className="mb-2 block text-sm font-black text-[#060d57]">
                  Email Address (Optional)
                </label>

                <input
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 font-semibold text-[#060d57] placeholder:text-gray-500 outline-none focus:border-[#75a62f]"
                />
              </div>

              {/* MEALS COUNT */}
              <div>
                <label className="mb-2 block text-sm font-black text-[#060d57]">
                  Number of Meals *
                </label>

                <input
                  type="number"
                  min="7"
                  placeholder="7"
                  value={mealsCount}
                  onChange={(e) => setMealsCount(e.target.value)}
                  className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 font-semibold text-[#060d57] placeholder:text-gray-500 outline-none focus:border-[#75a62f]"
                />

                <p className="mt-2 text-sm font-semibold text-gray-600">
                  Minimum request is 7 meals.
                </p>
              </div>

              {/* START DATE */}
              <div>
                <label className="mb-2 block text-sm font-black text-[#060d57]">
                  Requested Start Date *
                </label>

                <input
                  type="date"
                  value={requestedStartDate}
                  onChange={(e) => setRequestedStartDate(e.target.value)}
                  className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 font-semibold text-[#060d57] outline-none focus:border-[#75a62f]"
                />

                <p className="mt-2 text-sm font-semibold text-gray-600">
                  Requests must be submitted at least 2 days in advance.
                </p>
              </div>

              {/* PROMO CODE */}
              <div>
                <label className="mb-2 block text-sm font-black text-[#060d57]">
                  Member Promo Code
                </label>

                <input
                  type="text"
                  placeholder="HEALTHADDICT26"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 font-semibold uppercase text-[#060d57] placeholder:text-gray-500 outline-none focus:border-[#75a62f]"
                />
              </div>

              {/* NOTES */}
              <div>
                <label className="mb-2 block text-sm font-black text-[#060d57]">
                  Meal Preferences / Notes
                </label>

                <textarea
                  placeholder="Example: 3 chicken meals, 2 fish meals, 2 veggie meals. Any allergies or special notes."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="h-36 w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 font-semibold text-[#060d57] placeholder:text-gray-500 outline-none focus:border-[#75a62f]"
                />
              </div>

              <button
                onClick={submitRequest}
                disabled={loading}
                className="w-full rounded-2xl bg-[#060d57] py-4 font-black text-white"
              >
                {loading ? "Submitting Request..." : "Submit Packed Meal Request"}
              </button>
            </div>
          </section>

          {/* SUMMARY */}
          <section className="rounded-3xl bg-white p-6 shadow-xl">
            <h2 className="mb-6 text-3xl font-black text-[#060d57]">
              Request Summary
            </h2>

            <div className="space-y-4">
              <div className="rounded-2xl bg-[#f3f3f3] p-5">
                <p className="text-sm font-black uppercase text-[#75a62f]">
                  Meals Requested
                </p>

                <p className="mt-1 text-4xl font-black text-[#060d57]">
                  {mealsNumber || 0}
                </p>
              </div>

              <div className="rounded-2xl bg-[#f3f3f3] p-5">
                <p className="text-sm font-black uppercase text-[#75a62f]">
                  Discount
                </p>

                <p className="mt-1 text-4xl font-black text-[#060d57]">
                  {mealsNumber >= 7 ? `${discountPercent}%` : "Not eligible yet"}
                </p>

                <p className="mt-2 font-semibold text-gray-600">
                  {isMemberCode
                    ? "Health Addictions member discount applied."
                    : "Standard packed meal discount applies for 7+ meals."}
                </p>
              </div>

              <div className="rounded-2xl bg-[#060d57] p-5 text-white">
                <p className="text-sm font-black uppercase text-white/70">
                  Important
                </p>

                <ul className="mt-3 space-y-2 font-semibold text-white/90">
                  <li>• Minimum 7 meals required.</li>
                  <li>• Requests must be made 2 days in advance.</li>
                  <li>• Pickup details will be confirmed by WhatsApp.</li>
                  <li>• Final meal breakdown can be confirmed after submission.</li>
                </ul>
              </div>

              <a
                href="/menu"
                className="block rounded-2xl border-2 border-[#060d57] py-4 text-center font-black text-[#060d57]"
              >
                View Regular Menu
              </a>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}