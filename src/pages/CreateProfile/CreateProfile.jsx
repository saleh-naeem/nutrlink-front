import Navbar from "../../component/Navigationbar/Navbar";
import FormField from "../../component/FormField/FormField";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import { createProfile } from "../../api/customerapi";
import "./CreateProfile.css";
import { showAlert } from "../../utils/alertService";

export const CreateProfile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    height: "",
    currentWeight: "",
    targetWeight: "",
    allergies: [],
    primaryGoal: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAllergyToggle = (allergyValue) => {
    setFormData((prev) => {
      const currentAllergies = prev.allergies || [];

      if (currentAllergies.includes(allergyValue)) {
        return { ...prev, allergies: currentAllergies.filter(item => item !== allergyValue) };
      } else {
        return { ...prev, allergies: [...currentAllergies, allergyValue] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await createProfile(formData);
      console.log(result);
      await showAlert("Success!", "Profile updated successfully.", "success");
      
      if (user.role === "customer") {
        navigate("/profile");
      } else if (user.role === "nutritionist") {
        navigate("/Nprofile");
      } else {
        navigate('/')
      }
    } catch (error) {
      showAlert("Update Failed", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cp-page">
      <Navbar />

      <div className="cp-wrapper">
        <div className="cp-card">

          {/* Header */}
          <div className="cp-header">
            <div className="cp-icon">👤</div>
            <h1 className="cp-title">Create Your Profile</h1>
            <p className="cp-subtitle">Tell us about yourself so we can personalize your plan</p>
          </div>

          <form onSubmit={handleSubmit} className="cp-form">

            {/* Row: Age + Gender */}
            <div className="cp-row">
              <div className="cp-field-group">
                <FormField
                  label="Age"
                  id="age"
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="e.g. 25"
                />
              </div>

              <div className="cp-field-group">
                <label className="cp-label" htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="cp-select"
                  required
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            {/* Height */}
            <FormField
              label="Height (cm)"
              id="height"
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              placeholder="e.g. 173"
            />

            {/* Row: Current + Target Weight */}
            <div className="cp-row">
              <div className="cp-field-group">
                <FormField
                  label="Current Weight (kg)"
                  id="currentWeight"
                  type="number"
                  name="currentWeight"
                  value={formData.currentWeight}
                  onChange={handleChange}
                  placeholder="e.g. 85"
                />
              </div>
              <div className="cp-field-group">
                <FormField
                  label="Target Weight (kg)"
                  id="targetWeight"
                  type="number"
                  name="targetWeight"
                  value={formData.targetWeight}
                  onChange={handleChange}
                  placeholder="e.g. 75"
                />
              </div>
            </div>

            {user?.role === "customer" && (
              <>
                <div className="cp-field-group" style={{ marginBottom: '15px' }}>
                  <label className="cp-label" htmlFor="primaryGoal">Primary Goal</label>
                  <select
                    id="primaryGoal"
                    name="primaryGoal"
                    value={formData.primaryGoal}
                    onChange={handleChange}
                    className="cp-select"
                  >
                    <option value="" disabled>Select your main goal</option>
                    <option value="Weight Loss">Weight Loss</option>
                    <option value="Muscle Building">Muscle Building</option>
                    <option value="Clinical Nutrition">Clinical Nutrition</option>
                    <option value="Sports Nutrition">Sports Nutrition</option>
                    <option value="General Health">General Health</option>
                    <option value="Diabetic Diet">Diabetic Diet</option>
                    <option value="Pregnancy Nutrition">Pregnancy Nutrition</option>
                    <option value="Vegan Nutrition">Vegan Nutrition</option>
                  </select>
                </div>

                {/* Allergies */}
                <div className="cp-field-group" style={{ marginBottom: '20px' }}>
                  <label className="cp-label">Allergies</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>

                    {['peanuts', 'tree nuts', 'dairy', 'eggs', 'soy', 'wheat', 'gluten', 'fish', 'shellfish', 'sesame'].map((allergy) => {
                      const isSelected = formData.allergies?.includes(allergy);

                      return (
                        <div
                          key={allergy}
                          onClick={() => handleAllergyToggle(allergy)}
                          style={{
                            padding: '8px 16px',
                            borderRadius: '8px',
                            border: `2px solid ${isSelected ? '#10b981' : '#e5e7eb'}`,
                            backgroundColor: isSelected ? '#d1fae5' : '#ffffff',
                            color: isSelected ? '#065f46' : '#374151',
                            cursor: 'pointer',
                            fontWeight: '500',
                            textTransform: 'capitalize',
                            transition: 'all 0.2s ease',
                            userSelect: 'none'
                          }}
                        >
                          {allergy}
                        </div>
                      );
                    })}

                  </div>
                </div>
              </>
            )}


            {/* Submit */}
            <button type="submit" className="cp-btn" disabled={loading}>
              {loading ? (
                <span className="cp-btn-loading">
                  <span className="cp-spinner" /> Saving…
                </span>
              ) : (
                "Save Profile"
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};