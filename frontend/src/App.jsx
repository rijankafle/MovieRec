/**
 * Main App component with error boundary integration
 */
import { Routes, Route } from "react-router-dom";
import "./css/App.css";

// Page components
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";

// Shared components
import Navbar from "./components/NavBar";
import ErrorBoundary from "./components/ErrorBoundary";

// Context providers
import { MovieProvider } from "./context/MovieContext";

function App() {
  return (
    <MovieProvider>
      <Navbar />
      <ErrorBoundary>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
        </main>
      </ErrorBoundary>
    </MovieProvider>
  );
}

export default App;
