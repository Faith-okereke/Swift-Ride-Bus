import { Wind, Wifi, Clock, Users, ChevronRight } from "lucide-react";
export type BusProps = {
  id: string;
  image: string;
  name: string;
  shortName: string;
  capacity: number;
  price: number;
  departure: string;
  arrival: string;
  duration: string;
  seatsTaken: Number[];
  ac: boolean;
  wifi: boolean;
  terminal: string;
  tag: string;
  tagColor: "green" | "amber" | "blue" | "red";
  amenities: String[];
};
type props = {
  bus: BusProps;
  selected: boolean;
  onSelect: () => void;
};
const TAG_STYLES = {
  green: "bg-[#EAF4EE] text-[#2A7A4B]",
  amber: "bg-[#FFF7EB] text-[#92540A]",
  blue: "bg-[#EBF3FF] text-[#1D4F9B]",
  red: "bg-[#FEF0F0] text-[#9B1E1E]",
};

export default function BusCard({ bus, selected, onSelect }: props) {
  const availableSeats = bus.capacity - bus.seatsTaken.length;

  return (
    <div
      onClick={onSelect}
      className={`bg-white rounded-[14px] p-5 mb-3 cursor-pointer transition-all duration-200 
       shadow-lg hover:scale-95
        ${
          selected
            ? "border-[#C84B11] border-2 shadow-[0_6px_32px_rgba(200,75,17,0.12)]"
            : ""
        }
      `}
    >
      <div className="flex items-center gap-4">
        {/* Logo box */}
        <div className="size-16 flex items-center justify-center  ">
          <img
            src={bus.image}
            alt={bus.name}
            className="object-contain rounded-lg"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="text-[15px] font-semibold text-[#0D0D0D]">
              {bus.name}
            </h3>
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${TAG_STYLES[bus.tagColor]}`}
            >
              {bus.tag}
            </span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1 text-[12px] text-[#7A7A7A]">
              <Users size={12} /> {availableSeats} seats left
            </span>
            <span className="flex items-center gap-1 text-[12px] text-[#7A7A7A]">
              <Clock size={12} /> {bus.duration}
            </span>
            {bus.ac && (
              <span className="flex items-center gap-1 text-[12px] text-[#7A7A7A]">
                <Wind size={12} /> AC
              </span>
            )}
            {bus.wifi && (
              <span className="flex items-center gap-1 text-[12px] text-[#7A7A7A]">
                <Wifi size={12} /> WiFi
              </span>
            )}
          </div>
        </div>

        {/* Time — hidden on mobile */}
        <div className="text-center hidden md:block shrink-0">
          <div
            className="text-[18px] font-semibold text-[#0D0D0D]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {bus.departure}
          </div>
          <div className="text-[11px] text-[#7A7A7A]">Departs</div>
          <div className="text-[11px] text-[#B8B8B8] mt-0.5">
            {bus.arrival} arrives
          </div>
        </div>

        {/* Price */}
        <div className="text-right shrink-0">
          <div
            className="text-[22px] font-bold text-[#C84B11]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            ₦{bus.price.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#7A7A7A]">per seat</div>
        </div>

        <ChevronRight
          size={16}
          className="text-[#B8B8B8] hidden md:block shrink-0"
        />
      </div>
      <div className="flex justify-between items-center w-full pt-4 mt-4 border-t border-gray-300">
        {/* Terminal info */}
        <div className="flex items-center gap-2 text-[12px] text-[#7A7A7A]">
          <span>📍</span>
          <span>{bus.terminal}</span>
          <span className="ml-auto text-[#0D0D0D] font-medium md:hidden">
            {bus.departure}
          </span>
        </div>
        <button onClick={onSelect} className="btn-primary w-auto">
          View Seats
        </button>
      </div>
    </div>
  );
}
