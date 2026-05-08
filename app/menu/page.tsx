"use client";

import { useEffect, useState } from "react";

/* =========================
   MENU DATA SECTION
========================= */

const menuCategories = [
  {
    title: "Burgers",
    description:
      "100% homemade burgers sautéed with onion, mushrooms, lettuce, tomato, ketchup, mustard and mayo. Choice of wheat, white bread or tortilla.",
    items: [
      { name: "Ground Beef", price: 20, cal: 476, pro: "30g", carb: "49g", fat: "29g" },
      { name: "Ground Chicken", price: 15, cal: 393, pro: "29g", carb: "49g", fat: "13g" },
      { name: "Chicken Breast", price: 15, cal: 357, pro: "35g", carb: "49g", fat: "5g" },
      { name: "Fish", price: 20, cal: 341, pro: "32g", carb: "49g", fat: "6g" },
      { name: "Shrimp", price: 25, cal: 293, pro: "21g", carb: "49g", fat: "1g" },
      { name: "Salmon", price: 28, cal: 365, pro: "30g", carb: "49g", fat: "9g" },
    ],
  },
  {
    title: "Wraps",
    description:
      "Flour/wheat tortilla filled with protein, salad, mushroom, salsa, cheese and sour cream.",
    items: [
      { name: "Ground Beef", price: 24, cal: 708, pro: "38g", carb: "41g", fat: "45g" },
      { name: "Ground Chicken", price: 19, cal: 625, pro: "37g", carb: "41g", fat: "37g" },
      { name: "Chicken", price: 19, cal: 589, pro: "43g", carb: "41g", fat: "29g" },
      { name: "Fish", price: 25, cal: 573, pro: "40g", carb: "41g", fat: "30g" },
      { name: "Shrimp", price: 35, cal: 585, pro: "41g", carb: "41g", fat: "30g" },
      { name: "Salmon", price: 30, cal: 597, pro: "38g", carb: "41g", fat: "33g" },
      { name: "Steak", price: 32, cal: 659, pro: "43g", carb: "41g", fat: "34g" },
    ],
  },
  {
    title: "Veggie Wrap",
    description:
      "Flour/wheat tortilla filled with 4oz sweet or white potatoes sautéed with bell peppers, onions, veggies, mushroom, cheese and sour cream.",
    items: [
      { name: "Veggie", price: 15, cal: 618, pro: "19g", carb: "76g", fat: "29g" },
    ],
  },
  {
    title: "Salads",
    description:
      "A crisp flour/wheat tortilla bowl filled with lettuce, tomatoes, onions, mushrooms, cucumber, cheese and sour cream. Topped with protein of your choice and salad dressing.",
    items: [
      { name: "Ground Beef", price: 35, cal: 604, pro: "39g", carb: "43g", fat: "31g" },
      { name: "Ground Chicken", price: 30, cal: 521, pro: "38g", carb: "43g", fat: "23g" },
      { name: "Chicken", price: 30, cal: 485, pro: "44g", carb: "43g", fat: "15g" },
      { name: "Fish", price: 35, cal: 469, pro: "41g", carb: "43g", fat: "16g" },
      { name: "Shrimp", price: 50, cal: 481, pro: "42g", carb: "43g", fat: "18g" },
      { name: "Salmon", price: 45, cal: 493, pro: "44g", carb: "43g", fat: "19g" },
      { name: "Steak", price: 45, cal: 555, pro: "44g", carb: "43g", fat: "20g" },
    ],
  },
  {
    title: "Bowl",
    description:
      "Flour/wheat tortilla filled with beans and rice, lettuce, tomatoes, onions, mushrooms, cucumber, cheese and sour cream. Topped with protein of your choice and salad dressing.",
    items: [
      { name: "Ground Beef", price: 40, cal: 832, pro: "44g", carb: "77g", fat: "56g" },
      { name: "Ground Chicken", price: 35, cal: 749, pro: "43g", carb: "77g", fat: "48g" },
      { name: "Chicken", price: 35, cal: 713, pro: "49g", carb: "77g", fat: "40g" },
      { name: "Fish", price: 40, cal: 697, pro: "46g", carb: "77g", fat: "41g" },
      { name: "Shrimp", price: 55, cal: 709, pro: "47g", carb: "77g", fat: "41g" },
      { name: "Salmon", price: 50, cal: 721, pro: "44g", carb: "77g", fat: "48g" },
      { name: "Steak", price: 50, cal: 783, pro: "49g", carb: "77g", fat: "45g" },
    ],
  },
  {
    title: "Sweet Potato Meals",
    description:
      "Sweet potato sautéed with bell peppers, onions and mushrooms, with side salad, veggies and protein of your choice.",
    items: [
      { name: "Chicken", price: 32, cal: 636, pro: "48g", carb: "76g", fat: "17g" },
      { name: "Fish", price: 40, cal: 612, pro: "44g", carb: "76g", fat: "18g" },
      { name: "Shrimp", price: 45, cal: 570, pro: "33g", carb: "76g", fat: "17g" },
      { name: "Salmon", price: 50, cal: 648, pro: "41g", carb: "76g", fat: "23g" },
      { name: "Steak", price: 50, cal: 741, pro: "48g", carb: "76g", fat: "24g" },
    ],
  },
  {
    title: "Stuffed Potato Meals",
    description:
      "Stuffed potato with protein of your choice and sautéed bell peppers, onions and mushrooms, salad and veggies on the side.",
    items: [
      { name: "Veggie", price: 20, cal: 718, pro: "25g", carb: "87g", fat: "33g" },
      { name: "Chicken", price: 30, cal: 792, pro: "49g", carb: "76g", fat: "34g" },
      { name: "Fish", price: 35, cal: 776, pro: "46g", carb: "76g", fat: "35g" },
      { name: "Shrimp", price: 35, cal: 728, pro: "35g", carb: "76g", fat: "34g" },
      { name: "Salmon", price: 40, cal: 800, pro: "44g", carb: "76g", fat: "38g" },
      { name: "Steak", price: 40, cal: 862, pro: "49g", carb: "76g", fat: "39g" },
    ],
  },
  {
    title: "Veggie Rice Meals",
    description:
      "Rice sautéed with bell peppers, onions, mushrooms, carrots and broccoli, with side salad and protein of your choice.",
    items: [
      { name: "Veggie", price: 17, cal: 468, pro: "11g", carb: "64g", fat: "17g" },
      { name: "Chicken", price: 25, cal: 604, pro: "48g", carb: "64g", fat: "19g" },
      { name: "Fish", price: 30, cal: 580, pro: "44g", carb: "64g", fat: "20g" },
      { name: "Shrimp", price: 40, cal: 538, pro: "33g", carb: "64g", fat: "19g" },
      { name: "Salmon", price: 40, cal: 616, pro: "41g", carb: "64g", fat: "25g" },
      { name: "Steak", price: 40, cal: 709, pro: "48g", carb: "64g", fat: "26g" },
      { name: "Ground Beef", price: 30, cal: 783, pro: "42g", carb: "64g", fat: "43g" },
      { name: "Ground Chicken", price: 25, cal: 658, pro: "39g", carb: "64g", fat: "29g" },
    ],
  },
  {
    title: "Sweet Potato Fries Meals",
    description:
      "Oven baked sweet potato fries with side salad, veggies and protein of your choice.",
    items: [
      { name: "Veggie", price: 25, cal: 500, pro: "11g", carb: "76g", fat: "17g" },
      { name: "Chicken", price: 32, cal: 636, pro: "48g", carb: "76g", fat: "19g" },
      { name: "Fish", price: 40, cal: 612, pro: "41g", carb: "76g", fat: "20g" },
      { name: "Shrimp", price: 50, cal: 570, pro: "33g", carb: "76g", fat: "19g" },
      { name: "Salmon", price: 50, cal: 648, pro: "41g", carb: "76g", fat: "25g" },
      { name: "Steak", price: 50, cal: 741, pro: "48g", carb: "76g", fat: "26g" },
    ],
  },
  {
    title: "Dieter’s Olive Oil Pasta",
    description:
      "Wheat noodles sautéed with bell peppers, onions, broccoli and carrots with olive or coconut oil and protein of your choice.",
    items: [
      { name: "Veggie", price: 20, cal: 416, pro: "18g", carb: "89g", fat: "3g" },
      { name: "Chicken", price: 25, cal: 602, pro: "57g", carb: "89g", fat: "5g" },
      { name: "Fish", price: 35, cal: 578, pro: "53g", carb: "89g", fat: "6g" },
      { name: "Shrimp", price: 35, cal: 536, pro: "42g", carb: "91g", fat: "5g" },
      { name: "Salmon", price: 40, cal: 614, pro: "50g", carb: "89g", fat: "11g" },
      { name: "Steak", price: 40, cal: 707, pro: "57g", carb: "89g", fat: "12g" },
      { name: "Ground Beef", price: 30, cal: 721, pro: "50g", carb: "89g", fat: "29g" },
      { name: "Ground Chicken", price: 25, cal: 656, pro: "48g", carb: "89g", fat: "15g" },
    ],
  },
  {
    title: "Gainer’s Cream Pasta",
    description:
      "Noodles sautéed with bell peppers, onions, broccoli and carrots with special cream sauce.",
    items: [
      { name: "Veggie", price: 25, cal: 939, pro: "29g", carb: "127g", fat: "47g" },
      { name: "Chicken", price: 35, cal: 1075, pro: "66g", carb: "116g", fat: "48g" },
      { name: "Fish", price: 40, cal: 1051, pro: "62g", carb: "116g", fat: "49g" },
      { name: "Shrimp", price: 45, cal: 1009, pro: "51g", carb: "116g", fat: "48g" },
      { name: "Salmon", price: 45, cal: 1087, pro: "59g", carb: "116g", fat: "54g" },
      { name: "Steak", price: 50, cal: 1180, pro: "66g", carb: "116g", fat: "55g" },
      { name: "Ground Beef", price: 40, cal: 1254, pro: "59g", carb: "116g", fat: "72g" },
      { name: "Ground Chicken", price: 35, cal: 1129, pro: "57g", carb: "116g", fat: "58g" },
    ],
  },
  {
    title: "Quesadilla",
    description:
      "Grilled flour tortilla stuffed with steak or chicken, cheese and jalapeno peppers.",
    items: [
      { name: "Ground Beef", price: 30, cal: 952, pro: "56g", carb: "36g", fat: "58g" },
      { name: "Ground Chicken", price: 27, cal: 869, pro: "55g", carb: "36g", fat: "50g" },
      { name: "Chicken Breast", price: 27, cal: 833, pro: "61g", carb: "36g", fat: "42g" },
      { name: "Fish", price: 31, cal: 817, pro: "58g", carb: "36g", fat: "43g" },
      { name: "Shrimp", price: 44, cal: 829, pro: "59g", carb: "37g", fat: "43g" },
      { name: "Salmon", price: 38, cal: 841, pro: "56g", carb: "36g", fat: "46g" },
      { name: "Steak", price: 39, cal: 903, pro: "61g", carb: "36g", fat: "48g" },
    ],
  },
];

/* =========================
   MAIN MENU PAGE SECTION
========================= */

export default function MenuPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  const activeCategory = menuCategories[activeIndex];
  const nextCategory = menuCategories[(activeIndex + 1) % menuCategories.length];

  function updateCartSummary() {
    const cart = JSON.parse(localStorage.getItem("macroMealsCart") || "[]");

    const totalItems = cart.reduce(
      (total: number, meal: any) => total + meal.quantity,
      0
    );

    const totalPrice = cart.reduce(
      (total: number, meal: any) => total + meal.price * meal.quantity,
      0
    );

    setCartCount(totalItems);
    setCartTotal(totalPrice);
  }

  useEffect(() => {
    updateCartSummary();
  }, []);

  function goPrevious() {
    setActiveIndex((current) =>
      current === 0 ? menuCategories.length - 1 : current - 1
    );
  }

  function goNext() {
    setActiveIndex((current) =>
      current === menuCategories.length - 1 ? 0 : current + 1
    );
  }

  function addToCart(item: any) {
    const cart = JSON.parse(localStorage.getItem("macroMealsCart") || "[]");

    const cartItem = {
      id: `${activeCategory.title}-${item.name}`,
      category: activeCategory.title,
      name: item.name,
      price: item.price,
      cal: item.cal,
      pro: item.pro,
      carb: item.carb,
      fat: item.fat,
      quantity: 1,
    };

    const existingItem = cart.find((meal: any) => meal.id === cartItem.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push(cartItem);
    }

    localStorage.setItem("macroMealsCart", JSON.stringify(cart));
    updateCartSummary();
  }

  return (
    <main className="min-h-screen bg-[#f3f3f3] px-4 py-8 pb-28">
      <div className="mx-auto max-w-5xl">

        {/* =========================
           HEADER SECTION
        ========================= */}

        <div className="mb-6 text-center">
          <img
            src="/logo.png"
            alt="Macro Meals On Wheels"
            className="mx-auto mb-4 w-32 md:w-44"
          />

          <h1 className="text-5xl font-black text-[#060d57] md:text-6xl">
            OUR MENU
          </h1>
            <div className="mx-auto mt-5 flex max-w-md flex-wrap items-center justify-center gap-3 rounded-2xl bg-[#f3f3f3] px-5 py-4 shadow-inner">
  <div className="text-center">
    <p className="text-xs font-black uppercase tracking-wide text-[#75a62f]">
      Open Days
    </p>
    <p className="mt-1 text-sm font-black text-[#060d57]">
      Tuesday - Friday
    </p>
  </div>

  <div className="h-10 w-px bg-gray-300" />

  <div className="text-center">
    <p className="text-xs font-black uppercase tracking-wide text-[#75a62f]">
      Hours
    </p>
    <p className="mt-1 text-sm font-black text-[#060d57]">
      11:00 AM - 7:30 PM
    </p>
  </div>
</div>
          <p className="mt-3 text-lg font-bold text-[#75a62f]">
            Choose your meal. Pick your protein. Fuel your goals.
          </p>

          <a
            href="/cart"
            className="mt-5 hidden rounded-2xl bg-[#75a62f] px-6 py-3 font-bold text-white md:inline-block"
          >
            View Order ({cartCount}) - ${cartTotal}
          </a>
        </div>

        {/* =========================
           ACTIVE CATEGORY CARD SECTION
        ========================= */}

        <section className="rounded-3xl bg-white p-5 shadow-xl md:p-6">
          <div className="mb-4 text-center">
            <p className="text-sm font-bold text-[#75a62f]">
              Category {activeIndex + 1} of {menuCategories.length}
            </p>

            <h2 className="mt-2 text-4xl font-black text-[#060d57]">
              {activeCategory.title}
            </h2>

            <p className="mt-3 leading-relaxed text-gray-600">
              {activeCategory.description}
            </p>
          </div>

          {/* =========================
             CATEGORY NAVIGATION SECTION
          ========================= */}

          <div className="mb-6 mt-5 rounded-3xl bg-[#f3f3f3] p-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white p-3 text-left shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-wide text-[#75a62f]">
                  Current Category
                </p>
                <p className="mt-1 text-sm font-black text-[#060d57]">
                  {activeCategory.title}
                </p>
              </div>

              <button
                onClick={goNext}
                className="rounded-2xl bg-white p-3 text-left shadow-sm"
              >
                <p className="text-[10px] font-black uppercase tracking-wide text-[#75a62f]">
                  Up Next
                </p>
                <p className="mt-1 text-sm font-black text-[#060d57]">
                  {nextCategory.title}
                </p>
              </button>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <button
                onClick={goPrevious}
                className="rounded-2xl bg-white py-3 text-sm font-black text-[#060d57] shadow-sm"
              >
                ← Back
              </button>

              <button
                onClick={goNext}
                className="rounded-2xl bg-[#75a62f] py-3 text-sm font-black text-white shadow-sm"
              >
                Next →
              </button>
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {menuCategories.map((category, index) => (
                <button
                  key={category.title}
                  onClick={() => setActiveIndex(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    activeIndex === index
                      ? "w-8 bg-[#060d57]"
                      : "w-2.5 bg-gray-300"
                  }`}
                  aria-label={`Go to ${category.title}`}
                />
              ))}
            </div>
          </div>

          {/* =========================
             MENU ITEMS SECTION
          ========================= */}

          <div className="space-y-4">
            {activeCategory.items.map((item) => (
              <div
                key={item.name}
                className="rounded-2xl border border-gray-200 p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-black text-[#060d57]">
                        {item.name}
                      </h3>

                      <span className="rounded-full bg-[#75a62f]/10 px-3 py-1 text-lg font-black text-[#75a62f]">
                        ${item.price}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-gray-600">
                      {item.cal} Cal | {item.pro} Protein | {item.carb} Carb |{" "}
                      {item.fat} Fat
                    </p>
                  </div>

                  <button
                    onClick={() => addToCart(item)}
                    className="shrink-0 rounded-xl bg-[#060d57] px-6 py-3 font-bold text-white hover:bg-[#0b1675]"
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================
           STICKY MOBILE CART SECTION
        ========================= */}

        {cartCount > 0 && (
          <a
            href="/cart"
            className="fixed bottom-4 left-4 right-4 z-50 rounded-3xl bg-[#060d57] px-5 py-4 text-white shadow-2xl md:hidden"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white/70">
                  {cartCount} item{cartCount > 1 ? "s" : ""}
                </p>

                <p className="text-2xl font-black">View Order</p>
              </div>

              <div className="rounded-2xl bg-[#75a62f] px-5 py-3 text-xl font-black">
                ${cartTotal}
              </div>
            </div>
          </a>
        )}
      </div>
    </main>
  );
}