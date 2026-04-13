import ProgressBar from "../components/ProgressBar";
import { useBookingStore } from "../store/bookingStore";
import type { Bus, SeatProps, SeatStatus } from "../types/booking";
import { Icon } from "@iconify/react";
import { Link, useNavigate } from "react-router";
import { calculateTotalPrice } from "../utils/helpers";

const Seat = ({ number, status, driverSeat, onClick }: SeatProps) => {
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
      {/* Headrest */}
      <div
        className={`w-5 h-1.25 rounded-t-[3px] ${
          status === "selected" ? "bg-[#9B3A0A]" : "bg-[#E0DED7]"
        }`}
      />

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
        {isDriver ? (
          <Icon icon="mdi:steering" fontSize={16} />
        ) : status === "taken" ? (
          "×"
        ) : (
          number // ✅ just the number
        )}
      </button>
    </div>
  );
};

/* ================= PAGE ================= */

export default function SeatPage() {
  const legend = [
    { label: "Selected", color: "#C84B11" },
    { label: "Available", color: "#FAFAF8" },

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

      <div className="max-w-4xl mx-auto px-4  min-h-screen">
        <div className=" py-4 flex items-center relative">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 cursor-pointer hover:text-[#c84b11] lg:pl-12 pl-4"
          >
            <Icon
              icon={"material-symbols:arrow-back-ios-rounded"}
              fontSize={20}
            />
            <span className="md:text-lg text-base font-semibold">Back</span>
          </button>

          <h3 className="absolute left-1/2 -translate-x-1/2 lg:text-2xl text-lg font-bold">
            Select your Seat
          </h3>
        </div>

        <div className="lg:flex block justify-center items-start  lg:gap-12">
          {/* Seat Map */}

          <div className="bg-white rounded-[14px] shadow-md p-6">
            <div className="flex lg:flex-row flex-col  justify-center gap-16 items-start ">
              <div className="flex flex-col gap-3 items-center lg:p-12 p-6 ">
                {/* First row — driver seat + 2 passenger seats only */}
                <div className="grid grid-cols-5 gap-2">
                  {/* Driver seat (col 1) */}
                  <Seat
                    number={1}
                    status="taken"
                    driverSeat={driverSeat}
                    onClick={() => {}}
                  />
                  <div />

                  {/* Aisle */}
                  <div />

                  {/* Seats 2 and 3 */}
                  {[2, 3].map((seatNum) => {
                    const status: SeatStatus = bus.seatsTaken.includes(seatNum)
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

                {/* Remaining rows — normal 4-seat layout starting from seat 4 */}
                {Array.from({ length: rows - 1 }).map((_, rowIdx) => {
                  const cols: (number | "aisle")[] = [1, 2, "aisle", 3, 4];

                  return (
                    <div key={rowIdx} className="grid grid-cols-5 gap-2">
                      {cols.map((col, i) => {
                        if (col === "aisle") return <div key={i} />;

                        // offset by 3 (seats already used in row 1) and skip col indexing from 1
                        const seatNum = rowIdx * 4 + col + 3;
                        if (seatNum > bus.capacity) return <div key={i} />;

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
              <div className="flex flex-col items-start  gap-2">
                <div className="flex lg:flex-col flex-row gap-2 pt-10 lg:pt-6">
                  {legend.map((item, i) => (
                    <p
                      key={i}
                      className="flex items-center justify-normal gap-3"
                    >
                      <span
                        className={`size-6 block rounded-full  bg-[${item.color}]`}
                      />
                      <span className="font-semibold">{item.label}</span>
                    </p>
                  ))}
                </div>
                <div className="text-left pt-4">
                  <p className="font-medium text-lg">
                    Total Price: ₦
                    {calculateTotalPrice(
                      bus?.price,
                      bus?.hirePrice,
                      booking?.tripType,
                      booking?.passengers,
                      booking?.hireDuration, 
                    )}
                  </p>
                  {booking?.selectedSeats.length > 0 && (
                    <p className="">
                      Seat <span className="font-bold">{booking?.selectedSeats.join(",") || 0}</span> selected
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end items-end align-bottom">
              <button
                className="btn-primary w-auto disabled:cursor-not-allowed disabled:hover:bg-[#c84b11] mt-4 "
                disabled={booking?.selectedSeats.length < booking.passengers}
              >
                <Link to={"/personal-details"}>Continue</Link>
              </button>
            </div>
          </div>
          <img className="w-64 rounded-lg hidden lg:block" src={bus?.image} />
        </div>
      </div>
    </div>
  );
}
