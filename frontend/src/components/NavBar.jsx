/**
 * Navigation component for the application
 *
 * Provides links to main pages and displays the app brand
 */
import { Link } from "react-router-dom";
import { useMovieContext } from "../context/MovieContext";
import "../css/Navbar.css";

function NavBar() {
  const { clearRecommendations } = useMovieContext();

  // Handle logo click to clear recommendations state
  const handleLogoClick = () => {
    clearRecommendations();
  };

  return (
    <nav className="navbar" aria-label="Main navigation">
      {/* App logo/name - now clears recommendations when clicked */}
      <div className="navbar-brand">
        <Link to="/" onClick={handleLogoClick} aria-label="MovieRec Home">
          MovieRec
        </Link>
      </div>

      {/* Navigation links */}
      <div className="navbar-links">
        <Link to="/" className="nav-link" onClick={handleLogoClick}>
          Home
        </Link>
        <Link to="/favorites" className="nav-link">
          Favorites
        </Link>
      </div>
    </nav>
  );
}

export default NavBar;
