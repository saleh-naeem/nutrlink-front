import React, { useState } from 'react';
import './FilterBar.css';


const FilterBar = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    specialty: '',
    priceRange: '',
    experience: '',
    availability: '',
    sortBy: 'recommended'
  });

  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const specialties = [
    'All Specialties',
    'Weight Loss',
    'Sports Nutrition',
    'Diabetes Management',
    'Heart Health',
    'Vegan Nutrition',
    'Pregnancy Nutrition',
    'Clinical Nutrition'
  ];

  const priceRanges = [
    { label: 'Any Price', value: '' },
    { label: '$0 - $30', value: '0-30' },
    { label: '$30 - $50', value: '30-50' },
    { label: '$50 - $80', value: '50-80' },
    { label: '$80+', value: '80+' }
  ];

  const experienceLevels = [
    { label: 'Any Experience', value: '' },
    { label: '1-3 years', value: '1-3' },
    { label: '3-5 years', value: '3-5' },
    { label: '5-10 years', value: '5-10' },
    { label: '10+ years', value: '10+' }
  ];

  const availabilityOptions = [
    { label: 'Any Time', value: '' },
    { label: 'Morning', value: 'morning' },
    { label: 'Afternoon', value: 'afternoon' },
    { label: 'Evening', value: 'evening' },
    { label: 'Weekend', value: 'weekend' }
  ];

  const sortOptions = [
    { label: 'Recommended', value: 'recommended' },
    { label: 'Highest Rated', value: 'rating' },
    { label: 'Most Reviews', value: 'reviews' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // Call search handler if provided
  };

  const clearFilters = () => {
    const resetFilters = {
      specialty: '',
      priceRange: '',
      experience: '',
      availability: '',
      sortBy: 'recommended'
    };
    setFilters(resetFilters);
    setSearchQuery('');
    if (onFilterChange) {
      onFilterChange(resetFilters);
    }
  };

  const hasActiveFilters = 
    filters.specialty || 
    filters.priceRange || 
    filters.experience || 
    filters.availability || 
    filters.sortBy !== 'recommended';

  return (
    <div className="filter-bar">
      <div className="filter-bar-container">
        {/* Main Filters Row */}
        <div className="filters-row">
          {/* Specialty Filter */}
          <div className="filter-item">
            <label className="filter-label">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
              Specialty
            </label>
            <select
              className="filter-select"
              value={filters.specialty}
              onChange={(e) => handleFilterChange('specialty', e.target.value)}
            >
              {specialties.map((specialty) => (
                <option key={specialty} value={specialty === 'All Specialties' ? '' : specialty}>
                  {specialty}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="filter-item">
            <label className="filter-label">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              Price Range
            </label>
            <select
              className="filter-select"
              value={filters.priceRange}
              onChange={(e) => handleFilterChange('priceRange', e.target.value)}
            >
              {priceRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          {/* Experience Filter */}
          <div className="filter-item">
            <label className="filter-label">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"/>
              </svg>
              Experience
            </label>
            <select
              className="filter-select"
              value={filters.experience}
              onChange={(e) => handleFilterChange('experience', e.target.value)}
            >
              {experienceLevels.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          {/* Availability Filter */}
          <div className="filter-item">
            <label className="filter-label">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              Availability
            </label>
            <select
              className="filter-select"
              value={filters.availability}
              onChange={(e) => handleFilterChange('availability', e.target.value)}
            >
              {availabilityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Filter */}
          <div className="filter-item">
            <label className="filter-label">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="6" x2="16" y2="6"/>
                <line x1="4" y1="12" x2="13" y2="12"/>
                <line x1="4" y1="18" x2="10" y2="18"/>
              </svg>
              Sort By
            </label>
            <select
              className="filter-select"
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <button
            className="search-toggle-btn"
            onClick={() => setShowSearch(!showSearch)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
          </button>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button className="clear-filters-btn" onClick={clearFilters}>
              Clear All
            </button>
          )}
        </div>

        {/* Search Bar (Expandable) */}
        {showSearch && (
          <div className="search-bar-expanded">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search by name, specialty, or location..."
              value={searchQuery}
              onChange={handleSearch}
            />
            {searchQuery && (
              <button
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Active Filters Tags */}
        {hasActiveFilters && (
          <div className="active-filters">
            {filters.specialty && (
              <span className="filter-tag">
                {filters.specialty}
                <button onClick={() => handleFilterChange('specialty', '')}>×</button>
              </span>
            )}
            {filters.priceRange && (
              <span className="filter-tag">
                ${filters.priceRange.replace('-', ' - $')}
                <button onClick={() => handleFilterChange('priceRange', '')}>×</button>
              </span>
            )}
            {filters.experience && (
              <span className="filter-tag">
                {experienceLevels.find(e => e.value === filters.experience)?.label}
                <button onClick={() => handleFilterChange('experience', '')}>×</button>
              </span>
            )}
            {filters.availability && (
              <span className="filter-tag">
                {availabilityOptions.find(a => a.value === filters.availability)?.label}
                <button onClick={() => handleFilterChange('availability', '')}>×</button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
