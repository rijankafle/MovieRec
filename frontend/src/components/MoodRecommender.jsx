import { useState, useEffect, useRef } from "react";
import { analyzeMoodAndGetMovies } from "../services/api";
import "../css/MoodRecommender.css";

/**
 * Component that allows users to get movie recommendations based on their mood/situation
 * using voice input or text
 *
 * @param {Object} props - Component props
 * @param {Function} props.onRecommendations - Function to display recommended movies
 * @returns {JSX.Element} Voice mood recommender interface
 */
function MoodRecommender({ onRecommendations }) {
  // State for voice recognition and mood analysis
  const [isListening, setIsListening] = useState(false);
  const [moodText, setMoodText] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);

  // Reference to the speech recognition object
  const recognitionRef = useRef(null);

  // Initialize speech recognition
  useEffect(() => {
    // Check if browser supports speech recognition
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      setIsSpeechSupported(false);
      setError(
        "Voice recognition is not supported in your browser. Try Chrome or Edge."
      );
      return;
    }

    try {
      // Create speech recognition object
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();

      // Configure speech recognition
      recognitionRef.current.continuous = false; // Changed to false to fix glitches
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      // Set up event handlers
      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");

        setMoodText(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setError(`Error: ${event.error}`);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        // Auto-process if we have text
        if (moodText.trim()) {
          getMoodRecommendations();
        }
      };
    } catch (error) {
      console.error("Error initializing speech recognition:", error);
      setIsSpeechSupported(false);
      setError(
        "Failed to initialize speech recognition. Please try typing instead."
      );
    }

    // Clean up on unmount
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.error("Error stopping speech recognition:", error);
        }
      }
    };
  }, []);

  /**
   * Toggle voice listening on/off
   */
  const toggleListening = () => {
    if (!isSpeechSupported) {
      setError(
        "Voice recognition is not supported in your browser. Try Chrome or Edge."
      );
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error("Error stopping speech recognition:", error);
      }
      setIsListening(false);
    } else {
      setError(null);
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        setError(
          "Failed to start speech recognition. Please try again or type your mood."
        );
      }
    }
  };

  /**
   * Process the mood text and get movie recommendations
   */
  const getMoodRecommendations = async () => {
    if (!moodText.trim()) {
      setError("Please describe your mood or situation first");
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Call the mood analysis API to get movie recommendations
      const recommendedMovies = await analyzeMoodAndGetMovies(moodText);

      // Call the callback with the recommended movies and a title
      onRecommendations(
        recommendedMovies,
        `Movies for your mood: "${truncate(moodText, 30)}"`
      );
    } catch (error) {
      console.error("Error getting mood recommendations:", error);
      setError("Failed to get recommendations. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  /**
   * Truncate text to a specific length
   *
   * @param {string} text - Text to truncate
   * @param {number} length - Maximum length
   * @returns {string} Truncated text
   */
  const truncate = (text, length) => {
    if (text.length <= length) return text;
    return text.substring(0, length) + "...";
  };

  return (
    <div className="mood-recommender">
      <h3>Movie Mood Finder</h3>
      <p className="mood-description">
        Tell me how you're feeling or what situation you're in, and I'll
        recommend movies for you.
      </p>

      <div className="mood-input-container">
        <textarea
          className="mood-input"
          value={moodText}
          onChange={(e) => setMoodText(e.target.value)}
          placeholder="Example: I'm feeling nostalgic and want something uplifting..."
          disabled={processing || isListening}
        />

        <div className="mood-controls">
          <button
            className={`voice-btn ${isListening ? "listening" : ""}`}
            onClick={toggleListening}
            disabled={processing || !isSpeechSupported}
            title={isListening ? "Stop listening" : "Start voice input"}
          >
            {isListening ? "🔴 Stop" : "🎤 Speak"}
          </button>

          <button
            className="recommend-mood-btn"
            onClick={getMoodRecommendations}
            disabled={processing || !moodText.trim() || isListening}
          >
            {processing ? "Finding movies..." : "Get Recommendations"}
          </button>
        </div>
      </div>

      {error && <p className="mood-error">{error}</p>}

      {isListening && (
        <div className="listening-indicator">
          Listening... speak about your mood or situation
        </div>
      )}

      {processing && (
        <div className="processing-indicator">
          Analyzing your mood and finding perfect movies...
        </div>
      )}
    </div>
  );
}

export default MoodRecommender;
