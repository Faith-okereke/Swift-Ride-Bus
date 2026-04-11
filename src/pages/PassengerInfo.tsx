import { useState } from "react";
import ProgressBar from "../components/ProgressBar";
import { useBookingStore } from "../store/bookingStore";
import toast from "react-hot-toast";
import type { Bus } from "../types/Seats";
import { useNavigate } from "react-router";
import { Icon } from "@iconify/react";

type FieldProps = {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
  error?: string;
  maxLength?: number;
  className?: string;
};
type FormType = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

type ErrorType = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
};
const Field = ({
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  maxLength,
  className = "",
}: FieldProps) => (
  <div key={id} className={`flex flex-col gap-1 ${className}`}>
    <label className="text-[11px] font-semibold text-[#7A7A7A] uppercase tracking-[0.6px]">
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      maxLength={maxLength}
      className={`px-3 py-2.75 border-[1.5px] rounded-lg text-[14px] text-[#0D0D0D] bg-[#FAFAF8] w-full outline-none transition-colors 
          ${error ? "border-[#C84B11]" : "border-[#E0DED7] focus:border-[#0D0D0D]"}`}
    />
    {error && <p className="text-[11px] text-[#C84B11]">{error}</p>}
  </div>
);
const PassengerInfo = () => {
  const { booking, update } = useBookingStore();
  const navigate = useNavigate();
  const [errors, setErrors] = useState<ErrorType>({});
  const [form, setForm] = useState<FormType>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const setField = (key: keyof typeof form, val: string) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };
  const validate = () => {
    const e: ErrorType = {};

    if (!form?.firstName.trim()) e.firstName = "Required";
    if (!form?.lastName.trim()) e.lastName = "Required";
    if (!form?.email.trim() || !form.email.includes("@"))
      e.email = "Valid email required";
    if (!form.phone.trim()) e.phone = "Required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const initializePayment = () => {
    const public_key = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
    const bus = booking.selectedBus as Bus | null;
    try {
      // 2. Open Paystack Popup
      // @ts-ignore (Because PaystackPop is loaded via script tag
      const handler = PaystackPop.setup({
        key: public_key,
        email: form?.email,
        amount: bus?.price && bus?.price * booking.passengers * 100,
        ref: booking?.bookingRef,
        callback: function (response: any) {
          navigate("/booking-confirmation");
          toast.success("Payment successful:", response);
          update({
            passenger: {
              firstName: form?.firstName,
              lastName: form.lastName,
              email: form.email,
              phone: form.phone,
            },
          });
        },
        onClose: () => {
          toast.success("Transaction cancelled");
          // setInitiating(false);
        },
      });

      handler.openIframe();
    } catch (error) {
      console.error("Payment Error:", error);
      toast.error("Failed to initiate payment. Check connection.");
    }
  };
  return (
    <div className="">
      <ProgressBar currentStep={4} />
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className=" flex items-center gap-2 cursor-pointer hover:text-[#c84b11] p-5"
      >
        <Icon icon={"material-symbols:arrow-back-ios-rounded"} fontSize={20} />
        <span className="text-lg font-semibold">Back</span>
      </button>
      <div className="grid place-items-center p-6">
        <form
          className="bg-white shadow-lg w-full py-10 px-6 flex flex-col gap-6 items-center justify-center rounded-2xl"
          onSubmit={(e) => {
            e.preventDefault();
            if (validate()) {
              console.log("HELLO");
              initializePayment();
            }
          }}
        >
          <div className="text-center">
            <h1 className="text-2xl font-bold text-black uppercase  pb-3">
              Passenger Info
            </h1>
            <p>Enter your personal information or details of passenger</p>
          </div>

          <div className="flex justify-between items-center w-full gap-6 mb-3">
            <Field
              label="First Name"
              id="fn"
              placeholder="Faith"
              value={form.firstName}
              onChange={(v) => setField("firstName", v)}
              error={errors.firstName}
              className="w-full"
            />
            <Field
              label="Last Name"
              id="ln"
              placeholder="Okereke"
              value={form.lastName}
              onChange={(v) => setField("lastName", v)}
              error={errors.lastName}
              className="w-full"
            />
          </div>
          <div className="flex justify-between items-center w-full gap-6 mb-3">
            <Field
              label="Email"
              id="em"
              type="email"
              placeholder="you@email.com"
              value={form.email}
              onChange={(v) => setField("email", v)}
              error={errors.email}
              className="w-full"
            />
            <Field
              label="Phone"
              id="ph"
              type="tel"
              placeholder="08012345678"
              value={form.phone}
              onChange={(v) => setField("phone", v)}
              error={errors.phone}
              className="w-full"
            />
          </div>
          <button type="submit" className="btn-primary my-4 w-full">
            Proceed to Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default PassengerInfo;
