"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const countryCodes = [
  { flag: "🇦🇬", label: "Antigua & Barbuda", code: "+1268" },
  { flag: "🇺🇸", label: "United States", code: "+1" },
  { flag: "🇨🇦", label: "Canada", code: "+1" },
];

export default function CheckoutPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [countryCode, setCountryCode] = useState("+1268");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [notes, setNotes] = useState("");
  const [subscribe, setSubscribe] = useState(false);

  const [promoCode, setPromoCode] = useState("");

  useEffect(() => {
    const savedCart = JSON.parse(
      localStorage.getItem("macroMealsCart") || "[]"
    );

    setCart(savedCart);
  }, []);

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const isDiscountCode =
    promoCode.trim().toUpperCase() === "HEALTHADDICT1";

  const discountPercent = isDiscountCode ? 25 : 0;

  const discountAmount = subtotal * (discountPercent / 100);

  const finalTotal = subtotal - discountAmount;

  async function sendWhatsAppOrder() {
    if (!fullName || !whatsapp || !pickupDate || !pickupTime) {
      alert("Please fill in all required fields.");
      return;
    }

    if (cart.length === 0) {
      alert("Your order is empty.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("orders").insert([
      {
        customer_name: fullName,
        whatsapp: `${countryCode}${whatsapp}`,
        email,
        pickup_date: pickupDate,
        pickup_time: pickupTime,
        notes,
        subscribe,
        items: cart,
        subtotal,
        promo_code: promoCode,
        discount_percent: discountPercent,
        discount_amount: discountAmount,
        final_total: finalTotal,
      },
    ]);

    if (error) {
      console.error(error);
      alert("Failed to save order.");
      setLoading(false);
      return;
    }
    try {
  const telegramMessage = `
🚨 New Macro Meals Order

Customer: ${fullName}

Pickup Date: ${pickupDate}
Pickup Time: ${pickupTime}

Items:
${cart
  .map(
    (item) =>
      `${item.quantity}x ${item.category} - ${item.name}`
  )
  .join("\n")}

Total: $${finalTotal.toFixed(2)}

Open Dashboard:
https://macromeals.healthaddictions.co/admin/orders
`;

  const telegramRes = await fetch("/api/telegram", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: telegramMessage,
    }),
  });
  const telegramData = await telegramRes.json();
console.log("Telegram response:", telegramData);
alert(JSON.stringify(telegramData));
} catch (telegramError) {
  console.error("Telegram notification failed", telegramError);
}
    const orderItems = cart
      .map(
        (item) =>
          `${item.quantity}x ${item.category} - ${item.name} - $${
            item.price * item.quantity
          }`
      )
      .join("\n");

    const message = `
New Macro Meals Order

Customer: ${fullName}
WhatsApp: ${countryCode}${whatsapp}

Pickup Date: ${pickupDate}
Pickup Time: ${pickupTime}

Order:
${orderItems}

Subtotal: $${subtotal.toFixed(2)}

Discount: ${discountPercent}% (-$${discountAmount.toFixed(2)})

Final Total: $${finalTotal.toFixed(2)}

Promo Code: ${promoCode || "N/A"}

Notes:
${notes || "None"}
`;

    const whatsappURL = `https://wa.me/12687808226?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappURL, "_blank");

    localStorage.removeItem("macroMealsCart");

    setTimeout(() => {
      window.location.href = "/order-success";
    }, 1000);
  }

  return (
    <main className="min-h-screen bg-[#f3f3f3] px-4 py-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
        <section className="rounded-3xl bg-white p-6 shadow-xl">
          <h1 className="mb-6 text-3xl font-black text-[#060d57]">
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
                className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 text-base font-semibold text-[#060d57]"
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
                  className="rounded-2xl border border-gray-300 bg-white px-3 py-4 text-base font-semibold text-[#060d57]"
                >
                  {countryCodes.map((country) => (
                    <option
                      key={`${country.label}-${country.code}`}
                      value={country.code}
                    >
                      {country.flag} {country.code}
                    </option>
                  ))}
                </select>

                <input
                  type="tel"
                  placeholder="780 8226"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="col-span-2 rounded-2xl border border-gray-300 bg-white px-5 py-4 text-base font-semibold text-[#060d57]"
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
                className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 text-base font-semibold text-[#060d57]"
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
                className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 text-base font-semibold text-[#060d57]"
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
                className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 text-base font-semibold text-[#060d57]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-[#060d57]">
                Discount Code
              </label>

              <input
                type="text"
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 text-base font-semibold text-[#060d57]"
              />

              {discountPercent > 0 && (
                <p className="mt-2 text-sm font-black text-[#75a62f]">
                  25% discount applied successfully.
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-[#060d57]">
                Notes / Allergies / Special Requests
              </label>

              <textarea
                placeholder="No onions, extra sauce, allergy notes, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="h-32 w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 text-base font-semibold text-[#060d57]"
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

              <p className="mt-1 text-base leading-relaxed">
                National Fitness Centre Campsite
                <br />
                (Barrows Gym)
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-xl">
          <h2 className="mb-6 text-3xl font-black text-[#060d57]">
            Order Summary
          </h2>

          <div className="space-y-5">
            {cart.map((item) => (
              <div
                key={item.id}
                className="border-b border-gray-200 pb-4"
              >
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

          {discountPercent > 0 && (
            <div className="mt-6 flex items-center justify-between rounded-2xl bg-green-50 p-4">
              <p className="text-lg font-black text-[#060d57]">
                Discount ({discountPercent}%)
              </p>

              <p className="text-2xl font-black text-[#75a62f]">
                -${discountAmount.toFixed(2)}
              </p>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between">
            <h3 className="text-2xl font-black text-[#060d57]">
              Total
            </h3>

            <p className="text-3xl font-black text-[#060d57]">
              ${finalTotal.toFixed(2)}
            </p>
          </div>

          <button
            onClick={sendWhatsAppOrder}
            disabled={loading}
            className="mt-8 w-full rounded-2xl bg-[#060d57] py-4 text-base font-black text-white"
          >
            {loading ? "Sending Order..." : "Send Order on WhatsApp"}
          </button>
        </section>
      </div>
    </main>
  );
}