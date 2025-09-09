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
    Electricity_fee: 0
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
        Electricity_fee: 0
      });
      const { data } = await api.get("/dorms");
      setDorms(data);
    } catch (error) {
      console.error("Failed to create dorm:", error);
      alert("Failed to create dorm. Please check the console for details.");
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
                    </div>
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
    </main>
  );
}