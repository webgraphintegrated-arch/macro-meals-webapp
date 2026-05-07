"use client";

import { useEffect, useState } from "react";

const countryCodes = [
  { flag: "🇦🇬", label: "Antigua & Barbuda", code: "1268" },
  { flag: "🇺🇸", label: "United States", code: "1" },
  { flag: "🇨🇦", label: "Canada", code: "1" },
  { flag: "🇬🇧", label: "United Kingdom", code: "44" },
  { flag: "🇯🇲", label: "Jamaica", code: "1876" },
  { flag: "🇹🇹", label: "Trinidad & Tobago", code: "1868" },
  { flag: "🇧🇧", label: "Barbados", code: "1246" },
  { flag: "🇬🇾", label: "Guyana", code: "592" },
  { flag: "🇻🇨", label: "St. Vincent", code: "1784" },
  { flag: "🇰🇳", label: "St. Kitts & Nevis", code: "1869" },
  { flag: "🇩🇲", label: "Dominica", code: "1767" },
  { flag: "🇱🇨", label: "St. Lucia", code: "1758" },
  { flag: "🇬🇩", label: "Grenada", code: "1473" },
  { flag: "🇧🇸", label: "Bahamas", code: "1242" },
  { flag: "🇧🇿", label: "Belize", code: "501" },
  { flag: "🇸🇷", label: "Suriname", code: "597" },
  { flag: "🇭🇹", label: "Haiti", code: "509" },
  { flag: "🇩🇴", label: "Dominican Republic", code: "1809" },
  { flag: "🇵🇷", label: "Puerto Rico", code: "1787" },
  { flag: "🇰🇾", label: "Cayman Islands", code: "1345" },
  { flag: "🇻🇬", label: "British Virgin Islands", code: "1284" },
  { flag: "🇦🇮", label: "Anguilla", code: "1264" },
  { flag: "🇲🇸", label: "Montserrat", code: "1664" },
  { flag: "🇦🇼", label: "Aruba", code: "297" },
  { flag: "🇨🇼", label: "Curaçao", code: "599" },
  { flag: "🇳🇱", label: "Netherlands", code: "31" },
  { flag: "🇫🇷", label: "France", code: "33" },
  { flag: "🇩🇪", label: "Germany", code: "49" },
  { flag: "🇮🇹", label: "Italy", code: "39" },
  { flag: "🇪🇸", label: "Spain", code: "34" },
  { flag: "🇵🇹", label: "Portugal", code: "351" },
  { flag: "🇧🇪", label: "Belgium", code: "32" },
  { flag: "🇨🇭", label: "Switzerland", code: "41" },
  { flag: "🇸🇪", label: "Sweden", code: "46" },
  { flag: "🇳🇴", label: "Norway", code: "47" },
  { flag: "🇩🇰", label: "Denmark", code: "45" },
  { flag: "🇫🇮", label: "Finland", code: "358" },
  { flag: "🇮🇪", label: "Ireland", code: "353" },
  { flag: "🇦🇺", label: "Australia", code: "61" },
  { flag: "🇳🇿", label: "New Zealand", code: "64" },
  { flag: "🇿🇦", label: "South Africa", code: "27" },
  { flag: "🇳🇬", label: "Nigeria", code: "234" },
  { flag: "🇬🇭", label: "Ghana", code: "233" },
  { flag: "🇰🇪", label: "Kenya", code: "254" },
  { flag: "🇮🇳", label: "India", code: "91" },
  { flag: "🇵🇰", label: "Pakistan", code: "92" },
  { flag: "🇧🇩", label: "Bangladesh", code: "880" },
  { flag: "🇨🇳", label: "China", code: "86" },
  { flag: "🇯🇵", label: "Japan", code: "81" },
  { flag: "🇰🇷", label: "South Korea", code: "82" },
  { flag: "🇸🇬", label: "Singapore", code: "65" },
  { flag: "🇲🇾", label: "Malaysia", code: "60" },
  { flag: "🇵🇭", label: "Philippines", code: "63" },
  { flag: "🇦🇪", label: "United Arab Emirates", code: "971" },
  { flag: "🇸🇦", label: "Saudi Arabia", code: "966" },
  { flag: "🇶🇦", label: "Qatar", code: "974" },
  { flag: "🇧🇷", label: "Brazil", code: "55" },
  { flag: "🇦🇷", label: "Argentina", code: "54" },
  { flag: "🇲🇽", label: "Mexico", code: "52" },
  { flag: "🇨🇴", label: "Colombia", code: "57" },
  { flag: "🇻🇪", label: "Venezuela", code: "58" },
  { flag: "🇵🇪", label: "Peru", code: "51" },
  { flag: "🇨🇱", label: "Chile", code: "56" },
];

export default function CheckoutPage() {
  const [cart, setCart] = useState<any[]>([]);

  const [form, setForm] = useState({
    name: "",
    countryCode: "1268",
    whatsapp: "",
    email: "",
    pickupDate: "",
    pickupTime: "",
    notes: "",
    subscribe: false,
  });

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

  function handleChange(
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;

      setForm({
        ...form,
        [name]: checked,
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  }

  function sendToWhatsApp() {
    if (
      !form.name ||
      !form.whatsapp ||
      !form.pickupDate ||
      !form.pickupTime
    ) {
      alert(
        "Please fill in your name, WhatsApp number, pickup date and pickup time."
      );

      return;
    }

    if (cart.length === 0) {
      alert("Your order is empty.");

      return;
    }

    const fullWhatsapp = `+${form.countryCode}${form.whatsapp.replace(
      /\D/g,
      ""
    )}`;

    const orderItems = cart
      .map(
        (item) =>
          `${item.quantity}x ${item.category} - ${item.name} - $${
            item.price * item.quantity
          }`
      )
      .join("%0A");

    const message = `
New Macro Meals Order%0A%0A
Customer: ${form.name}%0A
WhatsApp: ${fullWhatsapp}%0A
Email: ${form.email || "N/A"}%0A
Pickup Date: ${form.pickupDate}%0A
Pickup Time: ${form.pickupTime}%0A
Subscribe: ${form.subscribe ? "Yes" : "No"}%0A%0A
Order:%0A${orderItems}%0A%0A
Subtotal: $${subtotal}%0A%0A
Notes: ${form.notes || "None"}
`;

    window.open(
      `https://wa.me/12687808226?text=${message}`,
      "_blank"
    );
  }

  return (
    <main className="min-h-screen bg-[#f3f3f3] px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <img
            src="/logo.png"
            alt="Macro Meals On Wheels"
            className="mx-auto mb-4 w-36"
          />

          <h1 className="text-5xl font-black text-[#060d57]">
            CHECKOUT
          </h1>

          <p className="mt-2 font-semibold text-[#75a62f]">
            Pickup only at National Fitness Centre Campsite
          </p>

          <a
            href="/cart"
            className="mt-4 inline-block font-bold text-[#75a62f]"
          >
            ← Back to Order
          </a>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-3xl bg-white p-6 shadow-lg">
            <h2 className="mb-5 text-3xl font-black text-[#060d57]">
              Pickup Details
            </h2>

            <div className="space-y-4">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full Name *"
                className="w-full rounded-2xl border border-gray-300 bg-white p-4 text-[#060d57] placeholder:text-gray-500"
              />

              <div className="grid grid-cols-3 gap-3">
                <select
                  name="countryCode"
                  value={form.countryCode}
                  onChange={handleChange}
                  className="col-span-1 rounded-2xl border border-gray-300 bg-white p-4 text-[#060d57]"
                >
                  {countryCodes.map((country) => (
                    <option
                      key={`${country.label}-${country.code}`}
                      value={country.code}
                    >
                      {country.flag} +{country.code}
                    </option>
                  ))}
                </select>

                <input
                  name="whatsapp"
                  value={form.whatsapp}
                  onChange={handleChange}
                  placeholder="WhatsApp Number *"
                  className="col-span-2 rounded-2xl border border-gray-300 bg-white p-4 text-[#060d57] placeholder:text-gray-500"
                />
              </div>

              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email Address (Optional)"
                className="w-full rounded-2xl border border-gray-300 bg-white p-4 text-[#060d57] placeholder:text-gray-500"
              />

              <input
                name="pickupDate"
                type="date"
                value={form.pickupDate}
                onChange={handleChange}
                className="w-full rounded-2xl border border-gray-300 bg-white p-4 text-[#060d57]"
              />

              <input
                name="pickupTime"
                type="time"
                value={form.pickupTime}
                onChange={handleChange}
                className="w-full rounded-2xl border border-gray-300 bg-white p-4 text-[#060d57]"
              />

              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Notes, allergies or special requests"
                className="min-h-28 w-full rounded-2xl border border-gray-300 bg-white p-4 text-[#060d57] placeholder:text-gray-500"
              />

              <label className="flex items-start gap-3 rounded-2xl bg-[#f3f3f3] p-4">
                <input
                  type="checkbox"
                  name="subscribe"
                  checked={form.subscribe}
                  onChange={handleChange}
                  className="mt-1"
                />

                <span className="text-sm font-semibold text-[#060d57]">
                  Yes, I’d like to receive discounts, updates and
                  special meal offers.
                </span>
              </label>

              <div className="rounded-2xl bg-[#060d57] p-4 text-white">
                <p className="font-bold">Pickup Location</p>
                <p>National Fitness Centre Campsite</p>
                <p>(Barrows Gym)</p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-lg">
            <h2 className="mb-5 text-3xl font-black text-[#060d57]">
              Order Summary
            </h2>

            {cart.length === 0 ? (
              <p className="font-bold text-gray-600">
                Your order is empty.
              </p>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="border-b border-gray-200 pb-3"
                  >
                    <p className="font-black text-[#060d57]">
                      {item.quantity}x {item.category} - {item.name}
                    </p>

                    <p className="text-sm text-gray-600">
                      ${item.price} each
                    </p>

                    <p className="font-bold text-[#75a62f]">
                      ${item.price * item.quantity}
                    </p>
                  </div>
                ))}

                <div className="flex justify-between pt-4 text-2xl font-black text-[#060d57]">
                  <span>Subtotal</span>

                  <span>${subtotal}</span>
                </div>

                <button
                  onClick={sendToWhatsApp}
                  className="mt-6 w-full rounded-2xl bg-[#060d57] py-4 font-black text-white hover:bg-[#0b1675]"
                >
                  Send Order on WhatsApp
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}