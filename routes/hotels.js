const express = require("express");
const router = express.Router();
const db = require("../models/data");

// GET /api/hotels?location=&minPrice=&maxPrice=&minRating=&roomType=&sort=
router.get("/", (req, res) => {
  const { location, minPrice, maxPrice, minRating, roomType, sort } = req.query;

  let result = db.hotels.filter((h) => {
    if (location) {
      const q = location.toLowerCase();
      if (!h.location.toLowerCase().includes(q)) return false;
    }
    if (minPrice && h.price < Number(minPrice)) return false;
    if (maxPrice && h.price > Number(maxPrice)) return false;
    if (minRating && h.rating < Number(minRating)) return false;
    if (roomType) {
      const hasRoom = db.rooms.some(
        (r) => r.hotelId === h.id && r.roomType.toLowerCase() === roomType.toLowerCase()
      );
      if (!hasRoom) return false;
    }
    return true;
  });

  // join a little extra info onto each hotel (Room -> Hotel relationship)
  const enriched = result.map((h) => {
    const hotelRooms = db.rooms.filter((r) => r.hotelId === h.id);
    return {
      ...h,
      totalRooms: hotelRooms.length,
      availableRooms: hotelRooms.filter((r) => r.status === "available").length,
      eligible: !!(db.inspections[h.id] && db.inspections[h.id].eligible)
    };
  });

  if (sort === "price-asc") enriched.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") enriched.sort((a, b) => b.price - a.price);
  else if (sort === "rating-desc") enriched.sort((a, b) => b.rating - a.rating);

  res.json(enriched);
});

// GET /api/hotels/:id
router.get("/:id", (req, res) => {
  const hotel = db.hotels.find((h) => h.id === req.params.id);
  if (!hotel) return res.status(404).json({ error: "Hotel not found" });
  res.json(hotel);
});

// GET /api/hotels/:id/rooms
router.get("/:id/rooms", (req, res) => {
  const hotelRooms = db.rooms.filter((r) => r.hotelId === req.params.id);
  res.json(hotelRooms);
});

module.exports = router;