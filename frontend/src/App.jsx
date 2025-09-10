import { useEffect, useState } from "react";
import { api } from "./lib/api";

// Star Rating Component
const StarRating = ({ rating, onRatingChange, readonly = false }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`text-2xl transition-colors ${
            readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
          } ${
            star <= (hoverRating || rating)
              ? 'text-yellow-400'
              : 'text-gray-300'
          }`}
          onClick={() => !readonly && onRatingChange(star)}
          onMouseEnter={() => !readonly && setHoverRating(star)}
          onMouseLeave={() => !readonly && setHoverRating(0)}
          disabled={readonly}
        >
          ★
        </button>
      ))}
      {!readonly && (
        <span className="ml-2 text-sm text-gray-600">
          {hoverRating || rating} star{(hoverRating || rating) !== 1 ? 's' : ''}
        </span>
      )}
      {readonly && (
        <span className="ml-2 text-sm text-gray-600">
          ({(rating || 0).toFixed(1)}/5)
        </span>
      )}
    </div>
  );
};

export default function App() {
  const [health, setHealth] = useState("Loading...");
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ email: "", name: "" });
  const [dorms, setDorms] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [userRatings, setUserRatings] = useState({}); // Track user's pending ratings
  const [ratingMessages, setRatingMessages] = useState({}); // Track rating submission messages
  const [dormForm, setDormForm] = useState({ 
    name: "", 
    location: "", 
    rating: 0, 
    image_url: "", 
    description: "",
    availibility: true,
    facilities: "",
    insurance_policy: 0,
    Water_fee: 0,
    Electricity_fee: 0,
    room_count: 0
  });
  const [room, setRoom] = useState([]); // To store the currently selected room
  const [selectedDormForRooms, setSelectedDormForRooms] = useState(null); // Track which dorm's rooms to show
  const [roomForm, setRoomForm] = useState({
    dormId: "",
    room_number: "",
    room_type: "Single",
    capacity: 1,
    price_per_month: 0,
    floor: 1,
    description: "",
    amenities: "",
    images: "",
    status: "Available",
    current_resident_id: null,
    expected_move_in_date: "",
    expected_available_date: ""
  });

  useEffect(() => {
    api.get("/health")
      .then(r => setHealth(`DB: ${r.data.db} @ ${r.data.now}`))
      .catch(() => setHealth("Backend unreachable"));

    api.get("/users")
      .then(r => setUsers(r.data))
      .catch(() => setUsers([]));

    api.get("/dorms")
      .then(r => setDorms(r.data))
      .catch(() => setDorms([]));

    api.get("/rooms")
      .then(r => setRooms(r.data))
      .catch(() => setRooms([]));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.name) return;
    await api.post("/users", form);
    setForm({ email: "", name: "" });
    const { data } = await api.get("/users");
    setUsers(data);
  };

  const dormSubmit = async (e) => {
    e.preventDefault();
    if (!dormForm.name || !dormForm.location || !dormForm.rating) return;
    
    try {
      await api.post("/dorms", dormForm);
      setDormForm({ 
        name: "", 
        location: "", 
        rating: 0, 
        image_url: "", 
        description: "",
        availibility: true,
        facilities: "",
        insurance_policy: 0,
        Water_fee: 0,
        Electricity_fee: 0,
        room_count: 0
      });
      const { data } = await api.get("/dorms");
      setDorms(data);
    } catch (error) {
      console.error("Failed to create dorm:", error);
      alert("Failed to create dorm. Please check the console for details.");
    }
  };

  const roomSubmit = async (e) => {
    e.preventDefault();
    if (!roomForm.dormId || !roomForm.room_number || !roomForm.price_per_month) return;
    
    try {
      // Convert images from comma-separated string to array
      const imagesArray = roomForm.images ? roomForm.images.split(',').map(img => img.trim()) : [];
      await api.post("/rooms", { ...roomForm, images: imagesArray });
      setRoomForm({
        dormId: "",
        room_number: "",
        room_type: "Single",
        capacity: 1,
        price_per_month: 0,
        floor: 1,
        description: "",
        amenities: "",
        images: "",
        status: "Available",
        current_resident_id: null,
        expected_move_in_date: "",
        expected_available_date: ""
      });
      const { data } = await api.get("/rooms");
      setRooms(data);
    } catch (error) {
      console.error("Failed to create room:", error);
      alert("Failed to create room. Please check the console for details.");
    }
  };

  // Load rooms for a specific dorm
  const loadDormRooms = async (dormId) => {
    try {
      const response = await api.get(`/rooms?dormId=${dormId}`);
      setSelectedDormForRooms(dormId);
      return response.data;
    } catch (error) {
      console.error("Failed to load dorm rooms:", error);
      return [];
    }
  };

  // Get status emoji and color
  const getStatusDisplay = (status) => {
    switch (status) {
      case 'Available':
        return { emoji: '✅', color: 'text-green-600', bg: 'bg-green-50' };
      case 'Occupied':
        return { emoji: '🏠', color: 'text-red-600', bg: 'bg-red-50' };
      case 'Reserved':
        return { emoji: '📝', color: 'text-yellow-600', bg: 'bg-yellow-50' };
      case 'Maintenance':
        return { emoji: '🔧', color: 'text-gray-600', bg: 'bg-gray-50' };
      default:
        return { emoji: '❓', color: 'text-gray-600', bg: 'bg-gray-50' };
    }
  };

  // Set pending rating (doesn't submit yet)
  const setPendingRating = (dormId, rating) => {
    setUserRatings(prev => ({
      ...prev,
      [dormId]: rating
    }));
    // Clear any previous messages
    setRatingMessages(prev => ({
      ...prev,
      [dormId]: null
    }));
  };

  // Submit rating function
  const submitRating = async (dormId, userId = 1) => {
    const rating = userRatings[dormId];
    if (!rating) {
      setRatingMessages(prev => ({
        ...prev,
        [dormId]: { type: 'error', text: 'Please select a rating first!' }
      }));
      return;
    }

    try {
      setRatingMessages(prev => ({
        ...prev,
        [dormId]: { type: 'loading', text: 'Submitting rating...' }
      }));

      await api.post(`/dorms/${dormId}/rate`, { rating, userId });
      
      // Clear the pending rating
      setUserRatings(prev => {
        const newRatings = { ...prev };
        delete newRatings[dormId];
        return newRatings;
      });

      // Show success message
      setRatingMessages(prev => ({
        ...prev,
        [dormId]: { type: 'success', text: 'Rating submitted successfully!' }
      }));

      // Clear success message after 3 seconds
      setTimeout(() => {
        setRatingMessages(prev => ({
          ...prev,
          [dormId]: null
        }));
      }, 3000);

      // Refresh dorms to get updated average rating
      const { data } = await api.get("/dorms");
      setDorms(data);
    } catch (error) {
      console.error("Failed to rate dorm:", error);
      setRatingMessages(prev => ({
        ...prev,
        [dormId]: { type: 'error', text: 'Failed to submit rating. Please try again.' }
      }));
    }
  };
  
  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-6 text-blue-600">LUMIQ</h1>
      <p className="text-center mb-8 text-gray-600">{health}</p>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Create User</h2>
        <form onSubmit={submit} className="flex flex-col sm:flex-row gap-4">
          <input
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
          <button 
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Add User
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Create Dorm</h2>
        <form onSubmit={dormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Name"
            value={dormForm.name}
            onChange={e => setDormForm({ ...dormForm, name: e.target.value })}
          />
          <input
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Location"
            value={dormForm.location}
            onChange={e => setDormForm({ ...dormForm, location: e.target.value })}
          />
          <input
            type="number"
            step="0.1"
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Insurance Policy"
            value={dormForm.insurance_policy}
            onChange={e => setDormForm({ ...dormForm, insurance_policy: Number(e.target.value) })}
          />
          <input
            type="number"
            step="0.1"
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Water Fee"
            value={dormForm.Water_fee}
            onChange={e => setDormForm({ ...dormForm, Water_fee: Number(e.target.value) })}
          />
          <input
            type="number"
            step="0.1"
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Electricity Fee"
            value={dormForm.Electricity_fee}
            onChange={e => setDormForm({ ...dormForm, Electricity_fee: Number(e.target.value) })}
          />
          <input
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Image URL"
            value={dormForm.image_url}
            onChange={e => setDormForm({ ...dormForm, image_url: e.target.value })}
          />
          <input
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Facilities"
            value={dormForm.facilities}
            onChange={e => setDormForm({ ...dormForm, facilities: e.target.value })}
          />
          <textarea
            className="md:col-span-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Description"
            value={dormForm.description}
            onChange={e => setDormForm({ ...dormForm, description: e.target.value })}
          />
          
          {/* Star Rating for Initial Rating */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Initial Rating
            </label>
            <StarRating 
              rating={dormForm.rating} 
              onRatingChange={(rating) => setDormForm({ ...dormForm, rating })}
            />
          </div>

          <div className="md:col-span-2 flex items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={dormForm.availibility}
                onChange={e => setDormForm({ ...dormForm, availibility: e.target.checked })}
                className="mr-2"
              />
              Available
            </label>
          </div>
          <button 
            type="submit"
            className="md:col-span-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Add Dorm
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Create Room</h2>
        <form onSubmit={roomSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={roomForm.dormId}
            onChange={e => setRoomForm({ ...roomForm, dormId: e.target.value })}
            required
          >
            <option value="">Select Dorm</option>
            {dorms.map(dorm => (
              <option key={dorm.id} value={dorm.id}>{dorm.name}</option>
            ))}
          </select>
          
          <input
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Room Number (e.g., 101, A-205)"
            value={roomForm.room_number}
            onChange={e => setRoomForm({ ...roomForm, room_number: e.target.value })}
            required
          />
          
          <select
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={roomForm.room_type}
            onChange={e => setRoomForm({ ...roomForm, room_type: e.target.value })}
          >
            <option value="Single">Single Room</option>
            <option value="Double">Double Room</option>
            <option value="Triple">Triple Room</option>
          </select>
          
          <input
            type="number"
            min="1"
            max="3"
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Capacity"
            value={roomForm.capacity}
            onChange={e => setRoomForm({ ...roomForm, capacity: parseInt(e.target.value) })}
          />
          
          <input
            type="number"
            step="0.01"
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Price per Month ($)"
            value={roomForm.price_per_month}
            onChange={e => setRoomForm({ ...roomForm, price_per_month: parseFloat(e.target.value) })}
            required
          />
          
          <input
            type="number"
            min="1"
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Floor"
            value={roomForm.floor}
            onChange={e => setRoomForm({ ...roomForm, floor: parseInt(e.target.value) })}
          />
          
          <select
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={roomForm.status}
            onChange={e => setRoomForm({ ...roomForm, status: e.target.value })}
          >
            <option value="Available">Available</option>
            <option value="Reserved">Reserved</option>
            <option value="Occupied">Occupied</option>
            <option value="Maintenance">Maintenance</option>
          </select>
          
          <select
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={roomForm.current_resident_id || ""}
            onChange={e => setRoomForm({ ...roomForm, current_resident_id: e.target.value ? parseInt(e.target.value) : null })}
          >
            <option value="">No Current Resident</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
          
          <input
            type="date"
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Expected Move-in Date"
            value={roomForm.expected_move_in_date}
            onChange={e => setRoomForm({ ...roomForm, expected_move_in_date: e.target.value })}
          />
          
          <input
            type="date"
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Expected Available Date"
            value={roomForm.expected_available_date}
            onChange={e => setRoomForm({ ...roomForm, expected_available_date: e.target.value })}
          />
          
          <input
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Amenities (e.g., AC, WiFi, Desk)"
            value={roomForm.amenities}
            onChange={e => setRoomForm({ ...roomForm, amenities: e.target.value })}
          />
          
          <input
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Image URLs (comma-separated)"
            value={roomForm.images}
            onChange={e => setRoomForm({ ...roomForm, images: e.target.value })}
          />
          
          <textarea
            className="md:col-span-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Room Description"
            value={roomForm.description}
            onChange={e => setRoomForm({ ...roomForm, description: e.target.value })}
            rows="3"
          />
          
          <button 
            type="submit"
            className="md:col-span-2 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          >
            Add Room
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Users</h2>
        {users.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No users found</p>
        ) : (
          <ul className="space-y-2">
            {users.map(u => (
              <li key={u.id} className="p-3 bg-gray-50 rounded-md border-l-4 border-blue-500">
                <span className="font-medium text-gray-800">{u.name}</span>
                <span className="text-gray-600 ml-2">({u.email})</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Dorms</h2>
        {dorms.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No dorms found</p>
        ) : (
          <ul className="space-y-4">
            {dorms.map(d => (
              <li key={d.id} className="p-4 bg-gray-50 rounded-md border-l-4 border-blue-500">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 text-lg">{d.name}</h3>
                    <p className="text-gray-600">📍 {d.location}</p>
                    
                    {/* Display Average Rating */}
                    <div className="my-2">
                      <StarRating rating={parseFloat(d.average_rating || d.rating) || 0} readonly={true} />
                      <span className="text-sm text-gray-500 ml-2">
                        ({parseInt(d.total_ratings || 0)} rating{(parseInt(d.total_ratings || 0)) !== 1 ? 's' : ''})
                      </span>
                    </div>

                    {/* Rate This Dorm */}
                    <div className="my-3 p-3 bg-blue-50 rounded-md">
                      <p className="text-sm font-medium text-gray-700 mb-2">Rate this dorm:</p>
                      <div className="flex items-center gap-3">
                        <StarRating 
                          rating={userRatings[d.id] || 0} 
                          onRatingChange={(rating) => setPendingRating(d.id, rating)}
                        />
                        <button
                          onClick={() => submitRating(d.id)}
                          disabled={!userRatings[d.id] || ratingMessages[d.id]?.type === 'loading'}
                          className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                            userRatings[d.id] && ratingMessages[d.id]?.type !== 'loading'
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {ratingMessages[d.id]?.type === 'loading' ? 'Submitting...' : 'Submit Rating'}
                        </button>
                      </div>
                      
                      {/* Rating Status Messages */}
                      {ratingMessages[d.id] && (
                        <div className={`mt-2 text-sm ${
                          ratingMessages[d.id].type === 'success' ? 'text-green-600' :
                          ratingMessages[d.id].type === 'error' ? 'text-red-600' :
                          'text-blue-600'
                        }`}>
                          {ratingMessages[d.id].text}
                        </div>
                      )}
                    </div>

                    <p className="text-gray-600">
                      🏠 {d.availibility ? "Available" : "Not Available"}
                    </p>
                    {d.description && (
                      <p className="text-gray-600 mt-2">{d.description}</p>
                    )}
                    {d.facilities && (
                      <p className="text-gray-600">🏊 Facilities: {d.facilities}</p>
                    )}
                    <div className="mt-2 text-sm text-gray-500">
                      <p>💰 Insurance Policy: ${d.insurance_policy}</p>
                      <p>💧 Water Fee: ${d.Water_fee}</p>
                      <p>⚡ Electricity Fee: ${d.Electricity_fee}</p>
                      <p>🏠 Total Rooms: {rooms.filter(r => r.dormId === d.id).length}</p>
                      <p>✅ Available Rooms: {rooms.filter(r => r.dormId === d.id && r.status === 'Available').length}</p>
                    </div>

                    {/* Show Rooms Button */}
                    <button
                      onClick={async () => {
                        if (selectedDormForRooms === d.id) {
                          setSelectedDormForRooms(null);
                        } else {
                          await loadDormRooms(d.id);
                        }
                      }}
                      className="mt-3 px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm font-medium"
                    >
                      {selectedDormForRooms === d.id ? 'Hide Rooms' : 'Show Rooms'}
                    </button>

                    {/* Display Rooms for this Dorm */}
                    {selectedDormForRooms === d.id && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-md">
                        <h4 className="font-medium text-gray-800 mb-3">Rooms in {d.name}</h4>
                        {rooms.filter(r => r.dormId === d.id).length === 0 ? (
                          <p className="text-gray-500 text-sm">No rooms available in this dorm yet.</p>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {rooms.filter(r => r.dormId === d.id).map(room => {
                              const statusDisplay = getStatusDisplay(room.status);
                              return (
                                <div key={room.id} className={`p-3 rounded-md border ${statusDisplay.bg} border-gray-200`}>
                                  <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                      <h5 className="font-medium text-gray-800">
                                        {statusDisplay.emoji} Room {room.room_number}
                                      </h5>
                                      <p className="text-sm text-gray-600">{room.room_type} • Floor {room.floor}</p>
                                      <p className="text-sm font-medium text-green-600">${room.price_per_month}/month</p>
                                      <p className={`text-sm font-medium ${statusDisplay.color}`}>
                                        {room.status}
                                      </p>
                                      
                                      {room.CurrentResident && (
                                        <p className="text-sm text-gray-600">
                                          👤 Current: {room.CurrentResident.name}
                                        </p>
                                      )}
                                      
                                      {room.expected_available_date && (
                                        <p className="text-sm text-orange-600">
                                          📅 Available: {new Date(room.expected_available_date).toLocaleDateString()}
                                        </p>
                                      )}
                                      
                                      {room.expected_move_in_date && (
                                        <p className="text-sm text-blue-600">
                                          📅 Move-in: {new Date(room.expected_move_in_date).toLocaleDateString()}
                                        </p>
                                      )}
                                      
                                      {room.amenities && (
                                        <p className="text-xs text-gray-500 mt-1">🛎️ {room.amenities}</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                  {d.image_url && (
                    <div className="ml-4">
                      <img src={d.image_url} alt={d.name} className="w-32 h-32 object-cover rounded-md" />
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">All Rooms</h2>
        {rooms.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No rooms found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map(room => {
              const statusDisplay = getStatusDisplay(room.status);
              const dorm = dorms.find(d => d.id === room.dormId);
              
              return (
                <div key={room.id} className={`p-4 rounded-lg border-2 ${statusDisplay.bg} border-gray-200 hover:shadow-md transition-shadow`}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800">
                      {statusDisplay.emoji} Room {room.room_number}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusDisplay.color} bg-white`}>
                      {room.status}
                    </span>
                  </div>
                  
                  {dorm && (
                    <p className="text-sm text-gray-600 mb-2">🏢 {dorm.name} - {dorm.location}</p>
                  )}
                  
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-600">🛏️ {room.room_type} • Capacity: {room.capacity}</p>
                    <p className="text-gray-600">🏢 Floor {room.floor}</p>
                    <p className="font-medium text-green-600">💰 ${room.price_per_month}/month</p>
                    
                    {room.CurrentResident && (
                      <p className="text-gray-700 font-medium">
                        👤 {room.CurrentResident.name}
                      </p>
                    )}
                    
                    {room.expected_available_date && (
                      <p className="text-orange-600 font-medium">
                        📅 Available: {new Date(room.expected_available_date).toLocaleDateString()}
                        <span className="text-gray-500">
                          {' '}({Math.ceil((new Date(room.expected_available_date) - new Date()) / (1000 * 60 * 60 * 24))} days)
                        </span>
                      </p>
                    )}
                    
                    {room.expected_move_in_date && (
                      <p className="text-blue-600">
                        📅 Move-in: {new Date(room.expected_move_in_date).toLocaleDateString()}
                      </p>
                    )}
                    
                    {room.amenities && (
                      <p className="text-gray-600">🛎️ {room.amenities}</p>
                    )}
                    
                    {room.description && (
                      <p className="text-gray-500 text-xs mt-2">{room.description}</p>
                    )}
                  </div>
                  
                  {/* Availability Message */}
                  <div className="mt-3 p-2 bg-white rounded-md">
                    <p className="text-xs">
                      {room.status === 'Available' && '✅ Available now! Ready to book.'}
                      {room.status === 'Occupied' && room.expected_available_date && 
                        `🏠 Occupied until ${new Date(room.expected_available_date).toLocaleDateString()}`}
                      {room.status === 'Occupied' && !room.expected_available_date && 
                        '🏠 Currently occupied - no move-out date set'}
                      {room.status === 'Reserved' && room.expected_move_in_date && 
                        `📝 Reserved until ${new Date(room.expected_move_in_date).toLocaleDateString()}`}
                      {room.status === 'Reserved' && !room.expected_move_in_date && 
                        '📝 Currently reserved'}
                      {room.status === 'Maintenance' && '🔧 Under maintenance - check back later'}
                    </p>
                  </div>
                  
                  {/* Room Images */}
                  {room.image_urls && room.image_urls.length > 0 && (
                    <div className="mt-3 flex space-x-2 overflow-x-auto">
                      {room.image_urls.slice(0, 3).map((img, index) => (
                        <img 
                          key={index}
                          src={img} 
                          alt={`Room ${room.room_number}`} 
                          className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                        />
                      ))}
                      {room.image_urls.length > 3 && (
                        <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-600">
                          +{room.image_urls.length - 3}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}