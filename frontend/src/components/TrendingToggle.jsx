/**
 * Enhanced Trending Toggle Component
 *
 * A sleek toggle with improved animations and no outline issues
 */
import { useState, useEffect } from "react";
import "../css/TrendingToggle.css";

function TrendingToggle({ timeWindow, onToggle }) {
  // Animation state for the active indicator
  const [animating, setAnimating] = useState(false);

  // Handle the toggle with animation
  const handleToggle = () => {
    setAnimating(true);
    onToggle();
  };

  // Reset animation state after transition completes
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimating(false);
    }, 500); // Longer animation duration

    return () => clearTimeout(timer);
  }, [timeWindow]);

  return (
    <div className="trending-toggle-container">
      <div className="trending-label">Trending</div>

      <div className="toggle-wrapper">
        <div className={`toggle-options ${animating ? "animating" : ""}`}>
          {/* Today option */}
          <button
            className={`toggle-option ${timeWindow === "day" ? "active" : ""}`}
            onClick={() => timeWindow !== "day" && handleToggle()}
            aria-pressed={timeWindow === "day"}
          >
            <span className="option-text">Today</span>
          </button>

          {/* This Week option */}
          <button
            className={`toggle-option ${timeWindow === "week" ? "active" : ""}`}
            onClick={() => timeWindow !== "week" && handleToggle()}
            aria-pressed={timeWindow === "week"}
          >
            <span className="option-text">This Week</span>
          </button>

          {/* Animated active background */}
          <div
            className={`active-background ${
              timeWindow === "week" ? "right" : "left"
            }`}
            aria-hidden="true"
          >
            <div className="glow-effect"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrendingToggle;
