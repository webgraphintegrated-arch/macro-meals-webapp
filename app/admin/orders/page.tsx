"use client";

import { useEffect, useRef, useState } from "react";
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

const statuses = [
  "Pending",
  "Order Received",
  "Ready for Pickup",
  "Pickup Complete",
  "Cancelled",
];

const topStatusCards = [
  "All",
  "Pending",
  "Order Received",
  "Ready for Pickup",
  "Ready Message Sent",
  "Pickup Complete",
];

const filterOptions = [
  "All",
  "Pending",
  "Order Received",
  "Ready for Pickup",
  "Ready Message Sent",
  "Pickup Complete",
  "Cancelled",
];

export default function OwnerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewOrderBanner, setShowNewOrderBanner] = useState(false);
  const [packedRequestCount, setPackedRequestCount] = useState(0);

  const soundRef = useRef<HTMLAudioElement | null>(null);

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

  async function fetchPackedRequestCount() {
    const { data, error } = await supabase
      .from("packed_meal_requests")
      .select("id,status")
      .eq("status", "New Request");

    if (error) {
      console.error(error);
      return;
    }

    setPackedRequestCount(data?.length || 0);
  }

  useEffect(() => {
    const role = localStorage.getItem("macroMealsRole");

    if (role !== "owner") {
      window.location.href = "/admin/login";
      return;
    }

    setAuthorized(true);

    soundRef.current = new Audio("/sounds/new-order.mp3");

    fetchOrders();
    fetchPackedRequestCount();

    const channel = supabase
      .channel("owner-live-orders")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "orders",
        },
        () => {
          fetchOrders();

          if (soundRef.current) {
            soundRef.current.currentTime = 0;
            soundRef.current.play().catch(() => {});
          }

          setShowNewOrderBanner(true);

          setTimeout(() => {
            setShowNewOrderBanner(false);
          }, 6000);
        }
      )
      .subscribe();

    const packedMealsChannel = supabase
      .channel("owner-packed-meal-request-alerts")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "packed_meal_requests",
        },
        () => {
          fetchPackedRequestCount();
        }
      )
      .subscribe();

    const autoRefresh = setInterval(() => {
      fetchOrders();
      fetchPackedRequestCount();
    }, 10000);

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(packedMealsChannel);
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

  async function sendOrderReceivedMessage(order: Order) {
  const cleanPhone = order.whatsapp.replace(/\D/g, "");

  const message = `Hi ${order.customer_name},

Your Macro Meals order has been received.

Our team will begin preparing your meal shortly.

Please stay tuned. You’ll receive another WhatsApp message once your order is ready for pickup.

Pickup Date: ${order.pickup_date}
Pickup Time: ${order.pickup_time}

Pickup Location:
National Fitness Centre Campsite (Barrows Gym)

Thank you for ordering with Macro Meals On Wheels.`;

  window.open(
    `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`,
    "_blank"
  );

  await updateStatus(order.id, "Order Received");
}

async function sendReadyMessage(order: Order) {
  const cleanPhone = order.whatsapp.replace(/\D/g, "");

  const message = `Hi ${order.customer_name},

Your Macro Meals order is now ready for pickup.

Pickup Date: ${order.pickup_date}
Pickup Time: ${order.pickup_time}

Pickup Location:
National Fitness Centre Campsite (Barrows Gym)

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

  const totalSales = orders.reduce(
    (total, order) => total + Number(order.subtotal || 0),
    0
  );

  function getCount(status: string) {
    if (status === "All") return orders.length;
    return orders.filter((order) => order.status === status).length;
  }

  if (!authorized) return null;

  return (
    <main className="min-h-screen bg-[#f3f3f3] px-4 py-8">
      <div className="mx-auto max-w-7xl">
        {showNewOrderBanner && (
          <div className="mb-6 animate-pulse rounded-3xl border-4 border-[#75a62f] bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-wide text-[#75a62f]">
                  New Order Alert
                </p>

                <h2 className="mt-1 text-2xl font-black text-[#060d57]">
                  A new Macro Meals order was received.
                </h2>
              </div>

              <div className="rounded-2xl bg-[#75a62f] px-5 py-3 text-lg font-black text-white">
                NEW
              </div>
            </div>
          </div>
        )}

        <div className="mb-6 flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-xl md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-black text-[#060d57]">
              Owner Dashboard
            </h1>

            <p className="mt-2 font-semibold text-gray-600">
              Full order management with sales totals and customer details.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="/admin/meal-prep"
              className="relative rounded-2xl bg-red-500 px-5 py-3 font-black text-white"
            >
              🔔 Meal Prep Requests
              {packedRequestCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-700 text-xs font-black text-white">
                  {packedRequestCount}
                </span>
              )}
            </a>

            <a
              href="/menu"
              className="rounded-2xl border-2 border-[#060d57] px-5 py-3 font-black text-[#060d57]"
            >
              View Menu
            </a>

            <a
              href="/admin/history"
              className="rounded-2xl border-2 border-[#060d57] px-5 py-3 font-black text-[#060d57]"
            >
              Order History
            </a>

            <a
              href="/admin/staff"
              className="rounded-2xl border-2 border-[#75a62f] px-5 py-3 font-black text-[#75a62f]"
            >
              Staff View
            </a>

            <button
              onClick={() => {
                fetchOrders();
                fetchPackedRequestCount();
              }}
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
                status === "Pickup Complete"
                  ? "bg-[#060d57] text-white"
                  : "bg-white"
              }`}
            >
              <p
                className={`text-sm font-black uppercase ${
                  status === "Pickup Complete"
                    ? "text-white/70"
                    : "text-[#75a62f]"
                }`}
              >
                {status}
              </p>

              <p
                className={`mt-2 text-3xl font-black ${
                  status === "Pickup Complete"
                    ? "text-white"
                    : "text-[#060d57]"
                }`}
              >
                {getCount(status)}
              </p>
            </div>
          ))}

          <div className="rounded-3xl bg-[#060d57] p-5 text-white shadow-lg">
            <p className="text-sm font-black uppercase text-white/70">
              Total Sales
            </p>

            <p className="mt-2 text-3xl font-black">${totalSales}</p>
          </div>
        </div>

        <div className="mb-6 rounded-3xl bg-white p-5 shadow-xl">
          <p className="mb-3 text-sm font-black uppercase tracking-wide text-[#060d57]">
            Search Customer
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
            <p className="text-xl font-black text-[#060d57]">
              Loading orders...
            </p>
          </div>
        )}

        {!loading && filteredOrders.length === 0 && (
          <div className="rounded-3xl bg-white p-8 text-center shadow-xl">
            <p className="text-xl font-black text-[#060d57]">
              No orders found.
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

                    <p className="text-sm font-semibold text-gray-700">
                      Email: {order.email || "N/A"}
                    </p>

                    <p className="mt-4 text-sm font-semibold text-gray-700">
                      Subscribe:
                    </p>

                    <p className="text-sm font-black text-[#060d57]">
                      {order.subscribe ? "Yes" : "No"}
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
                        onChange={(e) =>
                          updateStatus(order.id, e.target.value)
                        }
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

                      {order.status === "Pending" && (
                    <button
                      onClick={() => sendOrderReceivedMessage(order)}
                      className="rounded-2xl bg-[#060d57] px-5 py-4 font-black text-white"
                    >
                      Send Order Received WhatsApp
                    </button>
                  )}

                  {order.status === "Order Received" && (
                    <button
                      onClick={() =>
                        updateStatus(order.id, "Ready for Pickup")
                      }
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
                      Send Ready for Pickup WhatsApp
                    </button>
                  )}

                  {order.status === "Ready Message Sent" && (
                    <button
                      onClick={() =>
                        updateStatus(order.id, "Pickup Complete")
                      }
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

                                        {order.status !== "Cancelled" &&
                                          order.status !== "Pickup Complete" && (
                                            <button
                                              onClick={() =>
                                                updateStatus(order.id, "Cancelled")
                                              }
                                              className="rounded-2xl bg-red-500 px-5 py-4 font-black text-white"
                                            >
                                              Cancel Order
                                            </button>
                                          )}
                                      </div>

                                      <div className="mt-4 rounded-2xl bg-[#060d57] p-4 text-white">
                                        <p className="text-sm font-semibold text-white/70">
                                          Subtotal
                                        </p>

                                        <p className="text-3xl font-black">${order.subtotal}</p>
                                      </div>
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