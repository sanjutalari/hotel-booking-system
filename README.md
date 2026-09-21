# Hotel Booking System — Mini Project

> A full-stack hotel booking app built as a college mini project.
> Customers search hotels, browse real room photos, book, manage and rate their stays.
> Admins (on a separate port) add/remove hotels & rooms and inspect them against quality norms.

This README explains **everything** about the project: what it does, the tech, the architecture,
every file, every data model, every API endpoint, every screen, how the admin norms work, how to
run & test it, its known limits, and what to say live if an evaluator asks for a change.

---

## 1. What the project does

Two applications run side by side:

**Customer site — `http://localhost:3000`** — what a hotel guest uses:

```
Search (location · dates · guests)
   → filter + sort hotels (price / rating / location / min rating)
      → open a hotel → see its rooms with PHOTOS (bedroom · bathroom · balcony) + ambience
         → book a room → live total (nights × price)
            → confirmation shown as a boarding-pass style STAY VOUCHER
               → booking history → cancel anytime · rate your stay (1–5 stars)
```

**Admin console — `http://localhost:3001`** — what the hotel company uses (no login, by requirement):

```
Add / remove hotels  →  add / remove rooms (and edit room photos any time)
   → run an inspection: hygiene ✓ · customer service ✓ · guest feedback (1–5 ✓)
      → all 3 norms pass ⇒ the hotel becomes "eligible"
         → guests see the green "Quality-checked" badge on the customer cards
```

---

## 2. Tech stack & why

| Layer | Technology | Why |
|---|---|---|
| Frontend | HTML, CSS, Vanilla JS (DOM + `fetch`) | Keeps the project "mini" and easy to explain — no React |
| Backend | Node.js + Express | Simple REST API + static file serving |
| Data | In-memory JS arrays (`models/data.js`) | Real data to demo, instantly editable live, mirrors MongoDB collections |
| CORS | `cors` package | Lets the two ports call each other's data in the browser |
| Ports | Two Express apps in **one Node process** | Customer on 3000, admin on 3001 — same in-memory data |

**Why the data is in JS arrays and not MongoDB:** the PRD asks for a working, explainable demo.
The object shapes are written as they would be in a Mongoose schema, so swapping the array for
MongoDB later is a drop-in change (each array becomes a collection).

### 2.1 Node.js & Express — the two backend technologies, explained clearly

These two are a pair and are easy to mix up. The one-line difference:

> **Node.js is the runtime** (a JavaScript engine that runs on a server).
> **Express is a framework** (a toolkit that runs *on top of* Node to build web servers quickly).

#### Node.js — the runtime

| Point | Explanation (say this out loud) |
|---|---|
| What it is | A JavaScript engine you can run *outside the browser* — on any server or computer |
| What it changes | Before Node, JavaScript could only run inside a browser. Node makes the **same language** usable for the backend, so the whole project is one language: JS |
| How it runs | Single process, single thread, **event-driven** — instead of one thread per visitor, it reacts to events (a request arrives, a file finishes reading) and moves on. Great for I/O-heavy apps like a booking API |
| Module system | `require("./models/data")` loads another file into the process; `module.exports` sends things back out. Every `.js` file here is a module |
| In this project | `node server.js` boots everything — `server.js`, `admin.js`, `models/data.js`, `routes/*.js` all load through `require()`. `npm` (which ships with Node) installed `express` and `cors` from `package.json` |

#### Express — the framework

| Point | Explanation (say this out loud) |
|---|---|
| What it is | A minimal web framework built on top of Node |
| What it solves | Raw Node *can* serve HTTP (`http.createServer`), but you'd write `if (req.url === "…")` by hand. Express hands you routers, middleware, static files and JSON helpers |
| Job 1 — Routes | `app.use("/api/hotels", hotelRoutes)` + `router.get("/:id", handler)` maps a URL+method to a function |
| Job 2 — Middleware | `express.json()` (parse request bodies), `cors()`, `express.static()` (serve the HTML/CSS/JS folders) |
| Job 3 — Responses | `res.json(data)` sends JSON with the right headers; `res.status(201).json(data)` adds the status code |

**The same endpoint: raw Node vs Express** (a great comparison to show faculty):

```js
// RAW Node — low level, everything by hand
const http = require("http");
const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/api/hotels") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(db.hotels));
  }
});
server.listen(3000);
```

```js
// EXPRESS — same job, less code, knows JSON/params/query
const express = require("express");
const app = express();
app.get("/api/hotels", (req, res) => res.json(db.hotels));
app.listen(3000);
```

**The analogy to quote:** *"Node.js is the engine, Express is the toolkit that makes writing
servers fast — routing, JSON parsing and static files are all pre-built so we only write
business logic."* This project's whole API runs on the Express methods shown in section 10
(`app.use(…)` to mount, `router.get/post/put/delete(…)` to handle).

### 2.2 Network ports & the local server

**The one-line idea:** a **port** is a numbered "door" on a computer, and the **local server** is
your own machine acting as a server. `localhost:3000` means *"talk to this computer, through
door 3000."*

#### What a port is
A computer has one address (its **IP**), like a building's street address. But many programs run
on one computer, so each one listens on a **numbered door** — the port (0–65535). When a browser
connects, the URL tells it *which* building (`localhost`) and *which door* (`:3000`).

```
        ┌──────────────────────── localhost = 127.0.0.1 (your own computer) ──┐
        │                                                                       │
 Browser ──► http://localhost:3000  → door 3000  → customer Express app  (server.js)
        │                                                                       │
 Browser ──► http://localhost:3001  → door 3001  → admin Express app     (admin.js)  ┘
        └───────────────────────────────────────────────────────────────────────┘
                                   (one Node process, shared data)
```

#### How Express "listens" on a port
The server tells Node which door to open with `app.listen(PORT, …)` — the exact lines that run
this whole project:

```js
// server.js:10-24 — customer app
const PORT = process.env.PORT || 3000;            // default door = 3000
app.listen(PORT, () => {
  console.log(`Hotel Booking System running at http://localhost:${PORT}`);
});
```
```js
// admin.js:12,30 — admin app, a second door in the SAME process
const PORT_ADMIN = process.env.PORT_ADMIN || 3001; // default admin door = 3001
const server = app.listen(PORT_ADMIN, () => { … });
```

`|| 3000` is the **default value handling**: if the environment variable `PORT` is not set, it
falls back to 3000. Two Express apps in one process (section 2 line in the stack table) → two
doors → the browser URL decides which door to knock on. Both doors lead to the same in-memory
data (`models/data.js`), which is why an admin change on port 3001 appears instantly on port 3000.

#### Port facts worth quoting in the demo
- **`localhost` = 127.0.0.1** — the loopback address, i.e. "this computer itself." No internet
  involved; browser and server talk over the machine's own network stack.
- **Default web ports** — browsers assume port 80 for `http://` and 443 for `https://` when you
  don't type one. We use 3000/3001 so nothing tries to run as the system's default webserver.
- **Why each app needs a different port** — two programs cannot listen on the same door at the
  same time. Port 3000 customer + 3001 admin keeps them separate but co-located.
- **"Port already in use" (`EADDRINUSE`)** — means a previous `node` process is still holding the
  door. Fix: stop the old process (Task Manager → kill `node.exe`, or a terminal `taskkill
  /F /IM node.exe`) and start again. We hit exactly this while testing and it produced
  `Cannot PUT /api/admin/rooms/…` from a stale server — restarting the process fixed it.
- **Change the ports anytime** — `$env:PORT=4000; $env:PORT_ADMIN=4001; node server.js` and the
  app moves to the new doors without touching any code.

**URL recap with the port in place:**
```
http://localhost:3000/api/hotels/H1/rooms
 └─scheme─┘└──host(=this PC)──┘└port┘ └────────path────────┘
```
The **path** (section 10.5) selects *which* resource; the **port** selects *which app* on the
machine. That is the whole idea of a local multi-port server.

---

## 3. Architecture — how the two ports share data

```
                ┌────────────────── one Node process ──────────────────┐
                │                                                       │
 http:3000  ──► │  server.js (Express)        admin.js (Express)   ◄── http:3001
                │   ├── static → public/         ├── static → public-admin/
                │   ├── /api/hotels ...          ├── "/" → admin.html
                │   └── /api/bookings ...        └── /api/admin ...
                │              │                        │
                └──────────────┴─── require ────────────┘
                                     │
                            models/data.js
                     (the single source of truth, in memory)
```

`require("./models/data")` uses Node's module cache. Both Express apps get the **same** array
objects, so a hotel added on port 3001 is immediately visible on port 3000 — with no database,
no sync and no restart. This is a great demo point for faculty.

---

## 4. Client–Server architecture, the REST API & the DOM (faculty Q&A)

These three concepts appear in every list of likely questions. Each is explained here **and pinned
to exactly where it lives in this project.**

### 4.1 Client–Server architecture

```
 Browser (the CLIENT)                     Node process (the SERVER)          DATA
 ---------------------------------------------------------------------------------
  public/ HTML+CSS+JS                    server.js / admin.js (Express)   models/data.js
    |                                          |
    |-- 1. user clicks / types      ---->      |
    |-- 2. fetch("GET /api/hotels")  ---->     |-- 3. reads arrays, filters, joins ---->
    |                                          |-- 4. answers with JSON        <-----
    |<-- 5. JSON arrives, JS renders ----      |
```

**Simple definition:** the **client** (the browser tab running our HTML/CSS/JS) owns everything the
user sees and interacts with. The **server** (Express) owns the data and the business rules. They
talk to each other only over HTTP.

**This project's concrete split:**
- Client owns: search bar, filter/sort, hotel & room cards, gallery, booking form, voucher,
  history, feedback stars — everything visual, in `public/` and `public-admin/`.
- Server owns: the data (`models/data.js`) and every *rule* — input validation, night-count,
  price calculation, the double-booking guard, flipping room availability, the eligibility
  formula, cascading deletes.

**Why it matters (good demo point):** the client never reads arrays directly and never trusts the
user. It only *asks* the server and renders whatever JSON comes back. Open the customer page with
the server stopped and nothing loads — that proves the contract: no API, no app.

The admin console is a second client (`public-admin/`) talking to a second server (port 3001) —
but both Express apps run in **one Node process** and share the same data (section 3).

### 4.2 REST API

**Definition:** REST (Representational State Transfer) is a *style* for building APIs where the
URL names a **resource** (a noun) and the HTTP **method** says what to do with it (a verb).
"A REST API is the set of URLs a client may call."

| HTTP verb | Meaning | Project example |
|---|---|---|
| GET | read / fetch (no side effects) | `GET /api/hotels?location=Guntur` |
| POST | create something new | `POST /api/bookings` |
| PUT | update something existing | `PUT /api/bookings/B1/cancel` |
| DELETE | remove something | `DELETE /api/admin/hotels/H5` |

**Request → response cycle (trace it in `public/app.js`):**
1. Client sends a request: **method + URL + headers + optional JSON body**.
2. Express matches the URL in a route file (`routes/*.js`) and runs the handler.
3. The handler does its work against `models/data.js`.
4. The server replies with a **status code + JSON body**.
5. `fetch()` resolves, and the JS renders the JSON into the DOM.

**Status codes we actually send — say these during the demo:**
- `200` OK (successful `GET`s) · `201` Created (`POST` booking / room / hotel) ·
  `400` validation or conflict (bad dates, room already booked, delete blocked) ·
  `404` resource not found.

**Why it qualifies as RESTful (the four rules to mention):**
1. **Stateless** — every request is self-contained; the server doesn't remember you. That is why
   each history call carries the user id in the URL itself: `GET /api/bookings/sanju01`.
2. **Uniform interface** — the same four verbs are reused on every resource, and one
   business action = one call (cancelling flips the booking *and* frees the room in a single
   `PUT`).
3. **Resource-based URLs** — nested ones express relationships: `hotels/H1/rooms` reads as "the
   rooms of hotel H1"; `bookings/B1/cancel` as "cancel this booking".
4. **JSON in, JSON out** — `express.json()` in `server.js` parses request bodies; `res.json()`
   sends replies. Everything between client and server is `application/json`.

### 4.3 DOM (Document Object Model)

**Definition:** when a browser loads `index.html`, it builds an **in-memory tree of the page** —
every tag becomes a node. That tree is the DOM. Critically, the DOM is *not* the HTML file: it is
the live structure the browser keeps, which JavaScript can read and mutate **after load, with no
page reload**.

**This project is built entirely on DOM manipulation** (`public/app.js` uses all four operations):

| DOM operation | Code you can point at |
|---|---|
| Find a node | `document.querySelector("#hotelList")` |
| Build nodes from JSON | `hotelListEl.innerHTML = cardsHtml` or `document.createElement("div")` |
| Add behavior | `starEl.addEventListener("click", rateStay)` |
| Put it on screen | `container.appendChild(cardEl)` |

**Full trace for one screen (the demo favourite):**
1. `loadHotels()` → `fetch("/api/hotels")` gets the JSON (the round trip in 4.2).
2. `renderHotelList()` maps each hotel object to a card string and sets the container's
   `innerHTML`.
3. Because the container is already in the DOM tree, the cards **appear instantly on screen**.
4. Clicking a card runs `openHotel(id)` → a new `fetch` → a new client–server round trip → the
   detail view re-renders the same way.

**Two easy answers for an evaluator:**
- `innerHTML` keeps rendering simple (build a template string from data); `createElement` is
  safer for dynamic nodes (used for the star-rating buttons). We use both deliberately.
- Re-rendering = empty the container (`container.innerHTML = ""`) and rebuild — that is why every
  list on the site refreshes after each action.

**One-line summary to keep handy:** in this project the three web layers meet exactly where you'd
expect — **HTML is the content, CSS is the look, and JavaScript + the DOM is the behaviour.**

---

## 5. Folder & file reference

| Path | What it does |
|---|---|
| `server.js` | Customer Express app (3000). Starts admin server at the bottom. |
| `admin.js` | Admin Express app (3001). Serves `public-admin/`; `/` returns `admin.html`. |
| `models/data.js` | All models + seed data + auto-ID helpers. The "database". |
| `routes/hotels.js` | Customer hotel endpoints (list/filter/sort, details, rooms). |
| `routes/bookings.js` | Customer booking endpoints (create, cancel, history, feedback). |
| `routes/admin.js` | Admin endpoints (hotels, rooms, inspections, all bookings). |
| `public/index.html` | Customer screens (all views live in this one page). |
| `public/style.css` | Customer design system (tokens, fonts, responsive, motion). |
| `public/app.js` | Customer logic: `fetch()` → DOM rendering, booking calc, gallery, history. |
| `public-admin/admin.html` | Admin screens (hotels + inspections tab, bookings tab). |
| `public-admin/admin.css` | Admin styling (same palette, drier layout). |
| `public-admin/admin.js` | Admin logic: add/remove hotels, rooms + photos, inspections, bookings. |
| `TEAM-DIVISION.md` | Per-member role, demo script, Q&A prep, live-change walkthroughs. |

Common frontend pattern (vanilla, no libraries): a hidden-view system.
Each `<section class="view">` is one screen; `app.js` toggles `.active`; data arrives via
`fetch()` and becomes DOM elements through `document.createElement` + `innerHTML`.

---

## 6. Data models (in detail)

All defined in `models/data.js`. No real DB — just arrays of plain objects.

### Hotel
```js
{ id, name, location, price, image, rating, amenities[] }
```
`rating` 0–5, `price` is per night in ₹, `image` is a URL used on cards/detail.

### Room
```js
{ id, hotelId, roomNumber, roomType, price, status,
  bedImage, bathImage, balconyImage, hasBalcony, ambience[] }
```
- `hotelId` links the room to its hotel (one hotel → many rooms).
- `status` is `"available"` or `"booked"` — flips on booking/cancel.
- Each room carries its own **photo set**: `bedImage` (bedroom), `bathImage` (bathroom) and,
  when `hasBalcony` is true, a `balconyImage`. `ambience` is a list of vibe tags
  (e.g. "Sea breeze balcony", "Rain shower") shown on cards and the booking gallery.

### Booking
```js
{ id, userId, hotelId, roomId, checkIn, checkOut, guests, totalAmount, status, feedback? }
```
- References **both** a hotel and a room — the core "multiple related resources" concept.
- `status` is `"confirmed"` or `"cancelled"`.
- `totalAmount` is computed by the server: `nights × room.price`.
- `feedback` is optional (1–5) set by the guest after the stay.

### Inspection (admin)
```js
inspections[hotelId] = { hygiene: "pass"|"fail", service: "pass"|"fail",
                         feedbackScore: 1–5, note, date, eligible: true|false }
```
Stored in a plain object keyed by hotel id — like a small collection.

### Relationships
```
Hotel (1) ──<has── (many) Room (1) ──<is booked by── (many) Booking
```
A Room knows its Hotel via `hotelId`; a Booking points at a Hotel and a Room via both ids.
No duplicated data anywhere — exactly how real systems structure it.

### Seed data
4 hotels (Vijayawada, Guntur, Visakhapatnam, Mangalagiri), 10 rooms with real photo URLs,
plus empty `bookings` and `inspections` that fill up as you use the app.

---

## 7. The admin "norms & eligibility" rule

This is the site's quality gate. Every hotel must satisfy 3 norms:

1. **Hygiene & cleanliness** — `hygiene: "pass"`
2. **Customer service support** — `service: "pass"`
3. **Customer feedback** — average guest rating 3.5+ (`feedbackScore ≥ 3.5`; the admin enters
   a 1–5 score per inspection)

```js
eligible = (hygiene === "pass") && (service === "pass") && (feedbackScore >= 3.5)
```

- The admin saves an inspection via `POST /api/admin/hotels/:id/inspect`; the server computes
  `eligible` automatically.
- Guests reinforce norm 3 by rating stays in booking history (`POST /api/bookings/:id/feedback`);
  the admin's hotel list shows the live mean of those ratings alongside the admin-entered score.
- When `eligible` is true, the **customer** API returns `eligible: true` per hotel and the
  frontend shows the green **"✓ Quality-checked"** badge on hotel cards and the detail page.

---

## 8. Customer API — port 3000

Base URL `http://localhost:3000/api`. Every response is JSON.

### GET /hotels — search + filter + sort
Query params (all optional): `location`, `minPrice`, `maxPrice`, `minRating`, `roomType`, `sort` (`price-asc` | `price-desc` | `rating-desc`).
```bash
GET /api/hotels?location=Guntur&minPrice=1000&maxPrice=3000&sort=price-asc
```
Each hotel is **enriched** server-side with:
```js
{ ...hotel, totalRooms: 3, availableRooms: 2, eligible: true }
```
(`availableRooms` comes from counting `rooms` where `status === "available"`.)

### GET /hotels/:id
Returns the raw hotel object, or `404 { error: "Hotel not found" }`.

### GET /hotels/:id/rooms
Returns that hotel's rooms (with photos + ambience). Example:
```json
{ "id": "R302", "hotelId": "H3", "roomNumber": "302", "roomType": "Deluxe", "price": 5000,
  "status": "available", "bedImage": "…", "bathImage": "…", "balconyImage": "…",
  "hasBalcony": true, "ambience": ["Sea breeze balcony", "Champagne bar", "Premium linen"] }
```

### POST /bookings — create a booking
Body:
```json
{ "userId": "sanju01", "hotelId": "H1", "roomId": "R101",
  "checkIn": "2026-09-25", "checkOut": "2026-09-28", "guests": 2 }
```
What the server does, in order (great thing to explain to faculty):
1. Validates all required fields exist.
2. Computes nights; rejects with `400` if `checkOut <= checkIn`.
3. Finds the room by `roomId` + `hotelId`; `404` if missing, `400` if already `booked`
   (prevents double-booking).
4. `totalAmount = nights × room.price`.
5. Saves the booking with `status: "confirmed"` and sets `room.status = "booked"`.
6. Returns `201` with the full booking (including its auto-ID like `B1`).

### PUT /bookings/:id/cancel
Flips the booking to `"cancelled"` and sets the room back to `"available"` — both updates in
one request. Returns the booking.

### GET /bookings/:userId — history
Returns that user's bookings, **joined** with hotel/room names by the server:
```json
{ ..., "hotelName": "Sunrise Grand", "hotelLocation": "Vijayawada", "roomNumber": "101", "roomType": "Deluxe" }
```
The frontend just renders the names — no extra calls needed.

### POST /bookings/:id/feedback — rate a stay
Body `{ "score": 5 }` (1–5). Stores `booking.feedback`. Feeds the admin's feedback norm.

---

## 9. Admin API — port 3001

Base URL `http://localhost:3001/api/admin`. No authentication (demo requirement).

| Method | Endpoint | What it does |
|---|---|---|
| GET | `/hotels` | Hotels + room counts + inspection status + live feedback average |
| POST | `/hotels` | Add hotel — body: `{ name, location, price, image, rating, amenities[] }`, auto-ID `H5`, `H6`… |
| DELETE | `/hotels/:id` | Remove hotel (cascades: its rooms + bookings also removed) |
| POST | `/hotels/:id/inspect` | Save inspection — body: `{ hygiene, service, feedbackScore, note }`, returns `eligible` |
| GET | `/hotels/:id/rooms` | List a hotel's rooms |
| POST | `/hotels/:id/rooms` | Add room — body: `{ roomNumber, roomType, price, hasBalcony, bedImage?, bathImage?, balconyImage?, ambience? }` (default photos applied if omitted) |
| PUT | `/rooms/:roomId` | Update a room — **including setting/editing bedroom, bathroom, balcony photos** and toggling `hasBalcony` |
| DELETE | `/rooms/:roomId` | Remove a room — **blocked with 400 if it has an active confirmed booking** |
| GET | `/bookings` | Every booking (newest first), joined + feedback stars data |

Example inspection body + result:
```json
POST { "hygiene": "pass", "service": "pass", "feedbackScore": 4, "note": "linen + team checked" }
→   { "hotelId": "H5", "hygiene": "pass", "service": "pass", "feedbackScore": 4, "eligible": true }
```

---

## 10. How an API call happens & how routing works — real code

This section walks the connection between the two sides with **actual code from this project**:
first the client code that "calls" the API, then the Express code that "routes" it, then one
end-to-end trace. All line numbers refer to files in this repo.

### 10.1 The whole trip in four lines
```
1  user clicks "Confirm booking"          ->  public/app.js (event handler)
2  fetch("POST /api/bookings", body)      ->  api() helper -> browser sends HTTP request
3  Express finds the matching route       ->  routes/bookings.js (router.post("/"))
4  handler validates + computes + saves   ->  res.status(201).json(booking) -> back to step 2's await
```

### 10.2 Client side — the code that calls the API

Every call goes through one wrapper (`public/app.js:30-35`):
```js
async function api(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, options);              // 1 send the request
  const data = await res.json().catch(() => ({}));                     // 2 read the JSON body
  if (!res.ok) throw new Error(data.error || "Something went wrong");   // 3 4xx/5xx -> throw
  return data;                                                         // 4 parsed data
}
```

**GET** — filters ride in the *query string* (`public/app.js:162-176`):
```js
const params = new URLSearchParams();                  // builds ?location=..&minPrice=..&sort=..
if (location) params.append("location", location);
if (sort && sort !== "recommended") params.append("sort", sort);
const hotels = await api(`/hotels?${params.toString()}`);
```

**POST** — new data rides in the *request body* as JSON (`public/app.js:431-442`):
```js
const booking = await api("/bookings", {
  method: "POST",
  headers: { "Content-Type": "application/json" },   // tells Express how to parse the body
  body: JSON.stringify({
    userId, hotelId: currentHotel.id, roomId: currentRoom.id,
    checkIn, checkOut, guests,
  }),
});
```

**PUT / DELETE** — sometimes no body at all (`public/app.js:81`, `public-admin/admin.js:136`):
```js
await api(`/bookings/${id}/cancel`, { method: "PUT" });   // cancel a booking
await api(`/hotels/${hotel.id}`,    { method: "DELETE" }); // admin removes a hotel
```

Syntax note: `options` is the native `fetch()` options object `{ method, headers, body }`.
Forget `method` and it defaults to **GET** ("read"). Forget `Content-Type` with a body and the
server's `express.json()` cannot parse it — one of the most common student bugs.

### 10.3 Server side — how routing happens

Express routing = a **map from URL patterns to handler functions**. Instead of `if (url === "…")`,
routes are declared declaratively.

**Wiring the app** (`server.js:12-21`) — middleware then routers:
```js
app.use(cors());                                       // middleware 1: allow cross-port calls
app.use(express.json());                               // middleware 2: parse JSON body -> req.body
app.use(express.static(path.join(__dirname, "public"))); // middleware 3: serve the HTML/CSS/JS
app.use("/api/hotels",  hotelRoutes);                  // URLs starting /api/hotels  -> that router
app.use("/api/bookings", bookingRoutes);               // URLs starting /api/bookings -> that router
```

**Declaring the routes** (`routes/hotels.js`, `routes/bookings.js`, `routes/admin.js`):
```js
router.get("/",             handler);   // GET  /api/hotels
router.get("/:id",          handler);   // GET  /api/hotels/H1
router.get("/:id/rooms",    handler);   // GET  /api/hotels/H1/rooms
router.post("/",            handler);   // POST /api/bookings
router.put("/:id/cancel",   handler);   // PUT  /api/bookings/B1/cancel
router.post("/:id/feedback", handler);  // POST /api/bookings/B1/feedback
```

Route syntax to quote:
- `":id"` is a **route parameter** — any single path segment matches, and Express stores it in
  `req.params.id` (e.g. `"H1"`, `"B1"`).
- Matching is **behaviour-based, not index-based** — `app.use("/api/hotels", …)` strips the prefix,
  then the router matches the rest, so `/api/hotels/H1/rooms` lands on `router.get("/:id/rooms")`.
- **Query strings never affect matching** — `?location=Guntur` still hits the same route and ends
  up in `req.query`.

Every handler is a function `(req, res) => { … }` with three inputs and one output:
- `req.params` — segment values, e.g. `{ id: "H1" }`
- `req.query` — query string values, e.g. `{ location: "Guntur", sort: "price-asc" }`
- `req.body` — parsed JSON (filled by the `express.json()` middleware)
- output — `res.status(code).json(data)` or shorthand `res.json(data)`

**Real handler with its logic annotated** — `POST /api/bookings` (`routes/bookings.js:13-49`):
```js
router.post("/", (req, res) => {
  // 1 READ  — pull the JSON body apart
  const { userId, hotelId, roomId, checkIn, checkOut, guests } = req.body;

  // 2 VALIDATE — every required field
  if (!userId || !hotelId || !roomId || !checkIn || !checkOut || !guests)
    return res.status(400).json({ error: "Missing required booking fields" });

  const nights = nightsBetween(checkIn, checkOut);
  if (nights <= 0)
    return res.status(400).json({ error: "Check-out date must be after check-in date" });

  // 3 GUARD — room must exist and be free (double-booking protection)
  const room = db.rooms.find(r => r.id === roomId && r.hotelId === hotelId);
  if (!room) return res.status(404).json({ error: "Room not found" });
  if (room.status !== "available")
    return res.status(400).json({ error: "Room is already booked" });

  // 4 COMPUTE — the business rule (nights x rate)
  const totalAmount = nights * room.price;

  // 5 SAVE — create the record and flip the room status
  const booking = { id: db.getNextBookingId(), userId, hotelId, roomId,
                    checkIn, checkOut, guests, totalAmount, status: "confirmed" };
  db.bookings.push(booking);
  room.status = "booked";

  // 6 REPLY — 201 Created + the new booking as JSON
  res.status(201).json(booking);
});
```

### 10.4 End-to-end trace: "Confirm booking"

| # | side | where | what happens |
|---|---|---|---|
| 1 | client | `app.js` click handler | read the form, guard empty fields |
| 2 | client | `api()` wrapper | `fetch("POST /api/bookings")` with JSON body |
| 3 | network | browser | request line `POST /api/bookings HTTP/1.1`, header `Content-Type: application/json`, JSON body |
| 4 | server | `server.js` | `express.json()` parses the body into `req.body` |
| 5 | server | `routes/bookings.js` | `router.post("/")` matches the URL+method → handler runs |
| 6 | server | handler | validate → nights → room lookup + availability → `totalAmount` → push booking + `room.status = "booked"` |
| 7 | server | handler | `res.status(201).json(booking)` → HTTP response with status 201 + JSON body |
| 8 | client | `api()` wrapper | `res.ok` is true → returns `booking` |
| 9 | client | `app.js` | `renderVoucher(booking)` renders the stay voucher into the DOM |

### 10.5 URL anatomy cheat-sheet (a classic faculty question)
```
http://localhost:3000/api/hotels/H1/rooms?sort=price-asc
└──scheme──┘ └────host──┘ └─port┘└base┘ └prefix┘└:id┘└─path─┘└───query string───┘
```
- `scheme` `http` · `host` `localhost` · `port` `3000` (customer) / `3001` (admin) ·
  `path` `/api/hotels/H1/rooms`
- segment `H1` → `req.params.id`; `?sort=price-asc` → `req.query.sort`

Both frontends use the exact same `api()` pattern but with different bases: the customer page uses
`/api` (port 3000) while the admin page uses `/api/admin` (port 3001, `public-admin/admin.js:25-30`)
— same fetch helper shape, different base constant, which is how one project exposes two clients.

---

## 11. Customer frontend — every view explained

All views live in `public/index.html`; logic in `public/app.js`.

| View | Element | What the user does | Key JS functions |
|---|---|---|---|
| **Search** | `#view-search` | Hero search band (location/dates/guests) fills the filters; filter + sort; click a card | `loadHotels`, `renderHotelList` |
| **Hotel** | `#view-hotel` | Reads the detail, looks at the room photo strips, clicks an available room | `openHotel`, `renderRooms` |
| **Booking** | `#view-booking` | Reviews the room gallery (clickable thumbs), watches the live receipt, fills the form | `openBooking`, `fillGallery`, `syncOrderPanel` |
| **Confirm** | `#view-confirm` | Sees the stay voucher; jumps to history or back to search | `renderVoucher` |
| **History** | `#view-history` | Loads trips by user ID, sees stats, cancels or rates a stay | `loadHistory`, `renderHistory`, `attachFeedback` |

UX details worth pointing out during a demo:
- **Hero** → feeds `filterLocation` and saves `lastSearch` (localStorage) so the booking form
  is pre-filled with the dates/guests you searched with.
- **Live receipt** — `syncOrderPanel()` recalculates `nights × rate` on every date change and
  shows an inline error when check-out isn't after check-in.
- **Room gallery** — main image swaps as you click bedroom / bathroom / balcony thumbnails;
  ambience tags sit underneath.
- **Stay voucher** — the boarding-pass style confirmation with booking ID, hotel → room
  route, dates, guests, total and a "Confirmed" punch card.
- **Feedback stars** — only on confirmed bookings; disabled once rated ("Thanks for your feedback!").
- **Cancel** — a confirmation modal (not instant), then a toast.
- **Toasts, skeletons, empty states** — every action gives feedback: loading shimmer, success/error
  toast, and friendly "no results / no bookings yet" states.
- **Resilience** — keyboard focus rings, reduced-motion support, fully responsive.

State is kept in plain JS variables (`currentHotel`, `currentRoom`) plus `localStorage`
(`staybook.user`, `staybook.search`) so a returning guest's history loads automatically.

---

## 12. Admin frontend — the two tabs

| Tab | Contents |
|---|---|
| **Hotels & inspections** | "Add hotel" form · grid of hotel cards (rooms free, eligibility badge, 3 norm dots, feedback avg) · **Inspect** panel (hygiene/service selects + feedback + note) · **Rooms** panel (list, add room, remove, and the **"Add / edit photos"** panel to set bedroom/bathroom/balcony URLs per room) · **Delete** (with confirm, cascades) |
| **Bookings & feedback** | Live table of every booking: id, guest, hotel, room, dates, total, status, feedback stars |

Eligibility dots per card: green = pass, red = fail, tan = pending. The card's badge shows
**"✓ Eligible — passes all norms"** or **"◦ Under review"** so a faculty member can see the
admin decision at a glance.

---

## 13. How to run & test

1. `npm install` (only if `node_modules` is missing)
2. `npm start` (or `node server.js`) — starts **both** ports in one process
3. Open `http://localhost:3000` (customer) and `http://localhost:3001` (admin)

Optional env vars: `PORT=3000` and `PORT_ADMIN=3001`.

### What `npm start` prints (and how to open it on another device)

Running `npm start` prints the local links **and your machine's Wi-Fi/Ethernet IP** so you can
open the demo from a phone or second laptop on the same network:

```
> hotel-booking-system@1.0.0 start
> node server.js

Hotel Booking System running at http://localhost:3000
  Same Wi-Fi (open on your phone/laptop): http://192.168.0.176:3000
Admin console running at http://localhost:3001
  Same Wi-Fi (open on your phone/laptop): http://192.168.0.176:3001
```

- The `192.168.x.x` links are detected automatically from your network adapter
  (`utils/network.js`, using Node's `os.networkInterfaces()`) — no config needed.
- On a phone/another laptop, type those URLs **while both devices are on the same Wi-Fi**.
- The server already listens on all interfaces (`app.listen(PORT, …)` binds to every adapter),
  so no code change is needed for network access.
- **If the phone can't connect:** Windows Firewall is usually blocking `node.exe`.
  Allow it once: Windows Security → Allow an app through firewall → check **Node.js** (Private).
  Private-network access is enough for a demo.

### Quick Postman checklist (customer, port 3000)
1. `GET /api/hotels` → 4 hotels, each with `availableRooms` + `eligible`.
2. `GET /api/hotels/H1/rooms` → rooms with photo fields + ambience.
3. `POST /api/bookings` (example body above) → `201`, note the returned `id` (e.g. `B1`).
4. `GET /api/hotels/H1/rooms` again → R101 now `booked`.
5. `PUT /api/bookings/B1/cancel` → room flips back to `available`.
6. `POST /api/bookings/B1/feedback` `{ "score": 5 }` → stored.
7. `GET /api/bookings/sanju01` → history joined with hotel/room names.

### Quick Postman checklist (admin, port 3001 — remember the `/api/admin` prefix)
1. `GET /api/admin/hotels` → cards data incl. inspection + feedback.
2. `POST /api/admin/hotels` → add one, note new id (`H5`).
3. `POST /api/admin/hotels/H5/inspect` → `eligible: true` when all norms pass.
4. `POST /api/admin/hotels/H5/rooms` → add a room.
5. `PUT /api/admin/rooms/R…` → set `bedImage`/`bathImage`/`balconyImage`.
6. Refresh `http://localhost:3000` → new hotel visible with "Quality-checked" badge.
7. `DELETE /api/admin/hotels/H5` → cascades rooms + bookings.

---

## 14. Known limitations (say these honestly if asked)

- **No real authentication** — the admin console is deliberately on its own port with no login
  (per the brief); anyone on the demo network could open it.
- **Data resets on restart** — it's in-memory. Switching `models/data.js` to MongoDB/Mongoose
  makes it persist (shapes already match schemas).
- **No payment gateway** — "confirm booking" is confirmation only, in ₹.
- **Single-port demo** — both apps run from one process; they share data by design.
- **Simplified double-booking check** — a room with any overlapping confirmed booking is treated
  as booked; per-date availability logic is intentionally minimal for the mini project.

## 15. Live-change quick reference (evaluation day)

Because data is a plain JS array, live edits are fast:

- **Add a hotel** → append a hotel object to `hotels` in `models/data.js`, restart.
- **Add a room with photos** → append a room object (`hotelId`, `bedImage`, `bathImage`,
  `hasBalcony`, …), restart.
- **Make a hotel eligible immediately** → `inspections.H1 = { hygiene:"pass", service:"pass",
  feedbackScore:4, eligible:true }`.
- **Add a filter** → copy the `if (minPrice)` block in `routes/hotels.js`; add the matching
  `input`/`select` in `public/index.html` and read it in `loadHotels()` in `public/app.js`.
- **Restyle everything** → edit the CSS variables at the top of `public/style.css`.

For the full 3-member demo script, per-person Q&A and detailed live-change walkthroughs see
**`TEAM-DIVISION.md`**.