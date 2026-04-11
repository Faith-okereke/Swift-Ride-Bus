import BusCard from "../components/BusCard";
import ProgressBar from "../components/ProgressBar";
import { useBookingStore } from "../store/bookingStore";
import { formatDateShort } from "../utils/helpers";
import { useNavigate } from "react-router";
import { Icon } from "@iconify/react";
import busData from "../data/buses.json";
import type { Bus } from "../types/Seats";

const BUSES = busData as Bus[];

export default function BusListPage() {
  const { booking, update, reset } = useBookingStore();
  const navigate = useNavigate();

  const filteredBuses = BUSES.filter((bus) => {
    // route filter
    const matchesRoute = bus.from === booking.from && bus.to === booking.to;

    // trip type filter
    const matchesTripType = booking.tripType === "hire" ? bus.hire : true;

    return matchesRoute && matchesTripType;
  });

  const handleSelect = (bus: Bus) => {
    update({ selectedBus: bus, selectedSeats: [] });
    navigate(`/bus/${bus.id}/seats/`);
  };

  const tripLabel = {
    "one-way": "One Way",
    round: "Round Trip",
    hire: "Bus Hire",
  }[booking.tripType];

  return (
    <div>
      <ProgressBar currentStep={2} />
      <div className="max-w-full mx-auto md:px-12 px-6 py-8 animate-fadeInUp">
        {/* Back */}
        <button
          onClick={() => {
            navigate(-1);
            reset();
          }}
          className=" flex items-center gap-2 cursor-pointer hover:text-[#c84b11] pb-6"
        >
          <Icon
            icon={"material-symbols:arrow-back-ios-rounded"}
            fontSize={20}
          />
          <span className="md:text-lg text-base font-semibold">Back to Search</span>
        </button>

        {/* Header */}
        <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
          <div>
            <h2 className="text-[22px] font-bold text-[#0D0D0D]">
              {booking.from} → {booking.to}
            </h2>
            <p className="text-[13px] text-[#7A7A7A] mt-1">
              {filteredBuses.length} buses available ·{" "}
              {formatDateShort(booking.departDate)}
            </p>
          </div>
          <span className="inline-flex items-center gap-1 bg-[#F2F1ED] border border-[#E0DED7] rounded-full px-3 py-1 text-[12px] text-[#3A3A3A] font-medium">
            {tripLabel} · {booking.passengers} passenger
            {booking.passengers > 1 ? "s" : ""}
          </span>
        </div>

        {/* Bus list */}
        {filteredBuses.length === 0 ? (
          <div className="text-center py-16 flex flex-col items-center justify-center gap-2">
            <Icon icon={"tabler:bus-off"} fontSize={80} />
            <h3 className="text-2xl lg:text-4xl font-bold">No buses found</h3>
            <p className="text-[14px] text-[#7A7A7A]">
              Try a different route or date.
            </p>
            <button
              className="btn-primary text-sm"
              onClick={() => navigate(-1)}
            >
              Go back to Search Page
            </button>
          </div>
        ) : (
          filteredBuses.map((bus) => (
            <BusCard
              key={bus.id}
              bus={bus as Bus}
              selected={booking.selectedBus?.id === bus.id}
              onSelect={() => handleSelect(bus)}
            />
          ))
        )}
      </div>
    </div>
  );
}
