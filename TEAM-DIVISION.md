# Team Division & Presentation Script (3 Members)

This file splits the **entire** project across 3 members — what each one built, how they built it,
what to say (and how to say it) when faculty ask, and exactly what to do when they ask for a **live change**.

> Run: `npm start` → customer site at **http://localhost:3000**, admin console at **http://localhost:3001**.

---

## 0. Who owns which file

| Folder / file | Member | Why |
|---|---|---|
| `models/data.js` | **Member 1** | All entities + seed data (Hotels, Rooms, Bookings, Inspections) |
| `server.js`, `admin.js` | **Member 2** | Two Express servers — customer (3000) + admin (3001) |
| `routes/hotels.js`, `routes/bookings.js`, `routes/admin.js` | **Member 2** | All REST API endpoints |
| `public/app.js` (the `fetch()` + DOM parts) | **Member 2** | API → DOM bridge |
| `public/index.html`, `public/style.css` | **Member 3** | Screens, styling, booking flow UX |
| `public/app.js` (rendering functions) | **Member 3** | Hotel/room/voucher/history rendering |
| `public-admin/` (admin.html, admin.css, admin.js) | **Member 3** (UI) + **Member 2** (API) | Admin console screens + the admin API it calls |

---

## 1. Member 1 — Database & Models

### What they built
The whole "database": `models/data.js`.
- **Hotel** model: `id, name, location, price, image, rating, amenities`
- **Room** model: `id, hotelId, roomNumber, roomType, price, status, bedImage, bathImage, balconyImage, hasBalcony, ambience`
- **Booking** model: `id, userId, hotelId, roomId, checkIn, checkOut, guests, totalAmount, status, feedback`
- **Inspection** model (admin): `inspections[hotelId] = { hygiene, service, feedbackScore, note, date, eligible }`
- Seed data: 4 hotels, 10 rooms (each with bedroom/bathroom/balcony photos + ambience tags)
- Auto-ID helpers: `getNextHotelId()`, `getNextRoomId()`, `getNextBookingId()`

### How they built it
Started from the 3 entities in the guide, then added room photos + ambience and the admin
inspection store. Kept it as plain JS arrays/objects so it's easy to point at and explain —
the guide says real MongoDB (Mongoose) schemas would be a drop-in replacement later.

### What to say (and how)
1. Open `models/data.js` and walk the three models top to bottom.
2. Point at the `hotelId` inside a Room, and the `hotelId`/`roomId` inside a Booking.
3. Say: *"Room links to Hotel by `hotelId` — one hotel, many rooms. Every booking references both a hotel and a room, so the three models are connected without duplicating data."*
4. Show a room's `bedImage`/`bathImage`/`balconyImage` and its `hasBalcony` flag → say: *"Each room carries its own photo set, so the UI can show the bedroom, bathroom and balcony when someone books."*
5. Show the inspection record → *"The admin's norms live here too — hygiene, service and feedback — so eligibility is a computed fact, not hardcoded in the UI."*

### Likely questions + replies
- **Why 3 models instead of one big object?** — *"Keeps data organised and avoids duplication; it mirrors real systems like MakeMyTrip, and it's exactly how MongoDB collections would be structured."*
- **How does a Room know its Hotel?** — *"By `hotelId` — a reference ID, like a foreign key."*
- **What happens to a Room's `status` when booking/cancelling?** — *"Booking sets it to `booked`; cancelling sets it back to `available` (see routes/bookings.js)."*
- **Where does the room image data live?** — *"Inside each room object in models/data.js — bedroom, bathroom and balcony URLs plus ambience tags."*

### Sudden live changes (show + explain)
| Asked to… | Do this | Show |
|---|---|---|
| Add a hotel | Append `{ id: "H5", name:"…", location:"…", price:…, image:"…", rating:…, amenities:[…] }` to the `hotels` array in `models/data.js`, restart `npm start` | The new hotel card appears on the customer site |
| Add a room with photos | Append a room object using the same shape (with `bedImage`, `bathImage`, `hasBalcony`, etc.) to `rooms`, matching the hotel's `hotelId` | Room appears under that hotel with its photo strip |
| Add an inspection record | Add `inspections.H1 = { hygiene:"pass", service:"pass", feedbackScore:4, date:…, eligible:true }` | Hotel shows "Quality-checked" badge on the customer site |
| Change a displayed room field | Edit the room object's field in `data.js`, then check the render function in `public/app.js` | Both update after refresh |

---

## 2. Member 2 — API + DOM Integration

### What they built
The entire backend and the fetch bridge:
- `server.js` — main Express app on port **3000** (+ starts the admin server)
- `admin.js` — second Express app on port **3001** (separate port for the admin console, no login)
- `routes/hotels.js` — `GET /api/hotels` (location/price/rating filters + sort + availability + eligible flag), `GET /:id`, `GET /:id/rooms`
- `routes/bookings.js` — `POST /api/bookings` (creates booking + marks room booked), `PUT /:id/cancel` (frees the room), `GET /:userId` (history joins hotel/room names), `POST /:id/feedback`
- `routes/admin.js` — `GET/POST/DELETE` hotels, `POST .../inspect`, `GET/POST/DELETE` rooms, `GET /bookings`
- The `fetch()` + DOM rendering logic in `public/app.js` (hotel list, rooms, booking, history, feedback)

### How they built it
Every API route = *read request → talk to the model → send JSON back*. The frontend uses
vanilla `fetch()` and DOM methods (`createElement`, `innerHTML`, event listeners) to turn that
JSON into cards. Highlight: one server process serves **both** ports with the *same* in-memory
database, which is why a hotel added on `:3001` instantly appears on `:3000`.

### What to say (and how)
1. Show `routes/bookings.js` POST handler: *"This is the flow when a user clicks Book — it validates dates, checks the room is free, calculates `nights × price`, pushes the booking and marks the room `booked`."*
2. Show the cancel handler: *"Cancelling flips the booking to `cancelled` and sets the room back to `available`."*
3. In the browser press **F12 → Network**, book a room, and point at the JSON response → *"This is the API response; that JSON became the voucher on screen — that's the API → DOM connection, done with fetch() and innerHTML."*
4. Show the admin flow: add a hotel on `:3001`, refresh `:3000` → *"Both run on different ports but share the same data in memory."*

### Likely questions + replies
- **Walk me through clicking "Book Room"?** — *"The form builds a JSON body → fetch POST → server validates `checkOut > checkIn` and room availability → computes total → saves booking + sets room booked → returns the booking with its ID → the UI renders the confirmation voucher."*
- **GET vs POST?** — *"GET asks for data (hotel lists, history); POST sends new data (create booking, feedback). Cancel uses PUT because it updates an existing booking."*
- **What does `fetch()` do? What breaks without `await`?** — *"fetch returns a Promise; await pauses until the response arrives. Without await the code runs before the data is back, so the page would render nothing / throw."*
- **How does the admin get its own port?** — *"`admin.js` creates a second Express app that listens on 3001 and mounts only `/api/admin`, while `server.js` listens on 3000 — both `require('./models/data')` in the same process, so they share the arrays."*

### Sudden live changes (show + explain)
| Asked to… | Do this | Show |
|---|---|---|
| Add a filter (e.g. by rating) | It exists already as `minRating` — otherwise copy the `if (minPrice)` block in `routes/hotels.js` and add the matching input in `public/index.html` + read it in `loadHotels()` in `public/app.js` | Filtering updates instantly |
| Add a booking endpoint | Copy the nearest route in `routes/bookings.js`, change the URL + logic | Test it in the Network tab |
| Make admin able to pause a hotel | Add a `paused` flag route in `routes/admin.js` (copy the inspect pattern) | Status shows on admin cards |

---

## 3. Member 3 — Features, UI & UX

### What they built
Every screen a user sees + the booking logic:
- `public/index.html` — hero search band, filters/sort, hotel list, hotel detail + rooms, booking page with room gallery, stay-voucher confirmation, booking history with star feedback
- `public/style.css` — the full design system (petrol/sand/coral palette, Fraunces + Plus Jakarta Sans, responsive, reduced-motion support)
- Rendering + interaction code in `public/app.js`, and the admin UI in `public-admin/`
- Booking form logic: live nights × rate calculation, date validation, gallery thumb-switcher

### How they built it
Consistent design tokens in CSS variables, then every view is a hidden `<section>` the app
shows/hides. Interactions are event listeners: the hero search feeds the filters, the booking
form recalculates the receipt panel as you type dates, and the room gallery swaps bedroom /
bathroom / balcony images with thumbnail clicks.

### What to say (and how)
1. Do the full journey live: **search → filter → open hotel → pick room → book → voucher → history → cancel**.
2. Stop at the booking page: *"Every room has its own photos — bedroom, bathroom, and the balcony when it has one — plus ambience tags. The total updates live as `nights × room price`."*
3. Stop at the voucher: *"Confirmation is a ticket-style stay voucher with the booking ID and the trip details."*
4. Open the admin console (`:3001`) as the finale: *"The admin adds/removes hotels and rooms, and runs inspections against 3 norms — hygiene, customer service and guest feedback. When all three pass, the hotel becomes 'eligible' and earns the Quality-checked badge on the customer site."*

### Likely questions + replies
- **How did you validate check-out after check-in?** — *"The form compares the dates and shows an inline error; the receipt only shows a total when `nights > 0`."*
- **How is the total calculated?** — *"`nights = checkOut - checkIn`; `total = nights × room.price`. Shown live on the receipt panel."*
- **Where do the eligibility & feedback show up?** — *"Guest feedback is collected as stars on each history entry, the admin sees the average, and eligible hotels get the green 'Quality-checked' badge on their cards."*
- **Why room photos on the booking card?** — *"So a guest knows exactly which bedroom, bathroom and balcony they're paying for — trust in the booking."*

### Sudden live changes (show + explain)
| Asked to… | Do this | Show |
|---|---|---|
| Change a screen's text | Edit the relevant template string in `public/index.html` (static) or a render function in `public/app.js` (dynamic) | Refresh shows it |
| Restyle colours | Change the CSS variables at the top of `public/style.css` | Every screen updates at once |
| Add a field to the voucher | Edit `renderVoucher()` in `public/app.js` (data must exist — add it in `models/data.js` and/or the booking POST response) | New line on the voucher |
| Add a room-type filter on the customer page | Copy the pattern of the rating filter (input in `index.html` → param in `app.js` → `if (roomType)` in `routes/hotels.js`) | Filter works immediately |

---

## 4. Running both apps (for the demo laptop)

1. `npm install` (only if `node_modules` is missing)
2. `npm start` — prints:
   - `Hotel Booking System running at http://localhost:3000` (customer)
   - `Admin console running at http://localhost:3001` (admin)
3. Demo order: customer journey on `:3000`, then admin on `:3001` showing add/inspect/remove.

**Known mini-project limits to mention if asked:** no real auth (admin is a demo console on its
own port), data resets on restart (in-memory arrays — MongoDB would persist it), payment is not
integrated, prices are stored per room/hotel in ₹.