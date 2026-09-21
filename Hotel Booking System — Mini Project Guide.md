Hotel Booking System — Mini Project Guide
PRD, Development Prompt & Team Presentation Plan (3 Members)
1. Product Requirements Document (PRD)
Project Name: Hotel Booking System (Mini Reservation App)

Goal: A simple web application where a user can search hotels, view rooms, book a room, and manage their bookings.

Why this project (in one line for faculty): "It teaches how to design and connect multiple related database entities (Hotel, Room, Booking) through a REST API and a working UI."

Recommended Tech Stack (kept simple, not "complex")
Layer	Technology
Frontend	HTML, CSS, JavaScript (DOM manipulation, fetch)
Backend	Node.js + Express.js
Database	MongoDB (Mongoose)
API testing	Postman (optional, for demo)
You can keep the frontend plain HTML/CSS/JS — no React needed. This is intentional: it keeps the project "mini" and easy to explain to faculty.

Data Models
Hotel

{
  id, name, location, price, image,
  rating, amenities
}
Room

{
  id, hotelId, roomNumber, roomType,
  price, status   // status: available / booked
}
Booking

{
  id, userId, hotelId, roomId,
  checkIn, checkOut, guests,
  totalAmount, status   // status: confirmed / cancelled
}
Relationship: One Hotel → many Rooms → many Bookings. A Booking always references a hotelId and roomId, which is the core "multiple related resources" concept this project demonstrates.

Features (map directly to API endpoints below)
Search hotels
Filter by location
Filter by price
View hotel details
View rooms of a hotel
Book a room
Cancel a booking
View booking history
2. Full Development Prompt
(Use this as a single prompt if you want an AI tool to help generate the actual code — paste it as-is.)

Build a mini full-stack Hotel Booking System using Node.js, Express, MongoDB (Mongoose) for the backend, and plain HTML/CSS/JavaScript for the frontend.

Create three Mongoose models: Hotel (id, name, location, price, image, rating, amenities), Room (id, hotelId, roomNumber, roomType, price, status), and Booking (id, userId, hotelId, roomId, checkIn, checkOut, guests, totalAmount, status).

Build REST API endpoints for: listing hotels with optional location and price filters, getting a single hotel's details, listing rooms for a hotel, creating a booking (which should mark the selected room as "booked"), cancelling a booking (which should mark the room "available" again), and fetching a user's booking history.

Build a simple frontend with a search/filter bar, a hotel list page, a room list page, a booking form (check-in, check-out, guests), and a booking history page. Use fetch() to call the API and vanilla JavaScript DOM methods (document.createElement, innerHTML, event listeners) to render the data dynamically — no frontend framework.

Keep validation simple: check-out date must be after check-in date, and a room can't be double-booked for overlapping dates.

3. Work Division — 3 Members
The split follows the natural 3-layer structure of the app, so each member owns one clear, demoable piece.

👤 Member 1 — Database & Backend Models
What they build:

MongoDB connection setup
The three Mongoose schemas: Hotel, Room, Booking
Seed data (a few sample hotels and rooms so the demo has real data to show)
The relationships between models (Room links to Hotel via hotelId; Booking links to both)
What to say to faculty:

"I designed the database structure for the project. We have three entities — Hotel, Room, and Booking — and I connected them using reference IDs, so one hotel can have many rooms, and each booking links a specific user to a specific room."
Show the schema code on screen, then show the actual data sitting in MongoDB (MongoDB Compass or console.log) so it looks real, not just theoretical.
Be ready to explain: why 3 separate models instead of 1? → Answer: keeps data organized, avoids duplication, and mirrors how real hotel-booking systems (like MakeMyTrip) are structured.
👤 Member 2 — API Development + DOM Integration
(This is the member you asked to get API + DOM specifically)

What they build:

All Express API routes/controllers:
GET /hotels — list + filter by location/price
GET /hotels/:id — hotel details
GET /hotels/:id/rooms — rooms for a hotel
POST /bookings — create a booking
PUT /bookings/:id/cancel — cancel a booking
GET /bookings/:userId — booking history
The JavaScript on the frontend that calls these APIs using fetch() and then updates the DOM with the response (e.g., dynamically creating hotel cards, room cards, booking confirmation messages)
What to say to faculty:

"I built the API layer — this is the bridge between the database and the screen. Each API endpoint takes a request, talks to the database, and sends back JSON data."
"Then, on the frontend, I used JavaScript to call these APIs with fetch(), and used DOM manipulation — like document.createElement and innerHTML — to take that JSON data and turn it into actual hotel cards and room listings the user can see and click, without reloading the page."
Demo tip: open the browser's Network tab or Console during the live demo and show the JSON response coming back from an API call, then show it appearing on screen — this visually proves the API → DOM connection, which faculty love to see.
Be ready to explain: what is an API? what is the DOM?
API = a set of URLs the frontend can call to get or send data, without needing to know how the database works internally.
DOM = the live structure of the webpage in the browser; JavaScript can add/remove/update elements in it after the page has already loaded.
👤 Member 3 — Features, UI & Booking Flow
What they build:

The actual pages/screens: search page, hotel listing page with filters, hotel detail + room view, booking form, cancel button, booking history page
Styling (CSS) so it looks presentable
The booking logic on the form: check-in/check-out validation, total amount calculation
Overall testing of the user flow end-to-end before the demo
What to say to faculty:

"I focused on the user experience — building the actual screens a customer would use: searching hotels, filtering by location and price, booking a room, and viewing their booking history."
"I also handled the booking form logic — validating that check-out is after check-in, and calculating the total price based on number of nights."
Be ready to run the live demo end-to-end, since this member usually knows the full user journey best: search → filter → view hotel → view rooms → book → see it in booking history → cancel.
4. Suggested Presentation Order (10–12 min total)
Member 3 — 1 min intro: what the project is, the problem it solves, quick feature overview
Member 1 — 2–3 min: data models, database design, relationships
Member 2 — 3–4 min: API endpoints + how frontend connects to backend via DOM (this is usually the technically "meatiest" part faculty ask about)
Member 3 — Live demo (3–4 min): walk through the full user flow on screen
All 3 — Q&A
5. Likely Faculty Questions (prep for all 3)
Why did you choose these 3 models specifically?
How is a Room linked to a Hotel, and a Booking linked to a Room?
What happens in the database when a booking is cancelled?
What is the difference between frontend and backend in your project?
What is an API request/response — can you show one live?
What was the hardest part to implement?
What would you add if you had more time? (e.g., login/auth, payment integration, hotel reviews)
6. Evaluation-Day Checklist (based on your sir's instructions)
Your evaluation has 4 parts: PPT (10 min) → Code showcase → Live changes → Individual Q&A. A working project is ready for you:

✅ Working project: hotel-booking-system.zip — a real running Node.js + Express backend and an HTML/CSS/JS frontend. Unzip it, run npm install (only needed if node_modules is missing) then npm start, and open http://localhost:3000.
✅ PPT: hotel-booking-presentation.pptx — a 10-slide deck (objective, features, tech stack, data models, API table, architecture flow, team contribution, live demo cue, future scope) sized for a 10-minute talk.
Before class tomorrow morning, each member should:

Run the project once on the laptop you'll present from — confirm npm start works and the browser loads it.
Walk through the full user flow once yourself: search → filter → view hotel → view rooms → book → booking history → cancel.
Open your own section of the code (see Section 3 above) and be ready to point at it on screen, not just describe it.
On "Live Changes / Modifications"
The evaluator will ask you to modify something live. Since the "database" here is a simple JavaScript array (models/data.js), small changes are quick to make in front of them. Practice these once tonight so they're not a surprise:

Add a new hotel — add one more object to the hotels array in models/data.js, save, refresh browser (auto-picks it up on restart).
Add a new filter (e.g., filter by minimum rating) — in routes/hotels.js, copy the existing if (minPrice) block and adapt it for rating; add a matching input box in index.html and read it in app.js, following the same pattern as location/price.
Change a displayed field (e.g., show room type on the hotel card) — update the template string in app.js's renderHotelList function.
Add a new room to a hotel — add an object to the rooms array in models/data.js with a matching hotelId.
Whatever change they actually ask for, the pattern is the same: find the matching model/route/render function, copy the nearest existing example, and adapt it — walk through this pattern with your team tonight so whoever gets asked isn't starting from zero.

Individual Understanding — Likely Questions Per Member
Member 1 (Database & Models):

Why three separate models instead of one big object?
How does a Room know which Hotel it belongs to? (via hotelId)
What happens to a Room's status field when a booking is made / cancelled?
Member 2 (API + DOM):

Walk me through what happens, step by step, when a user clicks "Book Room."
What's the difference between a GET and a POST request here, and where did you use each?
Show me where in your code you take the API's JSON response and put it on the screen.
What is fetch() doing, and what would break if you removed await?
Member 3 (Features & UI):

How did you validate that check-out is after check-in?
How is the total amount calculated?
Walk me through the full user journey on screen, live.
Keep the demo data small (3–4 hotels, 2–3 rooms each) — it's easier to explain and nothing looks broken on stage.