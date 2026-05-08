"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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

const historyFilters = [
  "All",
  "Pickup Complete",
  "Cancelled",
  "Ready Message Sent",
  "Ready for Pickup",
  "Preparing",
  "Pending",
];

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

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

  useEffect(() => {
    const role = localStorage.getItem("macroMealsRole");

    if (role !== "owner") {
      window.location.href = "/admin/login";
      return;
    }

    setAuthorized(true);
    fetchOrders();
  }, []);

  function logout() {
    localStorage.removeItem("macroMealsRole");
    localStorage.removeItem("macroMealsAdmin");
    window.location.href = "/admin/login";
  }

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      activeFilter === "All" || order.status === activeFilter;

    const searchableText = `${order.customer_name} ${order.whatsapp}`
      .toLowerCase()
      .replace(/\s/g, "");

    const cleanedSearch = searchTerm.toLowerCase().replace(/\s/g, "");

    const matchesSearch =
      cleanedSearch === "" || searchableText.includes(cleanedSearch);

    return matchesStatus && matchesSearch;
  });

  const totalHistorySales = filteredOrders.reduce(
    (total, order) => total + Number(order.subtotal || 0),
    0
  );

  function getCount(filter: string) {
    if (filter === "All") return orders.length;
    return orders.filter((order) => order.status === filter).length;
  }

  if (!authorized) return null;

  return (
    <main className="min-h-screen bg-[#f3f3f3] px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-xl md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-black text-[#060d57]">
              Order History
            </h1>

            <p className="mt-2 font-semibold text-gray-600">
              Search and review past Macro Meals orders.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="/admin/orders"
              className="rounded-2xl border-2 border-[#060d57] px-5 py-3 font-black text-[#060d57]"
            >
              Owner Dashboard
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

        <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-3xl bg-white p-5 shadow-lg">
            <p className="text-sm font-black uppercase text-[#75a62f]">
              Results
            </p>

            <p className="mt-2 text-3xl font-black text-[#060d57]">
              {filteredOrders.length}
            </p>
          </div>

          <div className="rounded-3xl bg-[#060d57] p-5 text-white shadow-lg">
            <p className="text-sm font-black uppercase text-white/70">
              Filtered Sales
            </p>

            <p className="mt-2 text-3xl font-black">
              ${totalHistorySales}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-lg">
            <p className="text-sm font-black uppercase text-[#75a62f]">
              All Orders
            </p>

            <p className="mt-2 text-3xl font-black text-[#060d57]">
              {orders.length}
            </p>
          </div>
        </div>

        <div className="mb-6 rounded-3xl bg-white p-5 shadow-xl">
          <p className="mb-3 text-sm font-black uppercase tracking-wide text-[#060d57]">
            Search History
          </p>

          <input
            type="text"
            placeholder="Search by customer name or WhatsApp number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 text-base font-semibold text-[#060d57] placeholder:text-gray-500 outline-none focus:border-[#75a62f]"
          />
        </div>

        <div className="mb-8 rounded-3xl bg-white p-4 shadow-xl">
          <p className="mb-3 text-sm font-black uppercase tracking-wide text-[#060d57]">
            Filter History
          </p>

          <div className="flex flex-wrap gap-3">
            {historyFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-2xl px-5 py-3 text-sm font-black transition ${
                  activeFilter === filter
                    ? "bg-[#060d57] text-white"
                    : "bg-[#f3f3f3] text-[#060d57]"
                }`}
              >
                {filter} ({getCount(filter)})
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="rounded-3xl bg-white p-8 text-center shadow-xl">
            <p className="text-xl font-black text-[#060d57]">
              Loading history...
            </p>
          </div>
        )}

        {!loading && filteredOrders.length === 0 && (
          <div className="rounded-3xl bg-white p-8 text-center shadow-xl">
            <p className="text-xl font-black text-[#060d57]">
              No history found.
            </p>
          </div>
        )}

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
                      Status
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
                      Notes:
                    </p>

                    <p className="text-sm font-black text-[#060d57]">
                      {order.notes || "None"}
                    </p>
                  </div>

                  <div>
                    <div className="rounded-2xl bg-[#060d57] p-4 text-white">
                      <p className="text-sm font-semibold text-white/70">
                        Subtotal
                      </p>

                      <p className="text-3xl font-black">
                        ${order.subtotal}
                      </p>
                    </div>

                    <p className="mt-4 text-sm font-semibold text-gray-700">
                      Subscribe:
                    </p>

                    <p className="text-sm font-black text-[#060d57]">
                      {order.subscribe ? "Yes" : "No"}
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl bg-[#f3f3f3] p-4">
                  <p className="mb-4 text-sm font-black uppercase tracking-wide text-[#060d57]">
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