import React, { useState } from 'react';
import './FilterBar.css';

const FilterBar = ({ onFilterChange, filters }) => {
  const [showSearch, setShowSearch] = useState(false);
  // 🔴 REMOVED: const [searchQuery, setSearchQuery] = useState('');

  const specialties = [
    'All Specialties',
    'Weight Loss',
    'General Health',
    'Muscle Building',
    'Sports Nutrition',
    'Clinical Nutrition',
    'Diabetic Diet',
    'Pregnancy Nutrition',
    'Vegan Nutrition',
  ];

  const priceOptions = [
    { label: 'Any Price', value: '' },
    { label: 'Under $30', value: '30' },
    { label: 'Under $50', value: '50' },
    { label: 'Under $100', value: '100' },
  ];

  const experienceOptions = [
    { label: 'Any Experience', value: '' },
    { label: '1+ Year', value: '1' },
    { label: '3+ Years', value: '3' },
    { label: '5+ Years', value: '5' },
    { label: '10+ Years', value: '10' }
  ];

  const languageOptions = [
    { label: 'Any Language', value: '' },
    { label: 'Arabic', value: 'Arabic' },
    { label: 'English', value: 'English' },
    { label: 'Spanish', value: 'Spanish' },
    { label: 'Russian', value: 'Russian' },
    { label: 'Portuguese', value: 'Portuguese' }
  ];

  const handleFilterChange = (key, value) => {
    if (onFilterChange) {
      onFilterChange({ [key]: value });
    }
  };

  const handleSearch = (e) => {
    const val = e.target.value;
    // 🟢 CHANGED: Directly pass value to parent callback
    if (onFilterChange) onFilterChange({ search: val });
  };

  const clearFilters = () => {
    // 🔴 REMOVED: setSearchQuery('');
    if (onFilterChange) {
      onFilterChange({
        specialization: '',
        maxPrice: '',
        yearsOfExperience: '',
        languages: '',
        search: '',
      });
    }
  };

  // 🟢 CHANGED: Check the filters object directly for active search strings
  const hasActiveFilters =
    filters.specialization || filters.maxPrice ||
    filters.yearsOfExperience || filters.languages || filters.search;

  return (
    <div className="filter-bar">
      <div className="filter-bar-container">

        {/* Main Filters Row */}
        <div className="filters-row">

          {/* Specialty Filter */}
          <div className="filter-item">
            <label className="filter-label">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
              Specialty
            </label>
            <select
              className="filter-select"
              value={filters.specialization || ''}
              onChange={(e) => handleFilterChange('specialization', e.target.value)}
            >
              {specialties.map((s) => (
                <option key={s} value={s === 'All Specialties' ? '' : s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="filter-item">
            <label className="filter-label">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              Price Range
            </label>
            <select
              className="filter-select"
              value={filters.maxPrice || ''}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            >
              {priceOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Experience Filter */}
          <div className="filter-item">
            <label className="filter-label">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z" />
              </svg>
              Experience
            </label>
            <select
              className="filter-select"
              value={filters.yearsOfExperience || ''}
              onChange={(e) => handleFilterChange('yearsOfExperience', e.target.value)}
            >
              {experienceOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* languages Filter */}
          <div className="filter-item">
            <label className="filter-label">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Languages
            </label>
            <select
              className="filter-select"
              value={filters.languages || ''}
              onChange={(e) => handleFilterChange('languages', e.target.value)}
            >
              {languageOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <button
            className="search-toggle-btn"
            onClick={() => setShowSearch(!showSearch)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </button>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button className="clear-filters-btn" onClick={clearFilters}>Clear All</button>
          )}
        </div>

        {/* Search Bar (Expandable) */}
        {showSearch && (
          <div className="search-bar-expanded">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search by name, specialty, or location..."
              value={filters.search || ''} // 🟢 CHANGED: Bound directly to props
              onChange={handleSearch}
            />
            {filters.search && (
              <button
                className="clear-search-btn"
                onClick={() => {
                  // 🟢 CHANGED: Clear via the prop callback
                  onFilterChange({ search: '' })
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Active Filters Tags */}
        {hasActiveFilters && (
          <div className="active-filters">
            {filters.specialization && (
              <span className="filter-tag">
                {filters.specialization}
                <button onClick={() => handleFilterChange('specialization', '')}>×</button>
              </span>
            )}
            {filters.maxPrice && (
              <span className="filter-tag">
                Under ${filters.maxPrice}
                <button onClick={() => handleFilterChange('maxPrice', '')}>×</button>
              </span>
            )}
            {filters.yearsOfExperience && (
              <span className="filter-tag">
                {experienceOptions.find(e => e.value === filters.yearsOfExperience)?.label}
                <button onClick={() => handleFilterChange('yearsOfExperience', '')}>×</button>
              </span>
            )}
            {filters.languages && (
              <span className="filter-tag">
                {filters.languages}
                <button onClick={() => handleFilterChange('languages', '')}>×</button>
              </span>
            )}
            {/* 🟢 ADDED: Visual tag for the current search item */}
            {filters.search && (
              <span className="filter-tag">
                Search: "{filters.search}"
                <button onClick={() => handleFilterChange('search', '')}>×</button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;