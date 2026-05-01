import { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../AuthContext";
import { getCustomerAppointments, getNutritionistSchedule } from '../../api/appointmetapi';
import { accessConversation } from '../../api/chatapi'; // FIX: Imported the chat API
import { isSessionLive } from '../../utils/isSessionLive';
import JoinCallButton from "../Joincallbutton";
import './HomeSchedule.css'

const HomeSchedule = () => {
  const { user, isLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [isLive, setIsLive] = useState(false);

  const closeModal = () => {
    setSelectedAppt(null);
    setIsLive(false);
  };

  // Check if the selected appointment session is live
  useEffect(() => {
    if (!selectedAppt) return;

    const checkIsLive = () => {
      const live = isSessionLive(selectedAppt.date, selectedAppt.timeSlot);
      setIsLive(live);
    };

    checkIsLive();
    const interval = setInterval(checkIsLive, 3000);

    return () => clearInterval(interval);
  }, [selectedAppt]);

  const handleJoinSession = () => {
    if (selectedAppt && isLive) {
      navigate(`/video-call/${selectedAppt._id}`);
    }
  };

  const formatName = (u) => {
    if (!u?.username) return "User";
    return u.username.charAt(0).toUpperCase() + u.username.slice(1);
  };

  useEffect(() => {
    const fetchMyData = async () => {
      if (!isLogin || !user) return;

      try {
        setLoading(true);
        let res;

        if (user.role === 'nutritionist') {
          res = await getNutritionistSchedule();
        } else {
          res = await getCustomerAppointments();
        }

        const allFetched = res?.appointments || res?.schedule || [];

        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const upcoming = allFetched.filter(app => {
          const appointmentDate = new Date(app.date);
          const isTodayOrFuture = appointmentDate >= now;
          const isActuallyBooked = app.status === 'booked';

          return isTodayOrFuture && isActuallyBooked;
        });

        const sorted = upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));

        setAppointments(sorted.slice(0, 3));

      } catch (error) {
        console.error('Error loading home schedule:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyData();
  }, [isLogin, user]);

  useEffect(() => {
    if (!selectedAppt) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedAppt]);

  if (!isLogin) return null;

  // FIX: Function now accepts the specific user ID when clicked
  const handleMessageClick = async (targetUserId) => {
    if (!targetUserId) return;
    try {
      const chatData = await accessConversation(targetUserId);
      navigate('/chat', { state: { incomingChat: chatData } });
    } catch (err) {
      console.error('Error accessing chat:', err);
    }
  };

  return (
    <div className="home-schedule">
      <div className="schedule-list-side">
        <h2>Your Upcoming Sessions</h2>
        {loading ? (
          <p>Loading...</p>
        ) : appointments.length > 0 ? (
          <ul className="schedule-list">
            {appointments.map((app) => {
              const isNutri = user.role === 'nutritionist';
              const targetUser = isNutri ? app.customerId : app.nutritionistId;
              const title = isNutri ? "" : "Dr. ";

              return (
                <li key={app._id} className="schedule-item">
                  <div className="appt-info">
                    <div className="appt-avatar">
                      {targetUser?.profilePic ? (
                        <img
                          src={targetUser.profilePic}
                          alt={targetUser?.username}
                          className="avatar-img"
                        />
                      ) : (
                        targetUser?.username?.charAt(0).toUpperCase() || "?"
                      )}
                    </div>

                    <div className="appt-details">
                      <span className="target-name">
                        {title}{formatName(targetUser)}
                      </span>
                      <span className="appt-time">{app.timeSlot}</span>
                    </div>
                  </div>

                  <div className="appt-meta">
                    <span className="appt-date">{new Date(app.date).toLocaleDateString()}</span>
                    <div className="">
                      <button className="details-btn" onClick={() => setSelectedAppt(app)}>Details</button>
                      {/* FIX: Passing the target user ID to the function */}
                      <button className='message-btn' onClick={() => handleMessageClick(targetUser?._id)}>Message</button>
                    </div>
                  </div>
                </li>
              )
            })}
            <div className="view-all">
              <button className="view-button" onClick={() => navigate('/appointments')}>View All</button>
            </div>
          </ul>
        ) : (
          <p>No upcoming sessions.</p>
        )}
      </div>

      <div className="schedule-info-side">
        <h2>Your Progress</h2>
        <p>More stuff goes here (Stats, Goals, etc.)</p>
      </div>

      {selectedAppt && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-x" onClick={closeModal}>&times;</button>
            <div className="modal-header">
              <h2>Appointment Details</h2>
            </div>
            <hr className="modal-divider" />

            {/* Compute target inside modal context */}
            {(() => {
              const isNutri = user.role === 'nutritionist';
              const modalTarget = isNutri ? selectedAppt.customerId : selectedAppt.nutritionistId;
              const modalTitle = isNutri ? "" : "Dr. ";

              return (
                <>
                  <div className="modal-body">
                    <div className="info-row">
                      <span className="label">Participant:</span>
                      <span className="value">
                        {modalTitle}{formatName(modalTarget)}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="label">Time:</span>
                      <span className="value">{selectedAppt.timeSlot}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Date:</span>
                      <span className="value">{new Date(selectedAppt.date).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="modal-footer">
                    {/* FIX: Passing the target user ID to the function from the modal */}
                    <button className="chat-btn" onClick={() => handleMessageClick(modalTarget?._id)}>
                      <span className="btn-icon">💬</span>
                      Send Message
                    </button>
                    <JoinCallButton
                    classname="join-btn"
                      appointmentId={selectedAppt._id}
                      status={selectedAppt.status}
                      isLive={isLive}
                    />
                  </div>
                </>
              );
            })()}

          </div>
        </div>
      )}
    </div>
  );
};

export default HomeSchedule;