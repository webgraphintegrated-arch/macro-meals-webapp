"use client";

import { useEffect, useState } from "react";

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("macroMealsCart") || "[]");
    setCart(savedCart);
  }, []);

  function updateCart(newCart: any[]) {
    setCart(newCart);
    localStorage.setItem("macroMealsCart", JSON.stringify(newCart));
  }

  function increaseQuantity(id: string) {
    const newCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(newCart);
  }

  function decreaseQuantity(id: string) {
    const newCart = cart
      .map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0);

    updateCart(newCart);
  }

  function removeItem(id: string) {
    const newCart = cart.filter((item) => item.id !== id);
    updateCart(newCart);
  }

  function clearCart() {
    updateCart([]);
  }

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <main className="min-h-screen bg-[#f3f3f3] px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="Macro Meals On Wheels" className="mx-auto w-36 mb-4" />

          <h1 className="text-5xl font-black text-[#060d57]">YOUR ORDER</h1>

          <a href="/menu" className="mt-4 inline-block font-bold text-[#75a62f]">
            ← Back to Menu
          </a>
        </div>

        {cart.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-center shadow-lg">
            <p className="text-xl font-bold text-[#060d57]">
              Your order is empty.
            </p>

            <a
              href="/menu"
              className="mt-5 inline-block rounded-2xl bg-[#060d57] px-6 py-3 font-bold text-white"
            >
              View Menu
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="rounded-3xl bg-white p-5 shadow-lg">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-[#75a62f]">
                      {item.category}
                    </p>

                    <h2 className="text-2xl font-black text-[#060d57]">
                      {item.name}
                    </h2>

                    <p className="text-sm text-gray-600">
                      ${item.price} each
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {item.cal} Cal | {item.pro} Protein | {item.carb} Carb | {item.fat} Fat
                    </p>
                  </div>

                  <p className="text-2xl font-black text-[#75a62f]">
                    ${item.price * item.quantity}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="rounded-xl bg-gray-200 px-4 py-2 font-bold text-[#060d57]"
                    >
                      -
                    </button>

                    <span className="font-bold text-[#060d57]">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className="rounded-xl bg-gray-200 px-4 py-2 font-bold text-[#060d57]"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="font-bold text-red-500"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="rounded-3xl bg-white p-6 shadow-lg">
              <div className="flex justify-between text-2xl font-black text-[#060d57]">
                <span>Subtotal</span>
                <span>${subtotal}</span>
              </div>

              <a
                href="/checkout"
                className="mt-6 block w-full rounded-2xl bg-[#060d57] py-4 text-center font-bold text-white"
              >
                Continue to Checkout
              </a>

              <button
                onClick={clearCart}
                className="mt-3 block w-full rounded-2xl border-2 border-red-500 py-4 text-center font-bold text-red-500"
              >
                Clear Order
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}