import { useState } from 'react';
import { makereport } from '../api/report';
import './Report.css';

const REPORT_REASONS = [
  'Inappropriate behavior',
  'Misinformation / false advice',
  'Harassment or bullying',
  'Spam or advertising',
  'Unprofessional conduct',
  'Fake credentials',
  'Other',
];

/**
 * Report Modal Component
 *
 * Props:
 *   - reporterId      {string}   The logged-in customer's ID
 *   - reportedUserId  {string}   The nutritionist's ID being reported
 *   - nutritionistName {string}  Display name of the nutritionist (optional)
 *   - onClose         {function} Called when the modal should close
 *   - onSuccess       {function} Called after a successful report submission (optional)
 */
const Report = ({ reporterId, reportedUserId, nutritionistName = 'this nutritionist', onClose, onSuccess }) => {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!reason) {
      setError('Please select a reason for your report.');
      return;
    }
    if (description.trim().length < 10) {
      setError('Please provide at least 10 characters of description.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await makereport({
        reporterId,
        reporterModel: 'Customer',
        reportedUserId,
        reportedUserModel: 'Nutritionist',
        reason,
        description: description.trim(),
      });

      setSubmitted(true);
      onSuccess?.();
    } catch (err) {
      setError(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="report-backdrop" onClick={handleBackdropClick}>
      <div className="report-modal" role="dialog" aria-modal="true" aria-labelledby="report-title">

        {/* Close Button */}
        <button className="report-close-btn" onClick={onClose} aria-label="Close">
          ✕
        </button>

        {submitted ? (
          /* ── Success State ── */
          <div className="report-success">
            <div className="report-success-icon">
              <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="26" cy="26" r="25" stroke="#00c853" strokeWidth="2" />
                <path d="M14 26l8 8 16-16" stroke="#00c853" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="report-success-title">Report Submitted</h2>
            <p className="report-success-msg">
              Thank you for helping keep our community safe. Our team will review your report shortly.
            </p>
            <button className="report-submit-btn" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          /* ── Form State ── */
          <>
            {/* Header */}
            <div className="report-header">
              <div className="report-icon-wrap">
                <span className="report-icon">🚩</span>
              </div>
              <div>
                <h2 id="report-title" className="report-title">Report Nutritionist</h2>
                <p className="report-subtitle">
                  Reporting <strong>{nutritionistName}</strong>
                </p>
              </div>
            </div>

            <div className="report-divider" />

            {/* Reason Select */}
            <div className="report-field">
              <label className="report-label" htmlFor="report-reason">
                Reason <span className="report-required">*</span>
              </label>
              <div className="report-reasons-grid">
                {REPORT_REASONS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    className={`report-reason-chip ${reason === r ? 'selected' : ''}`}
                    onClick={() => {
                      setReason(r);
                      setError(null);
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="report-field">
              <label className="report-label" htmlFor="report-description">
                Description <span className="report-required">*</span>
              </label>
              <textarea
                id="report-description"
                className="report-textarea"
                placeholder="Please describe the issue in detail…"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setError(null);
                }}
                rows={4}
                maxLength={500}
              />
              <span className="report-char-count">{description.length} / 500</span>
            </div>

            {/* Error */}
            {error && (
              <div className="report-error">
                <span>⚠️</span> {error}
              </div>
            )}

            {/* Actions */}
            <div className="report-actions">
              <button
                type="button"
                className="report-cancel-btn"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="report-submit-btn"
                onClick={handleSubmit}
                disabled={loading || !reason || description.trim().length < 10}
              >
                {loading ? (
                  <span className="report-btn-spinner" />
                ) : (
                  '🚩 Submit Report'
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Report;