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
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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

    const orderDate = new Date(order.created_at);
    const start = startDate ? new Date(startDate + "T00:00:00") : null;
    const end = endDate ? new Date(endDate + "T23:59:59") : null;

    const matchesDate =
      (!start || orderDate >= start) && (!end || orderDate <= end);

    return matchesStatus && matchesSearch && matchesDate;
  });

  const totalHistorySales = filteredOrders.reduce(
    (total, order) => total + Number(order.subtotal || 0),
    0
  );

  const completedSales = filteredOrders
    .filter((order) => order.status === "Pickup Complete")
    .reduce((total, order) => total + Number(order.subtotal || 0), 0);

  function getCount(filter: string) {
    if (filter === "All") return orders.length;
    return orders.filter((order) => order.status === filter).length;
  }

  const bestSellers = filteredOrders
    .flatMap((order) => order.items)
    .reduce((acc: any[], item) => {
      const existing = acc.find(
        (meal) => meal.name === item.name && meal.category === item.category
      );

      if (existing) {
        existing.quantity += item.quantity;
        existing.total += item.price * item.quantity;
      } else {
        acc.push({
          category: item.category,
          name: item.name,
          quantity: item.quantity,
          total: item.price * item.quantity,
        });
      }

      return acc;
    }, [])
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  const dailySales = filteredOrders.reduce((acc: any[], order) => {
    const day = new Date(order.created_at).toLocaleDateString();

    const existing = acc.find((item) => item.date === day);

    if (existing) {
      existing.orders += 1;
      existing.sales += Number(order.subtotal || 0);
    } else {
      acc.push({
        date: day,
        orders: 1,
        sales: Number(order.subtotal || 0),
      });
    }

    return acc;
  }, []);

  function clearFilters() {
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
    setActiveFilter("All");
  }

  function exportCSV() {
    const rows = filteredOrders.map((order) => ({
      Date: new Date(order.created_at).toLocaleString(),
      Customer: order.customer_name,
      WhatsApp: order.whatsapp,
      Email: order.email || "",
      PickupDate: order.pickup_date,
      PickupTime: order.pickup_time,
      Status: order.status,
      Subtotal: order.subtotal,
      Notes: order.notes || "",
      Items: order.items
        .map((item) => `${item.quantity}x ${item.category} - ${item.name}`)
        .join(" | "),
    }));

    const headers = Object.keys(rows[0] || {
      Date: "",
      Customer: "",
      WhatsApp: "",
      Email: "",
      PickupDate: "",
      PickupTime: "",
      Status: "",
      Subtotal: "",
      Notes: "",
      Items: "",
    });

    const csvContent = [
      headers.join(","),
      ...rows.map((row: any) =>
        headers
          .map((header) => `"${String(row[header]).replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `macro-meals-order-history-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    link.click();
    URL.revokeObjectURL(url);
  }

  if (!authorized) return null;

  return (
    <main className="min-h-screen bg-[#f3f3f3] px-4 py-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-6 flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-xl md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-black text-[#060d57]">
              Order History
            </h1>

            <p className="mt-2 font-semibold text-gray-600">
              Search, filter, export, and review past Macro Meals orders.
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
              onClick={exportCSV}
              className="rounded-2xl bg-[#75a62f] px-5 py-3 font-black text-white"
            >
              Export CSV
            </button>

            <button
              onClick={logout}
              className="rounded-2xl bg-red-500 px-5 py-3 font-black text-white"
            >
              Logout
            </button>
          </div>
        </div>

        {/* SUMMARY CARDS */}

        <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl bg-white p-5 shadow-lg">
            <p className="text-sm font-black uppercase text-[#75a62f]">
              Filtered Orders
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
              Completed Sales
            </p>

            <p className="mt-2 text-3xl font-black text-[#060d57]">
              ${completedSales}
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

        {/* SEARCH + DATE FILTERS */}

        <div className="mb-6 rounded-3xl bg-white p-5 shadow-xl">
          <p className="mb-3 text-sm font-black uppercase tracking-wide text-[#060d57]">
            Search & Date Range
          </p>

          <div className="grid gap-4 lg:grid-cols-4">
            <input
              type="text"
              placeholder="Search by customer name or WhatsApp number"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-2xl border border-gray-300 bg-white px-5 py-4 text-base font-semibold text-[#060d57] placeholder:text-gray-500 outline-none focus:border-[#75a62f] lg:col-span-2"
            />

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-2xl border border-gray-300 bg-white px-5 py-4 text-base font-semibold text-[#060d57] outline-none focus:border-[#75a62f]"
            />

            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-2xl border border-gray-300 bg-white px-5 py-4 text-base font-semibold text-[#060d57] outline-none focus:border-[#75a62f]"
            />
          </div>

          <button
            onClick={clearFilters}
            className="mt-4 rounded-2xl border-2 border-[#060d57] px-5 py-3 font-black text-[#060d57]"
          >
            Clear Filters
          </button>
        </div>

        {/* FILTER BUTTONS */}

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

        {/* REPORTS */}

        <div className="mb-8 grid gap-6 lg:grid-cols-2">

          {/* BEST SELLERS */}

          <section className="rounded-3xl bg-white p-5 shadow-xl">
            <h2 className="text-2xl font-black text-[#060d57]">
              Best-Selling Meals
            </h2>

            <div className="mt-5 space-y-3">
              {bestSellers.length === 0 ? (
                <p className="font-semibold text-gray-600">
                  No meal data found.
                </p>
              ) : (
                bestSellers.map((meal, index) => (
                  <div
                    key={`${meal.name}-${index}`}
                    className="rounded-2xl bg-[#f3f3f3] p-4"
                  >
                    <p className="text-sm font-black text-[#75a62f]">
                      #{index + 1} {meal.category}
                    </p>

                    <p className="text-xl font-black text-[#060d57]">
                      {meal.name}
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-600">
                      Quantity Sold: {meal.quantity}
                    </p>

                    <p className="text-sm font-black text-[#060d57]">
                      Sales: ${meal.total}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* DAILY SALES */}

          <section className="rounded-3xl bg-white p-5 shadow-xl">
            <h2 className="text-2xl font-black text-[#060d57]">
              Daily Sales Summary
            </h2>

            <div className="mt-5 space-y-3">
              {dailySales.length === 0 ? (
                <p className="font-semibold text-gray-600">
                  No daily sales found.
                </p>
              ) : (
                dailySales.map((day, index) => (
                  <div
                    key={`${day.date}-${index}`}
                    className="flex items-center justify-between rounded-2xl bg-[#f3f3f3] p-4"
                  >
                    <div>
                      <p className="text-lg font-black text-[#060d57]">
                        {day.date}
                      </p>

                      <p className="text-sm font-semibold text-gray-600">
                        Orders: {day.orders}
                      </p>
                    </div>

                    <p className="text-2xl font-black text-[#75a62f]">
                      ${day.sales}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* ORDER LIST */}

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