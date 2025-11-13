import React, { JSX } from "react";
import { useNavigate } from "react-router-dom";
import dorm1 from "./assets/dorm1.jpeg";

// 🧩 Define a TypeScript type for a dorm object
type Dorm = {
  id: number;
  name: string;
  location: string;
  price: string;
  rating: number;
  image: string;
};

// 🏠 Dorm data (typed array)
const dorms: Dorm[] = [
  {
    id: 1,
    name: "The Grand Residence",
    location: "Bangkok, Thailand",
    price: "฿3,200 / month",
    rating: 4.8,
    image: dorm1,
  },
  {
    id: 2,
    name: "The Student Hub",
    location: "Chiang Mai, Thailand",
    price: "฿3,000 / month",
    rating: 4.5,
    image: "https://via.placeholder.com/300x200?text=Student+Hub",
  },
  {
    id: 3,
    name: "The Academic Suites",
    location: "Phuket, Thailand",
    price: "฿3,500 / month",
    rating: 4.9,
    image: "https://via.placeholder.com/300x200?text=Academic+Suites",
  },
  {
    id: 4,
    name: "The Scholar's Quarters",
    location: "Pattaya, Thailand",
    price: "฿3,100 / month",
    rating: 4.6,
    image: "https://via.placeholder.com/300x200?text=Scholar's+Quarters",
  },
  {
    id: 5,
    name: "The Campus Retreat",
    location: "Krabi, Thailand",
    price: "฿3,300 / month",
    rating: 4.7,
    image: "https://via.placeholder.com/300x200?text=Campus+Retreat",
  },
  {
    id: 6,
    name: "University Place",
    location: "Bangkok, Thailand",
    price: "฿3,800 / month",
    rating: 4.4,
    image: "https://via.placeholder.com/300x200?text=University+Place",
  },
];

// 🧭 Component
export default function Dorms(): JSX.Element {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0d1b2a] text-white p-6">
      {/* Top bar */}
      <header className="mb-6">
        {/* Top row: Lumiq and profile */}
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-pink-500 font-bold text-2xl">Lumiq</h1>
          <img
            src="https://via.placeholder.com/40"
            alt="profile"
            className="w-10 h-10 rounded-full"
          />
        </div>

        {/* Second row: navigation buttons */}
        <nav className="flex space-x-6">
          <button className="text-white border-b-2 border-lime-400">Dorms</button>
          <button className="text-gray-300 hover:text-white">
            Roommate Matching
          </button>
        </nav>
      </header>

      {/* Search */}
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search by dorm name..."
          className="w-2/3 px-4 py-3 rounded-full bg-[#1b263b] focus:outline-none text-gray-300"
        />
      </div>

      {/* Dorm cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dorms.map((dorm) => (
          <div
            key={dorm.id}
            className="bg-[#1b263b] rounded-2xl shadow-lg overflow-hidden relative"
          >
            {/* Image */}
            <img
              src={dorm.image}
              alt={dorm.name}
              className="w-full h-40 object-cover"
            />

            {/* Rating badge */}
            <div className="absolute top-2 right-2 bg-lime-400 text-black text-sm font-semibold px-3 py-1 rounded-full shadow">
              ⭐ {dorm.rating}
            </div>

            {/* Info */}
            <div className="p-4">
              <h2 className="text-lg font-semibold">{dorm.name}</h2>
              <p className="text-sm text-gray-400">{dorm.location}</p>
              <p className="mt-2 font-medium">Starts from {dorm.price}</p>
              <button
                onClick={() => navigate(`/rooms/${dorm.id}`)}
                className="mt-4 w-full bg-[#0d1b2a] text-white py-2 rounded-lg hover:bg-[#1e2a3f]"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
