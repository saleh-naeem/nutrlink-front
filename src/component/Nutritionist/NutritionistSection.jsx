import { useState, useEffect, useContext, useRef } from "react";
import NutritionistCard from './NutritionistCard'
import './NutritionistSection.css'
import { Link } from 'react-router-dom'
import { AuthContext } from "../../AuthContext";

const NutritionistSection = ({
  data = [],
  isLoading,
  limit = 5,
  title = "Top Rated Experts",
  showViewAll,
  isRecommended = false
}) => {
  const { user, isLogin } = useContext(AuthContext);

  const scrollRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      const container = scrollRef.current
      const maxScroll = container.scrollWidth - container.clientWidth
      container.scrollTo({ left: maxScroll, behavior: 'smooth' })
    }
  }

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' })
    }
  }

  if (isLogin && user?.role === 'nutritionist') return null;
  if (isLoading) return <div className="loading-state">Loading experts...</div>


  return (
    <section className="nutritionist-section-wrapper">
      <div className="section-container">

        {canScrollLeft && (
          <button className="scroll-arrow-left" onClick={scrollLeft} aria-label="Scroll left">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}

        {data.length > 4 && (
          <button className="scroll-arrow-right" onClick={scrollRight} aria-label="Scroll right">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        )}

        <div className="section-header">
          <h2 className="section-title">{title}</h2>

          {showViewAll && ( // Only show if the prop is true
            <Link to='/nutritionists' style={{ textDecoration: 'none' }}>
              <button className="view-nutritionists-btn">
                View All Nutritionists
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </Link>
          )}
        </div>


        <div className="nutritionists-grid" ref={scrollRef} onScroll={handleScroll}>
          {data.length > 0 ? (
            data.slice(0, limit).map((n) => (
              <NutritionistCard key={n._id} nutritionist={n} isRecommended={isRecommended} />
            ))
          ) : (
            <div className="no-data-container">
              <p className="no-data-text">
                {isRecommended
                  ? "Set your goals in your profile to see personalized matches!"
                  : "No nutritionists found at the moment."}
              </p>
              {isRecommended && (
                <Link to="/Dashboard" className="empty-state-btn">
                  Update Profile Goals
                </Link>
              )}
            </div>
          )}
        </div>

      </div>
    </section >
  )
}

export default NutritionistSection