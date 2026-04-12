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

```
src/
├── assets/
│   ├── hero.png
│   ├── react.svg
│   └── vite.svg
├── components/
│   ├── BusCard.tsx
│   ├── LocationInput.tsx
│   ├── Navbar.tsx
│   ├── NotFound.tsx
│   └── ProgressBar.tsx
├── data/
│   └── buses.json
├── hooks/
│   └── useAutocomplete.ts
├── pages/
│   ├── BookingSummary.tsx
│   ├── BusListPage.tsx
│   ├── ConfirmPage.tsx
│   ├── PassengerInfo.tsx
│   ├── SearchPage.tsx
│   └── SeatPage.tsx
├── store/
│   └── bookingStore.ts
├── types/
│   └── Seats.ts
├── utils/
│   └── helpers.ts
├── App.css
├── App.tsx
├── index.css
└── main.tsx
```
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
## Explanation of Approach

### State Management
Zustand was chosen over React Context for global state. It requires no Provider wrapper, 
components only re-render when their specific slice of state changes, and the store is 
simple to reason about and all booking state (trip type, selected bus, seats, passenger 
details) lives in one place and resets cleanly after a confirmed booking.

### Booking Flow
The app follows a strict linear flow enforced by React Router:

For One way and Round Trips:
```
Search --> Bus List --> Seat Selection --→ Passenger Info --→ Booking Summary --→ Confirmation
```
For Hire Purposes, it doesnt require seat selecxtion as the whole bus is needed by the client, so it goes straight to passenger details. 
```
Search --> Bus List --> Passenger Info --→ Booking Summary --→ Confirmation
```

Each step reads from and writes to the Zustand store, so data persists across pages 
without prop drilling or URL params.

### Data Layer
There is no backend. All bus data is served from a local `buses.json` file. This keeps 
the app self-contained and fast, while making it straightforward to swap in a real API 
later, only the data fetching layer would need to change, not the components or store.

### Seat Selection Logic
The seat map is rendered dynamically from each bus's `capacity` field. The first seat is 
always reserved as the driver's seat and cannot be selected. The first row renders only 
3 seats (driver + 2 passengers) with no partner seat beside the driver. Taken seats are 
sourced from `seatsTaken` in the JSON. Selected seats are tracked in the Zustand store 
and capped at the number of passengers chosen on the search screen.

### Payment
Paystack is integrated in test/sandbox mode. The public key is stored in an environment 
variable (`VITE_PAYSTACK_PUBLIC_KEY`) and never committed to the repository. On a 
successful payment callback, the booking reference from Paystack is saved to the store 
and the user is redirected to the confirmation screen.

### Pricing Logic
- **One Way** — base price × number of seats  
- **Round Trip** — base price × number of seats × 2  
- **Hire** — flat `hirePrice` from the bus data 

### TypeScript
Strict TypeScript is used throughout. All shared shapes (Bus, Passenger, BookingState, 
SeatStatus, etc.) are defined in the `types/` folder and imported wherever needed, 
keeping type definitions as a single source of truth and catching mismatches at compile 
time rather than runtime.

## Assumptions

- All available departure and destination locations are major cities in Nigeria.
- The person making the booking is an adult, that means no child/infant passenger types are handled.
- All buses in `buses.json` are shown for any searched route, there is no backend filtering by route or date. Filtering is hook-ready on the frontend.
- Seat availability is session-only and resets on page refresh and there is no backend persistence.
- One seat must be selected per passenger (e.g. 2 passengers = 2 seats).
- The first seat in every bus is the driver's seat and cannot be selected.
- For round trips, the return fare is calculated as double the one-way price.
- For bus hire, a separate flat `hirePrice` is used instead of the per-seat price.
- Payment runs in Paystack sandbox/test mode  which means no real charges are made.
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
