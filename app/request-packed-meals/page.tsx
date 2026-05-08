"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

const menuCategories = [
  {
    title: "Burgers",
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
    items: [{ name: "Veggie", price: 15 }],
  },
  {
    title: "Salads",
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

type SelectedMeal = {
  id: string;
  category: string;
  name: string;
  price: number;
  quantity: number;
};

export default function PackedMealRequestPage() {
  const [fullName, setFullName] = useState("");
  const [countryCode, setCountryCode] = useState("+1268");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [requestedStartDate, setRequestedStartDate] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [notes, setNotes] = useState("");
  const [containerOption, setContainerOption] = useState("Need Containers");
  const [subscribe, setSubscribe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [selectedMeals, setSelectedMeals] = useState<SelectedMeal[]>([]);

  const activeCategory = menuCategories[activeCategoryIndex];

  const totalMeals = selectedMeals.reduce(
    (total, meal) => total + meal.quantity,
    0
  );

  const subtotal = selectedMeals.reduce(
    (total, meal) => total + meal.price * meal.quantity,
    0
  );

  const isMemberCode = promoCode.trim().toUpperCase() === "HEALTHADDICT26";
  const discountPercent = totalMeals >= 7 ? (isMemberCode ? 15 : 10) : 0;
  const discountAmount = subtotal * (discountPercent / 100);
  const containerFee =
    containerOption === "Need Containers" ? totalMeals * 2 : 0;
  const estimatedTotal = subtotal - discountAmount + containerFee;

  function isAtLeastTwoDaysAhead(dateValue: string) {
    const today = new Date();
    const selectedDate = new Date(dateValue + "T00:00:00");

    today.setHours(0, 0, 0, 0);

    const differenceInMs = selectedDate.getTime() - today.getTime();
    const differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);

    return differenceInDays >= 2;
  }

  function addMeal(category: string, item: { name: string; price: number }) {
    const id = `${category}-${item.name}`;

    setSelectedMeals((currentMeals) => {
      const existingMeal = currentMeals.find((meal) => meal.id === id);

      if (existingMeal) {
        return currentMeals.map((meal) =>
          meal.id === id ? { ...meal, quantity: meal.quantity + 1 } : meal
        );
      }

      return [
        ...currentMeals,
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

  function decreaseMeal(id: string) {
    setSelectedMeals((currentMeals) =>
      currentMeals
        .map((meal) =>
          meal.id === id ? { ...meal, quantity: meal.quantity - 1 } : meal
        )
        .filter((meal) => meal.quantity > 0)
    );
  }

  function increaseMeal(id: string) {
    setSelectedMeals((currentMeals) =>
      currentMeals.map((meal) =>
        meal.id === id ? { ...meal, quantity: meal.quantity + 1 } : meal
      )
    );
  }

  function removeMeal(id: string) {
    setSelectedMeals((currentMeals) =>
      currentMeals.filter((meal) => meal.id !== id)
    );
  }

  async function submitRequest() {
    if (!fullName || !whatsapp || !email || !requestedStartDate) {
      alert(
        "Please fill in your name, WhatsApp number, email address and requested meal start date."
      );
      return;
    }

    if (totalMeals < 7) {
      alert("Packed meal requests must include at least 7 meals.");
      return;
    }

    if (!isAtLeastTwoDaysAhead(requestedStartDate)) {
      alert(
        "Packed meal requests must be submitted at least 2 days in advance."
      );
      return;
    }

    setLoading(true);

    const fullWhatsapp = `${countryCode}${whatsapp}`;

    const requestItems = selectedMeals.map((meal) => ({
      category: meal.category,
      name: meal.name,
      price: meal.price,
      quantity: meal.quantity,
      total: meal.price * meal.quantity,
    }));

    const { error } = await supabase.from("packed_meal_requests").insert([
      {
        customer_name: fullName,
        whatsapp: fullWhatsapp,
        email,
        meals_count: totalMeals,
        requested_start_date: requestedStartDate,
        notes,
        promo_code: promoCode.trim(),
        discount_percent: discountPercent,
        items: requestItems,
        subtotal,
        estimated_total: estimatedTotal,
        container_option: containerOption,
        container_fee: containerFee,
        subscribe,
        status: "New Request",
      },
    ]);

    if (error) {
      console.error(error);
      alert("Failed to submit packed meal request.");
      setLoading(false);
      return;
    }

    const mealBreakdown = selectedMeals
      .map(
        (meal) =>
          `${meal.quantity}x ${meal.category} - ${meal.name} - $${
            meal.price * meal.quantity
          }`
      )
      .join("\n");

    const message = `
New Packed Meal Request

Customer: ${fullName}
WhatsApp: ${fullWhatsapp}
Email: ${email}

Requested Meal Start Date: ${requestedStartDate}
Total Meals: ${totalMeals}

Selected Meals:
${mealBreakdown}

Subtotal: $${subtotal}
Discount Applied: ${discountPercent}%
Discount Amount: -$${discountAmount.toFixed(2)}

Container Option: ${containerOption}
Container Fee: $${containerFee.toFixed(2)}

Estimated Total: $${estimatedTotal.toFixed(2)}

Promo Code: ${promoCode.trim() || "N/A"}
Subscribed to Updates: ${subscribe ? "Yes" : "No"}

Notes:
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
    <main className="min-h-screen bg-[#f3f3f3] px-4 py-8 pb-28">
      <div className="mx-auto max-w-7xl">
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
            Select 7 or more meals for the week ahead. Requests must be
            submitted at least 2 days in advance.
          </p>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-xl">
            <p className="text-sm font-black uppercase tracking-wide text-[#75a62f]">
              Packed Meal Discount
            </p>

            <h2 className="mt-2 text-4xl font-black text-[#060d57]">
              10% Off
            </h2>

            <p className="mt-2 font-semibold text-gray-600">
              Automatically applied when selecting 7 or more meals.
            </p>
          </div>

          <div className="rounded-3xl bg-[#060d57] p-6 text-white shadow-xl">
            <p className="text-sm font-black uppercase tracking-wide text-white/70">
              Weekly Requests
            </p>

            <h2 className="mt-2 text-4xl font-black">2 Days Ahead</h2>

            <p className="mt-2 font-semibold text-white/80">
              Requests must be submitted at least 2 days before the requested
              meal start date.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-xl">
            <p className="text-sm font-black uppercase tracking-wide text-[#75a62f]">
              Containers
            </p>

            <h2 className="mt-2 text-4xl font-black text-[#060d57]">
              $2 Each
            </h2>

            <p className="mt-2 font-semibold text-gray-600">
              Container fee applies unless you provide your own containers in
              advance.
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <section className="rounded-3xl bg-white p-6 shadow-xl">
            <h2 className="mb-6 text-3xl font-black text-[#060d57]">
              Customer Details
            </h2>

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
                  className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 font-semibold text-[#060d57] placeholder:text-gray-500 outline-none focus:border-[#75a62f]"
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
                    className="rounded-2xl border border-gray-300 bg-white px-3 py-4 font-semibold text-[#060d57] outline-none focus:border-[#75a62f]"
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
                    className="col-span-2 rounded-2xl border border-gray-300 bg-white px-5 py-4 font-semibold text-[#060d57] placeholder:text-gray-500 outline-none focus:border-[#75a62f]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-black text-[#060d57]">
                  Email Address *
                </label>

                <input
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 font-semibold text-[#060d57] placeholder:text-gray-500 outline-none focus:border-[#75a62f]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-black text-[#060d57]">
                  Requested Meal Start Date *
                </label>

                <input
                  type="date"
                  value={requestedStartDate}
                  onChange={(e) => setRequestedStartDate(e.target.value)}
                  className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 font-semibold text-[#060d57] outline-none focus:border-[#75a62f]"
                />

                <p className="mt-2 text-sm font-semibold text-gray-600">
                  Select the date you would like your packed meals to begin.
                  Requests must be submitted at least 2 days in advance.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-black text-[#060d57]">
                  Container Option *
                </label>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setContainerOption("Need Containers")}
                    className={`w-full rounded-2xl border-2 px-5 py-4 text-left font-black ${
                      containerOption === "Need Containers"
                        ? "border-[#060d57] bg-[#060d57] text-white"
                        : "border-gray-300 bg-white text-[#060d57]"
                    }`}
                  >
                    I need containers ($2 per meal)
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setContainerOption("Providing Own Containers")
                    }
                    className={`w-full rounded-2xl border-2 px-5 py-4 text-left font-black ${
                      containerOption === "Providing Own Containers"
                        ? "border-[#75a62f] bg-[#75a62f] text-white"
                        : "border-gray-300 bg-white text-[#060d57]"
                    }`}
                  >
                    I will provide my own containers in advance
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-black text-[#060d57]">
                  Promo Code
                </label>

                <input
                  type="text"
                  placeholder="Enter promo code if you have one"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 font-semibold uppercase text-[#060d57] placeholder:text-gray-500 outline-none focus:border-[#75a62f]"
                />

                {isMemberCode && (
                  <p className="mt-2 text-sm font-black text-[#75a62f]">
                    Member discount applied.
                  </p>
                )}
              </div>

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

              <div>
                <label className="mb-2 block text-sm font-black text-[#060d57]">
                  Notes / Allergies / Meal Preferences
                </label>

                <textarea
                  placeholder="Add any special notes after selecting meals."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="h-36 w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 font-semibold text-[#060d57] placeholder:text-gray-500 outline-none focus:border-[#75a62f]"
                />
              </div>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-xl lg:col-span-1">
            <h2 className="mb-4 text-3xl font-black text-[#060d57]">
              Select Meals
            </h2>

            <p className="mb-4 font-semibold text-gray-600">
              Choose meals from the menu. Minimum 7 meals required.
            </p>

            <div className="mb-5 flex flex-wrap gap-2">
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

            <div className="rounded-3xl bg-[#f3f3f3] p-4">
              <h3 className="mb-4 text-2xl font-black text-[#060d57]">
                {activeCategory.title}
              </h3>

              <div className="space-y-3">
                {activeCategory.items.map((item) => (
                  <div
                    key={`${activeCategory.title}-${item.name}`}
                    className="rounded-2xl bg-white p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-lg font-black text-[#060d57]">
                          {item.name}
                        </p>

                        <p className="text-sm font-bold text-[#75a62f]">
                          ${item.price}
                        </p>
                      </div>

                      <button
                        onClick={() => addMeal(activeCategory.title, item)}
                        className="rounded-xl bg-[#060d57] px-5 py-3 font-black text-white"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-xl">
            <h2 className="mb-6 text-3xl font-black text-[#060d57]">
              Request Summary
            </h2>

            <div className="mb-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-[#f3f3f3] p-4">
                <p className="text-sm font-black uppercase text-[#75a62f]">
                  Meals
                </p>

                <p className="text-3xl font-black text-[#060d57]">
                  {totalMeals}
                </p>
              </div>

              <div className="rounded-2xl bg-[#f3f3f3] p-4">
                <p className="text-sm font-black uppercase text-[#75a62f]">
                  Discount
                </p>

                <p className="text-3xl font-black text-[#060d57]">
                  {discountPercent}%
                </p>
              </div>
            </div>

            {totalMeals < 7 && (
              <div className="mb-5 rounded-2xl border-2 border-red-500 bg-red-50 p-4">
                <p className="font-black text-red-600">
                  Add {7 - totalMeals} more meal
                  {7 - totalMeals === 1 ? "" : "s"} to qualify.
                </p>
              </div>
            )}

            <div className="mb-5 space-y-3">
              {selectedMeals.length === 0 ? (
                <p className="rounded-2xl bg-[#f3f3f3] p-4 font-semibold text-gray-600">
                  No meals selected yet.
                </p>
              ) : (
                selectedMeals.map((meal) => (
                  <div key={meal.id} className="rounded-2xl bg-[#f3f3f3] p-4">
                    <p className="text-sm font-black text-[#75a62f]">
                      {meal.category}
                    </p>

                    <p className="text-lg font-black text-[#060d57]">
                      {meal.name}
                    </p>

                    <p className="mt-1 text-sm font-bold text-gray-600">
                      ${meal.price} each
                    </p>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => decreaseMeal(meal.id)}
                          className="h-10 w-10 rounded-xl bg-white font-black text-[#060d57]"
                        >
                          −
                        </button>

                        <span className="min-w-8 text-center text-lg font-black text-[#060d57]">
                          {meal.quantity}
                        </span>

                        <button
                          onClick={() => increaseMeal(meal.id)}
                          className="h-10 w-10 rounded-xl bg-[#060d57] font-black text-white"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeMeal(meal.id)}
                        className="rounded-xl bg-red-50 px-4 py-2 font-black text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="rounded-3xl bg-[#060d57] p-5 text-white">
              <div className="flex justify-between font-bold text-white/80">
                <span>Subtotal</span>
                <span>${subtotal}</span>
              </div>

              <div className="mt-2 flex justify-between font-bold text-white/80">
                <span>Discount</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>

              <div className="mt-2 flex justify-between font-bold text-white/80">
                <span>Container Fee</span>
                <span>${containerFee.toFixed(2)}</span>
              </div>

              <div className="mt-4 flex justify-between border-t border-white/20 pt-4 text-2xl font-black">
                <span>Estimated Total</span>
                <span>${estimatedTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={submitRequest}
              disabled={loading}
              className="mt-5 w-full rounded-2xl bg-[#75a62f] py-4 font-black text-white"
            >
              {loading
                ? "Submitting Request..."
                : "Submit Packed Meal Request"}
            </button>

            <a
              href="/menu"
              className="mt-3 block rounded-2xl border-2 border-[#060d57] py-4 text-center font-black text-[#060d57]"
            >
              View Regular Menu
            </a>
          </section>
        </div>
      </div>
    </main>
  );
}