import Navbar from "../../component/Navigationbar/Navbar";
import FormField from "../../component/FormField/FormField";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import { showAlert } from "../../utils/alertService";
import "../CreateProfile/CreateProfile.css";

// Import both APIs with aliases to avoid naming conflicts
import * as customerAPI from "../../api/customerapi";
import * as nutritionistAPI from "../../api/nutritionist";

export const Updateprofile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Combined state for all possible fields
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    // Customer Only
    height: "",
    currentWeight: "",
    targetWeight: "",
    allergies: [],
    primaryGoal: "",
    specialization: [],
    bio: "",
    cardBio: "",
    yearsOfExperience: "",
    languages: [],
    price: ""
  });

  const isNutri = user?.role === "nutritionist";

  /* ── Load existing data based on role ── */
  useEffect(() => {
    async function loadData() {
      try {
        // Use correct API based on role
        const p = isNutri
          ? await nutritionistAPI.getProfile()
          : await customerAPI.getCustomerProfile();

        if (p) {
          setFormData({
            ...formData, // Keep default empty strings for missing fields
            age: p.age ?? "",
            gender: p.gender ?? "",
            height: p.height ?? "",
            currentWeight: p.currentWeight ?? "",
            targetWeight: p.targetWeight ?? "",
            allergies: Array.isArray(p.allergies) ? p.allergies : [],
            primaryGoal: p.primaryGoal ?? "",
            specialization: Array.isArray(p.specialization) ? p.specialization : [],
            bio: p.bio ?? "",
            cardBio: p.cardBio ?? "",
            yearsOfExperience: p.yearsOfExperience ?? "",
            languages: Array.isArray(p.languages) ? p.languages : [],
            price: p.price ?? ""
          });
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setFetching(false);
      }
    }
    loadData();
  }, [isNutri]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ── Generic toggle for arrays (Allergies, Specs, Languages) ── */
  const handleToggleArray = (field, value) => {
    setFormData((prev) => {
      const current = prev[field] || [];
      const updated = current.includes(value)
        ? current.filter(i => i !== value)
        : [...current, value];
      return { ...prev, [field]: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {};

    // Explicit list of fields we expect to be strict numbers
    const numericFields = ["age", "height", "currentWeight", "targetWeight", "yearsOfExperience", "price"];

    Object.entries(formData).forEach(([key, val]) => {
      if (val !== "" && val !== null && val !== undefined) {
        // Convert numeric values from strings to true numbers before hitting MongoDB
        if (numericFields.includes(key)) {
          payload[key] = parseFloat(val);
        } else {
          payload[key] = val;
        }
      }
    });

    if (Object.keys(payload).length === 0) {
      showAlert("No Changes", "Please update at least one field.", "warning");
      setLoading(false);
      return;
    }

    try {
      if (isNutri) {
        // Send nutritionist specific payload
        await nutritionistAPI.updateProfile({
          specialization: payload.specialization || [],
          bio: payload.bio,
          cardBio: payload.cardBio,
          yearsOfExperience: payload.yearsOfExperience,
          languages: payload.languages || [],
          price: payload.price,
          age: payload.age,
          gender: payload.gender
        });
      } else {
        // Send customer specific payload
        await customerAPI.updateCustomerProfile(payload);
      }

      await showAlert("Success!", "Profile updated successfully.", "success");
      navigate(isNutri ? "/Nprofile" : "/profile");
    } catch (error) {
      showAlert("Update Failed", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="cp-loader"><Navbar /><p>Loading profile...</p></div>;

  return (
    <div className="cp-page">
      <Navbar />
      <div className="cp-wrapper">
        <div className="cp-card">
          <div className="cp-header">
            <h1 className="cp-title">Update {isNutri ? 'Expert' : 'Health'} Profile</h1>
          </div>

          <form onSubmit={handleSubmit} className="cp-form">
            {/* COMMON FIELDS: Age & Gender */}
            <div className="cp-row">
              <FormField label="Age" name="age" type="number" value={formData.age} onChange={handleChange} required />
              <div className="cp-field-group">
                <label className="cp-label">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="cp-select">
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            {/* CONDITIONAL RENDERING: CUSTOMER FIELDS */}
            {!isNutri && (
              <>
                <FormField label="Height (cm)" name="height" type="number" value={formData.height} onChange={handleChange} />
                <div className="cp-row">
                  <FormField label="Current Weight" name="currentWeight" type="number" value={formData.currentWeight} onChange={handleChange} />
                  <FormField label="Target Weight" name="targetWeight" type="number" value={formData.targetWeight} onChange={handleChange} />
                </div>
                <div className="cp-field-group">
                  <label className="cp-label">Allergies</label>
                  <div className="pill-container">
                    {['peanuts', 'dairy', 'gluten', 'soy', 'fish'].map(a => (
                      <div key={a} className={`pill ${formData.allergies.includes(a) ? 'active' : ''}`} onClick={() => handleToggleArray('allergies', a)}>{a}</div>
                    ))}
                  </div>
                </div>
                <div className="cp-field-group">
                  <label className="cp-label">Primary Goal</label>
                  <select name="primaryGoal" value={formData.primaryGoal} onChange={handleChange} className="cp-select">
                    <option value="">Select Goal</option>
                    <option value="Weight Loss">Weight Loss</option>
                    <option value="Muscle Building">Muscle Building</option>
                    <option value="Diabetic Diet">Diabetic Diet</option>
                    <option value="Sports Nutrition">Sports Nutrition</option>
                    <option value="General Health">General Health</option>
                  </select>
                </div>
              </>
            )}

            {/* CONDITIONAL RENDERING: NUTRITIONIST FIELDS */}
            {isNutri && (
              <>
                <div className="cp-row">
                  <FormField label="Years of Experience" name="yearsOfExperience" type="number" value={formData.yearsOfExperience} onChange={handleChange} />
                  <FormField label="Price per Hour ($)" name="price" type="number" value={formData.price} onChange={handleChange} />
                </div>

                <FormField label="Card Bio (Max 150 chars)" name="cardBio" value={formData.cardBio} onChange={handleChange} maxLength="150" />

                <div className="cp-field-group">
                  <label className="cp-label">Full Bio</label>
                  <textarea name="bio" className="cp-textarea" value={formData.bio} onChange={handleChange} maxLength="500" />
                </div>

                <div className="cp-field-group">
                  <label className="cp-label">Specializations</label>
                  <div className="pill-container">
                    {['Weight Loss', 'Muscle Building', 'Diabetic Diet', 'Sports Nutrition', 'General Health'].map(s => (
                      <div key={s} className={`pill ${formData.specialization.includes(s) ? 'active' : ''}`} onClick={() => handleToggleArray('specialization', s)}>{s}</div>
                    ))}
                  </div>
                </div>

                <div className="cp-field-group">
                  <label className="cp-label">Languages</label>
                  <div className="pill-container">
                    {['Arabic', 'English', 'Spanish', 'Portuguese', 'Russian'].map(l => (
                      <div key={l} className={`pill ${formData.languages.includes(l) ? 'active' : ''}`} onClick={() => handleToggleArray('languages', l)}>{l}</div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="cp-actions">
              <button type="button" className="cp-btn-cancel" onClick={() => navigate(-1)}>Cancel</button>
              <button type="submit" className="cp-btn" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};