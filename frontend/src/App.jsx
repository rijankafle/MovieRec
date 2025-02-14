import { useState } from "react";
import reactLogo from "./assets/react.svg";
import Favorites from "./pages/Favorites";
import viteLogo from "/vite.svg";
import "./css/App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar";
import { MovieProvider } from "./context/MovieContext";

import Home from "./pages/Home";

function App() {
  return (
    <MovieProvider>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </main>
    </MovieProvider>
  );
}

export default App;
