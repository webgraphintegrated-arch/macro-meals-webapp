"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
const [packedRequestCount, setPackedRequestCount] = useState(0);
type PackedMealItem = {
  category: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
};

type PackedMealRequest = {
  id: string;
  customer_name: string;
  whatsapp: string;
  email: string | null;
  meals_count: number;
  requested_start_date: string;
  notes: string | null;
  promo_code: string | null;
  discount_percent: number;
  status: string;
  created_at: string;
  items: PackedMealItem[] | null;
  subtotal: number;
  estimated_total: number;
  container_option: string | null;
  container_fee: number;
  subscribe: boolean;
};

const statuses = [
  "New Request",
  "Approved",
  "Awaiting Pickup",
  "Completed",
  "Rejected",
];

const filterOptions = [
  "All",
  "New Request",
  "Approved",
  "Awaiting Pickup",
  "Completed",
  "Rejected",
];

export default function AdminPackedMealsPage() {
  const [requests, setRequests] = useState<PackedMealRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  async function fetchRequests() {
    const { data, error } = await supabase
      .from("packed_meal_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      alert("Failed to load packed meal requests.");
      setLoading(false);
      return;
    }

    setRequests((data as PackedMealRequest[]) || []);
    setLoading(false);
  }

  useEffect(() => {
    const role = localStorage.getItem("macroMealsRole");

    if (role !== "owner" && role !== "staff") {
      window.location.href = "/admin/login";
      return;
    }

    setAuthorized(true);
    fetchRequests();

    const channel = supabase
      .channel("packed-meal-requests")
      .on(
        "postgres_changes",
        {
          event: "*",
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

  function sendWhatsApp(request: PackedMealRequest) {
    const cleanPhone = request.whatsapp.replace(/\D/g, "");

    const message = `Hi ${request.customer_name},

Thank you for your packed meal request with Macro Meals On Wheels.

Requested Pickup Date: ${request.requested_start_date}
Total Meals: ${request.meals_count}
Estimated Total: $${Number(request.estimated_total || 0).toFixed(2)}

Current Status: ${request.status}

We will review and confirm your request shortly.`;

    window.open(
      `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  }

  function logout() {
    localStorage.removeItem("macroMealsRole");
    localStorage.removeItem("macroMealsAdmin");
    window.location.href = "/admin/login";
  }

  function exportCSV() {
    const rows = filteredRequests.map((request) => ({
      Date: new Date(request.created_at).toLocaleString(),
      Customer: request.customer_name,
      WhatsApp: request.whatsapp,
      Email: request.email || "",
      PickupDate: request.requested_start_date,
      MealsCount: request.meals_count,
      Status: request.status,
      Subtotal: request.subtotal || 0,
      ContainerOption: request.container_option || "",
      ContainerFee: request.container_fee || 0,
      DiscountPercent: request.discount_percent || 0,
      EstimatedTotal: request.estimated_total || 0,
      PromoCode: request.promo_code || "",
      Subscribe: request.subscribe ? "Yes" : "No",
      Notes: request.notes || "",
      Items:
        request.items
          ?.map(
            (item) =>
              `${item.quantity}x ${item.category} - ${item.name} - $${item.total}`
          )
          .join(" | ") || "",
    }));

    const headers = Object.keys(
      rows[0] || {
        Date: "",
        Customer: "",
        WhatsApp: "",
        Email: "",
        PickupDate: "",
        MealsCount: "",
        Status: "",
        Subtotal: "",
        ContainerOption: "",
        ContainerFee: "",
        DiscountPercent: "",
        EstimatedTotal: "",
        PromoCode: "",
        Subscribe: "",
        Notes: "",
        Items: "",
      }
    );

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
    link.download = `packed-meal-requests-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    link.click();
    URL.revokeObjectURL(url);
  }

  const filteredRequests = requests.filter((request) => {
    const matchesStatus =
      activeFilter === "All" || request.status === activeFilter;

    const searchableText = `${request.customer_name} ${request.whatsapp} ${request.email || ""}`
      .toLowerCase()
      .replace(/\s/g, "");

    const cleanedSearch = searchTerm.toLowerCase().replace(/\s/g, "");

    const matchesSearch =
      cleanedSearch === "" || searchableText.includes(cleanedSearch);

    return matchesStatus && matchesSearch;
  });

  function getCount(filter: string) {
    if (filter === "All") return requests.length;

    return requests.filter((request) => request.status === filter).length;
  }

  const totalEstimated = filteredRequests.reduce(
    (total, request) => total + Number(request.estimated_total || 0),
    0
  );

  const totalMeals = filteredRequests.reduce(
    (total, request) => total + Number(request.meals_count || 0),
    0
  );

  const subscribedCount = filteredRequests.filter(
    (request) => request.subscribe
  ).length;

  if (!authorized) return null;

  return (
    <main className="min-h-screen bg-[#f3f3f3] px-4 py-8">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}

        <div className="mb-6 flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-xl md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-black text-[#060d57]">
              Packed Meal Requests
            </h1>

            <p className="mt-2 font-semibold text-gray-600">
              Manage weekly packed meal requests, approvals, containers and customer follow-ups.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="/admin/orders"
              className="rounded-2xl border-2 border-[#060d57] px-5 py-3 font-black text-[#060d57]"
            >
              Owner Dashboard
            </a>

            <a
              href="/admin/staff"
              className="rounded-2xl border-2 border-[#75a62f] px-5 py-3 font-black text-[#75a62f]"
            >
              Staff View
            </a>

            <button
              onClick={fetchRequests}
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

        {/* STATS */}

        <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-3xl bg-white p-5 shadow-lg">
            <p className="text-sm font-black uppercase text-[#75a62f]">
              Requests
            </p>

            <p className="mt-2 text-3xl font-black text-[#060d57]">
              {filteredRequests.length}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-lg">
            <p className="text-sm font-black uppercase text-[#75a62f]">
              Meals
            </p>

            <p className="mt-2 text-3xl font-black text-[#060d57]">
              {totalMeals}
            </p>
          </div>

          <div className="rounded-3xl bg-[#060d57] p-5 text-white shadow-lg">
            <p className="text-sm font-black uppercase text-white/70">
              Estimated Total
            </p>

            <p className="mt-2 text-3xl font-black">
              ${totalEstimated.toFixed(2)}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-lg">
            <p className="text-sm font-black uppercase text-[#75a62f]">
              Subscribers
            </p>

            <p className="mt-2 text-3xl font-black text-[#060d57]">
              {subscribedCount}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-lg">
            <p className="text-sm font-black uppercase text-[#75a62f]">
              New Requests
            </p>

            <p className="mt-2 text-3xl font-black text-[#060d57]">
              {getCount("New Request")}
            </p>
          </div>
        </div>

        {/* SEARCH */}

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

        {/* FILTERS */}

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

        {/* LOADING / EMPTY */}

        {loading && (
          <div className="rounded-3xl bg-white p-8 text-center shadow-xl">
            <p className="text-xl font-black text-[#060d57]">
              Loading packed meal requests...
            </p>
          </div>
        )}

        {!loading && filteredRequests.length === 0 && (
          <div className="rounded-3xl bg-white p-8 text-center shadow-xl">
            <p className="text-xl font-black text-[#060d57]">
              No packed meal requests found.
            </p>
          </div>
        )}

        {/* REQUESTS */}

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
                  {/* CUSTOMER */}

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

                  {/* REQUEST DETAILS */}

                  <div>
                    <p className="text-sm font-black uppercase tracking-wide text-[#75a62f]">
                      Request Details
                    </p>

                    <p className="mt-2 text-lg font-black text-[#060d57]">
                      Pickup Date: {request.requested_start_date}
                    </p>

                    <p className="text-lg font-black text-[#060d57]">
                      Meals: {request.meals_count}
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

                  {/* ACTIONS */}

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
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>

                      {request.status === "New Request" && (
                        <button
                          onClick={() => updateStatus(request.id, "Approved")}
                          className="rounded-2xl bg-[#060d57] px-5 py-4 font-black text-white"
                        >
                          Approve Request
                        </button>
                      )}

                      {request.status === "Approved" && (
                        <button
                          onClick={() =>
                            updateStatus(request.id, "Awaiting Pickup")
                          }
                          className="rounded-2xl bg-[#75a62f] px-5 py-4 font-black text-white"
                        >
                          Mark Awaiting Pickup
                        </button>
                      )}

                      {request.status === "Awaiting Pickup" && (
                        <button
                          onClick={() => updateStatus(request.id, "Completed")}
                          className="rounded-2xl bg-[#060d57] px-5 py-4 font-black text-white"
                        >
                          Mark Completed
                        </button>
                      )}

                      {request.status !== "Rejected" &&
                        request.status !== "Completed" && (
                          <button
                            onClick={() =>
                              updateStatus(request.id, "Rejected")
                            }
                            className="rounded-2xl bg-red-500 px-5 py-4 font-black text-white"
                          >
                            Reject Request
                          </button>
                        )}

                      <button
                        onClick={() => sendWhatsApp(request)}
                        className="rounded-2xl bg-[#75a62f] px-5 py-4 font-black text-white"
                      >
                        WhatsApp Customer
                      </button>
                    </div>
                  </div>
                </div>

                {/* PRICE SUMMARY */}

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
                      Estimated Total
                    </p>

                    <p className="mt-1 text-2xl font-black">
                      ${Number(request.estimated_total || 0).toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* ORDER ITEMS */}

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