/* ================= Booking SUMMARY ================= */

import { useNavigate } from "react-router";
import type { Bus } from "../types/booking";
import { calculateTotalPrice, formatDateShort } from "../utils/helpers";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import { useBookingStore } from "../store/bookingStore";

function BookingSummary() {
  const { booking } = useBookingStore();
  const navigate = useNavigate();
  const seatCount = booking.selectedSeats.length;
  const public_key = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
  const bus = booking.selectedBus as Bus | null;

  const initializePayment = () => {
    try {
      // 2. Open Paystack Popup
      // @ts-ignore (Because PaystackPop is loaded via script tag
      const handler = PaystackPop.setup({
        key: public_key,
        email: booking?.passenger?.email,
        amount:
          booking?.tripType === "hire"
            ? (bus?.hirePrice  ?? 0) * (booking?.hireDuration ?? 1) * 100
            : booking?.tripType === "round"
              ? (bus?.price ?? 0) * 2 * seatCount * 100
              : (bus?.price ?? 0) * seatCount * 100,
        ref: booking?.bookingRef,
        callback: function (response: any) {
          navigate("/booking-confirmation");
          toast.success("Payment successful:", response);
        },
        onClose: () => {
          toast.success("Transaction cancelled");
          // setInitiating(false);
        },
      });

      handler.openIframe();
    } catch (error) {
      toast.error("Failed to initiate payment. Check connection.");
      console.error("Payment Error:", error);
    }
  };
  return (
    <div className="bg-white shadow-md rounded-lg  sticky top-20 w-full">
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
          Booking Summary
        </h3>
      </div>

      <div className="flex flex-col py-2.5 gap-3">
        <div className="flex items-center justify-center">
          <img
            src={bus?.image}
            className="rounded-2xl w-64 object-contain mb-8"
          />
        </div>

        <div className="flex justify-between items-center w-full px-5 md:px-12">
          <p className="text-[#7A7A7A]">Bus Name</p>
          <p className="font-medium text-right">{bus?.name}</p>
        </div>

        <div className="flex justify-between items-center w-full px-5 md:px-12">
          <p className="text-[#7A7A7A]">Bus Capacity</p>
          <p className="font-medium">{bus?.capacity} seater</p>
        </div>

        {booking?.tripType !== "hire" && (
          <div className="flex justify-between items-center w-full px-5 md:px-12">
            <p className="text-[#7A7A7A]">Seats Booked</p>
            <p className="font-medium">
              {booking.selectedSeats.sort((a, b) => a - b).join(", ")}
            </p>
          </div>
        )}
        <p className="font-bold border-b border-b-gray-400 pb-2 px-5 md:px-12">
          Booking Details
        </p>
        <div className="px-5 md:px-12 flex flex-col gap-3">
          <div className="flex justify-between items-center w-full ">
            <p className="text-[#7A7A7A]">Pick up Location</p>
            <p className="font-medium ">{booking?.from}</p>
          </div>
          <div className="flex justify-between items-center w-full">
            <p className="text-[#7A7A7A]">Drop off Location</p>
            <p className="font-medium ">{booking?.to}</p>
          </div>
          <div className="flex justify-between items-center w-full">
            <p className="text-[#7A7A7A]">Departure Time</p>
            <p className="font-medium">{bus?.departure}</p>
          </div>
          <div className="flex justify-between items-center w-full">
            <p className="text-[#7A7A7A]">Pick up Date</p>
            <p className="font-medium">
              {formatDateShort(booking?.departDate)}
            </p>
          </div>
          {booking?.tripType === "round" && (
            <div className="flex justify-between items-center w-full">
              <p className="text-[#7A7A7A]">Return Date</p>
              <p className="font-medium">
                {formatDateShort(booking?.returnDate)}
              </p>
            </div>
          )}
        </div>

        {booking?.tripType === "hire" && (
          <div>
            <p className="font-bold border-b border-b-gray-400 pb-2 px-5 md:px-12">
              Hire Details
            </p>

            <div className="flex justify-between items-center w-full px-5 md:px-12 pt-3">
              <p className="text-[#7A7A7A]">Hire Duration</p>
              <p className="font-medium">
                {booking?.hireDuration}{" "}
                {booking?.hireDuration === 1 ? "day" : "days"}{" "}
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <p className="font-bold border-b border-b-gray-400 pb-2 px-5 md:px-12">
            {booking?.tripType !== "hire"
              ? "Passenger's Details"
              : "Hirer's Details"}
          </p>
          {!bus?.hire && (
            <div className="flex justify-between items-center w-full px-5 md:px-12">
              <p className="text-[#7A7A7A]">Passengers</p>
              <p className="font-medium">
                {`${booking.passengers} passenger${booking.passengers > 1 ? "s" : ""}`}
              </p>
            </div>
          )}
          <div className="flex justify-between items-center w-full px-5 md:px-12">
            <p className="text-[#7A7A7A]">
              {booking?.tripType === "hire" ? "Hirer's Name" : "Passenger Name"}
            </p>
            <p className="font-medium">
              {booking?.passenger?.firstName} {booking?.passenger?.lastName}
            </p>
          </div>
          <div className="flex justify-between items-center w-full px-5 md:px-12">
            <p className="text-[#7A7A7A]">Email Address</p>
            <p className="font-medium">{booking?.passenger?.email}</p>
          </div>
          <div className="flex justify-between items-center w-full px-5 md:px-12">
            <p className="text-[#7A7A7A]">Phone Number</p>
            <p className="font-medium">{booking?.passenger?.phone}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4 border-t border-t-gray-400 lg:px-12 px-5 my-4">
        <span className="font-semibold">Total</span>
        <span className="text-[24px] font-bold text-[#C84B11]">
          ₦
          {calculateTotalPrice(
            bus?.price,
            bus?.hirePrice,
            booking?.tripType,
            booking?.passengers,
            booking?.hireDuration,
          )}
        </span>
      </div>
      <div className="px-5 md:px-12 pb-10">
        <button
          onClick={initializePayment}
          className=" btn-secondary flex items-center justify-center my-3 lg:my-auto w-full disabled:bg-gray-400 disabled:cursor-not-allowed disabled:border-none  disabled:text-white"
        >
          <p className="flex justify-center items-center gap-1 font-semibold">
            <span>Make Payment</span>
            <Icon icon={"lineicons:arrow-right"} fontSize={20} />
          </p>
        </button>
      </div>
    </div>
  );
}
export default BookingSummary;
