import { useState, useRef, useEffect } from "react";
import { CITIES } from "../hooks/useAutocomplete";
import { Icon } from "@iconify/react";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
};

export default function LocationInput({
  label,
  value,
  onChange,
  placeholder,
  error,
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = search.trim()
    ? CITIES.filter((c) => c.toLowerCase().includes(search.toLowerCase()))
    : CITIES;

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Auto-focus search when opened
  useEffect(() => {
    if (open) {
      setSearch("");
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [open]);

  const handleSelect = (city: string) => {
    onChange(city);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="flex flex-col gap-1.25 relative">
      <label className="text-[11px] font-semibold text-[#7A7A7A] uppercase tracking-[0.6px]">
        {label}
      </label>

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`relative w-full flex items-center gap-2 lg:pl-9 pl-2 pr-3 py-2.75 border-[1.5px] text-[14px] text-left transition-all cursor-pointer
          ${
            open
              ? "border-[#0D0D0D] border-b-transparent rounded-t-lg rounded-b-none bg-white"
              : error
                ? "border-[#C84B11] rounded-lg bg-[#FAFAF8]"
                : "border-[#E0DED7] rounded-lg bg-[#FAFAF8] hover:border-[#B8B8B8]"
          }`}
      >
        <Icon
          icon={"ph:map-pin-light"}
          fontSize={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7A7A] pointer-events-none shrink-0"
        />
        <span
          className={`flex-1 truncate ${value ? "text-[#0D0D0D]" : "text-[#B8B8B8]"}`}
        >
          {value || placeholder}
        </span>
        <Icon
          icon={"mdi:menu-down"}
          fontSize={14}
          className={`shrink-0 text-[#7A7A7A] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute top-full left-0 right-0 z-50 bg-white border-[1.5px] border-t-0 border-[#0D0D0D] rounded-b-lg shadow-[0_8px_24px_rgba(0,0,0,0.09)] overflow-hidden">
          {/* Search bar */}
          <div className="p-2 border-b border-[#E0DED7] sticky top-0 bg-white">
            <div className="relative">
              <Icon
                icon="md:search"
                fontSize={13}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#B8B8B8] pointer-events-none"
              />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search cities..."
                className="w-full pl-7 pr-3 py-1.75 border-[1.5px] border-[#E0DED7] rounded-md text-[13px] bg-[#FAFAF8] outline-none focus:border-[#C84B11] transition-colors placeholder:text-[#B8B8B8]"
              />
            </div>
          </div>

          {/* City list */}
          <div className="max-h-48 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-4 py-6 text-center text-[13px] text-[#B8B8B8]">
                No cities found
              </div>
            ) : (
              filtered.map((city) => {
                const isSelected = value === city;
                return (
                  <button
                    key={city}
                    type="button"
                    onMouseDown={() => handleSelect(city)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-left transition-colors cursor-pointer
                      ${
                        isSelected
                          ? "bg-[#FDF0EB] text-[#C84B11] font-medium"
                          : "text-[#0D0D0D] hover:bg-[#F2F1ED]"
                      }`}
                  >
                    {/* Dot indicator */}
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${isSelected ? "bg-[#C84B11]" : "bg-[#E0DED7]"}`}
                    />
                    <span className="flex-1">{city}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {error && <p className="text-[11px] text-[#C84B11]">{error}</p>}
    </div>
  );
}
