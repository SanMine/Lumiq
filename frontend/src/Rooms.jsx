import React, { useState } from "react";
import { useProperties } from "./Properties";
import dorm1 from "./assets/dorm1.jpeg";

export default function Rooms() {

  //called from Properties.jsx 

  
  const { dorms, rooms } = useProperties();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter dorms based on search term
  const filteredDorms = dorms.filter(dorm =>
    dorm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dorm.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper function to get room count and pricing for each dorm
  const getDormRoomInfo = (dormId) => {
    const dormRooms = rooms.filter(room => room.dormId === dormId);
    const availableRooms = dormRooms.filter(room => room.status === 'Available');
    const minPrice = dormRooms.length > 0 ? Math.min(...dormRooms.map(room => room.price_per_month)) : 0;
    
    return {
      totalRooms: dormRooms.length,
      availableRooms: availableRooms.length,
      startingPrice: minPrice
    };
  };


  //ying's code
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
    <button className="text-gray-300 hover:text-white">Roommate Matching</button>
  </nav>
</header>
      {/* Search */}
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search by dorm name or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-2/3 px-4 py-3 rounded-full bg-[#1b263b] focus:outline-none text-gray-300"
        />
      </div>

      {/* Dorm cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDorms.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 py-8">
            {dorms.length === 0 ? "Loading dorms..." : "No dorms found matching your search."}
          </div>
        ) : (
          filteredDorms.map((dorm) => {
            const roomInfo = getDormRoomInfo(dorm.id);
            const displayImage = dorm.image_url || dorm1; // Use backend image or fallback to dorm1
            const displayRating = parseFloat(dorm.average_rating || dorm.rating) || 0;
            
            return (
              <div
                key={dorm.id}
                className="bg-[#1b263b] rounded-2xl shadow-lg overflow-hidden relative"
              >
                {/* Image */}
                <img 
                  src={displayImage} 
                  alt={dorm.name} 
                  className="w-full h-40 object-cover"
                  onError={(e) => {
                    e.target.src = dorm1; // Fallback to local image if URL fails
                  }}
                />

                {/* Rating badge */}
                <div className="absolute top-2 right-2 bg-lime-400 text-black text-sm font-semibold px-3 py-1 rounded-full shadow">
                  ⭐ {displayRating.toFixed(1)}
                </div>

                {/* Availability badge */}
                {roomInfo.availableRooms > 0 && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow">
                    {roomInfo.availableRooms} Available
                  </div>
                )}

                {/* Info */}
                <div className="p-4">
                  <h2 className="text-lg font-semibold">{dorm.name}</h2>
                  <p className="text-sm text-gray-400">{dorm.location}</p>
                  
                  {/* Price and room info */}
                  {roomInfo.startingPrice > 0 ? (
                    <p className="mt-2 font-medium">
                      Starts from ฿{roomInfo.startingPrice.toLocaleString()} / month
                    </p>
                  ) : (
                    <p className="mt-2 font-medium text-gray-400">No rooms available</p>
                  )}
                  
                  {/* Room count */}
                  <p className="text-xs text-gray-500 mt-1">
                    {roomInfo.totalRooms} room{roomInfo.totalRooms !== 1 ? 's' : ''} total
                  </p>
                  
                  {/* Facilities if available */}
                  {dorm.facilities && (
                    <p className="text-xs text-gray-400 mt-1">
                      🏊 {dorm.facilities}
                    </p>
                  )}
                  
                  <button className="mt-4 w-full bg-[#0d1b2a] text-white py-2 rounded-lg hover:bg-[#1e2a3f] transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
