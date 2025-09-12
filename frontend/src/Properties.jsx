import { useState, useEffect } from "react";
import { api } from "./lib/api";

// Custom hook to manage all backend properties and API calls
export const useProperties = () => {
  // Health status
  const [health, setHealth] = useState("Loading...");
  
  // Users
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ email: "", name: "" });
  
  // Dorms
  const [dorms, setDorms] = useState([]);
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
  
  // Rooms
  const [rooms, setRooms] = useState([]);
  const [selectedDormForRooms, setSelectedDormForRooms] = useState(null);
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
  
  // Ratings
  const [userRatings, setUserRatings] = useState({});
  const [ratingMessages, setRatingMessages] = useState({});

  // Load all data on component mount
  useEffect(() => {
    // Health check
    api.get("/health")
      .then(r => setHealth(`DB: ${r.data.db} @ ${r.data.now}`))
      .catch(() => setHealth("Backend unreachable"));

    // Load users
    api.get("/users")
      .then(r => setUsers(r.data))
      .catch(() => setUsers([]));

    // Load dorms
    api.get("/dorms")
      .then(r => setDorms(r.data))
      .catch(() => setDorms([]));

    // Load rooms
    api.get("/rooms")
      .then(r => setRooms(r.data))
      .catch(() => setRooms([]));
  }, []);

  // API Functions
  const submitUser = async (e) => {
    e.preventDefault();
    if (!form.email || !form.name) return;
    await api.post("/users", form);
    setForm({ email: "", name: "" });
    const { data } = await api.get("/users");
    setUsers(data);
  };

  const submitDorm = async (e) => {
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

  const submitRoom = async (e) => {
    e.preventDefault();
    if (!roomForm.dormId || !roomForm.room_number || !roomForm.price_per_month) return;
    
    try {
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

  const setPendingRating = (dormId, rating) => {
    setUserRatings(prev => ({
      ...prev,
      [dormId]: rating
    }));
    setRatingMessages(prev => ({
      ...prev,
      [dormId]: null
    }));
  };

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
      
      setUserRatings(prev => {
        const newRatings = { ...prev };
        delete newRatings[dormId];
        return newRatings;
      });

      setRatingMessages(prev => ({
        ...prev,
        [dormId]: { type: 'success', text: 'Rating submitted successfully!' }
      }));

      setTimeout(() => {
        setRatingMessages(prev => ({
          ...prev,
          [dormId]: null
        }));
      }, 3000);

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

  // Return all state and functions
  return {
    // Health
    health,
    
    // Users
    users,
    form,
    setForm,
    submitUser,
    
    // Dorms
    dorms,
    dormForm,
    setDormForm,
    submitDorm,
    
    // Rooms
    rooms,
    roomForm,
    setRoomForm,
    submitRoom,
    selectedDormForRooms,
    setSelectedDormForRooms,
    loadDormRooms,
    
    // Ratings
    userRatings,
    ratingMessages,
    setPendingRating,
    submitRating
  };
};
