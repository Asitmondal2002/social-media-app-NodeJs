import React, { useState } from 'react';

const SimplePostTest = () => {
  const [content, setContent] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult('Sending request...');

    try {
      const token = localStorage.getItem('token');
      
      // Create FormData
      const formData = new FormData();
      formData.append('content', content);
      
      // Log what we're sending
      console.log('Sending content:', content);
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }
      
      // Send request
      const response = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      const responseText = await response.text();
      
      setResult(`Status: ${response.status}\n\nResponse: ${responseText}`);
    } catch (error) {
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>Simple Post Test</h1>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="4"
            style={{ width: '100%', marginBottom: '10px' }}
            required
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{ padding: '10px 15px', background: '#4CAF50', color: 'white', border: 'none' }}
        >
          {loading ? 'Sending...' : 'Submit Post'}
        </button>
      </form>
      
      <div style={{ marginTop: '20px', whiteSpace: 'pre-wrap', border: '1px solid #ddd', padding: '10px' }}>
        {result}
      </div>
    </div>
  );
};

export default SimplePostTest; 