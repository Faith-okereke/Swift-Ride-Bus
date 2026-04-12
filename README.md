# SwiftRide Bus Transport System

A responsive bus transportation booking web app built with **React + TypeScript + Tailwind CSS + Zustand**.

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 19 + Vite | UI framework & dev server |
| TypeScript | Static typing across the entire codebase |
| Tailwind CSS v4 | Utility-first styling |
| Zustand | Global state management |
| React Router v7 | Client-side routing |
| Iconify | Icon library |
| React Hot Toast | Toast notifications |
| Paystack | Payment processing (test mode) |

## Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/Faith-okereke/Swift-Ride-Bus.git
cd Swift-Ride-Bus

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env` file in the root of the project and add:
```env
VITE_PAYSTACK_PUBLIC_KEY=your_paystack_public_key_here
```
> Get your test public key from [dashboard.paystack.com](https://dashboard.paystack.com) under Settings → API Keys.

### 4. Start the development server
```bash
npm run dev
```
App runs at `http://localhost:5173`

### 5. Build for production
```bash
npm run build
```

---

## Project Structure
📦src
 ┣ 📂assets
 ┃ ┣ 📜hero.png
 ┃ ┣ 📜react.svg
 ┃ ┗ 📜vite.svg
 ┣ 📂components
 ┃ ┣ 📜BusCard.tsx
 ┃ ┣ 📜LocationInput.tsx
 ┃ ┣ 📜Navbar.tsx
 ┃ ┣ 📜NotFound.tsx
 ┃ ┗ 📜ProgressBar.tsx
 ┣ 📂data
 ┃ ┗ 📜buses.json
 ┣ 📂hooks
 ┃ ┗ 📜useAutocomplete.ts
 ┣ 📂pages
 ┃ ┣ 📜BookingSummary.tsx
 ┃ ┣ 📜BusListPage.tsx
 ┃ ┣ 📜ConfirmPage.tsx
 ┃ ┣ 📜PassengerInfo.tsx
 ┃ ┣ 📜SearchPage.tsx
 ┃ ┗ 📜SeatPage.tsx
 ┣ 📂store
 ┃ ┗ 📜bookingStore.ts
 ┣ 📂types
 ┃ ┗ 📜Seats.ts
 ┣ 📂utils
 ┃ ┗ 📜helpers.ts
 ┣ 📜App.css
 ┣ 📜App.tsx
 ┣ 📜index.css
 ┗ 📜main.tsx

## Routes

| Path | Page | Description |
|------|------|-------------|
| `/` | `SearchPage` | Trip search — type, route, date, passengers |
| `/search-results/buses` | `BusListPage` | Available buses for selected route |
| `/bus/:id/seats` | `SeatPage` | Visual seat map for selected bus |
| `/personal-details` | `PassengerInfo` | Passenger details form |
| `/booking-info` | `BookingSummary` | Full booking summary before payment |
| `/booking-confirmation` | `ConfirmPage` | Confirmation screen after successful payment |
| `*` | `NotFoundPage` | 404 fallback |

---

## Assumptions

- All available departure and destination locations are major cities in Nigeria.
- The person making the booking is an adult — no child/infant passenger types are handled.
- All buses in `buses.json` are shown for any searched route — there is no backend filtering by route or date. Filtering is hook-ready on the frontend.
- Seat availability is session-only and resets on page refresh — there is no backend persistence.
- One seat must be selected per passenger (e.g. 2 passengers = 2 seats).
- The first seat in every bus is the driver's seat and cannot be selected.
- For round trips, the return fare is calculated as double the one-way price.
- For bus hire, a separate flat `hirePrice` is used instead of the per-seat price.
- Payment runs in Paystack sandbox/test mode — no real charges are made.
- The app is optimized for use by a single adult booking on their own behalf.

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_PAYSTACK_PUBLIC_KEY` | Your Paystack public key (test or live) |

> For deployment on Vercel, add this variable under **Project → Settings → Environment Variables** instead of committing a `.env` file.

## Github Repository Link

[Github Link](https://github.com/Faith-okereke/Swift-Ride-Bus)

## Live Demo

[View on Vercel](https://swift-ride-bus.vercel.app)
