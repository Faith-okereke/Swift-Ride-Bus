import { useState } from "react";
import LocationInput from "../components/LocationInput";
import { useNavigate } from "react-router";
import { Icon } from "@iconify/react";
import { useBookingStore } from "../store/bookingStore";

type ErrorProps = {
  from?: string;
  to?: string;
  departDate?: string;
  returnDate?: string;
};
type TripType = "one-way" | "round" | "hire";

const TRIP_TYPES: { id: TripType; label: string }[] = [
  { id: "one-way", label: "One Way" },
  { id: "round", label: "Round Trip" },
  { id: "hire", label: "Hire a Bus" },
];

const FEATURES = [
  {
    icon: "ic:twotone-shield",
    title: "Safe Journeys",
    desc: "Verified drivers, insured vehicles, real-time tracking",
  },
  {
    icon: "solar:armchair-outline",
    title: "Choose Your Seat",
    desc: "Pick exactly where you sit before you board",
  },
  {
    icon: "octicon:zap-24",
    title: "Instant Tickets",
    desc: "Book in under 3 minutes, get your e-ticket instantly",
  },
];

export default function SearchPage() {
  const { booking, update } = useBookingStore();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({} as ErrorProps);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: ErrorProps = {};

    if (!booking.from.trim()) {
      newErrors.from = "Enter departure city";
    }

    if (!booking.to.trim()) {
      newErrors.to = "Enter destination city";
    }

    if (
      booking.from &&
      booking.to &&
      booking.from.toLowerCase() === booking.to.toLowerCase()
    ) {
      newErrors.to = "Cannot be the same as departure";
    }

    if (!booking.departDate) {
      newErrors.departDate = "Select a date";
    }

    if (booking.tripType === "round" && !booking.returnDate) {
      newErrors.returnDate = "Select return date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearch = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setLoading(true);
      navigate("/search-results/buses");
    } catch (err) {
      console.error("Search error:", err);
      setErrors({ from: "An unexpected error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const swapLocations = () => {
    update({ from: booking.to, to: booking.from });
    setErrors((e) => ({ ...e, from: undefined, to: undefined }));
  };

  return (
    <div>
      {/* Hero */}
      <div className="bg-[#0D0D0D] text-white px-6 pt-16 pb-24 relative overflow-hidden">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/8 border border-white/12 rounded-full px-4 py-2 text-[12px] text-white/70 mb-5">
            <span className="w-2 h-2 rounded-full bg-[#C84B11] inline-block" />
            Nigeria's #1 Bus Network · 200+ Routes
          </div>
          <h1
            className="text-5xl md:text-6xl font-bold leading-[1.1] mb-4 tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Travel <em className="text-[#C84B11] not-italic">anywhere</em>
            <br />
            across Nigeria
          </h1>
          <p className="text-white/50 text-[16px] max-w-md mx-auto">
            Safe, comfortable, affordable bus tickets — booked in minutes.
          </p>
        </div>
      </div>

      {/* Booking Card */}
      <form
        onSubmit={handleSearch}
        className="max-w-3xl mx-auto px-4 -mt-12 mb-12 relative z-10"
      >
        <div className="bg-white rounded-[20px] shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-[#E0DED7] p-7">
          {/* Trip Type Tabs */}
          <div className="flex gap-2 mb-6">
            {TRIP_TYPES.map((t) => (
              <button
                type="button"
                key={t.id}
                onClick={() => update({ tripType: t.id })}
                className={`flex-1 py-2.5 px-3 rounded-lg border-[1.5px] text-[13px] font-medium transition-all cursor-pointer
                  ${
                    booking?.tripType === t.id
                      ? "bg-[#0D0D0D] text-white border-[#0D0D0D]"
                      : "bg-white text-[#7A7A7A] border-[#E0DED7] hover:border-[#B8B8B8] hover:text-[#0D0D0D]"
                  }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Route Row */}
          <div className="flex items-end gap-2 mb-3">
            <div className="flex-1">
              <LocationInput
                label="From"
                value={booking.from}
                onChange={(v: any) => {
                  update({ from: v });
                  setErrors((e) => ({ ...e, from: "" }));
                }}
                placeholder="Departure city"
              />
              {errors.from && (
                <p className="text-[11px] text-[#C84B11] mt-1">{errors.from}</p>
              )}
            </div>

            <button
              onClick={swapLocations}
              type="button"
              className="w-9 h-9 pb-0.5 rounded-full border-[1.5px] border-[#E0DED7] bg-[#FAFAF8] flex items-center justify-center hover:bg-[#0D0D0D] hover:border-[#0D0D0D] hover:text-white transition-all shrink-0 cursor-pointer"
            >
              <Icon icon={"eva:swap-fill"} fontSize={14} />
            </button>

            <div className="flex-1">
              <LocationInput
                label="To"
                value={booking.to}
                onChange={(v: any) => {
                  update({ to: v });
                  setErrors((e) => ({ ...e, to: "" }));
                }}
                placeholder="Destination city"
              />
              {errors.to && (
                <p className="text-[11px] text-[#C84B11] mt-1">{errors.to}</p>
              )}
            </div>
          </div>

          {/* Date Row */}
          <div
            className={`grid gap-3 mb-3 ${booking.tripType !== "one-way" ? "grid-cols-2" : "grid-cols-1 md:grid-cols-2"}`}
          >
            <div className="flex flex-col gap-1.25">
              <label className="text-[11px] font-semibold text-[#7A7A7A] uppercase tracking-[0.6px]">
                Departure Date
              </label>
              <input
                type="date"
                value={booking.departDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => {
                  update({ departDate: e.target.value });
                  setErrors((er) => ({ ...er, departDate: "" }));
                }}
                className="px-3 py-2.75 border-[1.5px] border-[#E0DED7] rounded-lg text-[14px] text-[#0D0D0D] bg-[#FAFAF8] outline-none focus:border-[#0D0D0D] transition-colors"
              />
              {errors.departDate && (
                <p className="text-[11px] text-[#C84B11]">
                  {errors.departDate}
                </p>
              )}
            </div>

            {booking.tripType === "round" && (
              <div className="flex flex-col gap-1.25">
                <label className="text-[11px] font-semibold text-[#7A7A7A] uppercase tracking-[0.6px]">
                  Return Date
                </label>
                <input
                  type="date"
                  value={
                    booking?.tripType === "round" || booking?.tripType==="hire" ? booking.returnDate : ""
                  }
                  min={
                    booking.departDate || new Date().toISOString().split("T")[0]
                  }
                  onChange={(e) => {
                    update({ returnDate: e.target.value });
                    setErrors((er) => ({ ...er, returnDate: "" }));
                  }}
                  className="px-3 py-2.75 border-[1.5px] border-[#E0DED7] rounded-lg text-[14px] text-[#0D0D0D] bg-[#FAFAF8] outline-none focus:border-[#0D0D0D] transition-colors"
                />
                {errors.returnDate && (
                  <p className="text-[11px] text-[#C84B11]">
                    {errors.returnDate}
                  </p>
                )}
              </div>
            )}

            {booking.tripType === "hire" && (
              <div className="flex flex-col gap-1.25">
                <label className="text-[11px] font-semibold text-[#7A7A7A] uppercase tracking-[0.6px]">
                  Duration
                </label>
                <select
                  value={booking.hireDuration || "1 day"}
                  onChange={(e) => update({ hireDuration: e.target.value })}
                  className="px-3 py-2.75 border-[1.5px] border-[#E0DED7] rounded-lg text-[14px] text-[#0D0D0D] bg-[#FAFAF8] outline-none focus:border-[#0D0D0D] transition-colors"
                >
                  {["1 day", "2 days", "3 days", "5 days", "7 days"].map(
                    (d) => (
                      <option key={d}>{d}</option>
                    ),
                  )}
                </select>
              </div>
            )}
          </div>

          {/* Passengers */}
          <div className="flex items-center justify-between px-4 py-3 border-[1.5px] border-[#E0DED7] rounded-lg bg-[#FAFAF8] mb-4">
            <span className="text-[13px] text-[#3A3A3A]">Passengers</span>
            <div className="flex items-center gap-1">
              <Icon
                icon={"ei:minus"}
                fontSize={30}
                onClick={() =>
                  update({ passengers: Math.max(1, booking.passengers - 1) })
                }
                className="leading-none hover:border-[#0D0D0D] transition-colors cursor-pointer"
              >
                −
              </Icon>
              <span className="text-[15px] font-semibold w-5 text-center">
                {booking.passengers}
              </span>
              <Icon
                icon={"ei:plus"}
                fontSize={30}
                onClick={() =>
                  update({ passengers: Math.min(6, booking.passengers + 1) })
                }
                className="leading-none hover:border-[#0D0D0D] transition-colors cursor-pointer"
              >
                +
              </Icon>
            </div>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#C84B11] hover:bg-[#A33A09] disabled:opacity-60 text-white rounded-lg text-[15px] font-semibold flex items-center justify-center gap-2 transition-all hover:-translate-y-px active:translate-y-0 cursor-pointer "
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full spinner" />
                Searching...
              </>
            ) : (
              <div className="flex justify-center items-center gap-2">
                <Icon icon={"fe:search"} fontSize={16} />
                <span>Search Available Buses</span>
              </div>
            )}
          </button>
        </div>
      </form>

      {/* Features */}
      <div className="max-w-3xl mx-auto px-4 mb-16 grid grid-cols-1 md:grid-cols-3 gap-4">
        {FEATURES.map(({ icon, title, desc }) => (
          <div
            key={title}
            className="bg-white border border-[#E0DED7] rounded-[14px] p-5 text-center"
          >
            <div className="w-10 h-10 rounded-[10px] bg-[#F2F1ED] flex items-center justify-center mx-auto mb-3">
              <Icon icon={icon} fontSize={18} className="text-[#C84B11]" />
            </div>
            <div className="text-[14px] font-semibold mb-1">{title}</div>
            <div className="text-[12px] text-[#7A7A7A]">{desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
