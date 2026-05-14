"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

type MealPrepItem = {
  category: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
};

type MealPrepRequest = {
  id: string;
  customer_name: string;
  whatsapp: string;
  email: string | null;
  meals_count: number;
  requested_start_date: string;
  notes: string | null;
  promo_code: string | null;
  discount_percent: number | null;
  status: string;
  created_at: string;
  items: MealPrepItem[] | null;
  subtotal: number | null;
  estimated_total: number | null;
  container_option: string | null;
  container_fee: number | null;
  subscribe: boolean | null;
};

const statuses = [
  "New Request",
  "Preparing",
  "Ready for Pickup",
  "Ready Message Sent",
  "Pickup Complete",
  "Cancelled",
];

const statusSelectorOptions = [
  "New Request",
  "Preparing",
  "Ready for Pickup",
  "Pickup Complete",
  "Cancelled",
];

const filterOptions = [
  "All",
  "New Request",
  "Preparing",
  "Ready for Pickup",
  "Ready Message Sent",
  "Pickup Complete",
  "Cancelled",
];

export default function MealPrepAdminPage() {
  const [requests, setRequests] = useState<MealPrepRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [role, setRole] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewRequestBanner, setShowNewRequestBanner] = useState(false);

  const soundRef = useRef<HTMLAudioElement | null>(null);

  async function fetchRequests() {
    const { data, error } = await supabase
      .from("packed_meal_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      alert("Failed to load meal prep requests.");
      setLoading(false);
      return;
    }

    setRequests((data as MealPrepRequest[]) || []);
    setLoading(false);
  }

  useEffect(() => {
    const storedRole = localStorage.getItem("macroMealsRole");

    if (storedRole !== "owner" && storedRole !== "staff") {
      window.location.href = "/admin/login";
      return;
    }

    setRole(storedRole);
    setAuthorized(true);

    soundRef.current = new Audio("/sounds/new-order.mp3");

    fetchRequests();

    const channel = supabase
      .channel("meal-prep-live-requests")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "packed_meal_requests",
        },
        () => {
          fetchRequests();

          if (soundRef.current) {
            soundRef.current.currentTime = 0;
            soundRef.current.play().catch(() => {});
          }

          setShowNewRequestBanner(true);

          setTimeout(() => {
            setShowNewRequestBanner(false);
          }, 6000);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "packed_meal_requests",
        },
        () => {
          fetchRequests();
        }
      )
      .subscribe();

    const autoRefresh = setInterval(() => {
      fetchRequests();
    }, 10000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(autoRefresh);
    };
  }, []);

  async function updateStatus(requestId: string, newStatus: string) {
    const { error } = await supabase
      .from("packed_meal_requests")
      .update({ status: newStatus })
      .eq("id", requestId);

    if (error) {
      console.error(error);
      alert("Failed to update request status.");
      return;
    }

    setRequests((currentRequests) =>
      currentRequests.map((request) =>
        request.id === requestId
          ? { ...request, status: newStatus }
          : request
      )
    );
  }

  async function sendPreparingMessage(request: MealPrepRequest) {
    const cleanPhone = request.whatsapp.replace(/\D/g, "");

    const message = `Hi ${request.customer_name},

Your Macro Meals meal prep request is now being prepared.

Pickup Date: ${request.requested_start_date}

We will send another WhatsApp message when your meal prep is ready for pickup.

Thank you for choosing Macro Meals On Wheels.`;

    window.open(
      `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );

    await updateStatus(request.id, "Preparing");
  }

  async function sendReadyMessage(request: MealPrepRequest) {
    const cleanPhone = request.whatsapp.replace(/\D/g, "");

    const message = `Hi ${request.customer_name},

Your Macro Meals meal prep request is ready for pickup.

Pickup Location:
National Fitness Centre Campsite (Barrows Gym)

Pickup Date: ${request.requested_start_date}

Thank you for choosing Macro Meals On Wheels.`;

    window.open(
      `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );

    await updateStatus(request.id, "Ready Message Sent");
  }

  function logout() {
    localStorage.removeItem("macroMealsRole");
    localStorage.removeItem("macroMealsAdmin");
    window.location.href = "/admin/login";
  }

  function getCount(status: string) {
    if (status === "All") return requests.length;

    return requests.filter((request) => request.status === status).length;
  }

  const filteredRequests = requests.filter((request) => {
    const matchesStatus =
      activeFilter === "All" || request.status === activeFilter;

    const searchableText = `${request.customer_name} ${request.whatsapp} ${
      request.email || ""
    }`
      .toLowerCase()
      .replace(/\s/g, "");

    const cleanedSearch = searchTerm.toLowerCase().replace(/\s/g, "");

    const matchesSearch =
      cleanedSearch === "" || searchableText.includes(cleanedSearch);

    return matchesStatus && matchesSearch;
  });

  const newRequestCount = getCount("New Request");

  if (!authorized) return null;

  return (
    <main className="min-h-screen bg-[#f3f3f3] px-4 py-8">
      <div className="mx-auto max-w-7xl">
        {showNewRequestBanner && (
          <div className="mb-6 animate-pulse rounded-3xl border-4 border-red-500 bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-wide text-red-500">
                  New Meal Prep Request
                </p>

                <h2 className="mt-1 text-2xl font-black text-[#060d57]">
                  A new meal prep request was received.
                </h2>
              </div>

              <div className="rounded-2xl bg-red-500 px-5 py-3 text-lg font-black text-white">
                🔔 NEW
              </div>
            </div>
          </div>
        )}

        <div className="mb-6 flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-xl md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-4xl font-black text-[#060d57]">
                Meal Prep Requests
              </h1>

              {newRequestCount > 0 && (
                <div className="flex items-center gap-2 rounded-full bg-red-500 px-4 py-2 text-sm font-black text-white shadow-lg">
                  🔔 {newRequestCount} New
                </div>
              )}
            </div>

            <p className="mt-2 font-semibold text-gray-600">
              Manage meal prep requests, customer details, pickup status and WhatsApp updates.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={role === "owner" ? "/admin/orders" : "/admin/staff"}
              className="rounded-2xl border-2 border-[#060d57] px-5 py-3 font-black text-[#060d57]"
            >
              Back to Dashboard
            </a>

            <button
              onClick={fetchRequests}
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

        <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          {statuses.map((status) => (
            <div
              key={status}
              className={`relative rounded-3xl p-5 shadow-lg ${
                status === "Pickup Complete"
                  ? "bg-[#060d57] text-white"
                  : "bg-white"
              }`}
            >
              {status === "New Request" && newRequestCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-xs font-black text-white">
                  {newRequestCount}
                </span>
              )}

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
        </div>

        <div className="mb-6 rounded-3xl bg-white p-5 shadow-xl">
          <p className="mb-3 text-sm font-black uppercase tracking-wide text-[#060d57]">
            Search Requests
          </p>

          <input
            type="text"
            placeholder="Search by customer name, WhatsApp or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 text-base font-semibold text-[#060d57] placeholder:text-gray-500 outline-none focus:border-[#75a62f]"
          />
        </div>

        <div className="mb-8 rounded-3xl bg-white p-4 shadow-xl">
          <p className="mb-3 text-sm font-black uppercase tracking-wide text-[#060d57]">
            Filter Requests
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
              Loading meal prep requests...
            </p>
          </div>
        )}

        {!loading && filteredRequests.length === 0 && (
          <div className="rounded-3xl bg-white p-8 text-center shadow-xl">
            <p className="text-xl font-black text-[#060d57]">
              No meal prep requests found.
            </p>
          </div>
        )}

        {!loading && filteredRequests.length > 0 && (
          <div className="grid gap-6">
            {filteredRequests.map((request) => (
              <section
                key={request.id}
                className="rounded-3xl bg-white p-6 shadow-xl"
              >
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-4">
                  <div>
                    <p className="text-sm font-black uppercase tracking-wide text-[#75a62f]">
                      Request Status
                    </p>

                    <p className="text-2xl font-black text-[#060d57]">
                      {request.status}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#f3f3f3] px-4 py-3 text-sm font-black text-[#060d57]">
                    Submitted: {new Date(request.created_at).toLocaleString()}
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                  <div>
                    <p className="text-sm font-black uppercase tracking-wide text-[#75a62f]">
                      Customer
                    </p>

                    <h2 className="mt-1 text-2xl font-black text-[#060d57]">
                      {request.customer_name}
                    </h2>

                    <p className="mt-2 text-sm font-semibold text-gray-700">
                      WhatsApp: {request.whatsapp}
                    </p>

                    <p className="text-sm font-semibold text-gray-700">
                      Email: {request.email || "N/A"}
                    </p>

                    <p className="mt-4 text-sm font-semibold text-gray-700">
                      Subscribed:
                    </p>

                    <p className="text-sm font-black text-[#060d57]">
                      {request.subscribe ? "Yes" : "No"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-black uppercase tracking-wide text-[#75a62f]">
                      Request Details
                    </p>

                    <p className="mt-2 text-lg font-black text-[#060d57]">
                      Pickup Date: {request.requested_start_date}
                    </p>

                    <p className="text-lg font-black text-[#060d57]">
                      Total Meals: {request.meals_count}
                    </p>

                    <p className="mt-4 text-sm font-semibold text-gray-700">
                      Container Option:
                    </p>

                    <p className="text-sm font-black text-[#060d57]">
                      {request.container_option || "N/A"}
                    </p>

                    <p className="mt-4 text-sm font-semibold text-gray-700">
                      Notes:
                    </p>

                    <p className="text-sm font-black text-[#060d57]">
                      {request.notes || "None"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-black uppercase tracking-wide text-[#75a62f]">
                      Actions
                    </p>

                    <div className="mt-3 flex flex-col gap-3">
                      <select
                        value={request.status || "New Request"}
                        onChange={(e) =>
                          updateStatus(request.id, e.target.value)
                        }
                        className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 font-black text-[#060d57]"
                      >
                        {statusSelectorOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>

                      {request.status === "New Request" && (
                        <button
                          onClick={() => sendPreparingMessage(request)}
                          className="rounded-2xl bg-[#060d57] px-5 py-4 font-black text-white"
                        >
                          Send Preparing WhatsApp
                        </button>
                      )}

                      {request.status === "Preparing" && (
                        <button
                          onClick={() =>
                            updateStatus(request.id, "Ready for Pickup")
                          }
                          className="rounded-2xl bg-[#75a62f] px-5 py-4 font-black text-white"
                        >
                          Mark Ready for Pickup
                        </button>
                      )}

                      {request.status === "Ready for Pickup" && (
                        <button
                          onClick={() => sendReadyMessage(request)}
                          className="rounded-2xl bg-[#75a62f] px-5 py-4 font-black text-white"
                        >
                          Send Ready WhatsApp
                        </button>
                      )}

                      {request.status === "Ready Message Sent" && (
                        <button
                          onClick={() =>
                            updateStatus(request.id, "Pickup Complete")
                          }
                          className="rounded-2xl bg-[#060d57] px-5 py-4 font-black text-white"
                        >
                          Pickup Complete
                        </button>
                      )}

                      {request.status !== "Cancelled" &&
                        request.status !== "Pickup Complete" && (
                          <button
                            onClick={() =>
                              updateStatus(request.id, "Cancelled")
                            }
                            className="rounded-2xl bg-red-500 px-5 py-4 font-black text-white"
                          >
                            Cancel Request
                          </button>
                        )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-4">
                  <div className="rounded-2xl bg-[#f3f3f3] p-4">
                    <p className="text-sm font-black uppercase text-[#75a62f]">
                      Subtotal
                    </p>

                    <p className="mt-1 text-2xl font-black text-[#060d57]">
                      ${Number(request.subtotal || 0).toFixed(2)}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#f3f3f3] p-4">
                    <p className="text-sm font-black uppercase text-[#75a62f]">
                      Discount
                    </p>

                    <p className="mt-1 text-2xl font-black text-[#060d57]">
                      {request.discount_percent || 0}%
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#f3f3f3] p-4">
                    <p className="text-sm font-black uppercase text-[#75a62f]">
                      Container Fee
                    </p>

                    <p className="mt-1 text-2xl font-black text-[#060d57]">
                      ${Number(request.container_fee || 0).toFixed(2)}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#060d57] p-4 text-white">
                    <p className="text-sm font-black uppercase text-white/70">
                      Customer Total
                    </p>

                    <p className="mt-1 text-2xl font-black">
                      ${Number(request.estimated_total || 0).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl bg-[#f3f3f3] p-4">
                  <p className="mb-4 text-sm font-black uppercase tracking-wide text-[#060d57]">
                    Selected Meals
                  </p>

                  {!request.items || request.items.length === 0 ? (
                    <p className="rounded-2xl bg-white p-4 font-semibold text-gray-600">
                      No selected meal details found.
                    </p>
                  ) : (
                    <div className="grid gap-3 md:grid-cols-2">
                      {request.items.map((item, index) => (
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
                            ${item.total}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}