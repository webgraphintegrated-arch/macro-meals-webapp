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
  pickup_date: string;
  pickup_time: string;
  notes: string | null;
  items: OrderItem[];
  status: string;
  created_at: string;
};

const statuses = [
  "Pending",
  "Preparing",
  "Ready for Pickup",
  "Ready Message Sent",
  "Pickup Complete",
  "Cancelled",
];

const topStatusCards = [
  "All",
  "Pending",
  "Preparing",
  "Ready for Pickup",
  "Ready Message Sent",
  "Pickup Complete",
];

const filterOptions = [
  "All",
  "Pending",
  "Preparing",
  "Ready for Pickup",
  "Ready Message Sent",
  "Pickup Complete",
  "Cancelled",
];

export default function StaffOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

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

    if (role !== "staff" && role !== "owner") {
      window.location.href = "/admin/login";
      return;
    }

    setAuthorized(true);
    fetchOrders();

    const channel = supabase
      .channel("staff-orders")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        () => fetchOrders()
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

  async function sendReadyMessage(order: Order) {
    const cleanPhone = order.whatsapp.replace(/\D/g, "");

    const message = `Hi ${order.customer_name},

Your Macro Meals order is now ready for pickup at National Fitness Centre Campsite (Barrows Gym).

Pickup Date: ${order.pickup_date}
Pickup Time: ${order.pickup_time}

Thank you for ordering with Macro Meals On Wheels.`;

    window.open(
      `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );

    await updateStatus(order.id, "Ready Message Sent");
  }

  function logout() {
    localStorage.removeItem("macroMealsRole");
    localStorage.removeItem("macroMealsAdmin");
    window.location.href = "/admin/login";
  }

  const filteredOrders =
    activeFilter === "All"
      ? orders
      : orders.filter((order) => order.status === activeFilter);

  function getCount(status: string) {
    if (status === "All") return orders.length;
    return orders.filter((order) => order.status === status).length;
  }

  if (!authorized) return null;

  return (
    <main className="min-h-screen bg-[#f3f3f3] px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-xl md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-black text-[#060d57]">
              Staff Dashboard
            </h1>

            <p className="mt-2 font-semibold text-gray-600">
              Kitchen and pickup management without sales totals.
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

        <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {topStatusCards.map((status) => (
            <div
              key={status}
              className={`rounded-3xl p-5 shadow-lg ${
                status === "Pickup Complete" ? "bg-[#060d57] text-white" : "bg-white"
              }`}
            >
              <p
                className={`text-sm font-black uppercase ${
                  status === "Pickup Complete" ? "text-white/70" : "text-[#75a62f]"
                }`}
              >
                {status}
              </p>

              <p
                className={`mt-2 text-3xl font-black ${
                  status === "Pickup Complete" ? "text-white" : "text-[#060d57]"
                }`}
              >
                {getCount(status)}
              </p>
            </div>
          ))}
        </div>

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
                {filter} ({getCount(filter)})
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="rounded-3xl bg-white p-8 text-center shadow-xl">
            <p className="text-xl font-black text-[#060d57]">Loading orders...</p>
          </div>
        )}

        {!loading && filteredOrders.length === 0 && (
          <div className="rounded-3xl bg-white p-8 text-center shadow-xl">
            <p className="text-xl font-black text-[#060d57]">No orders found.</p>
          </div>
        )}

        {!loading && filteredOrders.length > 0 && (
          <div className="grid gap-6">
            {filteredOrders.map((order) => (
              <section key={order.id} className="rounded-3xl bg-white p-6 shadow-xl">
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
                    <p className="text-sm font-black uppercase tracking-wide text-[#75a62f]">
                      Actions
                    </p>

                    <div className="mt-3 flex flex-col gap-3">
                      <select
                        value={order.status || "Pending"}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 font-black text-[#060d57]"
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>

                      {order.status === "Pending" && (
                        <button
                          onClick={() => updateStatus(order.id, "Preparing")}
                          className="rounded-2xl bg-[#060d57] px-5 py-4 font-black text-white"
                        >
                          Start Preparing
                        </button>
                      )}

                      {order.status === "Preparing" && (
                        <button
                          onClick={() => updateStatus(order.id, "Ready for Pickup")}
                          className="rounded-2xl bg-[#75a62f] px-5 py-4 font-black text-white"
                        >
                          Mark Ready for Pickup
                        </button>
                      )}

                      {order.status === "Ready for Pickup" && (
                        <button
                          onClick={() => sendReadyMessage(order)}
                          className="rounded-2xl bg-[#75a62f] px-5 py-4 font-black text-white"
                        >
                          Send Ready WhatsApp
                        </button>
                      )}

                      {order.status === "Ready Message Sent" && (
                        <button
                          onClick={() => updateStatus(order.id, "Pickup Complete")}
                          className="rounded-2xl bg-[#060d57] px-5 py-4 font-black text-white"
                        >
                          Pickup Complete
                        </button>
                      )}

                      {order.status !== "Cancelled" &&
                        order.status !== "Pickup Complete" && (
                          <button
                            onClick={() => updateStatus(order.id, "Cancelled")}
                            className="rounded-2xl bg-red-500 px-5 py-4 font-black text-white"
                          >
                            Cancel Order
                          </button>
                        )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl bg-[#f3f3f3] p-4">
                  <p className="mb-4 text-sm font-black uppercase tracking-wide text-[#060d57]">
                    Order Items
                  </p>

                  <div className="grid gap-3 md:grid-cols-2">
                    {order.items.map((item, index) => (
                      <div key={`${item.name}-${index}`} className="rounded-2xl bg-white p-4">
                        <p className="text-sm font-black text-[#75a62f]">
                          {item.category}
                        </p>

                        <p className="text-xl font-black text-[#060d57]">
                          {item.quantity}x {item.name}
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