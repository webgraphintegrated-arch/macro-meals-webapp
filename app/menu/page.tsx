"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

const menuCategories = [
  {
    title: "Burgers",
    description:
      "100% homemade burgers sautéed with onion, mushrooms, lettuce, tomato, ketchup, mustard and mayo. Choice of wheat, white bread or tortilla.",
    items: [
      { name: "Ground Beef", price: 20 },
      { name: "Ground Chicken", price: 15 },
      { name: "Chicken Breast", price: 15 },
      { name: "Fish", price: 20 },
      { name: "Shrimp", price: 25 },
      { name: "Salmon", price: 28 },
    ],
  },
  {
    title: "Wraps",
    description:
      "Flour/wheat tortilla filled with protein, salad, mushroom, salsa, cheese and sour cream.",
    items: [
      { name: "Ground Beef", price: 24 },
      { name: "Ground Chicken", price: 19 },
      { name: "Chicken", price: 19 },
      { name: "Fish", price: 25 },
      { name: "Shrimp", price: 35 },
      { name: "Salmon", price: 30 },
      { name: "Steak", price: 32 },
    ],
  },
  {
    title: "Veggie Wrap",
    description:
      "Flour/wheat tortilla filled with fresh vegetables, salad, mushroom, salsa, cheese and sour cream.",
    items: [{ name: "Veggie", price: 15 }],
  },
  {
    title: "Salads",
    description:
      "Fresh salad bowl served with your choice of protein and balanced toppings.",
    items: [
      { name: "Ground Beef", price: 35 },
      { name: "Ground Chicken", price: 30 },
      { name: "Chicken", price: 30 },
      { name: "Fish", price: 35 },
      { name: "Shrimp", price: 50 },
      { name: "Salmon", price: 45 },
      { name: "Steak", price: 45 },
    ],
  },
  {
    title: "Bowl",
    description:
      "Balanced bowl meal served with your choice of protein and meal base.",
    items: [
      { name: "Ground Beef", price: 40 },
      { name: "Ground Chicken", price: 35 },
      { name: "Chicken", price: 35 },
      { name: "Fish", price: 40 },
      { name: "Shrimp", price: 55 },
      { name: "Salmon", price: 50 },
      { name: "Steak", price: 50 },
    ],
  },
  {
    title: "Sweet Potato Meals",
    description:
      "Sweet potato meal served with your selected protein for a balanced packed meal option.",
    items: [
      { name: "Chicken", price: 32 },
      { name: "Fish", price: 40 },
      { name: "Shrimp", price: 45 },
      { name: "Salmon", price: 50 },
      { name: "Steak", price: 50 },
    ],
  },
  {
    title: "Stuffed Potato Meals",
    description:
      "Stuffed potato packed with your selected protein or veggie option.",
    items: [
      { name: "Veggie", price: 20 },
      { name: "Chicken", price: 30 },
      { name: "Fish", price: 35 },
      { name: "Shrimp", price: 35 },
      { name: "Salmon", price: 40 },
      { name: "Steak", price: 40 },
    ],
  },
  {
    title: "Veggie Rice Meals",
    description:
      "Veggie rice meal served with your choice of protein or veggie option.",
    items: [
      { name: "Veggie", price: 17 },
      { name: "Chicken", price: 25 },
      { name: "Fish", price: 30 },
      { name: "Shrimp", price: 40 },
      { name: "Salmon", price: 40 },
      { name: "Steak", price: 40 },
      { name: "Ground Beef", price: 30 },
      { name: "Ground Chicken", price: 25 },
    ],
  },
  {
    title: "Sweet Potato Fries Meals",
    description:
      "Sweet potato fries meal served with your selected protein or veggie option.",
    items: [
      { name: "Veggie", price: 25 },
      { name: "Chicken", price: 32 },
      { name: "Fish", price: 40 },
      { name: "Shrimp", price: 50 },
      { name: "Salmon", price: 50 },
      { name: "Steak", price: 50 },
    ],
  },
  {
    title: "Dieter’s Olive Oil Pasta",
    description:
      "Olive oil pasta made for a lighter meal option with your choice of protein or veggie.",
    items: [
      { name: "Veggie", price: 20 },
      { name: "Chicken", price: 25 },
      { name: "Fish", price: 35 },
      { name: "Shrimp", price: 35 },
      { name: "Salmon", price: 40 },
      { name: "Steak", price: 40 },
      { name: "Ground Beef", price: 30 },
      { name: "Ground Chicken", price: 25 },
    ],
  },
  {
    title: "Gainer’s Cream Pasta",
    description:
      "Cream pasta made for a heavier meal option with your choice of protein or veggie.",
    items: [
      { name: "Veggie", price: 25 },
      { name: "Chicken", price: 35 },
      { name: "Fish", price: 40 },
      { name: "Shrimp", price: 45 },
      { name: "Salmon", price: 45 },
      { name: "Steak", price: 50 },
      { name: "Ground Beef", price: 40 },
      { name: "Ground Chicken", price: 35 },
    ],
  },
  {
    title: "Quesadilla",
    description:
      "Quesadilla filled with your selected protein, cheese and savory fillings.",
    items: [
      { name: "Ground Beef", price: 30 },
      { name: "Ground Chicken", price: 27 },
      { name: "Chicken Breast", price: 27 },
      { name: "Fish", price: 31 },
      { name: "Shrimp", price: 44 },
      { name: "Salmon", price: 38 },
      { name: "Steak", price: 39 },
    ],
  },
];

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

const allowedPickupTimes = [
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
  "6:00 PM",
  "6:30 PM",
  "7:00 PM",
  "7:30 PM",
];

type CartItem = {
  id: string;
  category: string;
  name: string;
  price: number;
  quantity: number;
};

function timeToMinutes(time: string) {
  const [rawTime, period] = time.split(" ");
  const [rawHour, rawMinute] = rawTime.split(":");

  let hour = Number(rawHour);
  const minute = Number(rawMinute);

  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  return hour * 60 + minute;
}

function isTuesdayToFriday(dateValue: string) {
  if (!dateValue) return false;

  const selectedDate = new Date(dateValue + "T00:00:00");
  const day = selectedDate.getDay();

  return day >= 2 && day <= 5;
}

function isToday(dateValue: string) {
  if (!dateValue) return false;

  const today = new Date();
  const selectedDate = new Date(dateValue + "T00:00:00");

  return (
    today.getFullYear() === selectedDate.getFullYear() &&
    today.getMonth() === selectedDate.getMonth() &&
    today.getDate() === selectedDate.getDate()
  );
}

function isOrderingOpenNow() {
  const now = new Date();
  const day = now.getDay();
  const minutes = now.getHours() * 60 + now.getMinutes();

  const isOpenDay = day >= 2 && day <= 5;
  const orderStart = 9 * 60;
  const orderEnd = 19 * 60 + 30;

  return isOpenDay && minutes >= orderStart && minutes <= orderEnd;
}

export default function MenuPage() {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [countryCode, setCountryCode] = useState("+1268");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [notes, setNotes] = useState("");
  const [subscribe, setSubscribe] = useState(false);
  const [loading, setLoading] = useState(false);

  const activeCategory = menuCategories[activeCategoryIndex];
  const orderingOpen = isOrderingOpenNow();

  const availablePickupTimes = useMemo(() => {
    if (!pickupDate) return allowedPickupTimes;

    if (!isToday(pickupDate)) return allowedPickupTimes;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    return allowedPickupTimes.filter(
      (time) => timeToMinutes(time) > currentMinutes
    );
  }, [pickupDate]);

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  function addToCart(category: string, item: { name: string; price: number }) {
    const id = `${category}-${item.name}`;

    setCart((currentCart) => {
      const existingItem = currentCart.find((cartItem) => cartItem.id === id);

      if (existingItem) {
        return currentCart.map((cartItem) =>
          cartItem.id === id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }

      return [
        ...currentCart,
        {
          id,
          category,
          name: item.name,
          price: item.price,
          quantity: 1,
        },
      ];
    });
  }

  function decreaseItem(id: string) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function increaseItem(id: string) {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }

  function removeItem(id: string) {
    setCart((currentCart) => currentCart.filter((item) => item.id !== id));
  }

  async function submitOrder() {
    if (!orderingOpen) {
      alert("Ordering is available Tuesday to Friday from 9:00 AM to 7:30 PM.");
      return;
    }

    if (cart.length === 0) {
      alert("Please add at least one meal to your order.");
      return;
    }

    if (!customerName || !whatsapp || !pickupDate || !pickupTime) {
      alert("Please fill in your name, WhatsApp number, pickup date and pickup time.");
      return;
    }

    if (!isTuesdayToFriday(pickupDate)) {
      alert("Pickup is only available Tuesday to Friday.");
      return;
    }

    if (!availablePickupTimes.includes(pickupTime)) {
      alert("Please choose an available pickup time between 11:00 AM and 7:30 PM.");
      return;
    }

    setLoading(true);

    const fullWhatsapp = `${countryCode}${whatsapp}`;

    const orderItems = cart.map((item) => ({
      category: item.category,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    const { error } = await supabase.from("orders").insert([
      {
        customer_name: customerName,
        whatsapp: fullWhatsapp,
        email,
        pickup_date: pickupDate,
        pickup_time: pickupTime,
        notes,
        subscribe,
        items: orderItems,
        subtotal,
        status: "Pending",
      },
    ]);

    if (error) {
      console.error(error);
      alert("Failed to submit order.");
      setLoading(false);
      return;
    }

    window.location.href = "/order-success";
  }

  return (
    <main className="min-h-screen bg-[#f3f3f3] px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl bg-white p-6 text-center shadow-xl">
          <Image
            src="/logo.png"
            alt="Macro Meals On Wheels"
            width={130}
            height={130}
            className="mx-auto mb-4"
          />

          <h1 className="text-4xl font-black text-[#060d57] md:text-6xl">
            Order Meals
          </h1>

          <p className="mx-auto mt-3 max-w-2xl font-semibold text-gray-600">
            Order fresh meals Tuesday to Friday from 9:00 AM. Pickup is available
            from 11:00 AM to 7:30 PM.
          </p>

          <div className="mx-auto mt-5 flex max-w-md flex-wrap items-center justify-center gap-3 rounded-2xl bg-[#f3f3f3] px-5 py-4 shadow-inner">
            <div className="text-center">
              <p className="text-xs font-black uppercase tracking-wide text-[#75a62f]">
                Order Days
              </p>

              <p className="mt-1 text-sm font-black text-[#060d57]">
                Tuesday - Friday
              </p>
            </div>

            <div className="h-10 w-px bg-gray-300" />

            <div className="text-center">
              <p className="text-xs font-black uppercase tracking-wide text-[#75a62f]">
                Ordering Starts
              </p>

              <p className="mt-1 text-sm font-black text-[#060d57]">
                9:00 AM
              </p>
            </div>

            <div className="h-10 w-px bg-gray-300" />

            <div className="text-center">
              <p className="text-xs font-black uppercase tracking-wide text-[#75a62f]">
                Pickup Hours
              </p>

              <p className="mt-1 text-sm font-black text-[#060d57]">
                11:00 AM - 7:30 PM
              </p>
            </div>
          </div>

          {!orderingOpen && (
            <div className="mx-auto mt-5 max-w-xl rounded-2xl border-2 border-red-500 bg-red-50 p-4">
              <p className="font-black text-red-600">
                Online ordering is currently closed.
              </p>

              <p className="mt-1 text-sm font-semibold text-red-600">
                Orders can be placed Tuesday to Friday from 9:00 AM to 7:30 PM.
              </p>
            </div>
          )}
        </div>

        <div className="mb-8 rounded-3xl bg-white p-5 shadow-xl">
          <p className="mb-3 text-sm font-black uppercase tracking-wide text-[#060d57]">
            Meal Categories
          </p>

          <div className="flex flex-wrap gap-2">
            {menuCategories.map((category, index) => (
              <button
                key={category.title}
                onClick={() => setActiveCategoryIndex(index)}
                className={`rounded-2xl px-4 py-3 text-sm font-black ${
                  activeCategoryIndex === index
                    ? "bg-[#060d57] text-white"
                    : "bg-[#f3f3f3] text-[#060d57]"
                }`}
              >
                {category.title}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <section className="rounded-3xl bg-white p-6 shadow-xl lg:col-span-2">
            <h2 className="text-3xl font-black text-[#060d57]">
              {activeCategory.title}
            </h2>

            <p className="mt-2 mb-5 font-semibold text-gray-600">
              {activeCategory.description}
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              {activeCategory.items.map((item) => (
                <div
                  key={`${activeCategory.title}-${item.name}`}
                  className="rounded-3xl bg-[#f3f3f3] p-5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xl font-black text-[#060d57]">
                        {item.name}
                      </p>

                      <p className="mt-2 text-2xl font-black text-[#75a62f]">
                        ${item.price}
                      </p>
                    </div>

                    <button
                      onClick={() => addToCart(activeCategory.title, item)}
                      className="rounded-2xl bg-[#060d57] px-5 py-3 font-black text-white"
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-xl">
            <h2 className="mb-5 text-3xl font-black text-[#060d57]">
              Your Order
            </h2>

            {cart.length === 0 ? (
              <p className="rounded-2xl bg-[#f3f3f3] p-4 font-semibold text-gray-600">
                No meals added yet.
              </p>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="rounded-2xl bg-[#f3f3f3] p-4">
                    <p className="text-sm font-black text-[#75a62f]">
                      {item.category}
                    </p>

                    <p className="text-lg font-black text-[#060d57]">
                      {item.name}
                    </p>

                    <p className="mt-1 text-sm font-bold text-gray-600">
                      ${item.price} each
                    </p>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => decreaseItem(item.id)}
                          className="h-10 w-10 rounded-xl bg-white font-black text-[#060d57]"
                        >
                          −
                        </button>

                        <span className="min-w-8 text-center text-lg font-black text-[#060d57]">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => increaseItem(item.id)}
                          className="h-10 w-10 rounded-xl bg-[#060d57] font-black text-white"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="rounded-xl bg-red-50 px-4 py-2 font-black text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-5 rounded-2xl bg-[#060d57] p-5 text-white">
              <div className="flex justify-between text-2xl font-black">
                <span>Total</span>
                <span>${subtotal}</span>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full rounded-2xl border border-gray-300 px-5 py-4 font-semibold text-[#060d57] outline-none focus:border-[#75a62f]"
              />

              <div className="grid grid-cols-3 gap-3">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="rounded-2xl border border-gray-300 px-3 py-4 font-semibold text-[#060d57] outline-none focus:border-[#75a62f]"
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
                  placeholder="WhatsApp Number"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="col-span-2 rounded-2xl border border-gray-300 px-5 py-4 font-semibold text-[#060d57] outline-none focus:border-[#75a62f]"
                />
              </div>

              <input
                type="email"
                placeholder="Email Address optional"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-gray-300 px-5 py-4 font-semibold text-[#060d57] outline-none focus:border-[#75a62f]"
              />

              <div>
                <label className="mb-2 block text-sm font-black text-[#060d57]">
                  Pickup Date
                </label>

                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => {
                    setPickupDate(e.target.value);
                    setPickupTime("");
                  }}
                  className="w-full rounded-2xl border border-gray-300 px-5 py-4 font-semibold text-[#060d57] outline-none focus:border-[#75a62f]"
                />

                {pickupDate && !isTuesdayToFriday(pickupDate) && (
                  <p className="mt-2 text-sm font-black text-red-500">
                    Pickup is only available Tuesday to Friday.
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-black text-[#060d57]">
                  Pickup Time
                </label>

                <select
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 font-semibold text-[#060d57] outline-none focus:border-[#75a62f]"
                >
                  <option value="">Select pickup time</option>

                  {availablePickupTimes.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              <textarea
                placeholder="Order notes optional"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="h-28 w-full rounded-2xl border border-gray-300 px-5 py-4 font-semibold text-[#060d57] outline-none focus:border-[#75a62f]"
              />

              <label className="flex items-start gap-3 rounded-2xl bg-[#f3f3f3] p-4">
                <input
                  type="checkbox"
                  checked={subscribe}
                  onChange={() => setSubscribe(!subscribe)}
                  className="mt-1"
                />

                <span className="text-sm font-bold text-[#060d57]">
                  Yes, I’d like to receive updates, discounts and special meal
                  offers.
                </span>
              </label>

              <button
                onClick={submitOrder}
                disabled={loading || !orderingOpen}
                className={`w-full rounded-2xl py-4 font-black text-white ${
                  loading || !orderingOpen
                    ? "cursor-not-allowed bg-gray-400"
                    : "bg-[#75a62f]"
                }`}
              >
                {loading ? "Submitting Order..." : "Submit Order"}
              </button>

              <a
                href="/request-packed-meals"
                className="block rounded-2xl border-2 border-[#060d57] py-4 text-center font-black text-[#060d57]"
              >
                Request Weekly Packed Meals
              </a>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}