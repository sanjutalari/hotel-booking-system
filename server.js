const express = require("express");
const cors = require("cors");
const path = require("path");

const hotelRoutes = require("./routes/hotels");
const bookingRoutes = require("./routes/bookings");
const { startAdminServer } = require("./admin");
const { getLanIP } = require("./utils/network");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve the frontend (public/) as static files
app.use(express.static(path.join(__dirname, "public")));

// API routes
app.use("/api/hotels", hotelRoutes);
app.use("/api/bookings", bookingRoutes);

app.listen(PORT, () => {
  const lan = getLanIP();
  console.log(`Hotel Booking System running at http://localhost:${PORT}`);
  if (lan) {
    console.log(`  Same Wi-Fi (open on your phone/laptop): http://${lan}:${PORT}`);
  }
});

// Admin console on its own port (3001) — same in-memory data, no auth.
startAdminServer();
