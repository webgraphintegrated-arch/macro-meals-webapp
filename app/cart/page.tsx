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

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <main className="min-h-screen bg-[#f3f3f3] px-4 py-8 pb-28">
      <div className="mx-auto max-w-4xl">

        {/* HEADER SECTION */}
        <div className="mb-8 text-center">
          <img
            src="/logo.png"
            alt="Macro Meals On Wheels"
            className="mx-auto mb-4 w-36"
          />

          <h1 className="text-5xl font-black text-[#060d57]">
            YOUR ORDER
          </h1>

          <p className="mt-2 font-bold text-[#75a62f]">
            Review your meals before checkout
          </p>

          <a
            href="/menu"
            className="mt-4 inline-block font-bold text-[#060d57]"
          >
            ← Back to Menu
          </a>
        </div>

        {/* EMPTY CART SECTION */}
        {cart.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-center shadow-lg">
            <h2 className="text-2xl font-black text-[#060d57]">
              Your order is empty.
            </h2>

            <p className="mt-2 text-gray-600">
              Add meals from the menu to start your order.
            </p>

            <a
              href="/menu"
              className="mt-6 inline-block rounded-2xl bg-[#060d57] px-8 py-4 font-black text-white"
            >
              View Menu
            </a>
          </div>
        ) : (
          <div className="space-y-5">

            {/* CART ITEMS SECTION */}
            {cart.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl bg-white p-5 shadow-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-black text-[#75a62f]">
                      {item.category}
                    </p>

                    <h2 className="mt-1 text-2xl font-black text-[#060d57]">
                      {item.name}
                    </h2>

                    <p className="mt-1 text-sm font-semibold text-gray-600">
                      ${item.price} each
                    </p>

                    {item.cal && (
                      <p className="mt-1 text-xs text-gray-500">
                        {item.cal} Cal | {item.pro} Protein | {item.carb} Carb | {item.fat} Fat
                      </p>
                    )}
                  </div>

                  <p className="text-2xl font-black text-[#75a62f]">
                    ${item.price * item.quantity}
                  </p>
                </div>

                {/* QUANTITY CONTROLS */}
                <div className="mt-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="h-11 w-11 rounded-xl bg-gray-200 text-xl font-black text-[#060d57]"
                    >
                      −
                    </button>

                    <span className="min-w-8 text-center text-lg font-black text-[#060d57]">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className="h-11 w-11 rounded-xl bg-[#060d57] text-xl font-black text-white"
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

            {/* SUMMARY SECTION */}
            <div className="rounded-3xl bg-white p-6 shadow-lg">
              <div className="mb-4 flex justify-between text-lg font-bold text-gray-600">
                <span>Total Items</span>
                <span>{totalItems}</span>
              </div>

              <div className="flex justify-between text-3xl font-black text-[#060d57]">
                <span>Subtotal</span>
                <span>${subtotal}</span>
              </div>

              <a
                href="/checkout"
                className="mt-6 block w-full rounded-2xl bg-[#060d57] py-4 text-center font-black text-white"
              >
                Continue to Checkout
              </a>

              <button
                onClick={clearCart}
                className="mt-3 block w-full rounded-2xl border-2 border-red-500 py-4 text-center font-black text-red-500"
              >
                Clear Order
              </button>
            </div>
          </div>
        )}

        {/* STICKY MOBILE CHECKOUT BUTTON */}
        {cart.length > 0 && (
          <a
            href="/checkout"
            className="fixed bottom-4 left-4 right-4 z-50 rounded-3xl bg-[#060d57] px-5 py-4 text-white shadow-2xl md:hidden"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white/70">
                  {totalItems} item{totalItems > 1 ? "s" : ""}
                </p>

                <p className="text-2xl font-black">
                  Checkout
                </p>
              </div>

              <div className="rounded-2xl bg-[#75a62f] px-5 py-3 text-xl font-black">
                ${subtotal}
              </div>
            </div>
          </a>
        )}
      </div>
    </main>
  );
}