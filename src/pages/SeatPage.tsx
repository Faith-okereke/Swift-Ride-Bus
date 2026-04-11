import ProgressBar from "../components/ProgressBar";
import { useBookingStore } from "../store/bookingStore";
import type {
  BookingSummaryProps,
  Bus,
  SeatProps,
  SeatStatus,
} from "../types/Seats";
import { formatDateShort } from "../utils/helpers";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router";

/* ================= SEAT ================= */

function Seat({ number, status, driverSeat, onClick }: SeatProps) {
  const base =
    "relative w-10 h-11 rounded-[6px] border-[1.5px] flex items-center justify-center text-[11px] font-semibold transition-all duration-150";

  const styles: Record<SeatStatus, string> = {
    available: `${base} bg-[#FAFAF8] border-[#E0DED7] text-[#7A7A7A] cursor-pointer hover:border-[#C84B11] hover:bg-[#FDF0EB] hover:text-[#C84B11]`,
    taken: `${base} bg-[#E8E6DF] border-[#E0DED7] text-[#B8B8B8] cursor-not-allowed`,
    selected: `${base} bg-[#C84B11] border-[#C84B11] text-white cursor-pointer`,
  };

  const isDriver = number === driverSeat;

  return (
    <div className="flex flex-col items-center gap-0.75">
      <button
        className={`${styles[status]} ${isDriver ? "cursor-not-allowed opacity-50" : ""}`}
        onClick={isDriver || status === "taken" ? undefined : onClick}
        disabled={isDriver}
        title={
          isDriver
            ? "Driver seat"
            : status === "taken"
              ? "Seat taken"
              : `Seat ${number}`
        }
      >
        <Icon icon={"mdi:car-seat"} fontSize={20}>
          {status === "taken" ? "×" : number}
        </Icon>
      </button>
    </div>
  );
}

/* ================= Booking SUMMARY ================= */

function BookingSummary({ bus, booking }: BookingSummaryProps) {
  const navigate = useNavigate();
  const seatCount = booking.selectedSeats.length;
  const total = bus.price * seatCount;

  return (
    <div className="bg-white shadow-md rounded-lg  sticky top-20 w-full">
      <h3 className="text-lg text-center font-bold mb-4 border-b border-b-gray-400 py-4">
        Booking Summary
      </h3>

      <div className="flex flex-col py-2.5 gap-3 px-5">
        <img src={bus.image} className="rounded-lg" />
        <div className="flex justify-between items-center w-full">
          <p className="text-[#7A7A7A]">Bus Name</p>
          <p className="font-medium text-right">{bus.name}</p>
        </div>
        <div className="flex justify-between items-center w-full">
          <p className="text-[#7A7A7A]">Pick up Location</p>
          <p className="font-medium ">{booking.from}</p>
        </div>
        <div className="flex justify-between items-center w-full">
          <p className="text-[#7A7A7A]">Drop off Location</p>
          <p className="font-medium ">{booking.to}</p>
        </div>
        <div className="flex justify-between items-center w-full">
          <p className="text-[#7A7A7A]">Departure Time</p>
          <p className="font-medium">{bus?.departure}</p>
        </div>
        <div className="flex justify-between items-center w-full">
          <p className="text-[#7A7A7A]">Pick up Date</p>
          <p className="font-medium">{formatDateShort(booking?.departDate)}</p>
        </div>
        {booking?.tripType === "round" && (
          <div className="flex justify-between items-center w-full">
            <p className="text-[#7A7A7A]">Return Date</p>
            <p className="font-medium">
              {formatDateShort(booking?.returnDate)}
            </p>
          </div>
        )}
        {booking?.tripType === "hire" && (
          <div className="flex justify-between items-center w-full">
            <p className="text-[#7A7A7A]">Hire Duration</p>
            <p className="font-medium">{booking?.hireDuration}</p>
          </div>
        )}
        <div className="flex justify-between items-center w-full">
          <p className="text-[#7A7A7A]">Seats Selected</p>
          <p className="font-medium">
            {seatCount
              ? booking.selectedSeats.sort((a, b) => a - b).join(", ")
              : "Not selected"}
          </p>
        </div>
        <div className="flex justify-between items-center w-full">
          <p className="text-[#7A7A7A]">Passengers</p>
          <p className="font-medium">
            {`${booking.passengers} passenger${booking.passengers > 1 ? "s" : ""}`}
          </p>
        </div>
      </div>

      <div className="flex justify-between pt-4 border-t border-t-gray-400 p-5 mt-4">
        <span className="font-semibold">Total</span>
        <span className="text-[24px] font-bold text-[#C84B11]">
          ₦ {total.toLocaleString()}
        </span>
      </div>
      <div className="lg:px-5">
        <button
          onClick={() => navigate("/personal-details")}
          disabled={seatCount < booking.passengers}
          className="mx-5 lg:mx-auto btn-secondary flex items-center justify-center my-3 lg:my-auto w-full disabled:bg-gray-400 disabled:cursor-not-allowed disabled:border-none  disabled:text-white"
        >
          {seatCount < booking.passengers ? (
            `Select ${booking.passengers - seatCount} more`
          ) : (
            <p className="flex justify-center items-center gap-1 font-semibold">
              <span>Reserve</span>
              <Icon icon={"lineicons:arrow-right"} fontSize={20} />
            </p>
          )}
        </button>
      </div>
    </div>
  );
}

/* ================= PAGE ================= */

export default function SeatPage() {
  const legend = [
    { label: "Available", color: "#FAFAF8" },
    { label: "Selected", color: "#C84B11" },
    { label: "Taken", color: "#E8E6DF" },
  ];
  const { booking, update } = useBookingStore();
  const navigate = useNavigate();

  const bus = booking.selectedBus as Bus | null;
  const driverSeat = 1;

  if (!bus) return null;

  const toggleSeat = (n: number) => {
    const seats = [...booking.selectedSeats];
    const idx = seats.indexOf(n);
    if (n === driverSeat) return;
    if (idx > -1) {
      seats.splice(idx, 1);
    } else {
      if (seats.length >= booking.passengers) seats.shift();
      seats.push(n);
    }

    update({ selectedSeats: seats });
  };

  const rows = Math.ceil(bus.capacity / 4);

  return (
    <div>
      <ProgressBar currentStep={3} />

      <div className="max-w-4xl mx-auto px-4 pt-8">
        <button
          onClick={() => navigate(-1)}
          className=" flex items-center gap-2 cursor-pointer hover:text-[#c84b11]"
        >
          <Icon
            icon={"material-symbols:arrow-back-ios-rounded"}
            fontSize={20}
          />
          <span className="text-lg font-semibold">Back</span>
        </button>

        <h2 className="text-2xl py-5 font-bold mb-1 text-center">
          Select Your Seat
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
          {/* Seat Map */}
          <div className="bg-white rounded-[14px] shadow-md p-6">
            <div className="flex flex-col gap-3 items-center">
              {Array.from({ length: rows }).map((_, rowIdx) => {
                const cols: (number | "aisle")[] = [1, 2, "aisle", 3, 4];

                return (
                  <div key={rowIdx} className="grid grid-cols-5 gap-2">
                    {cols.map((col, i) => {
                      if (col === "aisle") return <div key={i} />;

                      const seatNum = rowIdx * 4 + col;
                      if (seatNum < 1 || seatNum > bus.capacity)
                        return <div key={i} />;

                      const status: SeatStatus = bus.seatsTaken.includes(
                        seatNum,
                      )
                        ? "taken"
                        : booking.selectedSeats.includes(seatNum)
                          ? "selected"
                          : "available";

                      return (
                        <Seat
                          key={seatNum}
                          number={seatNum}
                          status={status}
                          onClick={() => toggleSeat(seatNum)}
                          driverSeat={driverSeat}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col gap-2 pt-10">
              {legend.map((item, i) => (
                <p key={i} className="flex items-center justify-normal gap-2">
                  <span className={`w-10 h-10 block bg-[${item.color}]`} />
                  <span>{item.label}</span>
                </p>
              ))}
            </div>
          </div>

          {/* Summary */}
          <BookingSummary bus={bus} booking={booking} />
        </div>
      </div>
    </div>
  );
}
