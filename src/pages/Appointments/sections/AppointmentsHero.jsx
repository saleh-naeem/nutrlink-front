import Swal from 'sweetalert2'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cancelAppointment } from '../../../api/appointmetapi'
import { accessConversation } from '../../../api/chatapi'
import { showAlert, showConfirm } from '../../../utils/alertService';
import AppointmentCard from '../../../component/AppointmentCard/AppointmentCard'
import Report from '../../../component/Report'
import './AppointmentsHero.css'

const AppointmentsHero = ({ appointments = [], role, refreshData }) => {
  const [selectedAppt, setSelectedAppt] = useState(null)
  const [showReport, setShowReport]     = useState(false)
  const navigate = useNavigate()

  const isNutri    = role === 'nutritionist'
  const target     = isNutri ? selectedAppt?.customerId : selectedAppt?.nutritionistId
  const title      = isNutri ? '' : 'Dr. '
  const targetRole = isNutri ? 'customer' : 'nutritionist'

  // The logged-in customer's id — only customers can report
  const currentCustomerId = selectedAppt?.customerId?._id ?? selectedAppt?.customerId

  const handleAppointmentCancel = async (appointmentId) => {
    const result = await showConfirm('Are you sure?', 'This will cancel the booking.', true)
    if (result.isConfirmed) {
      try {
        await cancelAppointment(appointmentId)
        setSelectedAppt(null)
        if (refreshData) refreshData()
        showAlert('Success', 'Appointment cancelled.', 'success')
      } catch (err) {
        console.error('Action failed:', err)
        showAlert('Error', err.response?.data?.message || 'Action failed', 'error')
      }
    }
  }

  const handleMessageClick = async () => {
    try {
      const chatData = await accessConversation(target?._id)
      navigate('/chat', { state: { incomingChat: chatData } })
    } catch (err) {
      console.error('Error accessing chat:', err)
    }
  }

  return (
    <div className="appointments-hero">

      {/* ── Sidebar ── */}
      <div className="hero-sidebar">
        <h2 className="my-appointments">My Appointments</h2>
        <div className="hero-scroll-list">
          {appointments && appointments.length > 0 ? (
            appointments.map((appointment) => (
              <AppointmentCard
                key={appointment._id}
                appointment={appointment}
                role={role}
                onSelect={() => {
                  if (selectedAppt?._id === appointment._id)
                    setSelectedAppt(null)
                  else
                    setSelectedAppt(appointment)
                }}
              />
            ))
          ) : (
            <div className="no-appointments-sidebar">No upcoming sessions found</div>
          )}
        </div>
      </div>

      {/* ── Main detail view ── */}
      <div className="hero-main-view">
        {appointments.length < 3 && appointments.length > 0 && (
          <div className="barear" />
        )}

        {selectedAppt ? (
          <div className="details-overlay-absolute">
            <button onClick={() => setSelectedAppt(null)} className="exit-btn">X</button>

{/* {!isNutri && (
  <button className="report-appt-btn" onClick={() => setShowReport(true)}>
    <span className="report-icon">🚩</span>
    <span className="report-text">Report</span>
  </button>
)} */}

            <div className="details-info">
              <div className="profile-image-wrapper">
                <img src={target?.profilePic} alt="Profile" className="profile-pic" />
              </div>
              <div className="text-info">
                <h3 className="username">{title}{target?.username}</h3>
                <h2 className="email">{target?.email}</h2>
              </div>
              <div className="devider" />
            </div>

            <div className="body-info">
              <div className="date-info">Date: <span>{selectedAppt.date.split('T')[0]}</span></div>
              <div className="time-info">Time: <span className="time">{selectedAppt.timeSlot}</span></div>
            </div>

            <div className="footer-info">
              <div className="footer-left-info">
                <button
                  className="cancel-appointment"
                  onClick={() => handleAppointmentCancel(selectedAppt._id)}
                >
                  Cancel appointment
                </button>
              </div>

              <div className="footer-right-info">
                <button className="message"     onClick={handleMessageClick}>message</button>
                <button className="see-profile" onClick={() => navigate(`/${targetRole}/profile/${target?._id}`)}>
                  see profile
                </button>

                {/* ── Report button: only visible to customers reporting a nutritionist ── */}
              {!isNutri && (
  <button className="report-appt-btn" onClick={() => setShowReport(true)}>
    <span className="report-icon">🚩</span>
    <span className="report-text">Report</span>
  </button>
)}
              </div>
            </div>
          </div>
        ) : (
          <div className="no-result-container">
            <h2 className="no-result">
              {appointments.length > 0
                ? 'Click over any appointment to see details'
                : 'Your schedule is currently empty'}
            </h2>
          </div>
        )}
      </div>

      {/* ── Report Modal ── */}
      {showReport && selectedAppt && (
        <Report
          reporterId={currentCustomerId}
          reportedUserId={selectedAppt?.nutritionistId?._id ?? selectedAppt?.nutritionistId}
          nutritionistName={selectedAppt?.nutritionistId?.username ?? 'this nutritionist'}
          onClose={() => setShowReport(false)}
          onSuccess={() => setShowReport(false)}
        />
      )}

    </div>
  )
}

export default AppointmentsHero