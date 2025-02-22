import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Define the interface for search results
interface SearchResult {
  id: string;
  name: string;
  avatar?: string;
}

const Search: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);

    try {
      const response = await axios.get<SearchResult[]>(`/api/search?query=${query}`);
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching search results:', error);
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
        <button type="submit" className="btn-primary">Search</button>
      </form>

      {loading && <p>Loading...</p>}

      <div className="search-results">
        {results.length > 0 ? (
          results.map((result) => (
            <div key={result.id} className="search-item" onClick={() => navigate(`/profile/${result.id}`)}>
              <img src={result.avatar || '/default-avatar.png'} alt={result.name} />
              <p>{result.name}</p>
            </div>
          ))
        ) : (
          !loading && query && <p>No results found.</p>
        )}
      </div>
    </div>
  );
};

export default Search;
