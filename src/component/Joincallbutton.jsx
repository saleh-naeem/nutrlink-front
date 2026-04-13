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
const JoinCallButton = ({ appointmentId, status }) => {
  const navigate = useNavigate();

  const handleJoinCall = () => {
    navigate(`/video-call/${appointmentId}`);
  };

  // Only show button for booked appointments
  if (status !== 'booked') {
    return null;
  }

  return (
    <button 
      className="join-call-btn"
      onClick={handleJoinCall}
      title="Join video call"
    >
      <Video size={18} />
      <span>Join Call</span>
    </button>
  );
};

export default JoinCallButton;