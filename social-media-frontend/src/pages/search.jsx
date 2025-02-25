import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);

    try {
      const response = await axios.get(`/api/search?query=${query}`);
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-container">
      <h2>Search</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for users or posts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="btn-primary">
          Search
        </button>
      </form>

      {loading && <p>Loading...</p>}

      <div className="search-results">
        {results.length > 0
          ? results.map((result) => (
              <div
                key={result.id}
                className="search-item"
                onClick={() => navigate(`/profile/${result.id}`)}
              >
                <img
                  src={result.avatar || "/default-avatar.png"}
                  alt={result.name}
                />
                <p>{result.name}</p>
              </div>
            ))
          : !loading && query && <p>No results found.</p>}
      </div>
    </div>
  );
};

export default Search;
