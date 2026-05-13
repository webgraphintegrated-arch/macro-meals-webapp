"use client";

import { useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

const fixedMeals = [
  {
    id: 1,
    name: "6oz Chicken Veggie Rice Meal",
    price: 25,
    macros: {
      calories: 357,
      protein: 35,
      carbs: 49,
      fat: 5,
    },
  },
  {
    id: 2,
    name: "6oz Chicken Sweet Potato Meal",
    price: 32,
    macros: {
      calories: 420,
      protein: 38,
      carbs: 52,
      fat: 6,
    },
  },
  {
    id: 3,
    name: "6oz Chicken Pasta Meal",
    price: 25,
    macros: {
      calories: 460,
      protein: 35,
      carbs: 58,
      fat: 8,
    },
  },
  {
    id: 4,
    name: "4oz Chicken Stuffed Potato Meal",
    price: 30,
    macros: {
      calories: 390,
      protein: 28,
      carbs: 45,
      fat: 7,
    },
  },
];

const countryCodes = [
  { label: "Antigua +1 268", value: "1268" },
  { label: "USA/Canada +1", value: "1" },
  { label: "UK +44", value: "44" },
  { label: "Jamaica +1 876", value: "1876" },
  { label: "Barbados +1 246", value: "1246" },
  { label: "Trinidad +1 868", value: "1868" },
];

const proteins = [
  { name: "Chicken Breast", pricePerOz: 2 },
  { name: "Fish", pricePerOz: 3 },
  { name: "Steak", pricePerOz: 5 },
  { name: "Shrimp", pricePerOz: 6 },
  { name: "Salmon", pricePerOz: 5 },
  { name: "Ground Beef", pricePerOz: 3 },
  { name: "Ground Chicken", pricePerOz: 1.5 },
];

const carbs = [
  { name: "Burger Bread", pricePerOz: 2 },
  { name: "Wheat Tortilla", pricePerOz: 2.5 },
  { name: "Rice", pricePerOz: 1.25 },
  { name: "Beans", pricePerOz: 1 },
  { name: "French Fries", pricePerOz: 1 },
  { name: "Sweet Potato French Fries", pricePerOz: 2.25 },
  { name: "Sweet Potato", pricePerOz: 1.25 },
  { name: "White Potato", pricePerOz: 1 },
  { name: "Whole Wheat Noodles", pricePerOz: 1.25 },
  { name: "Plain Noodles", pricePerOz: 1 },
  { name: "No Carb", pricePerOz: 0 },
];

const fats = [
  { name: "Olive Oil", price: 2 },
  { name: "Coconut Oil", price: 2 },
  { name: "Avocado Oil", price: 2 },
  { name: "Avocado", price: 2 },
  { name: "Cream Sauce", price: 2 },
  { name: "Cheese", price: 3 },
  { name: "No Fat", price: 0 },
];

const sides = [
  { name: "Steamed Veg", price: 5 },
  { name: "Salad", price: 5 },
  { name: "Veg + Salad", price: 8 },
  { name: "No Side", price: 0 },
];

type MealMode = "fixed" | "custom";

const fieldClass =
  "w-full rounded-2xl border border-slate-300 bg-white p-4 text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100";

function cleanPhoneNumber(value: string) {
  return value.replace(/\D/g, "");
}

function isAtLeastTwoDaysAhead(dateValue: string) {
  if (!dateValue) return false;

  const today = new Date();
  const selectedDate = new Date(dateValue + "T00:00:00");

  today.setHours(0, 0, 0, 0);

  const differenceInMs = selectedDate.getTime() - today.getTime();
  const differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);

  return differenceInDays >= 2;
}

function MealBuilder({
  label,
  mode,
  setMode,
  fixedMeal,
  setFixedMeal,
  protein,
  setProtein,
  proteinOz,
  setProteinOz,
  carb,
  setCarb,
  carbOz,
  setCarbOz,
  fat,
  setFat,
  side,
  setSide,
}: any) {
  const total =
    mode === "fixed"
      ? fixedMeal.price
      : protein.pricePerOz * proteinOz +
        carb.pricePerOz * carbOz +
        fat.price +
        side.price;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-xl font-bold text-slate-900">{label}</h3>

      <label className="mb-2 block font-semibold">Meal Type</label>

      <select
        className={fieldClass}
        value={mode}
        onChange={(e) => setMode(e.target.value as MealMode)}
      >
        <option value="fixed">Fixed Menu Meal</option>
        <option value="custom">Custom Build</option>
      </select>

      {mode === "fixed" ? (
        <div className="mt-4">
          <label className="mb-2 block font-semibold">Choose Meal</label>

          <select
            className={fieldClass}
            value={fixedMeal.id}
            onChange={(e) =>
              setFixedMeal(
                fixedMeals.find(
                  (meal) => meal.id === Number(e.target.value)
                ) || fixedMeals[0]
              )
            }
          >
            {fixedMeals.map((meal) => (
              <option key={meal.id} value={meal.id}>
                {meal.name} - ${meal.price}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-semibold">Protein</label>

              <select
                className={fieldClass}
                value={protein.name}
                onChange={(e) =>
                  setProtein(
                    proteins.find((item) => item.name === e.target.value) ||
                      proteins[0]
                  )
                }
              >
                {proteins.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name} - ${item.pricePerOz}/oz
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block font-semibold">Protein Oz</label>

              <input
                required
                type="number"
                min={0}
                className={fieldClass}
                value={proteinOz}
                onChange={(e) => setProteinOz(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-semibold">Carb</label>

              <select
                className={fieldClass}
                value={carb.name}
                onChange={(e) =>
                  setCarb(
                    carbs.find((item) => item.name === e.target.value) ||
                      carbs[0]
                  )
                }
              >
                {carbs.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name} - ${item.pricePerOz}/oz
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block font-semibold">Carb Oz</label>

              <input
                required
                type="number"
                min={0}
                className={fieldClass}
                value={carbOz}
                onChange={(e) => setCarbOz(Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block font-semibold">Fat / Sauce</label>

            <select
              className={fieldClass}
              value={fat.name}
              onChange={(e) =>
                setFat(
                  fats.find((item) => item.name === e.target.value) || fats[0]
                )
              }
            >
              {fats.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name} - ${item.price}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block font-semibold">Side</label>

            <select
              className={fieldClass}
              value={side.name}
              onChange={(e) =>
                setSide(
                  sides.find((item) => item.name === e.target.value) ||
                    sides[0]
                )
              }
            >
              {sides.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name} - ${item.price}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="mt-5 rounded-2xl bg-green-50 p-4">
        <p className="text-lg font-bold text-green-800">
          {label} Total: ${total.toFixed(2)}
        </p>

        {mode === "fixed" && fixedMeal.macros && (
          <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="rounded-xl bg-white p-3 text-center shadow-sm">
              <p className="text-xs font-semibold uppercase text-slate-500">
                Calories
              </p>
              <p className="text-lg font-bold text-slate-900">
                {fixedMeal.macros.calories}
              </p>
            </div>

            <div className="rounded-xl bg-white p-3 text-center shadow-sm">
              <p className="text-xs font-semibold uppercase text-slate-500">
                Protein
              </p>
              <p className="text-lg font-bold text-slate-900">
                {fixedMeal.macros.protein}g
              </p>
            </div>

            <div className="rounded-xl bg-white p-3 text-center shadow-sm">
              <p className="text-xs font-semibold uppercase text-slate-500">
                Carbs
              </p>
              <p className="text-lg font-bold text-slate-900">
                {fixedMeal.macros.carbs}g
              </p>
            </div>

            <div className="rounded-xl bg-white p-3 text-center shadow-sm">
              <p className="text-xs font-semibold uppercase text-slate-500">
                Fat
              </p>
              <p className="text-lg font-bold text-slate-900">
                {fixedMeal.macros.fat}g
              </p>
            </div>
          </div>
        )}

        {mode === "custom" && (
          <p className="mt-3 text-sm font-semibold text-slate-600">
            Custom build macros will vary based on your selected ounces and
            ingredients.
          </p>
        )}
      </div>
    </div>
  );
}

export default function MealPlanPage() {
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("1268");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [requestedPickupDate, setRequestedPickupDate] = useState("");
  const [containerOption, setContainerOption] = useState("Need Containers");
  const [notes, setNotes] = useState("");
  const [subscribe, setSubscribe] = useState(false);
  const [loading, setLoading] = useState(false);

  const [days, setDays] = useState(7);
  const [mealsPerDay, setMealsPerDay] = useState(2);
  const [discountCode, setDiscountCode] = useState("");

  const [mealOneMode, setMealOneMode] = useState<MealMode>("fixed");
  const [mealTwoMode, setMealTwoMode] = useState<MealMode>("fixed");
  const [mealThreeMode, setMealThreeMode] = useState<MealMode>("fixed");

  const [mealOneFixed, setMealOneFixed] = useState(fixedMeals[0]);
  const [mealTwoFixed, setMealTwoFixed] = useState(fixedMeals[1]);
  const [mealThreeFixed, setMealThreeFixed] = useState(fixedMeals[2]);

  const [mealOneProtein, setMealOneProtein] = useState(proteins[0]);
  const [mealOneProteinOz, setMealOneProteinOz] = useState(5);
  const [mealOneCarb, setMealOneCarb] = useState(carbs[6]);
  const [mealOneCarbOz, setMealOneCarbOz] = useState(10);
  const [mealOneFat, setMealOneFat] = useState(fats[6]);
  const [mealOneSide, setMealOneSide] = useState(sides[0]);

  const [mealTwoProtein, setMealTwoProtein] = useState(proteins[0]);
  const [mealTwoProteinOz, setMealTwoProteinOz] = useState(5);
  const [mealTwoCarb, setMealTwoCarb] = useState(carbs[6]);
  const [mealTwoCarbOz, setMealTwoCarbOz] = useState(10);
  const [mealTwoFat, setMealTwoFat] = useState(fats[6]);
  const [mealTwoSide, setMealTwoSide] = useState(sides[0]);

  const [mealThreeProtein, setMealThreeProtein] = useState(proteins[0]);
  const [mealThreeProteinOz, setMealThreeProteinOz] = useState(5);
  const [mealThreeCarb, setMealThreeCarb] = useState(carbs[6]);
  const [mealThreeCarbOz, setMealThreeCarbOz] = useState(10);
  const [mealThreeFat, setMealThreeFat] = useState(fats[6]);
  const [mealThreeSide, setMealThreeSide] = useState(sides[0]);

  const getMealTotal = (
    mode: MealMode,
    fixed: any,
    protein: any,
    proteinOz: number,
    carb: any,
    carbOz: number,
    fat: any,
    side: any
  ) =>
    mode === "fixed"
      ? fixed.price
      : protein.pricePerOz * proteinOz +
        carb.pricePerOz * carbOz +
        fat.price +
        side.price;

  const mealOneTotal = getMealTotal(
    mealOneMode,
    mealOneFixed,
    mealOneProtein,
    mealOneProteinOz,
    mealOneCarb,
    mealOneCarbOz,
    mealOneFat,
    mealOneSide
  );

  const mealTwoTotal = getMealTotal(
    mealTwoMode,
    mealTwoFixed,
    mealTwoProtein,
    mealTwoProteinOz,
    mealTwoCarb,
    mealTwoCarbOz,
    mealTwoFat,
    mealTwoSide
  );

  const mealThreeTotal = getMealTotal(
    mealThreeMode,
    mealThreeFixed,
    mealThreeProtein,
    mealThreeProteinOz,
    mealThreeCarb,
    mealThreeCarbOz,
    mealThreeFat,
    mealThreeSide
  );

  const dailyTotal =
    mealsPerDay === 1
      ? mealOneTotal
      : mealsPerDay === 2
      ? mealOneTotal + mealTwoTotal
      : mealOneTotal + mealTwoTotal + mealThreeTotal;

  const totalMeals = days * mealsPerDay;
  const subtotal = useMemo(() => dailyTotal * days, [dailyTotal, days]);

  const discountPercent =
    totalMeals >= 7 && discountCode.trim().toUpperCase() === "HEALTHADDICT26"
      ? 15
      : totalMeals >= 7
      ? 10
      : 0;

  const discountAmount = subtotal * (discountPercent / 100);
  const containerFee =
    containerOption === "Need Containers" ? totalMeals * 2 : 0;
  const grandTotal = subtotal - discountAmount + containerFee;

  function mealText(
    mode: MealMode,
    fixedMeal: any,
    protein: any,
    proteinOz: number,
    carb: any,
    carbOz: number,
    fat: any,
    side: any
  ) {
    if (mode === "fixed") return fixedMeal.name;

    return `${proteinOz}oz ${protein.name}, ${carbOz}oz ${carb.name}, ${fat.name}, ${side.name}`;
  }

  async function handleWhatsapp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const cleanPhone = cleanPhoneNumber(phoneNumber);

    if (cleanPhone.startsWith("1268") || cleanPhone.startsWith("268")) {
      alert(
        "Please enter your WhatsApp number without the country code. The country code is already selected."
      );
      return;
    }

    if (cleanPhone.length < 7) {
      alert("Please enter a valid WhatsApp number.");
      return;
    }

    if (!requestedPickupDate) {
      alert("Please select your requested pickup date.");
      return;
    }

    if (!isAtLeastTwoDaysAhead(requestedPickupDate)) {
      alert("Weekly Meal Prep Requests must be submitted at least 2 days in advance.");
      return;
    }

    if (totalMeals < 7) {
      alert("Weekly Meal Prep Requests must include at least 7 meals.");
      return;
    }

    setLoading(true);

    const fullPhone = `${countryCode}${cleanPhone}`;

    const mealOneText = mealText(
      mealOneMode,
      mealOneFixed,
      mealOneProtein,
      mealOneProteinOz,
      mealOneCarb,
      mealOneCarbOz,
      mealOneFat,
      mealOneSide
    );

    const mealTwoText = mealText(
      mealTwoMode,
      mealTwoFixed,
      mealTwoProtein,
      mealTwoProteinOz,
      mealTwoCarb,
      mealTwoCarbOz,
      mealTwoFat,
      mealTwoSide
    );

    const mealThreeText = mealText(
      mealThreeMode,
      mealThreeFixed,
      mealThreeProtein,
      mealThreeProteinOz,
      mealThreeCarb,
      mealThreeCarbOz,
      mealThreeFat,
      mealThreeSide
    );

    const items = [
      {
        category: "Meal Plan",
        name: `Meal 1: ${mealOneText}`,
        price: mealOneTotal,
        quantity: days,
        total: mealOneTotal * days,
      },
      ...(mealsPerDay >= 2
        ? [
            {
              category: "Meal Plan",
              name: `Meal 2: ${mealTwoText}`,
              price: mealTwoTotal,
              quantity: days,
              total: mealTwoTotal * days,
            },
          ]
        : []),
      ...(mealsPerDay === 3
        ? [
            {
              category: "Meal Plan",
              name: `Meal 3: ${mealThreeText}`,
              price: mealThreeTotal,
              quantity: days,
              total: mealThreeTotal * days,
            },
          ]
        : []),
    ];

    const { error } = await supabase.from("packed_meal_requests").insert([
      {
        customer_name: customerName,
        whatsapp: `+${fullPhone}`,
        email,
        meals_count: totalMeals,
        requested_start_date: requestedPickupDate,
        notes,
        promo_code: discountCode.trim(),
        discount_percent: discountPercent,
        status: "New Request",
        items,
        subtotal,
        estimated_total: grandTotal,
        container_option: containerOption,
        container_fee: containerFee,
        subscribe,
      },
    ]);

    if (error) {
      console.error(error);
      alert("Failed to submit weekly meal prep request.");
      setLoading(false);
      return;
    }

    const message = `
MACRO MEALS PLAN REQUEST

Customer: ${customerName}
Email: ${email}
WhatsApp: +${fullPhone}

Requested Pickup Date: ${requestedPickupDate}

Plan:
${days} day(s)
${mealsPerDay} meal(s) per day
Total Meals: ${totalMeals}

Meal 1:
${mealOneText}
Price: $${mealOneTotal.toFixed(2)}

${
  mealsPerDay >= 2
    ? `Meal 2:
${mealTwoText}
Price: $${mealTwoTotal.toFixed(2)}`
    : ""
}

${
  mealsPerDay === 3
    ? `Meal 3:
${mealThreeText}
Price: $${mealThreeTotal.toFixed(2)}`
    : ""
}

Daily Total: $${dailyTotal.toFixed(2)}
Subtotal: $${subtotal.toFixed(2)}
Discount: ${discountPercent}% - $${discountAmount.toFixed(2)}
Container Option: ${containerOption}
Container Fee: $${containerFee.toFixed(2)}
Grand Total: $${grandTotal.toFixed(2)}

Discount Code: ${discountCode || "N/A"}
Subscribe: ${subscribe ? "Yes" : "No"}

Notes:
${notes || "None"}
`;

    window.open(
      `https://wa.me/12687808226?text=${encodeURIComponent(message)}`,
      "_blank"
    );

    setLoading(false);
    alert("Weekly Meal Prep Request submitted successfully.");
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6 text-slate-900">
      <form onSubmit={handleWhatsapp} className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-3xl bg-white p-6 shadow-sm">
          

          <h1 className="mt-2 text-4xl font-bold">
            Weekly Meal Prep Request
          </h1>

          <p className="mt-2 text-slate-600">
            7+ meals get 10% off. Health Addictions members use code
            HEALTHADDICT26 for 15% off.
          </p>

          <p className="mt-2 text-sm font-semibold text-slate-500">
            Requests must be submitted at least 2 days before pickup. Containers
            are $2 per meal unless you provide your own containers in advance.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-sm lg:col-span-2">
            <h2 className="mb-4 text-2xl font-bold">Customer Details</h2>

            <div className="mb-8 grid gap-4 md:grid-cols-2">
              <input
                required
                placeholder="Customer Name"
                className={fieldClass}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />

              <input
                required
                type="email"
                placeholder="Email Address"
                className={fieldClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <select
                required
                className={fieldClass}
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
              >
                {countryCodes.map((code) => (
                  <option key={code.value} value={code.value}>
                    {code.label}
                  </option>
                ))}
              </select>

              <input
                required
                type="tel"
                placeholder="WhatsApp Number without country code"
                className={fieldClass}
                value={phoneNumber}
                onChange={(e) =>
                  setPhoneNumber(cleanPhoneNumber(e.target.value))
                }
              />

              <div>
                <label className="mb-2 block font-semibold">
                  Requested Pickup Date
                </label>

                <input
                  required
                  type="date"
                  className={fieldClass}
                  value={requestedPickupDate}
                  onChange={(e) => setRequestedPickupDate(e.target.value)}
                />

                <p className="mt-2 text-sm font-semibold text-slate-500">
                  Must be at least 2 days in advance.
                </p>
              </div>

              <div>
                <label className="mb-2 block font-semibold">
                  Container Option
                </label>

                <select
                  required
                  className={fieldClass}
                  value={containerOption}
                  onChange={(e) => setContainerOption(e.target.value)}
                >
                  <option value="Need Containers">
                    I need containers ($2 per meal)
                  </option>
                  <option value="Providing Own Containers">
                    I will provide my own containers in advance
                  </option>
                </select>
              </div>
            </div>

            <div className="mb-8 grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block font-semibold">
                  Number of Days
                </label>

                <input
                  required
                  type="number"
                  min={1}
                  className={fieldClass}
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold">
                  Meals Per Day
                </label>

                <select
                  required
                  className={fieldClass}
                  value={mealsPerDay}
                  onChange={(e) => setMealsPerDay(Number(e.target.value))}
                >
                  <option value={1}>1 Meal</option>
                  <option value={2}>2 Meals</option>
                  <option value={3}>3 Meals</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block font-semibold">
                  Discount Code
                </label>

                <input
                  placeholder="Enter code if applicable"
                  className={fieldClass}
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-8 grid gap-4 md:grid-cols-2">
              <label className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                <input
                  type="checkbox"
                  checked={subscribe}
                  onChange={() => setSubscribe(!subscribe)}
                  className="mt-1"
                />

                <span className="text-sm font-semibold text-slate-700">
                  Yes, I’d like to receive updates, discounts and special meal
                  offers.
                </span>
              </label>

              <textarea
                placeholder="Notes, allergies or meal preferences"
                className={fieldClass}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="space-y-6">
              <MealBuilder
                label="Meal 1"
                mode={mealOneMode}
                setMode={setMealOneMode}
                fixedMeal={mealOneFixed}
                setFixedMeal={setMealOneFixed}
                protein={mealOneProtein}
                setProtein={setMealOneProtein}
                proteinOz={mealOneProteinOz}
                setProteinOz={setMealOneProteinOz}
                carb={mealOneCarb}
                setCarb={setMealOneCarb}
                carbOz={mealOneCarbOz}
                setCarbOz={setMealOneCarbOz}
                fat={mealOneFat}
                setFat={setMealOneFat}
                side={mealOneSide}
                setSide={setMealOneSide}
              />

              {mealsPerDay >= 2 && (
                <MealBuilder
                  label="Meal 2"
                  mode={mealTwoMode}
                  setMode={setMealTwoMode}
                  fixedMeal={mealTwoFixed}
                  setFixedMeal={setMealTwoFixed}
                  protein={mealTwoProtein}
                  setProtein={setMealTwoProtein}
                  proteinOz={mealTwoProteinOz}
                  setProteinOz={setMealTwoProteinOz}
                  carb={mealTwoCarb}
                  setCarb={setMealTwoCarb}
                  carbOz={mealTwoCarbOz}
                  setCarbOz={setMealTwoCarbOz}
                  fat={mealTwoFat}
                  setFat={setMealTwoFat}
                  side={mealTwoSide}
                  setSide={setMealTwoSide}
                />
              )}

              {mealsPerDay === 3 && (
                <MealBuilder
                  label="Meal 3"
                  mode={mealThreeMode}
                  setMode={setMealThreeMode}
                  fixedMeal={mealThreeFixed}
                  setFixedMeal={setMealThreeFixed}
                  protein={mealThreeProtein}
                  setProtein={setMealThreeProtein}
                  proteinOz={mealThreeProteinOz}
                  setProteinOz={setMealThreeProteinOz}
                  carb={mealThreeCarb}
                  setCarb={setMealThreeCarb}
                  carbOz={mealThreeCarbOz}
                  setCarbOz={setMealThreeCarbOz}
                  fat={mealThreeFat}
                  setFat={setMealThreeFat}
                  side={mealThreeSide}
                  setSide={setMealThreeSide}
                />
              )}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold">Quote Summary</h2>

            <div className="space-y-4">
              <div className="flex justify-between border-b pb-3">
                <span>Total Meals</span>
                <span className="font-semibold">{totalMeals}</span>
              </div>

              <div className="flex justify-between border-b pb-3">
                <span>Meal 1</span>
                <span className="font-semibold">
                  ${mealOneTotal.toFixed(2)}
                </span>
              </div>

              {mealsPerDay >= 2 && (
                <div className="flex justify-between border-b pb-3">
                  <span>Meal 2</span>
                  <span className="font-semibold">
                    ${mealTwoTotal.toFixed(2)}
                  </span>
                </div>
              )}

              {mealsPerDay === 3 && (
                <div className="flex justify-between border-b pb-3">
                  <span>Meal 3</span>
                  <span className="font-semibold">
                    ${mealThreeTotal.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex justify-between border-b pb-3">
                <span>Daily Total</span>
                <span className="font-semibold">${dailyTotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between border-b pb-3">
                <span>Subtotal</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between border-b pb-3">
                <span>Discount</span>
                <span className="font-semibold">
                  {discountPercent}% - ${discountAmount.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between border-b pb-3">
                <span>Container Fee</span>
                <span className="font-semibold">
                  ${containerFee.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between pt-3 text-2xl font-bold">
                <span>Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {totalMeals < 7 && (
              <p className="mt-4 rounded-2xl bg-yellow-50 p-3 text-sm font-semibold text-yellow-800">
                Discount applies only when ordering 7 meals or more.
              </p>
            )}

            {totalMeals >= 7 && discountPercent === 10 && (
              <p className="mt-4 rounded-2xl bg-green-50 p-3 text-sm font-semibold text-green-800">
                Regular 10% discount applied.
              </p>
            )}

            {totalMeals >= 7 && discountPercent === 15 && (
              <p className="mt-4 rounded-2xl bg-green-50 p-3 text-sm font-semibold text-green-800">
                Health Addictions member 15% discount applied.
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-8 w-full rounded-2xl bg-green-600 px-5 py-4 font-bold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {loading ? "Submitting..." : "Submit Weekly Meal Prep Request"}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}9