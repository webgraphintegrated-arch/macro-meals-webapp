"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

/* =========================
   TYPES SECTION
========================= */

type OrderItem = {
  id?: string;
  category: string;
  name: string;
  price: number;
  quantity: number;
  cal?: number;
  pro?: string;
  carb?: string;
  fat?: string;
};

type Order = {
  id: string;
  customer_name: string;
  whatsapp: string;
  email: string | null;
  pickup_date: string;
  pickup_time: string;
  notes: string | null;
  subscribe: boolean;
  items: OrderItem[];
  subtotal: number;
  status: string;
  created_at: string;
};

const statuses = [
  "Pending",
  "Preparing",
  "Ready for Pickup",
  "Completed",
  "Cancelled",
];

/* =========================
   ADMIN ORDERS PAGE
========================= */

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  /* =========================
     ADMIN CHECK + REALTIME ORDERS
  ========================= */

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("macroMealsAdmin");

    if (adminLoggedIn !== "true") {
      window.location.href = "/admin/login";
      return;
    }

    setAuthorized(true);
    fetchOrders();

    const channel = supabase
      .channel("orders-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  /* =========================
     FETCH ORDERS
  ========================= */

  async function fetchOrders() {
    setLoading(true);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      alert("Failed to load orders.");
      setLoading(false);
      return;
    }

    setOrders((data || []) as Order[]);
    setLoading(false);
  }

  /* =========================
     UPDATE ORDER STATUS
  ========================= */

  async function updateStatus(orderId: string, newStatus: string) {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      console.error(error);
      alert("Failed to update order status.");
      return;
    }

    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  }

  /* =========================
     LOGOUT
  ========================= */

  function logout() {
    localStorage.removeItem("macroMealsAdmin");
    window.location.href = "/admin/login";
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleString();
  }

  if (!authorized) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f3f3f3] px-4">
        <div className="rounded-3xl bg-white p-8 text-center shadow-xl">
          <p className="text-xl font-black text-[#060d57]">
            Checking admin access...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f3f3f3] px-4 py-8">
      <div className="mx-auto max-w-7xl">
        {/* =========================
           HEADER SECTION
        ========================= */}

        <div className="mb-8 flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-xl md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-black text-[#060d57]">
              Admin Orders
            </h1>

            <p className="mt-2 font-semibold text-gray-600">
              Live order dashboard with realtime updates.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="/menu"
              className="rounded-2xl border-2 border-[#060d57] px-5 py-3 font-black text-[#060d57]"
            >
              View Menu
            </a>

            <button
              onClick={fetchOrders}
              className="rounded-2xl bg-[#060d57] px-5 py-3 font-black text-white"
            >
              Refresh
            </button>

            <button
              onClick={logout}
              className="rounded-2xl bg-red-500 px-5 py-3 font-black text-white"
            >
              Logout
            </button>
          </div>
        </div>

        {/* =========================
           LOADING / EMPTY SECTION
        ========================= */}

        {loading && (
          <div className="rounded-3xl bg-white p-8 text-center shadow-lg">
            <p className="text-xl font-black text-[#060d57]">
              Loading orders...
            </p>
          </div>
        )}

        {!loading && orders.length === 0 && (
          <div className="rounded-3xl bg-white p-8 text-center shadow-lg">
            <p className="text-xl font-black text-[#060d57]">
              No orders yet.
            </p>
          </div>
        )}

        {/* =========================
           ORDERS LIST SECTION
        ========================= */}

        {!loading && orders.length > 0 && (
          <div className="grid gap-6">
            {orders.map((order) => (
              <section
                key={order.id}
                className="rounded-3xl bg-white p-6 shadow-xl"
              >
                <div className="grid gap-6 lg:grid-cols-3">
                  {/* CUSTOMER INFO */}
                  <div>
                    <p className="text-sm font-black uppercase tracking-wide text-[#75a62f]">
                      Customer
                    </p>

                    <h2 className="mt-1 text-2xl font-black text-[#060d57]">
                      {order.customer_name}
                    </h2>

                    <p className="mt-2 text-sm font-semibold text-gray-700">
                      WhatsApp: {order.whatsapp}
                    </p>

                    <p className="text-sm font-semibold text-gray-700">
                      Email: {order.email || "N/A"}
                    </p>

                    <p className="mt-3 text-sm font-semibold text-gray-700">
                      Ordered: {formatDate(order.created_at)}
                    </p>
                  </div>

                  {/* PICKUP INFO */}
                  <div>
                    <p className="text-sm font-black uppercase tracking-wide text-[#75a62f]">
                      Pickup
                    </p>

                    <p className="mt-2 text-lg font-black text-[#060d57]">
                      Date: {order.pickup_date}
                    </p>

                    <p className="text-lg font-black text-[#060d57]">
                      Time: {order.pickup_time}
                    </p>

                    <p className="mt-3 text-sm font-semibold text-gray-700">
                      Subscribe: {order.subscribe ? "Yes" : "No"}
                    </p>

                    <p className="mt-3 text-sm font-semibold text-gray-700">
                      Notes: {order.notes || "None"}
                    </p>
                  </div>

                  {/* STATUS */}
                  <div>
                    <p className="text-sm font-black uppercase tracking-wide text-[#75a62f]">
                      Status
                    </p>

                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 font-black text-[#060d57]"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>

                    <div className="mt-4 rounded-2xl bg-[#060d57] p-4 text-white">
                      <p className="text-sm font-semibold text-white/70">
                        Subtotal
                      </p>

                      <p className="text-3xl font-black">
                        ${order.subtotal}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ORDER ITEMS */}
                <div className="mt-6 rounded-2xl bg-[#f3f3f3] p-4">
                  <p className="mb-3 text-sm font-black uppercase tracking-wide text-[#060d57]">
                    Order Items
                  </p>

                  <div className="grid gap-3 md:grid-cols-2">
                    {order.items.map((item, index) => (
                      <div
                        key={`${item.name}-${index}`}
                        className="rounded-2xl bg-white p-4"
                      >
                        <p className="text-sm font-black text-[#75a62f]">
                          {item.category}
                        </p>

                        <p className="text-lg font-black text-[#060d57]">
                          {item.quantity}x {item.name}
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-600">
                          ${item.price} each
                        </p>

                        <p className="mt-1 text-lg font-black text-[#75a62f]">
                          ${item.price * item.quantity}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}