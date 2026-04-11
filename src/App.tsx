import { useEffect } from "react";
import SearchPage from "./pages/SearchPage";
import BusListPage from "./pages/BusListPage";
import SeatPage from "./pages/SeatPage";
import ConfirmPage from "./pages/ConfirmPage";
import Navbar from "./components/Navbar";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import PassengerInfo from "./pages/PassengerInfo";
import NotFoundPage from "./components/NotFound";
import BookingSummary from "./pages/BookingSummary";

function AppContent() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="search-results/buses" element={<BusListPage />} />
          <Route path="bus/:id/seats" element={<SeatPage />} />
          <Route path="personal-details" element={<PassengerInfo />} />
          <Route path="/booking-confirmation" element={<ConfirmPage />} />
          <Route path="booking-info" element={<BookingSummary />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
