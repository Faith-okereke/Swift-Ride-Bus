import { formatDate, generateRef } from "../utils/helpers";
import { useBookingStore } from "../store/bookingStore";
import { Link } from "react-router";
import { Icon } from "@iconify/react";

export default function ConfirmPage() {
  const { booking, reset } = useBookingStore();
  const bus = booking.selectedBus;
  const seatCount = booking?.selectedSeats.length;
  if (!bus) return null;

  const base =
    booking?.tripType === "round"
      ? ((bus?.price ?? 0) * seatCount * 2).toLocaleString()
      : ((bus?.price ?? 0) * seatCount).toLocaleString();
  const total = base;
  const passengerName = `${booking.passenger.firstName} ${booking.passenger.lastName}`;

  return (
    <div className="max-w-140 mx-auto px-4 py-16 text-center animate-fadeInUp">
      {/* Success icon */}
      <div className="flex flex-col gap-1 items-center justify-center">
        <Icon
          icon={"prime:check-circle"}
          fontSize={100}
          className="text-green-500"
        />

        <h1 className="text-[32px] font-bold mb-2 text-[#0D0D0D]">
          Booking Confirmed!
        </h1>
        <p className="text-[15px] text-[#7A7A7A] mb-8 max-w-sm mx-auto">
          Your ticket has been sent to{" "}
          <strong className="text-[#0D0D0D]">{booking.passenger.email}</strong>.
          Show this at the terminal.
        </p>
      </div>

      {/* Ticket */}
      <div className="bg-white border-[1.5px] border-[#E0DED7] rounded-[20px] overflow-hidden text-left mb-6 shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
        {/* Ticket header */}
        <div className="bg text-black px-6 py-3 flex items-center justify-between border-b-2 border-b-gray-300">
          <div>
            <div className="text-[20px] font-bold">
              {booking.from} → {booking.to}
            </div>
            <div className="text-[12px] mt-0.5">
              Ref: {generateRef}
            </div>
          </div>
          <span className="bg-green-500 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
            Confirmed
          </span>
        </div>

        {/* Ticket body */}
        <div className="grid grid-cols-2 gap-4 p-6">
          {[
            { label: "Passenger", value: passengerName },
            { label: "Date", value: formatDate(booking.departDate) },
            { label: "Departure", value: bus.departure },
            { label: "Trip type", value: booking.tripType },
            {
              label: "Seat(s) Number",
              value: booking.selectedSeats.sort((a, b) => a - b).join(", "),
            },
            { label: "Bus", value: bus.name },
            {
              label: "Amount Paid",
              value: `₦${total.toLocaleString()}`,
              accent: true,
            },
          ].map(({ label, value, accent }) => (
            <div key={label}>
              <div className="text-[10px] font-bold uppercase tracking-[0.7px] text-[#B8B8B8] mb-1">
                {label}
              </div>
              <div
                className={`capitalize text-[15px] font-semibold ${accent ? "text-[#C84B11]" : "text-[#0D0D0D]"}`}
              >
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Link
        to={"/"}
        onClick={() => reset()}
        className="btn-primary rounded-full text-sm"
      >
        Book Another Trip
      </Link>
    </div>
  );
}
