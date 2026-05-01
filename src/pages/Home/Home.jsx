import React, { useState, useContext, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import './Home.css';
import Navbar from '../../component/Navigationbar/Navbar';
import NutritionistSection from '../../component/Home/NutritionistSection';
import { Aibot } from '../../component/Aibot/Aibot';
import HomeSchedule from '../../component/Home/HomeSchedule';
import { getFilteredCards, getRecommendedExperts } from '../../api/nutritionist'
import Hero from '../../component/Home/Hero'

import { AuthContext } from '../../AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { user, handleLogout } = useContext(AuthContext);
  const isLogin = !!user;

  const [nutritionists, setNutritionists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recommended, setRecommended] = useState([])
  const [recLoading, setRecLoading] = useState(false)

  useEffect(() => {
    const loadHomeData = async () => {
      const shouldFetchRecs = isLogin && user?.role === 'customer';

      try {
        if (nutritionists.length === 0) {
          setLoading(true);
          const cardsResponse = await getFilteredCards();
          setNutritionists(cardsResponse.cards || []);
          setLoading(false);
        }

        if (shouldFetchRecs && recommended.length === 0) {
          setRecLoading(true);
          const recsResponse = await getRecommendedExperts();
          setRecommended(recsResponse || []);
          setRecLoading(false);
        } else if (!isLogin) {
          setRecommended([]);
        }

      } catch (err) {
        console.error('Data Fetch Error:', err);
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
        setRecLoading(false);
      }
    };

    loadHomeData();
  }, [isLogin, user?.role]);

  const onLogoutClick = () => {
    handleLogout();
    navigate("/Home");
  };

  const handleCtaClick = () => navigate("/RegisterType");

  return (
    <div className="home-page">
      <Navbar />

      <Aibot />

      <Hero />

      <HomeSchedule />

      {error ? (
        <div className="error-message">{error}</div>
      ) : (
        <NutritionistSection
          data={nutritionists}
          isLoading={loading}
          limit={10}
          title="Top Rated Experts"
          showViewAll={true}
        />
      )}

      {isLogin && user?.role === 'customer' && (
        <NutritionistSection
          data={recommended}
          isLoading={recLoading}
          limit={10}
          title="Recommended For Your Goals ✨"
          isRecommended={true}
        />
      )}

      

<section className="features-section">
        <div className="features-header">
          <span className="features-badge">Why Choose Nutrilink</span>
          <h2 className="section-title">Everything You Need for a Healthier Life</h2>
          <p className="section-subtitle">Comprehensive tools and expert support at your fingertips</p>
        </div>
        <div className="features-grid">
          <div className="feature-card" data-aos="fade-up" data-aos-delay="0">
            <div className="feature-icon-wrapper green">
              <div className="feature-icon-circle green">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
              </div>
              <div className="feature-glow green"></div>
            </div>
            <h3 className="feature-title">Expert Nutritionists</h3>
            <p className="feature-description">Connect with certified professionals tailored to your unique health needs and goals</p>
            <Link to="/nutritionists" className="feature-link">
              Find an Expert
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
          <div className="feature-card" data-aos="fade-up" data-aos-delay="100">
            <div className="feature-icon-wrapper blue">
              <div className="feature-icon-circle blue">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" /></svg>
              </div>
              <div className="feature-glow blue"></div>
            </div>
            <h3 className="feature-title">Personalized Meal Plans</h3>
            <p className="feature-description">Custom meal plans designed for your specific goals, preferences, and dietary requirements</p>
            <Link to="/calculator" className="feature-link">
              Get Started
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
          <div className="feature-card" data-aos="fade-up" data-aos-delay="200">
            <div className="feature-icon-wrapper purple">
              <div className="feature-icon-circle purple">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" /></svg>
              </div>
              <div className="feature-glow purple"></div>
            </div>
            <h3 className="feature-title">Progress Analytics</h3>
            <p className="feature-description">Track your journey with detailed charts, milestones, and personalized insights</p>
            <Link to="/dashboard" className="feature-link">
              View Progress
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
          <div className="feature-card" data-aos="fade-up" data-aos-delay="300">
            <div className="feature-icon-wrapper orange">
              <div className="feature-icon-circle orange">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" /><circle cx="7.5" cy="14.5" r="1.5" /><circle cx="12" cy="12" r="1" /><circle cx="16.5" cy="16.5" r="1.5" /></svg>
              </div>
              <div className="feature-glow orange"></div>
            </div>
            <h3 className="feature-title">AI Health Assistant</h3>
            <p className="feature-description">Get instant, intelligent answers to your nutrition questions anytime</p>
            <button className="feature-link" onClick={() => document.querySelector('.aibot-container')?.scrollIntoView({ behavior: 'smooth' })}>
              Try AI Helper
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
        <div className="features-cta">
          <button className="features-cta-button" onClick={handleCtaClick}>
            Get Started for Free
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
</div>
      </section>

      {!isLogin && (
        <section className="testimonials-section">
          <div className="testimonials-container">
            <div className="testimonials-header">
              <span className="testimonials-badge">Success Stories</span>
              <h2 className="testimonials-title">What Our Users Say</h2>
              <p className="testimonials-subtitle">Real experiences from people who transformed their health with Nutrilink</p>
            </div>
            <div className="testimonials-grid">
              <div className="testimonial-card">
                <div className="testimonial-rating">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                </div>
                <p className="testimonial-text">"Lost 20 pounds in 3 months! The personalized meal plans made all the difference. My nutritionist was supportive every step of the way."</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">SM</div>
                  <div className="testimonial-info">
                    <h4 className="testimonial-name">Sarah M.</h4>
                    <span className="testimonial-role">Customer</span>
                  </div>
                </div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-rating">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                </div>
                <p className="testimonial-text">"The AI assistant answered my late-night questions instantly. Finally, a platform that fits my busy schedule!"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">JK</div>
                  <div className="testimonial-info">
                    <h4 className="testimonial-name">James K.</h4>
                    <span className="testimonial-role">Customer</span>
                  </div>
                </div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-rating">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                </div>
                <p className="testimonial-text">"As a nutritionist, this platform helped me grow my client base significantly. The tools are intuitive and professional."</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">EP</div>
                  <div className="testimonial-info">
                    <h4 className="testimonial-name">Dr. Elena P.</h4>
                    <span className="testimonial-role">Nutritionist</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {!isLogin && (
        <section className="cta-section">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Transform Your Health?</h2>
            <button className="cta-button" onClick={handleCtaClick}>Start Your Journey Today</button>
          </div>
        </section>
      )}

<footer className="footer">
        <div className="footer-wave">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="footer-wave-fill"></path>
          </svg>
        </div>
        <div className="footer-main">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="5" y="5" width="3" height="14" rx="1.5" fill="#00c853"/>
                  <path d="M8 7L16 17" stroke="#00c853" strokeWidth="3.5" strokeLinecap="round"/>
                  <rect x="16" y="5" width="3" height="14" rx="1.5" fill="#00c853"/>
                </svg>
                <span className="footer-logo-text">Nutrilink</span>
              </div>
              <p className="footer-description">Your personal health companion. Connect with expert nutritionists, track your progress, and achieve your wellness goals with AI-powered guidance.</p>
              <div className="footer-social">
                <a href="#" className="social-link" aria-label="Facebook">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.437H7.358v-3.451h3.837V9.785c0-3.819 2.27-5.935 5.456-5.935 1.309 0 2.59.102 2.59.102v2.842h-1.455c-1.433 0-1.877.892-1.877 1.812v2.22h3.328l-.532 3.452h-2.796v8.437C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" className="social-link" aria-label="Twitter">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.955-3.127 1.117a4.92 4.92 0 00-8.384 4.482C7.569 18.115 5.25 16.268 5.25 11.691c0-.377.027-.747.082-1.113a4.893 4.893 0 01-.076-.94c.627-.828 1.154-1.885 1.572-3.017a5.034 5.034 0 01-.296-.728c-.065-.29-.058-.597-.028-.914a4.887 4.887 0 001.764-2.39 4.937 4.937 0 01-.097-.516c-.275-.906-.852-1.635-1.62-2.27a4.901 4.901 0 002.037-3.767h-.002A4.944 4.944 0 003.56 4.105a4.912 4.912 0 001.703-2.635 4.923 4.923 0 01-.238-1.617c0-.907.155-1.78.465-2.609A13.016 13.016 0 012.19 2.524a4.952 4.952 0 001.703 3.206A4.926 4.926 0 013.81 8.55a4.922 4.922 0 01-1.906.085 4.935 4.935 0 004.6 3.426 9.897 9.897 0 01-6.107 2.014c-.13-.007-.26-.014-.391-.022a4.962 4.962 0 004.328 3.02 9.813 9.813 0 01-4.826 1.984 9.686 9.686 0 01-.002-5.856z"/></svg>
                </a>
                <a href="#" className="social-link" aria-label="Instagram">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="#" className="social-link" aria-label="LinkedIn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              </div>
            </div>
            <div className="footer-links-section">
              <h4 className="footer-heading">Quick Links</h4>
              <ul className="footer-links-list">
                <li><Link to="/nutritionists">Find Nutritionists</Link></li>
                <li><Link to="/calculator">BMI Calculator</Link></li>
                <li><Link to="/registerType">Create Account</Link></li>
                <li><Link to="/login">Sign In</Link></li>
              </ul>
            </div>
            <div className="footer-links-section">
              <h4 className="footer-heading">Services</h4>
              <ul className="footer-links-list">
                <li><Link to="/nutritionists">Nutritionist Consultation</Link></li>
                <li><Link to="/calculator">Meal Planning</Link></li>
                <li><Link to="/dashboard">Progress Tracking</Link></li>
                <li><Link to="/chat">AI Assistant</Link></li>
              </ul>
            </div>
            <div className="footer-links-section">
              <h4 className="footer-heading">Contact</h4>
              <ul className="footer-links-list contact-list">
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  <span>support@nutrilink.com</span>
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  <span>+1 (555) 123-4567</span>
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <span>Mon - Fri: 9AM - 6PM</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">&copy; {new Date().getFullYear()} Nutrilink. All rights reserved.</p>
            <div className="footer-legal">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/cookies">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;