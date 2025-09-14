import React, { useState, useEffect } from 'react';

const Personality = () => {
  const [users, setUsers] = useState([]);
  const [personalities, setPersonalities] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userPersonality, setUserPersonality] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all users on component mount
  useEffect(() => {
    fetchUsers();
    fetchAllPersonalities();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllPersonalities = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/personalities');
      const data = await response.json();
      setPersonalities(data);
    } catch (err) {
      console.error('Error fetching personalities:', err);
    }
  };

  const fetchUserPersonality = async (userId) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/api/personalities?userId=${userId}`);
      
      if (response.status === 404) {
        setUserPersonality(null);
        setError('No personality profile found for this user');
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch personality');
      }
      
      const data = await response.json();
      setUserPersonality(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch user personality');
      setUserPersonality(null);
      console.error('Error fetching user personality:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setUserPersonality(null);
    setError('');
    if (user) {
      fetchUserPersonality(user.id);
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper function to check if user has personality
  const hasPersonality = (userId) => {
    return personalities.some(p => p.userId === userId);
  };

  const PersonalityDetailModal = ({ personality, onClose }) => {
    if (!personality) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-[#1b263b] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-600">
            <div>
              <h2 className="text-2xl font-bold text-white">🎭 Personality Profile</h2>
              <p className="text-lime-400 text-lg font-semibold">"{personality.nickname}"</p>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl font-bold"
            >
              ×
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Basic Info */}
              <div className="bg-[#0d1b2a] rounded-xl p-4">
                <h3 className="text-lime-400 font-semibold mb-3 flex items-center">
                  📝 Basic Info
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Age:</span>
                    <span className="text-white font-medium">{personality.age}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Gender:</span>
                    <span className="text-white font-medium">{personality.gender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">MBTI:</span>
                    <span className="bg-lime-400 text-black px-2 py-1 rounded-full text-xs font-bold">
                      {personality.MBTI}
                    </span>
                  </div>
                </div>
              </div>

              {/* Living Preferences */}
              <div className="bg-[#0d1b2a] rounded-xl p-4">
                <h3 className="text-lime-400 font-semibold mb-3 flex items-center">
                  🏠 Living Preferences
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Sleep Type:</span>
                    <span className="text-white font-medium">{personality.sleep_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Study Habits:</span>
                    <span className="text-white font-medium">{personality.study_habits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Cleanliness:</span>
                    <span className="text-white font-medium">{personality.cleanliness}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Social Level:</span>
                    <span className="text-white font-medium">{personality.social}</span>
                  </div>
                </div>
              </div>

              {/* Lifestyle */}
              <div className="bg-[#0d1b2a] rounded-xl p-4">
                <h3 className="text-lime-400 font-semibold mb-3 flex items-center">
                  🎉 Lifestyle
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Going Out:</span>
                    <span className="text-white font-medium">{personality.going_out}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Drinking:</span>
                    <span className="text-white font-medium">{personality.drinking}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Smoking:</span>
                    <span className="text-white font-medium">{personality.smoking ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Pets:</span>
                    <span className="text-white font-medium">{personality.pets}</span>
                  </div>
                </div>
              </div>

              {/* Environment */}
              <div className="bg-[#0d1b2a] rounded-xl p-4">
                <h3 className="text-lime-400 font-semibold mb-3 flex items-center">
                  🌡️ Environment
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Noise Tolerance:</span>
                    <span className="text-white font-medium">{personality.noise_tolerance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Temperature:</span>
                    <span className="text-white font-medium">{personality.temperature}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              {personality.description && (
                <div className="bg-[#0d1b2a] rounded-xl p-4 md:col-span-2">
                  <h3 className="text-lime-400 font-semibold mb-3 flex items-center">
                    💭 Description
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{personality.description}</p>
                </div>
              )}

              {/* Contact */}
              {personality.contact && (
                <div className="bg-[#0d1b2a] rounded-xl p-4">
                  <h3 className="text-lime-400 font-semibold mb-3 flex items-center">
                    📞 Contact
                  </h3>
                  <p className="text-white font-medium">{personality.contact}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0d1b2a] text-white p-6">
      {/* Top bar - matching Rooms.jsx style */}
      <header className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-pink-500 font-bold text-2xl">Lumiq</h1>
          <img
            src="https://via.placeholder.com/40"
            alt="profile"
            className="w-10 h-10 rounded-full"
          />
        </div>
        <nav className="flex space-x-6">
          <button className="text-gray-300 hover:text-white">Dorms</button>
          <button className="text-white border-b-2 border-lime-400">Users & Personalities</button>
        </nav>
      </header>

      {/* Search - matching Rooms.jsx style */}
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-2/3 px-4 py-3 rounded-full bg-[#1b263b] focus:outline-none text-gray-300"
        />
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#1b263b] rounded-xl p-4 text-center">
          <h3 className="text-2xl font-bold text-lime-400">{users.length}</h3>
          <p className="text-gray-400">Total Users</p>
        </div>
        <div className="bg-[#1b263b] rounded-xl p-4 text-center">
          <h3 className="text-2xl font-bold text-pink-500">{personalities.length}</h3>
          <p className="text-gray-400">Personalities</p>
        </div>
        <div className="bg-[#1b263b] rounded-xl p-4 text-center">
          <h3 className="text-2xl font-bold text-blue-400">
            {users.length > 0 ? Math.round((personalities.length / users.length) * 100) : 0}%
          </h3>
          <p className="text-gray-400">Profile Complete</p>
        </div>
      </div>

      {/* User cards - matching Rooms.jsx grid style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && filteredUsers.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 py-8">
            Loading users...
          </div>
        ) : filteredUsers.length === 0 && users.length > 0 ? (
          <div className="col-span-full text-center text-gray-400 py-8">
            No users found matching your search.
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 py-8">
            <p className="mb-4">No users found. Create some users first!</p>
            <button 
              onClick={fetchUsers}
              className="bg-lime-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-lime-500 transition-colors"
            >
              🔄 Refresh Users
            </button>
          </div>
        ) : (
          filteredUsers.map((user) => {
            const userHasPersonality = hasPersonality(user.id);
            const userPersonalityData = personalities.find(p => p.userId === user.id);
            
            return (
              <div
                key={user.id}
                className="bg-[#1b263b] rounded-2xl shadow-lg overflow-hidden relative cursor-pointer hover:bg-[#1e2a3f] transition-colors"
                onClick={() => handleUserSelect(user)}
              >
                {/* User Avatar */}
                <div className="bg-gradient-to-br from-pink-500 to-lime-400 h-32 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-800">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Personality badge */}
                {userHasPersonality && (
                  <div className="absolute top-2 right-2 bg-lime-400 text-black text-xs font-semibold px-2 py-1 rounded-full shadow">
                    ✅ Has Profile
                  </div>
                )}

                {/* Role badge */}
                <div className="absolute top-2 left-2 bg-pink-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow capitalize">
                  {user.role}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h2 className="text-lg font-semibold">{user.name}</h2>
                  <p className="text-sm text-gray-400">{user.email}</p>
                  <p className="text-xs text-gray-500 mt-1">ID: {user.id}</p>
                  
                  {/* Personality preview */}
                  {userPersonalityData ? (
                    <div className="mt-3 space-y-1">
                      <p className="text-xs text-lime-400 font-medium">
                        "{userPersonalityData.nickname}" • {userPersonalityData.age} years
                      </p>
                      <p className="text-xs text-gray-400">
                        {userPersonalityData.MBTI} • {userPersonalityData.gender}
                      </p>
                    </div>
                  ) : (
                    <p className="mt-3 text-xs text-gray-500 italic">
                      No personality profile
                    </p>
                  )}
                  
                  <button 
                    className="mt-4 w-full bg-[#0d1b2a] text-white py-2 rounded-lg hover:bg-black transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (userPersonalityData) {
                        setUserPersonality(userPersonalityData);
                      } else {
                        handleUserSelect(user);
                      }
                    }}
                  >
                    {userHasPersonality ? 'View Profile' : 'No Profile'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Personality Detail Modal */}
      {userPersonality && (
        <PersonalityDetailModal 
          personality={userPersonality} 
          onClose={() => setUserPersonality(null)} 
        />
      )}

      {/* Error message */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
          {error}
          <button 
            className="ml-2 text-red-200 hover:text-white"
            onClick={() => setError('')}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default Personality;
