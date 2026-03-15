import { useState, useEffect } from 'react';
import { nutritionistChartData, nutritionistDashboardStats, getProfile } from "../api/nDashboard";
import Navbar from "../component/Navbar";
import './Ndashboard.css';

export const Ndashboard = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(null);
  
  // Mock data for appointments (replace with API later)
  const [todayAppointments] = useState([
    {
      id: 1,
      time: "10:00 AM - 11:00 AM",
      clientName: "Ahmad Ali",
      clientAvatar: "A",
      sessionType: "Keto Plan",
      status: "Booked"
    },
    {
      id: 2,
      time: "2:00 PM - 3:00 PM",
      clientName: "Sarah Johnson",
      clientAvatar: "S",
      sessionType: "Weight Loss",
      status: "Booked"
    },
    {
      id: 3,
      time: "4:30 PM - 5:30 PM",
      clientName: "Osama Khan",
      clientAvatar: "O",
      sessionType: "General Consult",
      status: "Booked"
    }
  ]);

  const [upcomingSessions] = useState([
    { date: "Mar 4, 9:00 AM", client: "Lina Chen", type: "Weight Loss" },
    { date: "Mar 4, 11:30 AM", client: "Qianna Khan", type: "Follow-up" },
    { date: "Mar 5, 2:00 PM", client: "Sarah Johnson", type: "Meal Plan" },
    { date: "Mar 6, 10:00 AM", client: "Ahmad Ali", type: "Keto Review" },
    { date: "Mar 9, 3:30 PM", client: "John Doe", type: "Consult" }
  ]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [profileData, statsData, chartDataRes] = await Promise.all([
        getProfile(),
        nutritionistDashboardStats(),
        nutritionistChartData()
      ]);
      
      setProfile(profileData);
      setStats(statsData);
      setChartData(chartDataRes);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartSession = (appointmentId) => {
    console.log("Starting session:", appointmentId);
    // Add your session start logic here
  };

  const handleCancelAppointment = (appointmentId) => {
    console.log("Cancelling appointment:", appointmentId);
    // Add your cancel logic here
  };

  if (loading) {
    return (
      <div className="ndashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  // Mock stats data (replace with API data when available)
  const statsDisplay = stats || {
    totalClients: 120,
    clientsGrowth: 15,
    avgRating: 4.8,
    totalReviews: 45,
    experience: 5,
    specialization: "Keto/Weight Loss",
    todaySessions: 3,
    nextSession: "10:00 AM"
  };

  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });

  return (
    <div className="ndashboard">
      <Navbar isLogin={true} onLogout={() => {/* Add logout logic */}} />
      
      <div className="ndashboard__container">
        {/* Header */}
        <div className="ndashboard__header">
          <div className="header-left">
            <p className="header-date">{currentDate}</p>
            <h1>Welcome, {profile?.user?.username || 'Nutritionist'}!</h1>
          </div>
          <div className="header-right">
            <div className="profile-badge">
              <div className="profile-badge__info">
                <p className="profile-badge__name">{profile?.user?.username || 'Sarah Miller'}</p>
                <p className="profile-badge__role">Registered Nutritionist</p>
              </div>
              <div className="profile-badge__avatar">
                {profile?.user?.username?.charAt(0).toUpperCase() || 'S'}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <p className="stat-label">Total Clients Served</p>
              <p className="stat-value">{statsDisplay.totalClients}</p>
              <p className="stat-subtext">+{statsDisplay.clientsGrowth}% this month</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <p className="stat-label">Average Rating</p>
              <p className="stat-value">{statsDisplay.avgRating} ⭐</p>
              <p className="stat-subtext">based on {statsDisplay.totalReviews} reviews</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🎓</div>
            <div className="stat-content">
              <p className="stat-label">Experience</p>
              <p className="stat-value">{statsDisplay.experience} Years</p>
              <p className="stat-subtext">{statsDisplay.specialization}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <p className="stat-label">Today's Agenda</p>
              <p className="stat-value">{statsDisplay.todaySessions} Sessions</p>
              <p className="stat-subtext">Next: {statsDisplay.nextSession}</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="ndashboard__grid">
          
          {/* Today's Schedule */}
          <div className="ndashboard__card schedule-card">
            <h2>Today's Schedule ({new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })})</h2>
            
            <div className="appointments-list">
              {todayAppointments.length > 0 ? (
                todayAppointments.map((appointment) => (
                  <div key={appointment.id} className="appointment-item">
                    <div className="appointment-time">
                      <p className="time-slot">{appointment.time}</p>
                      <span className={`status-badge status-badge--${appointment.status.toLowerCase()}`}>
                        {appointment.status}
                      </span>
                    </div>
                    
                    <div className="appointment-client">
                      <div className="client-avatar">
                        {appointment.clientAvatar}
                      </div>
                      <div className="client-info">
                        <p className="client-name">{appointment.clientName}</p>
                        <p className="session-type">{appointment.sessionType}</p>
                      </div>
                    </div>
                    
                    <div className="appointment-actions">
                      <button 
                        className="btn btn--primary"
                        onClick={() => handleStartSession(appointment.id)}
                      >
                        Start Session
                      </button>
                      <button 
                        className="btn btn--secondary"
                        onClick={() => handleCancelAppointment(appointment.id)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>📅 No appointments scheduled for today</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="ndashboard__right">
            
            {/* Monthly Performance Chart */}
            <div className="ndashboard__card chart-card">
              <h2>Monthly Performance: Completed Appointments (2026)</h2>
              
              <div className="chart-container">
                <div className="chart-bars">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => {
                    // Mock data - replace with actual chartData
                    const appointments = Math.floor(Math.random() * 20) + 5;
                    const clients = Math.floor(Math.random() * 15) + 5;
                    const maxValue = 25;
                    
                    return (
                      <div key={month} className="chart-bar-group">
                        <div className="chart-bars-wrapper">
                          <div 
                            className="chart-bar chart-bar--appointments"
                            style={{ height: `${(appointments / maxValue) * 100}%` }}
                            title={`${appointments} appointments`}
                          >
                            <span className="bar-label">{appointments}</span>
                          </div>
                          <div 
                            className="chart-bar chart-bar--clients"
                            style={{ height: `${(clients / maxValue) * 100}%` }}
                            title={`${clients} unique clients`}
                          >
                            <span className="bar-label">{clients}</span>
                          </div>
                        </div>
                        <p className="chart-month">{month}</p>
                      </div>
                    );
                  })}
                </div>
                
                <div className="chart-legend">
                  <div className="legend-item">
                    <span className="legend-color legend-color--appointments"></span>
                    <span>Appointments</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color legend-color--clients"></span>
                    <span>Unique Clients</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Sessions */}
            <div className="ndashboard__card upcoming-card">
              <h2>Upcoming Sessions (Next 5)</h2>
              <p className="upcoming-subtitle">Strictly starting strictly tomorrow (March 4, 2026)</p>
              
              <div className="upcoming-list">
                {upcomingSessions.map((session, index) => (
                  <div key={index} className="upcoming-item">
                    <span className="upcoming-date">{session.date}</span>
                    <span className="upcoming-client">{session.client}</span>
                    <span className="upcoming-type">{session.type}</span>
                  </div>
                ))}
              </div>
              
              <button className="btn btn--outline btn--full">
                View Full Schedule
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};