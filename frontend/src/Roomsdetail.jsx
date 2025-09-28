import React from "react";
import dormImage from "./assets/dorm1.jpeg"; // Replace with actual dorm image

export default function RoomsDetail() {
  return (
    <div className="min-h-screen bg-[#0d0d1f] text-white p-6">
      {/* Header */}
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
    <button className="text-gray-300 hover:text-white">Roommate Matching</button>
  </nav>
</header>
      {/* Main dorm info */}
      <div className="bg-[#1a1a2e] rounded-2xl shadow-lg  mb-8">
        <img
          src={dormImage}
          alt="Campus Suites"
          className="w-full h-96 object-cover rounded-t-2xl mb-4 "
        />
        <h2 className="text-2xl font-bold p-3">Campus Suites</h2>
        <p className="text-gray-400 flex items-center p-3">
          📍 123 University Ave, Cityville, State 12345
        </p>

        <div className="flex justify-between items-center mt-4 pb-3 p-3">
          <span className="text-lime-400 font-semibold ">⭐ 4.5 (120 reviews)</span>
          <span className="text-gray-300">Price Range: $800 – $1200 / month</span>
          <button className="bg-pink-600 px-6 py-2 rounded-lg ">Book / Apply Now</button>
        </div>
      </div>

      {/* Description */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-pink-400 mb-2">Description & Highlights</h3>
        <p className="text-gray-300">
          Campus Suites offers modern student living with a focus on community and
          convenience. Located just steps from MFU campus, it provides a range of
          room options and amenities to suit every student’s needs.
        </p>

        {/* Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mt-4">
          <div className="bg-[#1b263b] p-4 rounded-lg text-center">🛏 Varied Room Types</div>
          <div className="bg-[#1b263b] p-4 rounded-lg text-center">⚡ High-Speed Internet</div>
          <div className="bg-[#1b263b] p-4 rounded-lg text-center">🍳 Shared Kitchen</div>
          <div className="bg-[#1b263b] p-4 rounded-lg text-center">🧺 Laundry Facilities</div>
          <div className="bg-[#1b263b] p-4 rounded-lg text-center">🛋 Common Lounge</div>
          <div className="bg-[#1b263b] p-4 rounded-lg text-center">🏋️ Fitness Center</div>
        </div>
      </div>

      {/* Room Options */}
      <div className="mb-8 rounded-2xl">
        <h3 className="text-xl font-bold text-pink-400 mb-2">Room Options</h3>
        <table className="w-full text-left  border-separate border-spacing-y-2">
          <thead>
            <tr className="text-pink-400">
              <th>Room Type</th>
              <th>Size</th>
              <th>Price</th>
              <th>Availability</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-[#1b263b] rounded-lg">
              <td className="p-2">Single Room</td>
              <td>150 sq ft</td>
              <td>$800/month</td>
              <td className="text-lime-400">Available</td>
            </tr>
            <tr className="bg-[#1b263b] rounded-lg">
              <td className="p-2">Double Room</td>
              <td>250 sq ft</td>
              <td>$1000/month</td>
              <td className="text-yellow-400">Limited</td>
            </tr>
            <tr className="bg-[#1b263b] rounded-lg">
              <td className="p-2">Suite</td>
              <td>400 sq ft</td>
              <td>$1200/month</td>
              <td className="text-red-500">Full</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Reviews */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-pink-400 mb-2">Reviews & Ratings</h3>
        <div className="flex items-center space-x-6 mb-4">
          <div className="text-4xl font-bold text-lime-400">4.5</div>
          <div className="text-gray-400">Based on 120 reviews</div>
        </div>

        {/* Example reviews */}
        <div className="bg-[#1b263b] p-4 rounded-lg mb-3">
          <p className="font-semibold">Sophia Clark <span className="text-gray-400 text-sm">2023-08-15</span></p>
          <p className="text-gray-300 mt-1">
            Campus Suites is an amazing place to live! The rooms are modern and clean,
            and the staff is super friendly and helpful.
          </p>
        </div>
        <div className="bg-[#1b263b] p-4 rounded-lg">
          <p className="font-semibold">Ethan Miller <span className="text-gray-400 text-sm">2023-07-20</span></p>
          <p className="text-gray-300 mt-1">
            Great location, right next to campus. The only downside is it can get a bit noisy sometimes.
          </p>
        </div>
      </div>

      {/* Map */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-pink-400 mb-2">Location & Accessibility</h3>
        <img
          src="https://via.placeholder.com/600x300?text=Map+Placeholder"
          alt="map"
          className="w-full rounded-lg"
        />
      </div>

      {/* Policies */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-pink-400 mb-2">Policies & Safety</h3>
        <div className="bg-[#1b263b] p-4 rounded-lg mb-2">
          <p><strong>Rules:</strong> No pets, quiet hours after 10 PM, guest policy.</p>
        </div>
        <div className="bg-[#1b263b] p-4 rounded-lg">
          <p><strong>Safety Features:</strong> 24/7 security, key card access, emergency call system.</p>
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex justify-between items-center bg-[#1b263b] p-4 rounded-lg">
        <p>Ready to find your new home?</p>
        <div className="flex space-x-4">
          <button className="bg-pink-600 px-4 py-2 rounded-lg">Book a Room</button>
          <button className="bg-gray-600 px-4 py-2 rounded-lg">Contact Dorm</button>
          <button className="bg-gray-800 px-4 py-2 rounded-lg">Save to Wishlist</button>
        </div>
      </div>
    </div>
  );
}
