import React, { useState } from 'react';

export default function SearchBar({ onSearch, loading }) {
  const [loc, setLoc] = useState('');
  const submit = e => {
    e.preventDefault();
    if (loc.trim()) onSearch(loc.trim());
  };
  return (
    <form onSubmit={submit} className="searchbar">
      <input value={loc} onChange={e => setLoc(e.target.value)} placeholder="Enter location (city, state, country)" />
      <button disabled={loading} className='btn'>{loading ? 'Searching...' : 'Search'}</button>
    </form>
  );
}
