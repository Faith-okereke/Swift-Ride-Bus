import { Bus } from "lucide-react";
import { Link } from "react-router";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-[#FAFAF8] border-b border-[#E0DED7] px-6 h-20 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-[#C84B11] flex items-center justify-center">
          <Bus size={16} color="#fff" />
        </div>
        <Link
          to={"/"}
          className="text-[22px] text-[#0D0D0D] tracking-tight"
          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
        >
          Swift<span className="text-[#C84B11]">Ride</span>
        </Link>
      </div>
    </nav>
  );
}
