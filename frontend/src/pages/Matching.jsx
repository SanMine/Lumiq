import { useState, useEffect } from 'react';
import axios from 'axios';
import './Matching.css';

const API_URL = 'http://localhost:3001/api';

function Matching() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [matches, setMatches] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const [minMatch, setMinMatch] = useState(0);

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      setUsers(response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      setToken(response.data.token);
      setSelectedUserId(response.data.user.id.toString());
      return true;
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed');
      return false;
    }
  };

  const findMatches = async () => {
    if (!selectedUserId) {
      setError('Please select a user');
      return;
    }

    if (!token) {
      setError('Please login first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Find matches
      const matchResponse = await axios.post(
        `${API_URL}/matching/find-roommates/${selectedUserId}?minMatch=${minMatch}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMatches(matchResponse.data.matches || []);

      // Get statistics
      const statsResponse = await axios.get(
        `${API_URL}/matching/stats/${selectedUserId}?minMatch=60`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStats(statsResponse.data.stats);
    } catch (err) {
      console.error('Error finding matches:', err);
      setError(err.response?.data?.error || 'Failed to find matches');
    } finally {
      setLoading(false);
    }
  };

  const getMatchColor = (percentage) => {
    if (percentage >= 80) return '#10b981'; // Green
    if (percentage >= 60) return '#f59e0b'; // Yellow
    if (percentage >= 40) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  const getMatchLabel = (percentage) => {
    if (percentage >= 80) return 'Excellent Match';
    if (percentage >= 60) return 'Good Match';
    if (percentage >= 40) return 'Fair Match';
    return 'Poor Match';
  };

  const quickLogin = async (userEmail, password) => {
    const success = await handleLogin(userEmail, password);
    if (success) {
      setTimeout(() => findMatches(), 500);
    }
  };

  const selectedUser = users.find((u) => u._id === parseInt(selectedUserId));

  return (
    <div className="matching-container">
      <h1>🤖 AI Roommate Matching</h1>
      <p className="subtitle">Find your perfect roommate using AI-powered compatibility analysis</p>

      {/* Quick Login Section */}
      <div className="quick-login-section">
        <h3>Quick Login</h3>
        <div className="quick-login-buttons">
          <button
            onClick={() => quickLogin('alice.chen@lumiq.edu', 'Password123!')}
            className="quick-login-btn"
          >
            Login as Alice
          </button>
          <button
            onClick={() => quickLogin('bob.smith@lumiq.edu', 'SecurePass456!')}
            className="quick-login-btn"
          >
            Login as Bob
          </button>
          <button
            onClick={() => quickLogin('carol.johnson@lumiq.edu', 'MyPassword789!')}
            className="quick-login-btn"
          >
            Login as Carol
          </button>
        </div>
      </div>

      {/* User Selection */}
      <div className="selection-card">
        <h2>Select User</h2>
        <select
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          className="user-select"
        >
          <option value="">-- Select a user --</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name} ({user.email}) - {user.role}
            </option>
          ))}
        </select>

        {selectedUser && (
          <div className="selected-user-info">
            <p>
              <strong>Selected:</strong> {selectedUser.name}
            </p>
            <p>
              <strong>Email:</strong> {selectedUser.email}
            </p>
            <p>
              <strong>Role:</strong> {selectedUser.role}
            </p>
          </div>
        )}

        <div className="filter-section">
          <label>
            Minimum Match Percentage: {minMatch}%
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={minMatch}
              onChange={(e) => setMinMatch(parseInt(e.target.value))}
              className="slider"
            />
          </label>
        </div>

        <button onClick={findMatches} disabled={loading || !token} className="find-btn">
          {loading ? '🔄 Finding Matches...' : '🔍 Find Compatible Roommates'}
        </button>

        {!token && <p className="warning">⚠️ Please login using quick login buttons above</p>}
      </div>

      {error && (
        <div className="error-card">
          <p>❌ {error}</p>
        </div>
      )}

      {/* Statistics */}
      {stats && (
        <div className="stats-card">
          <h2>📊 Matching Statistics</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">{stats.totalCandidates}</div>
              <div className="stat-label">Total Candidates</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{stats.goodMatches}</div>
              <div className="stat-label">Good Matches (≥60%)</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{stats.averageMatchPercentage}%</div>
              <div className="stat-label">Average Score</div>
            </div>
          </div>

          <div className="distribution">
            <h3>Match Distribution</h3>
            <div className="distribution-bars">
              <div className="dist-item">
                <span>🟢 Excellent (80-100%)</span>
                <div className="bar-container">
                  <div
                    className="bar excellent"
                    style={{
                      width: `${
                        (stats.matchDistribution.excellent / stats.totalCandidates) * 100
                      }%`,
                    }}
                  ></div>
                  <span className="bar-label">{stats.matchDistribution.excellent}</span>
                </div>
              </div>
              <div className="dist-item">
                <span>🟡 Good (60-79%)</span>
                <div className="bar-container">
                  <div
                    className="bar good"
                    style={{
                      width: `${(stats.matchDistribution.good / stats.totalCandidates) * 100}%`,
                    }}
                  ></div>
                  <span className="bar-label">{stats.matchDistribution.good}</span>
                </div>
              </div>
              <div className="dist-item">
                <span>🟠 Fair (40-59%)</span>
                <div className="bar-container">
                  <div
                    className="bar fair"
                    style={{
                      width: `${(stats.matchDistribution.fair / stats.totalCandidates) * 100}%`,
                    }}
                  ></div>
                  <span className="bar-label">{stats.matchDistribution.fair}</span>
                </div>
              </div>
              <div className="dist-item">
                <span>🔴 Poor (0-39%)</span>
                <div className="bar-container">
                  <div
                    className="bar poor"
                    style={{
                      width: `${(stats.matchDistribution.poor / stats.totalCandidates) * 100}%`,
                    }}
                  ></div>
                  <span className="bar-label">{stats.matchDistribution.poor}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Matches List */}
      {matches.length > 0 && (
        <div className="matches-section">
          <h2>🎯 Compatible Roommates ({matches.length})</h2>
          <div className="matches-grid">
            {matches.map((match, index) => (
              <div key={match.candidateId} className="match-card">
                <div className="match-header">
                  <div className="match-rank">#{index + 1}</div>
                  <h3>{match.candidateName}</h3>
                  <div
                    className="match-score"
                    style={{ backgroundColor: getMatchColor(match.matchPercentage) }}
                  >
                    {match.matchPercentage}%
                  </div>
                </div>

                <div className="match-label" style={{ color: getMatchColor(match.matchPercentage) }}>
                  {getMatchLabel(match.matchPercentage)}
                </div>

                <div className="compatibility-details">
                  <div className="compat-item">
                    <strong>🧠 Personality:</strong>
                    <p>{match.compatibility.personalityMatch}</p>
                  </div>

                  <div className="compat-item">
                    <strong>🏠 Lifestyle:</strong>
                    <p>{match.compatibility.lifestyleMatch}</p>
                  </div>

                  <div className="compat-item">
                    <strong>⭐ Preferences:</strong>
                    <p>{match.compatibility.preferenceMatch}</p>
                  </div>

                  <div className="compat-item overall">
                    <strong>📝 Overall:</strong>
                    <p>{match.compatibility.overallReason}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {matches.length === 0 && !loading && !error && selectedUserId && token && (
        <div className="no-results">
          <p>🔍 Click "Find Compatible Roommates" to see matches</p>
        </div>
      )}
    </div>
  );
}

export default Matching;
