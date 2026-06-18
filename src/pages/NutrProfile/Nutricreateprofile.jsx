import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../component/Navigationbar/Navbar";
import { createProfile } from "../../api/nutritionist";

const SPECIALIZATIONS = [
  "Weight Loss",
  "Muscle Building",
  "Diabetic Diet",
  "Sports Nutrition",
  "General Health",
];

const LANGUAGES = ["Arabic", "English", "Portuguese", "Spanish", "Russian"];

export const NutriCreateProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    specialization: [],
    bio: "",
    cardBio: "",
    yearsOfExperience: "",
    languages: [],
    price: "",
  });

  const toggleItem = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.specialization.length === 0) {
      alert("Please select at least one specialization.");
      return;
    }

    /* ── Convert number fields from string to number ── */
    const payload = {
      ...formData,
      price: formData.price !== "" ? Number(formData.price) : undefined,
      yearsOfExperience: formData.yearsOfExperience !== "" ? Number(formData.yearsOfExperience) : undefined,
    };

    setLoading(true);
    try {
      await createProfile(payload);
      navigate("/Nprofile");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 font-sans text-gray-900 pb-20">
      <Navbar />
      <div className="w-full max-w-2xl mx-auto pt-12 px-4 sm:px-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10">
          
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🥗</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Profile</h1>
            <p className="text-gray-500">Set up your nutritionist profile to start helping clients</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            {/* Specialization */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700 flex justify-between items-center">
                <span>Specialization <span className="text-red-500">*</span></span>
                <span className="text-xs text-gray-400 font-normal">Select all that apply</span>
              </label>
              <div className="flex flex-wrap gap-2 mt-1">
                {SPECIALIZATIONS.map((s) => {
                  const isActive = formData.specialization.includes(s);
                  return (
                    <label
                      key={s}
                      className={`inline-flex items-center justify-center px-4 py-2 border rounded-full text-sm font-medium cursor-pointer transition-all duration-200 select-none
                        ${isActive ? "bg-green-100 border-green-500 text-green-700" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"}`}
                    >
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={isActive}
                        onChange={() => toggleItem("specialization", s)}
                      />
                      {s}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Languages */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Languages</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {LANGUAGES.map((l) => {
                  const isActive = formData.languages.includes(l);
                  return (
                    <label
                      key={l}
                      className={`inline-flex items-center justify-center px-4 py-2 border rounded-full text-sm font-medium cursor-pointer transition-all duration-200 select-none
                        ${isActive ? "bg-green-100 border-green-500 text-green-700" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"}`}
                    >
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={isActive}
                        onChange={() => toggleItem("languages", l)}
                      />
                      {l}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Years of experience + Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700" htmlFor="yearsOfExperience">
                  Years of Experience
                </label>
                <input
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-colors"
                  id="yearsOfExperience"
                  name="yearsOfExperience"
                  type="number"
                  min="0"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  placeholder="e.g. 5"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700" htmlFor="price">
                  Price ($/hr)
                </label>
                <input
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-colors"
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  max="500"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g. 50"
                />
              </div>
            </div>

            {/* Card Bio */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700 flex justify-between items-center" htmlFor="cardBio">
                Short Bio
                <span className="text-xs text-gray-400 font-normal">{formData.cardBio.length}/150</span>
              </label>
              <input
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-colors"
                id="cardBio"
                name="cardBio"
                type="text"
                maxLength={150}
                value={formData.cardBio}
                onChange={handleChange}
                placeholder="A short intro shown on your public card"
              />
            </div>

            {/* Full Bio */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700 flex justify-between items-center" htmlFor="bio">
                Full Bio
                <span className="text-xs text-gray-400 font-normal">{formData.bio.length}/500</span>
              </label>
              <textarea
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-colors resize-y"
                id="bio"
                name="bio"
                maxLength={500}
                rows={4}
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell clients about your background, approach, and expertise…"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…
                </span>
              ) : (
                "Create Profile"
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};