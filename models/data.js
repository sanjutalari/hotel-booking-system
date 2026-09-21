/**
 * In-memory "database" for the mini project.
 * Each array below acts as a MongoDB collection would.
 * (If you later connect real MongoDB, each of these becomes a Mongoose model/schema —
 * the shape of the objects stays exactly the same.)
 */

// ---------- HOTEL MODEL ----------
// { id, name, location, price, image, rating, amenities }
let hotels = [
  {
    id: "H1",
    name: "Sunrise Grand",
    location: "Vijayawada",
    price: 2500,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
    rating: 4.5,
    amenities: ["Free WiFi", "Pool", "Breakfast"]
  },
  {
    id: "H2",
    name: "Palm Residency",
    location: "Guntur",
    price: 1800,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
    rating: 4.0,
    amenities: ["Free WiFi", "Parking"]
  },
  {
    id: "H3",
    name: "Ocean View Suites",
    location: "Visakhapatnam",
    price: 4200,
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800",
    rating: 4.8,
    amenities: ["Free WiFi", "Pool", "Sea View", "Spa"]
  },
  {
    id: "H4",
    name: "City Comfort Inn",
    location: "Mangalagiri",
    price: 1200,
    image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800",
    rating: 3.8,
    amenities: ["Free WiFi", "AC"]
  }
];

// ---------- ROOM MODEL ----------
// { id, hotelId, roomNumber, roomType, price, status, bedImage, bathImage, balconyImage?, hasBalcony, ambience[] }
let rooms = [
  {
    id: "R101", hotelId: "H1", roomNumber: "101", roomType: "Deluxe", price: 2500,
    status: "available",
    bedImage: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800",
    bathImage: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800",
    balconyImage: "https://images.unsplash.com/photo-1533692328991-08159ff19fca?w=800",
    hasBalcony: true,
    ambience: ["King bed", "Work desk", "City view", "Evening balcony"]
  },
  {
    id: "R102", hotelId: "H1", roomNumber: "102", roomType: "Suite", price: 3800,
    status: "available",
    bedImage: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800",
    bathImage: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800",
    balconyImage: "https://images.unsplash.com/photo-1521401830884-6c03c1c87ebb?w=800",
    hasBalcony: true,
    ambience: ["Living area", "Rain shower", "Premium toiletries", "Private balcony"]
  },
  {
    id: "R103", hotelId: "H1", roomNumber: "103", roomType: "Standard", price: 1900,
    status: "available",
    bedImage: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
    bathImage: "https://images.unsplash.com/photo-1556905200-3770203d8ebf?w=800",
    hasBalcony: false,
    ambience: ["Queen bed", "Blackout curtains", "Quiet"]
  },

  {
    id: "R201", hotelId: "H2", roomNumber: "201", roomType: "Standard", price: 1800,
    status: "available",
    bedImage: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
    bathImage: "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800",
    hasBalcony: false,
    ambience: ["Twin beds", "Garden view", "Desk corner"]
  },
  {
    id: "R202", hotelId: "H2", roomNumber: "202", roomType: "Deluxe", price: 2600,
    status: "available",
    bedImage: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
    bathImage: "https://images.unsplash.com/photo-1556905200-3770203d8ebf?w=800",
    hasBalcony: false,
    ambience: ["King bed", "Soft lighting", "Earthy tones"]
  },

  {
    id: "R301", hotelId: "H3", roomNumber: "301", roomType: "Suite", price: 4200,
    status: "available",
    bedImage: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
    bathImage: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800",
    balconyImage: "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=800",
    hasBalcony: true,
    ambience: ["Ocean view", "Private balcony", "Rain shower", "Sunset walks"]
  },
  {
    id: "R302", hotelId: "H3", roomNumber: "302", roomType: "Deluxe", price: 5000,
    status: "available",
    bedImage: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
    bathImage: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800",
    balconyImage: "https://images.unsplash.com/photo-1533692328991-08159ff19fca?w=800",
    hasBalcony: true,
    ambience: ["Sea breeze balcony", "Champagne bar", "Premium linen"]
  },
  {
    id: "R303", hotelId: "H3", roomNumber: "303", roomType: "Standard", price: 3500,
    status: "available",
    bedImage: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
    bathImage: "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800",
    hasBalcony: false,
    ambience: ["Compact", "Budget friendly", "High floor"]
  },

  {
    id: "R401", hotelId: "H4", roomNumber: "401", roomType: "Standard", price: 1200,
    status: "available",
    bedImage: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800",
    bathImage: "https://images.unsplash.com/photo-1556905200-3770203d8ebf?w=800",
    hasBalcony: false,
    ambience: ["Queen bed", "Air conditioning", "Street view"]
  },
  {
    id: "R402", hotelId: "H4", roomNumber: "402", roomType: "Deluxe", price: 1900,
    status: "available",
    bedImage: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
    bathImage: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800",
    hasBalcony: false,
    ambience: ["Extra space", "City view", "Reading nook"]
  }
];

// ---------- BOOKING MODEL ----------
// { id, userId, hotelId, roomId, checkIn, checkOut, guests, totalAmount, status, feedback? }
let bookings = [];
let bookingCounter = 1;

// ---------- ADMIN / INSPECTION MODEL ----------
// inspections[hotelId] = {
//   hygiene: "pass" | "fail", service: "pass" | "fail",
//   feedbackScore: 1..5, note, date, eligible: boolean
// }
let inspections = {};

function getNextBookingId() { return `B${bookingCounter++}`; }

function getNextHotelId() {
  const nums = hotels.map((h) => parseInt(h.id.replace(/\D/g, ""), 10)).filter((n) => !isNaN(n));
  return `H${(Math.max(...nums, 0) + 1)}`;
}

function getNextRoomId() {
  const nums = rooms.map((r) => parseInt(r.id.replace(/\D/g, ""), 10)).filter((n) => !isNaN(n));
  return `R${(Math.max(...nums, 0) + 1)}`;
}

module.exports = {
  hotels,
  rooms,
  bookings,
  inspections,
  getNextBookingId,
  getNextHotelId,
  getNextRoomId
};