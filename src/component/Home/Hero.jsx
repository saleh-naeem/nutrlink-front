import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../AuthContext'; // Adjust path if your context is elsewhere
import Typewriter from 'typewriter-effect';
import CountUp from 'react-countup';

const typewriterOptions = {
  nutritionist: [
    'Managing your clients efficiently',
    'Creating professional meal plans',
    'Tracking patient health metrics',
    'Expanding your wellness practice'
  ],
  customer: [
    'Tracking your daily progress',
    'Achieving your weight goals',
    'Personalizing your diet plan',
    'Connecting with your expert'
  ],
  guest: [
    'Making your life better',
    'The Smart Bridge to Better Health',
    'Connecting you with experts',
    'Personalizing your diet',
    'Smart food tracking',
    'Evidence-Based Wellness Ecosystem'
  ]
}



const Hero = () => {
  const { user } = useContext(AuthContext);
  const isLogin = !!user;

  const getHeroContent = (user, isLogin) => {
    const role = user?.role?.toLowerCase();

    const displayName = user?.username
      ? user.username.charAt(0).toUpperCase() + user.username.slice(1)
      : "User";

    if (!isLogin) {
      return {
        title: <>Your Journey to <span className='text-green'>Better Health</span> Starts Here</>,
        description: "Connect with expert nutritionists, track your diet, and achieve your wellness goals with our AI-powered platform.",
        primaryBtn: { text: "Get Started", link: "/RegisterType" },
        secondaryBtn: { text: "Book Appointment", link: "/nutritionists" }
      };
    }

    if (role === 'nutritionist') {
      return {
        title: <>Empower Your <span className="text-green">Clinic</span> with AI</>,
        description: `Welcome back, Coach ${displayName}. Manage your patients, update diet plans, and check your schedule.`,
        primaryBtn: { text: "Go to Dashboard", link: "/Ndashboard" },
        secondaryBtn: { text: "View Appointments", link: "/appointments" }
      };
    }

    return {
      title: <>Welcome Back, <span className="text-green">{displayName}</span>!</>,
      description: "Ready to reach your weight goals today? Check your latest meal plan and track your progress.",
      primaryBtn: { text: "Go to Dashboard", link: "/Dashboard" },
      secondaryBtn: { text: "Find Nutritionists", link: "/nutritionists" }
    };
  };

  const content = getHeroContent(user, isLogin);

  const userRole = user?.role || 'guest'
  const activeStrings = typewriterOptions[userRole] || typewriterOptions.guest


  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-text">
          {/* Typetwriter AI Feed */}
          <div className="typewriter-container">
            <span className="typewriter-label"></span>
            <Typewriter
              options={{
                strings: activeStrings,
                autoStart: true,
                loop: true,
                deleteSpeed: 50,
                delay: 75,
                cursor: '_'
              }}
            />
          </div>

          <h1 className="hero-title"> {content.title} </h1>

          <p className="hero-description"> {content.description} </p>

          <div className="hero-buttons">
            {!isLogin ? (
              <>
                <Link to="/RegisterType"><button className="btn-primary">Get Started</button></Link>
                <Link to="/nutritionists"><button className="btn-secondary">Book Appointment</button></Link>
              </>
            ) : (
              <>
                <Link to={user?.role === 'nutritionist' ? '/Ndashboard' : '/Dashboard'}>
                  <button className="btn-primary">Go to Dashboard</button>
                </Link>
                <Link to="/nutritionists"><button className="btn-secondary">Find Nutritionists</button></Link>
              </>
            )}
          </div>

          <div className="stats-container">
            <div className="stat-item">
              <h3><CountUp className='stat-number' end={10} duration={3} />K+</h3>
              <p className='stat-label'>Happy Clients</p>
            </div>
            <div className="stat-item">
              <h3><CountUp className='stat-number' end={500} duration={3} />+</h3>
              <p className='stat-label'>Nutritionists</p>
            </div>
            <div className="stat-item">
              <h3><CountUp className='stat-number' end={95} duration={3} />%</h3>
              <p className="stat-label">Success Rate</p>
            </div>
          </div>
        </div>

        <div className="hero-image">
          <img
            src="https://img.freepik.com/premium-photo/laptop-desk-nutritionists-office-with-healthy-food-displays_1170794-294316.jpg"
            alt="Healthy Food"
            className="food-image"
          />
        </div>
      </div>
    </section>
  )
}

export default Hero