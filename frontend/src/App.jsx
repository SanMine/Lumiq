import { useEffect, useState } from "react";
import { api } from "./lib/api";
import Rooms from "./Rooms"
import Personality from "./Personality"
import "./App.css"

function App(){   
  const [currentView, setCurrentView] = useState('rooms');

  return (     
    <div>
      <nav style={{ 
        padding: '20px', 
        background: '#667eea', 
        marginBottom: '20px',
        display: 'flex',
        gap: '20px'
      }}>
        <button 
          onClick={() => setCurrentView('rooms')}
          style={{
            padding: '10px 20px',
            background: currentView === 'rooms' ? 'white' : 'transparent',
            color: currentView === 'rooms' ? '#667eea' : 'white',
            border: '2px solid white',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          🏠 Rooms
        </button>
        <button 
          onClick={() => setCurrentView('personality')}
          style={{
            padding: '10px 20px',
            background: currentView === 'personality' ? 'white' : 'transparent',
            color: currentView === 'personality' ? '#667eea' : 'white',
            border: '2px solid white',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          👥 Personalities
        </button>
      </nav>

      {currentView === 'rooms' && <Rooms/>}
      {currentView === 'personality' && <Personality/>}
    </div>   
  ); 
}

export default App;