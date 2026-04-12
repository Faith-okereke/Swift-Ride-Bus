// store/bookingStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { today } from "../utils/helpers";

export interface BookingProps {
    id:string
    tripType: "one-way" | "round" | "hire";
    from: string;
    to: string;
    departDate: string;
    returnDate: string;
    passengers: number;
    selectedBus: any;
    selectedSeats: number[];
    hireDuration?: number;
    passenger: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
    };
    bookingRef: string;
}

const initialState: BookingProps = {
    id:"",
    tripType: "one-way",
    from: "",
    to: "",
    departDate: today(),
    returnDate: "",
    passengers: 1,
    selectedBus: null,
    selectedSeats: [],
    hireDuration: 1,
    passenger: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
    },
    bookingRef: "",
};

interface BookingStore {
    booking: BookingProps;
    update: (partial: Partial<BookingProps>) => void;
    reset: () => void;
}

export const useBookingStore = create<BookingStore>()(
    persist(
        (set) => ({
            booking: initialState,

            update: (partial) =>
                set((state) => ({
                    booking: { ...state.booking, ...partial },
                })),

            reset: () => set({ booking: initialState }),
        }),
        {
            name: "booking-storage",
        }
    )
);