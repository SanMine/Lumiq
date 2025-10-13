import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dorms from "./Dorms";
import RoomsDetail from "./Roomsdetail";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dorms />} />
        <Route path="/rooms/:id" element={<RoomsDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;