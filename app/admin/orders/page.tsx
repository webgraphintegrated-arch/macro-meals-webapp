"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

/* =========================
   TYPES
========================= */

type OrderItem = {
  category: string;
  name: string;
  price: number;
  quantity: number;
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

const filterOptions = [
  "All",
  "Pending",
  "Preparing",
  "Ready for Pickup",
  "Completed",
  "Cancelled",
];

/* =========================
   PAGE
========================= */

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  /* =========================
     FETCH ORDERS
  ========================= */

  async function fetchOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setOrders((data as Order[]) || []);
    setLoading(false);
  }

  /* =========================
     LOAD + REALTIME + AUTO REFRESH
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

    const autoRefresh = setInterval(() => {
      fetchOrders();
    }, 10000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(autoRefresh);
    };
  }, []);

  /* =========================
     UPDATE STATUS
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
     WHATSAPP READY MESSAGE
  ========================= */

  function sendReadyMessage(order: Order) {
    const cleanPhone = order.whatsapp.replace(/\D/g, "");

    const message = `Hi ${order.customer_name},

Your Macro Meals order is ready for pickup at National Fitness Centre Campsite (Barrows Gym).

Pickup Date: ${order.pickup_date}
Pickup Time: ${order.pickup_time}

Thank you for ordering with Macro Meals On Wheels.`;

    window.open(
      `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  }

  /* =========================
     LOGOUT
  ========================= */

  function logout() {
    localStorage.removeItem("macroMealsAdmin");
    window.location.href = "/admin/login";
  }

  /* =========================
     FILTER + STATS
  ========================= */

  const filteredOrders =
    activeFilter === "All"
      ? orders
      : orders.filter((order) => order.status === activeFilter);

  const totalSales = orders.reduce((total, order) => total + Number(order.subtotal), 0);

  const pendingCount = orders.filter((order) => order.status === "Pending").length;
  const preparingCount = orders.filter((order) => order.status === "Preparing").length;
  const readyCount = orders.filter((order) => order.status === "Ready for Pickup").length;
  const completedCount = orders.filter((order) => order.status === "Completed").length;
  const cancelledCount = orders.filter((order) => order.status === "Cancelled").length;

  function getFilterCount(filter: string) {
    if (filter === "All") return orders.length;
    return orders.filter((order) => order.status === filter).length;
  }

  if (!authorized) {
    return null;
  }

  /* =========================
     UI
  ========================= */

  return (
    <main className="min-h-screen bg-[#f3f3f3] px-4 py-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-6 flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-xl md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-black text-[#060d57]">
              Admin Orders
            </h1>

            <p className="mt-2 font-semibold text-gray-600">
              Live customer orders dashboard with filters and order status tracking.
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

        {/* STATS */}

        <div className="mb-6 grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          <div className="rounded-3xl bg-white p-5 shadow-lg">
            <p className="text-sm font-black uppercase text-[#75a62f]">All Orders</p>
            <p className="mt-2 text-3xl font-black text-[#060d57]">{orders.length}</p>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-lg">
            <p className="text-sm font-black uppercase text-[#75a62f]">Pending</p>
            <p className="mt-2 text-3xl font-black text-[#060d57]">{pendingCount}</p>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-lg">
            <p className="text-sm font-black uppercase text-[#75a62f]">Preparing</p>
            <p className="mt-2 text-3xl font-black text-[#060d57]">{preparingCount}</p>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-lg">
            <p className="text-sm font-black uppercase text-[#75a62f]">Ready</p>
            <p className="mt-2 text-3xl font-black text-[#060d57]">{readyCount}</p>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-lg">
            <p className="text-sm font-black uppercase text-[#75a62f]">Completed</p>
            <p className="mt-2 text-3xl font-black text-[#060d57]">{completedCount}</p>
          </div>

          <div className="rounded-3xl bg-[#060d57] p-5 text-white shadow-lg">
            <p className="text-sm font-black uppercase text-white/70">Total Sales</p>
            <p className="mt-2 text-3xl font-black">${totalSales}</p>
          </div>
        </div>

        {/* FILTER BUTTONS */}

        <div className="mb-8 rounded-3xl bg-white p-4 shadow-xl">
          <p className="mb-3 text-sm font-black uppercase tracking-wide text-[#060d57]">
            Filter Orders
          </p>

          <div className="flex flex-wrap gap-3">
            {filterOptions.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-2xl px-5 py-3 text-sm font-black transition ${
                  activeFilter === filter
                    ? "bg-[#060d57] text-white"
                    : "bg-[#f3f3f3] text-[#060d57]"
                }`}
              >
                {filter} ({getFilterCount(filter)})
              </button>
            ))}
          </div>
        </div>

        {/* LOADING */}

        {loading && (
          <div className="rounded-3xl bg-white p-8 text-center shadow-xl">
            <p className="text-xl font-black text-[#060d57]">
              Loading orders...
            </p>
          </div>
        )}

        {/* NO ORDERS */}

        {!loading && filteredOrders.length === 0 && (
          <div className="rounded-3xl bg-white p-8 text-center shadow-xl">
            <p className="text-xl font-black text-[#060d57]">
              No {activeFilter === "All" ? "" : activeFilter} orders found.
            </p>
          </div>
        )}

        {/* ORDERS */}

        {!loading && filteredOrders.length > 0 && (
          <div className="grid gap-6">
            {filteredOrders.map((order) => (
              <section
                key={order.id}
                className="rounded-3xl bg-white p-6 shadow-xl"
              >
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-4">
                  <div>
                    <p className="text-sm font-black uppercase tracking-wide text-[#75a62f]">
                      Order Status
                    </p>

                    <p className="text-2xl font-black text-[#060d57]">
                      {order.status}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#f3f3f3] px-4 py-3 text-sm font-black text-[#060d57]">
                    Ordered: {new Date(order.created_at).toLocaleString()}
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">

                  {/* CUSTOMER */}

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
                  </div>

                  {/* PICKUP */}

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

                    <p className="mt-4 text-sm font-semibold text-gray-700">
                      Subscribe:
                    </p>

                    <p className="text-sm font-black text-[#060d57]">
                      {order.subscribe ? "Yes" : "No"}
                    </p>

                    <p className="mt-4 text-sm font-semibold text-gray-700">
                      Notes:
                    </p>

                    <p className="text-sm font-black text-[#060d57]">
                      {order.notes || "None"}
                    </p>
                  </div>

                  {/* STATUS */}

                  <div>
                    <p className="text-sm font-black uppercase tracking-wide text-[#75a62f]">
                      Update Status
                    </p>

                    <select
                      value={order.status || "Pending"}
                      onChange={(e) =>
                        updateStatus(order.id, e.target.value)
                      }
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

                    {order.status === "Ready for Pickup" && (
                      <button
                        onClick={() => sendReadyMessage(order)}
                        className="mt-4 w-full rounded-2xl bg-[#75a62f] px-5 py-4 font-black text-white"
                      >
                        Send Ready WhatsApp
                      </button>
                    )}
                  </div>
                </div>

                {/* ORDER ITEMS */}

                <div className="mt-6 rounded-2xl bg-[#f3f3f3] p-4">
                  <p className="mb-4 text-sm font-black uppercase tracking-wide text-[#060d57]">
                    Order Items
                  </p>

                  <div className="grid gap-3 md:grid-cols-2">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="rounded-2xl bg-white p-4"
                      >
                        <p className="text-sm font-black text-[#75a62f]">
                          {item.category}
                        </p>

                        <p className="text-xl font-black text-[#060d57]">
                          {item.quantity}x {item.name}
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-600">
                          ${item.price} each
                        </p>

                        <p className="mt-2 text-2xl font-black text-[#75a62f]">
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