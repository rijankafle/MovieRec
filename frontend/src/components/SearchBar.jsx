function SearchBar({ value, onChange, isSearching }) {
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search for movies..."
        className="search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {isSearching && <div className="search-spinner">🔄</div>}
    </div>
  );
}

export default SearchBar; 