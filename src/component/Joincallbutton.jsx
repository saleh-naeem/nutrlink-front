import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Video } from 'lucide-react';
import './JoinCallButton.css';

/**
 * Button component to join a video call for an appointment
 * 
 * Usage in your appointment list/details:
 * <JoinCallButton appointmentId={appointment._id} status={appointment.status} />
 */
const JoinCallButton = ({ appointmentId, status, isLive }) => {
  const navigate = useNavigate();

  const handleJoinCall = () => {
    if (isLive) {
      navigate(`/video-call/${appointmentId}`);
    }
  };

  // Only show button for booked appointments
  if (status !== 'booked') {
    return null;
  }

  return (
    <button
      // Apply your styles and dynamic classes here
      className={`start-btn-hero ${isLive ? 'active' : 'disabled'}`}
      onClick={handleJoinCall}
      disabled={!isLive}
      title={isLive ? "Join video call" : "Session not started yet"}
    >
      {/* Kept his icon but used your dynamic text */}
      {isLive && <Video size={16} style={{ marginRight: '6px', display: 'inline' }} />}
      {isLive ? 'Join now' : 'Start Session'}
    </button>
  );
};

export default JoinCallButton;