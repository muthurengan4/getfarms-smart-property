frontend/src/components/App.js
import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [form, setForm] = useState({ location: '', budget: '', property_type: '' });
  const [results, setResults] = useState([]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post('https://your-backend-url.onrender.com/match-properties-ai', form);
    setResults(res.data);
  };

  return (
    <div className="p-6 max-w-screen-md mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-4">GetFarms - Smart Property Match</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
        <input name="location" placeholder="Location" className="border p-2 w-full" onChange={handleChange} required />
        <input name="budget" placeholder="Budget (₹)" type="number" className="border p-2 w-full" onChange={handleChange} required />
        <select name="property_type" className="border p-2 w-full" onChange={handleChange} required>
          <option value="">Select Type</option>
          <option value="Land">Land</option>
          <option value="House">House</option>
        </select>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Match</button>
      </form>
      <div className="mt-6 grid gap-4">
        {results.map(p => (
          <div key={p.id} className="border rounded p-4 shadow-md">
            <img src={p.image} alt={p.title} className="w-full h-48 object-cover rounded" />
            <h2 className="text-xl font-semibold mt-2">{p.title}</h2>
            <p className="text-sm text-gray-600">{p.location}</p>
            <p className="text-sm text-green-800 font-bold">₹{p.price.toLocaleString()}</p>
            <p className="text-sm mt-2">{p.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
