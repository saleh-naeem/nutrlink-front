import axios from 'axios';

const api = axios.create({
  baseURL: "http://localhost:5000/nutrlink/api/appointments"
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ═══════════════════════════════════════════════════════════
// NUTRITIONIST ENDPOINTS
// ═══════════════════════════════════════════════════════════

export async function createSlot(slotData) {
  const res = await api.post('/slot', slotData);
  return res.data;
}

export async function deleteSlot(slotId) {
  const res = await api.delete(`/slot/${slotId}`);
  return res.data;
}

/**
 * Unified Schedule Fetcher
 * Returns all statuses (available, booked, canceled, completed)
 */
export async function getNutritionistSchedule() {
  const res = await api.get('/schedule');
  return res.data;
}

export async function markCompleted(appointmentId) {
  const res = await api.put(`/complete/${appointmentId}`);
  return res.data;
}

// ═══════════════════════════════════════════════════════════
// CUSTOMER ENDPOINTS
// ═══════════════════════════════════════════════════════════

export async function bookAppointment(slotId) {
  const res = await api.put(`/book/${slotId}`);
  return res.data;
}

/**
 * Unified Customer Fetcher
 * Returns all statuses (booked, canceled, completed)
 */
export async function getCustomerAppointments() {
  const res = await api.get('/customer-appointments');
  return res.data;
}

export async function rescheduleAppointment(rescheduleData) {
  const res = await api.put('/reschedule', rescheduleData);
  return res.data;
}

export async function cancelAppointment(appointmentId) {
  const res = await api.put(`/cancel/${appointmentId}`);
  return res.data;
}

// ═══════════════════════════════════════════════════════════
// PUBLIC & ADMIN ENDPOINTS
// ═══════════════════════════════════════════════════════════

export async function getAvailableSlots(nutritionistId) {
  const res = await api.get(`/${nutritionistId}`);
  return res.data;
}

export async function getAllAppointments() {
  const res = await api.get('/admin/all');
  return res.data;
}