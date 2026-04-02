import React, { useState, useEffect, useContext } from 'react'
import { getCustomerAppointments, getNutritionistSchedule } from '../../api/appointmetapi'
import { AuthContext } from '../../AuthContext'
import Navbar from '../../component/Navigationbar/Navbar'
import AppointmentsHero from './sections/AppointmentsHero'
import LoadingOverlay from '../../component/LoadingOverlay/LoadingOverlay'
import AppointmentsManager from './sections/AppointmentsManager'
import './Appointments.css'

const Appointments = () => {
  const { user } = useContext(AuthContext)
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  // 1. Define the fetch function OUTSIDE the useEffect so the whole file can use it
  const refreshAppointmentsData = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const response = (user.role === 'nutritionist')
        ? await getNutritionistSchedule()
        : await getCustomerAppointments()

      const dataArray = Array.isArray(response) ? response : (response.appointments || response.schedule || [])
      setAppointments(dataArray)
    } catch (err) {
      console.error("Fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  // 2. Run the function when the component loads
  useEffect(() => {
    refreshAppointmentsData()
  }, [user?.role])

  const upcomingAppointments = (appointments || []).filter(appt => appt.status === 'booked')

  return (
    <div className='appointments-container'>
      <Navbar />
      <LoadingOverlay message="Loading my appointments..." isActive={loading} />
      
      {!loading && <AppointmentsHero appointments={upcomingAppointments} role={user?.role} />}
      
      {/* 3. Pass the newly hoisted function to the manager */}
      <AppointmentsManager 
        appointments={appointments} 
        role={user?.role} 
        refreshData={refreshAppointmentsData} 
      />
    </div>
  )
}

export default Appointments