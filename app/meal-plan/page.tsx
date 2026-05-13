"use client";

import { useMemo, useState } from "react";

const MEMBER_CODE = "HEALTHADDICT26";

const fixedMeals = [
  { id: 1, name: "6oz Chicken Veggie Rice Meal", price: 25, calories: 604, protein: 48, carbs: 64, fat: 19 },
  { id: 2, name: "6oz Chicken Sweet Potato Meal", price: 32, calories: 636, protein: 48, carbs: 76, fat: 17 },
  { id: 3, name: "6oz Chicken Pasta Meal", price: 25, calories: 602, protein: 57, carbs: 89, fat: 5 },
  { id: 4, name: "4oz Chicken Stuffed Potato Meal", price: 30, calories: 792, protein: 49, carbs: 76, fat: 34 },
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
  { name: "Chicken Breast", pricePerOz: 2, calories: 31, protein: 6.5, carbs: 0, fat: 0.25 },
  { name: "Fish", pricePerOz: 3, calories: 27, protein: 5.8, carbs: 0, fat: 0.5 },
  { name: "Steak", pricePerOz: 5, calories: 48.5, protein: 6.5, carbs: 0, fat: 1.5 },
  { name: "Shrimp", pricePerOz: 6, calories: 30, protein: 6, carbs: 0.5, fat: 0.5 },
  { name: "Salmon", pricePerOz: 5, calories: 33, protein: 5.25, carbs: 0, fat: 1.5 },
  { name: "Ground Beef", pricePerOz: 3, calories: 60.75, protein: 5.25, carbs: 0, fat: 4.25 },
  { name: "Ground Chicken", pricePerOz: 1.5, calories: 40, protein: 5, carbs: 0, fat: 2.25 },
];

const carbsList = [
  { name: "Burger Bread", pricePerOz: 2, calories: 117, protein: 4, carbs: 21, fat: 2 },
  { name: "Wheat Tortilla", pricePerOz: 2.5, calories: 180, protein: 5, carbs: 30, fat: 5 },
  { name: "Rice", pricePerOz: 1.25, calories: 25, protein: 0.5, carbs: 4.25, fat: 0.75 },
  { name: "Beans", pricePerOz: 1, calories: 25, protein: 1.25, carbs: 3.75, fat: 6.25 },
  { name: "French Fries", pricePerOz: 1, calories: 24, protein: 0.5, carbs: 5.7, fat: 0.1 },
  { name: "Sweet Potato French Fries", pricePerOz: 2.25, calories: 24, protein: 0.4, carbs: 5.7, fat: 0.1 },
  { name: "Sweet Potato", pricePerOz: 1.25, calories: 24, protein: 0.4, carbs: 5.7, fat: 0.1 },
  { name: "White Potato", pricePerOz: 1, calories: 24, protein: 0.5, carbs: 5.7, fat: 0.1 },
  { name: "Whole Wheat Noodles", pricePerOz: 1.25, calories: 35, protein: 1.5, carbs: 7.6, fat: 0.2 },
  { name: "Plain Noodles", pricePerOz: 1, calories: 37, protein: 1.1, carbs: 7.8, fat: 0.1 },
  { name: "No Carb", pricePerOz: 0, calories: 0, protein: 0, carbs: 0, fat: 0 },
];

const fats = [
  { name: "Olive Oil", price: 2, calories: 126, protein: 0, carbs: 0, fat: 14 },
  { name: "Coconut Oil", price: 2, calories: 117, protein: 0, carbs: 0, fat: 14 },
  { name: "Avocado Oil", price: 2, calories: 124, protein: 0, carbs: 0, fat: 14 },
  { name: "Avocado", price: 2, calories: 29.25, protein: 0.25, carbs: 1.5, fat: 2.75 },
  { name: "Cream Sauce", price: 2, calories: 49, protein: 0.9, carbs: 1.2, fat: 4.6 },
  { name: "Cheese", price: 3, calories: 114, protein: 7, carbs: 0.375, fat: 9 },
  { name: "No Fat", price: 0, calories: 0, protein: 0, carbs: 0, fat: 0 },
];

const sides = [
  { name: "Steamed Veg", price: 5, calories: 0, protein: 0, carbs: 0, fat: 0 },
  { name: "Salad", price: 5, calories: 0, protein: 0, carbs: 0, fat: 0 },
  { name: "Veg + Salad", price: 8, calories: 0, protein: 0, carbs: 0, fat: 0 },
  { name: "No Side", price: 0, calories: 0, protein: 0, carbs: 0, fat: 0 },
];

type MealMode = "fixed" | "custom";

const fieldClass =
  "w-full rounded-2xl border border-slate-300 bg-white p-4 text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100";

function calculateMeal(mode: MealMode, fixed: any, protein: any, proteinOz: number, carb: any, carbOz: number, fat: any, side: any) {
  if (mode === "fixed") {
    return {
      price: fixed.price,
      calories: fixed.calories,
      protein: fixed.protein,
      carbs: fixed.carbs,
      fat: fixed.fat,
    };
  }

  return {
    price: protein.pricePerOz * proteinOz + carb.pricePerOz * carbOz + fat.price + side.price,
    calories: protein.calories * proteinOz + carb.calories * carbOz + fat.calories + side.calories,
    protein: protein.protein * proteinOz + carb.protein * carbOz + fat.protein + side.protein,
    carbs: protein.carbs * proteinOz + carb.carbs * carbOz + fat.carbs + side.carbs,
    fat: protein.fat * proteinOz + carb.fat * carbOz + fat.fat + side.fat,
  };
}

function MacroBoxes({ macros }: any) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
      <div className="rounded-2xl bg-slate-100 p-3">
        <p className="text-slate-500">Calories</p>
        <p className="font-bold text-slate-900">{macros.calories.toFixed(0)}</p>
      </div>
      <div className="rounded-2xl bg-slate-100 p-3">
        <p className="text-slate-500">Protein</p>
        <p className="font-bold text-slate-900">{macros.protein.toFixed(1)}g</p>
      </div>
      <div className="rounded-2xl bg-slate-100 p-3">
        <p className="text-slate-500">Carbs</p>
        <p className="font-bold text-slate-900">{macros.carbs.toFixed(1)}g</p>
      </div>
      <div className="rounded-2xl bg-slate-100 p-3">
        <p className="text-slate-500">Fat</p>
        <p className="font-bold text-slate-900">{macros.fat.toFixed(1)}g</p>
      </div>
    </div>
  );
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
  const meal = calculateMeal(mode, fixedMeal, protein, proteinOz, carb, carbOz, fat, side);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-xl font-bold text-slate-900">{label}</h3>

      <label className="mb-2 block font-semibold">Meal Type</label>
      <select className={fieldClass} value={mode} onChange={(e) => setMode(e.target.value as MealMode)}>
        <option value="fixed">Fixed Menu Meal</option>
        <option value="custom">Custom Build</option>
      </select>

      {mode === "fixed" ? (
        <div className="mt-4">
          <label className="mb-2 block font-semibold">Choose Meal</label>
          <select
            className={fieldClass}
            value={fixedMeal.id}
            onChange={(e) => setFixedMeal(fixedMeals.find((meal) => meal.id === Number(e.target.value)) || fixedMeals[0])}
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
              <select className={fieldClass} value={protein.name} onChange={(e) => setProtein(proteins.find((item) => item.name === e.target.value) || proteins[0])}>
                {proteins.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name} - ${item.pricePerOz}/oz
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block font-semibold">Protein Oz</label>
              <input required type="number" min={0} className={fieldClass} value={proteinOz} onChange={(e) => setProteinOz(Number(e.target.value))} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-semibold">Carb</label>
              <select className={fieldClass} value={carb.name} onChange={(e) => setCarb(carbsList.find((item) => item.name === e.target.value) || carbsList[0])}>
                {carbsList.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name} - ${item.pricePerOz}/oz
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block font-semibold">Carb Oz</label>
              <input required type="number" min={0} className={fieldClass} value={carbOz} onChange={(e) => setCarbOz(Number(e.target.value))} />
            </div>
          </div>

          <div>
            <label className="mb-2 block font-semibold">Fat / Sauce</label>
            <select className={fieldClass} value={fat.name} onChange={(e) => setFat(fats.find((item) => item.name === e.target.value) || fats[0])}>
              {fats.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name} - ${item.price}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block font-semibold">Side</label>
            <select className={fieldClass} value={side.name} onChange={(e) => setSide(sides.find((item) => item.name === e.target.value) || sides[0])}>
              {sides.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name} - ${item.price}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="mt-5 rounded-2xl bg-green-50 p-4 text-lg font-bold text-green-800">
        {label} Total: ${meal.price.toFixed(2)}
      </div>

      <MacroBoxes macros={meal} />
    </div>
  );
}

export default function MealPlanPage() {
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("1268");
  const [phoneNumber, setPhoneNumber] = useState("");

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
  const [mealOneCarb, setMealOneCarb] = useState(carbsList[6]);
  const [mealOneCarbOz, setMealOneCarbOz] = useState(10);
  const [mealOneFat, setMealOneFat] = useState(fats[6]);
  const [mealOneSide, setMealOneSide] = useState(sides[0]);

  const [mealTwoProtein, setMealTwoProtein] = useState(proteins[0]);
  const [mealTwoProteinOz, setMealTwoProteinOz] = useState(5);
  const [mealTwoCarb, setMealTwoCarb] = useState(carbsList[6]);
  const [mealTwoCarbOz, setMealTwoCarbOz] = useState(10);
  const [mealTwoFat, setMealTwoFat] = useState(fats[6]);
  const [mealTwoSide, setMealTwoSide] = useState(sides[0]);

  const [mealThreeProtein, setMealThreeProtein] = useState(proteins[0]);
  const [mealThreeProteinOz, setMealThreeProteinOz] = useState(5);
  const [mealThreeCarb, setMealThreeCarb] = useState(carbsList[6]);
  const [mealThreeCarbOz, setMealThreeCarbOz] = useState(10);
  const [mealThreeFat, setMealThreeFat] = useState(fats[6]);
  const [mealThreeSide, setMealThreeSide] = useState(sides[0]);

  const mealOne = calculateMeal(mealOneMode, mealOneFixed, mealOneProtein, mealOneProteinOz, mealOneCarb, mealOneCarbOz, mealOneFat, mealOneSide);
  const mealTwo = calculateMeal(mealTwoMode, mealTwoFixed, mealTwoProtein, mealTwoProteinOz, mealTwoCarb, mealTwoCarbOz, mealTwoFat, mealTwoSide);
  const mealThree = calculateMeal(mealThreeMode, mealThreeFixed, mealThreeProtein, mealThreeProteinOz, mealThreeCarb, mealThreeCarbOz, mealThreeFat, mealThreeSide);

  const activeMeals = mealsPerDay === 1 ? [mealOne] : mealsPerDay === 2 ? [mealOne, mealTwo] : [mealOne, mealTwo, mealThree];

  const dailyTotal = activeMeals.reduce((sum, meal) => sum + meal.price, 0);
  const dailyCalories = activeMeals.reduce((sum, meal) => sum + meal.calories, 0);
  const dailyProtein = activeMeals.reduce((sum, meal) => sum + meal.protein, 0);
  const dailyCarbs = activeMeals.reduce((sum, meal) => sum + meal.carbs, 0);
  const dailyFat = activeMeals.reduce((sum, meal) => sum + meal.fat, 0);

  const totalMeals = days * mealsPerDay;
  const subtotal = useMemo(() => dailyTotal * days, [dailyTotal, days]);

  const discountPercent =
    totalMeals >= 7 && discountCode.trim().toUpperCase() === MEMBER_CODE
      ? 15
      : totalMeals >= 7
      ? 10
      : 0;

  const discountAmount = subtotal * (discountPercent / 100);
  const grandTotal = subtotal - discountAmount;

  function mealText(mode: MealMode, fixedMeal: any, protein: any, proteinOz: number, carb: any, carbOz: number, fat: any, side: any) {
    if (mode === "fixed") return fixedMeal.name;
    return `${proteinOz}oz ${protein.name}, ${carbOz}oz ${carb.name}, ${fat.name}, ${side.name}`;
  }

  function handleWhatsapp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const cleanPhone = phoneNumber.replace(/\D/g, "");
    const fullPhone = `${countryCode}${cleanPhone}`;

    const mealOneText = mealText(mealOneMode, mealOneFixed, mealOneProtein, mealOneProteinOz, mealOneCarb, mealOneCarbOz, mealOneFat, mealOneSide);
    const mealTwoText = mealText(mealTwoMode, mealTwoFixed, mealTwoProtein, mealTwoProteinOz, mealTwoCarb, mealTwoCarbOz, mealTwoFat, mealTwoSide);
    const mealThreeText = mealText(mealThreeMode, mealThreeFixed, mealThreeProtein, mealThreeProteinOz, mealThreeCarb, mealThreeCarbOz, mealThreeFat, mealThreeSide);

    const message = `
MACRO MEALS PLAN REQUEST

Customer: ${customerName}
Email: ${email}
WhatsApp: +${fullPhone}

Plan:
${days} day(s)
${mealsPerDay} meal(s) per day
Total Meals: ${totalMeals}

Meal 1:
${mealOneText}
Price: $${mealOne.price.toFixed(2)}
Calories: ${mealOne.calories.toFixed(0)}
Protein: ${mealOne.protein.toFixed(1)}g
Carbs: ${mealOne.carbs.toFixed(1)}g
Fat: ${mealOne.fat.toFixed(1)}g

${mealsPerDay >= 2 ? `Meal 2:
${mealTwoText}
Price: $${mealTwo.price.toFixed(2)}
Calories: ${mealTwo.calories.toFixed(0)}
Protein: ${mealTwo.protein.toFixed(1)}g
Carbs: ${mealTwo.carbs.toFixed(1)}g
Fat: ${mealTwo.fat.toFixed(1)}g` : ""}

${mealsPerDay === 3 ? `Meal 3:
${mealThreeText}
Price: $${mealThree.price.toFixed(2)}
Calories: ${mealThree.calories.toFixed(0)}
Protein: ${mealThree.protein.toFixed(1)}g
Carbs: ${mealThree.carbs.toFixed(1)}g
Fat: ${mealThree.fat.toFixed(1)}g` : ""}

Daily Macros:
Calories: ${dailyCalories.toFixed(0)}
Protein: ${dailyProtein.toFixed(1)}g
Carbs: ${dailyCarbs.toFixed(1)}g
Fat: ${dailyFat.toFixed(1)}g

Daily Total: $${dailyTotal.toFixed(2)}
Subtotal: $${subtotal.toFixed(2)}
Discount: ${discountPercent}% - $${discountAmount.toFixed(2)}
Grand Total: $${grandTotal.toFixed(2)}

Discount Code: ${discountCode ? "Entered" : "N/A"}
`;

    window.open(`https://wa.me/12687808226?text=${encodeURIComponent(message)}`, "_blank");
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6 text-slate-900">
      <form onSubmit={handleWhatsapp} className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase text-green-600">Macro Meals</p>
          <h1 className="mt-2 text-4xl font-bold">Meal Plan Quote Calculator</h1>
          <p className="mt-2 text-slate-600">
            Orders with 7 or more meals receive a regular discount. Members may enter their private member code for the member discount.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-sm lg:col-span-2">
            <h2 className="mb-4 text-2xl font-bold">Customer Details</h2>

            <div className="mb-8 grid gap-4 md:grid-cols-2">
              <input required placeholder="Customer Name" className={fieldClass} value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
              <input required type="email" placeholder="Email Address" className={fieldClass} value={email} onChange={(e) => setEmail(e.target.value)} />

              <select required className={fieldClass} value={countryCode} onChange={(e) => setCountryCode(e.target.value)}>
                {countryCodes.map((code) => (
                  <option key={code.value} value={code.value}>
                    {code.label}
                  </option>
                ))}
              </select>

              <input required type="tel" placeholder="WhatsApp Number" className={fieldClass} value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            </div>

            <div className="mb-8 grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block font-semibold">Number of Days</label>
                <input required type="number" min={1} className={fieldClass} value={days} onChange={(e) => setDays(Number(e.target.value))} />
              </div>

              <div>
                <label className="mb-2 block font-semibold">Meals Per Day</label>
                <select required className={fieldClass} value={mealsPerDay} onChange={(e) => setMealsPerDay(Number(e.target.value))}>
                  <option value={1}>1 Meal</option>
                  <option value={2}>2 Meals</option>
                  <option value={3}>3 Meals</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block font-semibold">Member Discount Code</label>
                <input placeholder="Members only" className={fieldClass} value={discountCode} onChange={(e) => setDiscountCode(e.target.value)} />
              </div>
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
                <span>Daily Total</span>
                <span className="font-semibold">${dailyTotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between border-b pb-3">
                <span>Subtotal</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between border-b pb-3">
                <span>Discount</span>
                <span className="font-semibold">{discountPercent}% - ${discountAmount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between pt-3 text-2xl font-bold">
                <span>Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 rounded-3xl bg-slate-50 p-4">
              <h3 className="mb-3 font-bold">Daily Macros</h3>
              <MacroBoxes
                macros={{
                  calories: dailyCalories,
                  protein: dailyProtein,
                  carbs: dailyCarbs,
                  fat: dailyFat,
                }}
              />
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
                Member 15% discount applied.
              </p>
            )}

            <button type="submit" className="mt-8 w-full rounded-2xl bg-green-600 px-5 py-4 font-bold text-white hover:bg-green-700">
              Submit on WhatsApp
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}