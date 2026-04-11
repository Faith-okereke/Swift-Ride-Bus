import { useState, useRef } from "react";

type UseAutocompleteProps = {
  value: string;
  onChange: (value: string) => void;
  exclude?: string;
};

export const CITIES = [
  'Lagos', 'Abuja', 'Kano', 'Ibadan', 'Port Harcourt', 'Kaduna',
  'Benin City', 'Enugu', 'Owerri', 'Calabar', 'Uyo', 'Warri',
  'Jos', 'Ilorin', 'Abeokuta', 'Nnewi', 'Asaba', 'Onitsha',
  'Sokoto', 'Maiduguri', 'Akure', 'Bauchi', 'Lokoja', 'Makurdi',
];

export function useAutocomplete({ value, onChange }: UseAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState<string>(value || "");

  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const suggestions: string[] =
    query.trim().length > 0
      ? CITIES.filter((c: any) =>
        c.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 7)
      : [];

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onChange(val);
    setOpen(true);
  };

  const handleSelect = (city: string) => {
    setQuery(city);
    onChange(city);
    setOpen(false);
  };

  const handleBlur = () => {
    blurTimer.current = setTimeout(() => setOpen(false), 150);
  };

  const handleFocus = () => {
    if (blurTimer.current) clearTimeout(blurTimer.current);
    if (query.trim()) setOpen(true);
  };

  return {
    query,
    setQuery,
    open,
    suggestions,
    handleInput,
    handleSelect,
    handleBlur,
    handleFocus,
  };
}