import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dorms from "./Dorms";
import RoomsDetail from "./Roomsdetail";
import "./App.css";
import { JSX } from "react";

// No props, so no types needed here
function App(): JSX.Element {
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
