import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getreport } from '../../api/report';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('applications');

  // ── Applications ───────────────────────────────────────────
  const [pendingNutritionists, setPendingNutritionists] = useState([]);
  const [appLoading, setAppLoading]   = useState(true);
  const [appError, setAppError]       = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  // ── Reports ────────────────────────────────────────────────
  const [reports, setReports]               = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportsError, setReportsError]     = useState(null);
  const [expandedReport, setExpandedReport] = useState(null);
  const [reportActionLoading, setReportActionLoading] = useState(null);

  useEffect(() => { fetchPendingNutritionists(); }, []);
  useEffect(() => {
    if (activeTab === 'reports' && reports.length === 0 && !reportsLoading)
      fetchReports();
  }, [activeTab]);

  // ── Applications API ───────────────────────────────────────
  const fetchPendingNutritionists = async () => {
    try {
      setAppLoading(true); setAppError(null);
      const token = localStorage.getItem('authToken');
      if (!token) { navigate('/login'); return; }
      const res = await fetch('http://localhost:5000/nutrlink/api/admin/pending', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) { navigate('/login'); return; }
        throw new Error('Failed to fetch pending nutritionists');
      }
      setPendingNutritionists(await res.json());
    } catch (err) { setAppError(err.message); }
    finally { setAppLoading(false); }
  };

  const handleApprove = async (userId) => {
    if (!window.confirm('Approve this nutritionist?')) return;
    try {
      setActionLoading(userId);
      const token = localStorage.getItem('authToken');
      const res = await fetch(`http://localhost:5000/nutrlink/api/admin/approve/${userId}`, {
        method: 'PUT', headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message || 'Failed'); }
      setPendingNutritionists(prev => prev.filter(u => u._id !== userId));
      alert('Nutritionist approved!');
    } catch (err) { alert('Error: ' + err.message); }
    finally { setActionLoading(null); }
  };

  const handleReject = async (userId) => {
    if (!window.confirm('Reject this application?')) return;
    try {
      setActionLoading(userId);
      const token = localStorage.getItem('authToken');
      const res = await fetch(`http://localhost:5000/nutrlink/api/admin/reject/${userId}`, {
        method: 'PUT', headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message || 'Failed'); }
      setPendingNutritionists(prev => prev.filter(u => u._id !== userId));
      alert('Application rejected.');
    } catch (err) { alert('Error: ' + err.message); }
    finally { setActionLoading(null); }
  };

  const openImageInNewTab = (url) => window.open(url, '_blank');

  // ── Reports API ────────────────────────────────────────────
  const fetchReports = async () => {
    try {
      setReportsLoading(true); setReportsError(null);
      const data = await getreport();
      setReports(Array.isArray(data) ? data : (data.reports ?? []));
    } catch (err) { setReportsError(err.message); }
    finally { setReportsLoading(false); }
  };

  const handleResolveReport = async (reportId) => {
    if (!window.confirm('Mark this report as resolved?')) return;
    try {
      setReportActionLoading(reportId);
      const token = localStorage.getItem('authToken');
      const res = await fetch(`http://localhost:5000/nutrlink/api/reports/${reportId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: 'resolved' }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message || 'Failed'); }
      setReports(prev => prev.map(r => r._id === reportId ? { ...r, status: 'resolved' } : r));
    } catch (err) { alert('Error: ' + err.message); }
    finally { setReportActionLoading(null); }
  };

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm('Delete this report permanently?')) return;
    try {
      setReportActionLoading(reportId);
      const token = localStorage.getItem('authToken');
      const res = await fetch(`http://localhost:5000/nutrlink/api/reports/${reportId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message || 'Failed'); }
      setReports(prev => prev.filter(r => r._id !== reportId));
    } catch (err) { alert('Error: ' + err.message); }
    finally { setReportActionLoading(null); }
  };

  // ── Helpers ────────────────────────────────────────────────
  const statusColor = (status) => {
    if (status === 'pending')  return 'report-status-pending';
    if (status === 'reviewed') return 'report-status-reviewed';
    if (status === 'resolved') return 'report-status-resolved';
    return '';
  };

  // Extract a guaranteed-string ID from whatever the backend returns
  // Extract a guaranteed string ID from any shape the backend returns:
  // null, plain string, populated profile object, or MongoDB ObjectId.
  const safeId = (field) => {
    if (field === null || field === undefined) return null;
    // Already a plain string
    if (typeof field === 'string') return field;
    // Populated object — pull _id out first
    const raw = (typeof field === 'object' && '_id' in field) ? field._id : field;
    if (raw === null || raw === undefined) return null;
    if (typeof raw === 'string') return raw;
    // MongoDB ObjectId — serialize via JSON to get the hex string cleanly
    try {
      const j = JSON.stringify(raw);
      // JSON.stringify of an ObjectId gives the 24-char hex string directly
      return j.replace(/^"|"$/g, '');
    } catch {
      return String(raw);
    }
  };

  // ── Loading / error guard ──────────────────────────────────
  if (appLoading) return (
    <div className="admin-dashboard">
      <div className="admin-loading"><div className="admin-spinner" /><p>Loading dashboard...</p></div>
    </div>
  );

  if (appError) return (
    <div className="admin-dashboard">
      <div className="admin-error">
        <h2>⚠️ Error</h2><p>{appError}</p>
        <button onClick={fetchPendingNutritionists} className="admin-retry-btn">Try Again</button>
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard">

      <header className="admin-header">
        <h1>🩺 Admin Dashboard</h1>
        <p className="admin-subtitle">Manage your NutrLink platform</p>
      </header>

      {/* ── Tabs ── */}
      <div className="admin-tabs">
        <button
          className={`admin-tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
          onClick={() => setActiveTab('applications')}
        >
          📋 Applications
          {pendingNutritionists.length > 0 && (
            <span className="admin-tab-badge">{pendingNutritionists.length}</span>
          )}
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          🚩 Reports
          {reports.filter(r => r.status === 'pending').length > 0 && (
            <span className="admin-tab-badge red">{reports.filter(r => r.status === 'pending').length}</span>
          )}
        </button>
      </div>

      {/* ══════════════════════════════════════════
          TAB: APPLICATIONS
      ══════════════════════════════════════════ */}
      {activeTab === 'applications' && (
        <>
          {pendingNutritionists.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty-icon">✅</div>
              <h2>All caught up!</h2>
              <p>No pending nutritionist applications.</p>
              <button onClick={fetchPendingNutritionists} className="admin-refresh-btn">Refresh</button>
            </div>
          ) : (
            <div className="admin-applications">
              <div className="admin-count">
                {pendingNutritionists.length} pending application{pendingNutritionists.length !== 1 ? 's' : ''}
              </div>
              <div className="admin-grid">
                {pendingNutritionists.map((user) => (
                  <div key={user._id} className="admin-card">
                    <div className="admin-card-header">
                      <img src={user.profilePic} alt={user.username} className="admin-avatar" />
                      <div className="admin-user-info">
                        <h3 className="admin-username">{user.username}</h3>
                        <p className="admin-email">{user.email}</p>
                        <span className="admin-badge">Nutritionist</span>
                      </div>
                    </div>
                    <div className="admin-credential-section">
                      <label className="admin-credential-label">Credential / Certificate:</label>
                      {user.credentialImage ? (
                        <div className="admin-credential-preview">
                          <img src={user.credentialImage} alt="Credential" className="admin-credential-img"
                            onClick={() => openImageInNewTab(user.credentialImage)} />
                          <button className="admin-view-full-btn" onClick={() => openImageInNewTab(user.credentialImage)}>
                            🔍 View Full Size
                          </button>
                        </div>
                      ) : (
                        <p className="admin-no-credential">No credential uploaded</p>
                      )}
                    </div>
                    <div className="admin-meta">
                      <span className="admin-date">Applied: {new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="admin-actions">
                      <button onClick={() => handleApprove(user._id)} disabled={actionLoading === user._id} className="admin-approve-btn">
                        {actionLoading === user._id ? '...' : '✓ Approve'}
                      </button>
                      <button onClick={() => handleReject(user._id)} disabled={actionLoading === user._id} className="admin-reject-btn">
                        {actionLoading === user._id ? '...' : '✕ Reject'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* ══════════════════════════════════════════
          TAB: REPORTS
      ══════════════════════════════════════════ */}
      {activeTab === 'reports' && (
        <div className="admin-reports-section">

          {reportsLoading && (
            <div className="admin-loading"><div className="admin-spinner" /><p>Loading reports...</p></div>
          )}

          {reportsError && (
            <div className="admin-error">
              <h2>⚠️ Error</h2><p>{reportsError}</p>
              <button onClick={fetchReports} className="admin-retry-btn">Try Again</button>
            </div>
          )}

          {!reportsLoading && !reportsError && reports.length === 0 && (
            <div className="admin-empty">
              <div className="admin-empty-icon">🏳️</div>
              <h2>No reports yet</h2>
              <p>No user reports have been submitted.</p>
              <button onClick={fetchReports} className="admin-refresh-btn">Refresh</button>
            </div>
          )}

          {!reportsLoading && !reportsError && reports.length > 0 && (
            <>
              <div className="admin-count" style={{ borderLeftColor: '#ff5252' }}>
                {reports.length} report{reports.length !== 1 ? 's' : ''}&nbsp;·&nbsp;
                {reports.filter(r => r.status === 'pending').length} pending
              </div>

              <div className="admin-reports-list">
                {reports.map((report) => {
                  const reporterId    = safeId(report.reporterId);
                  const reportedId    = safeId(report.reportedUserId);
                  const isActing      = reportActionLoading === report._id;
                  const isResolved    = report.status === 'resolved';

                  // Extra info from populated profile objects
                  const customerInfo  = report.reporterId && typeof report.reporterId === 'object'
                    ? [report.reporterId.gender, report.reporterId.age != null ? `age ${report.reporterId.age}` : null]
                        .filter(Boolean).join(', ')
                    : null;

                  const nutriInfo     = report.reportedUserId && typeof report.reportedUserId === 'object'
                    ? (report.reportedUserId.cardBio || null)
                    : null;

                  return (
                    <div key={report._id} className="admin-report-card">

                      {/* ── Top row: reporter → reported ── */}
                      <div className="report-card-top">

                        <div className="report-card-ids">
                          <span className="report-label-tag">Reporter (Customer)</span>
                          <span className="report-id-val">
                            {reporterId ?? '—'}
                          </span>
                          {customerInfo && <span className="report-id-sub">{customerInfo}</span>}
                        </div>

                        <span className="report-arrow">→</span>

                        <div className="report-card-ids">
                          <span className="report-label-tag">Reported (Nutritionist)</span>
                          <span className="report-id-val">
                            {reportedId ?? '—'}
                          </span>
                          {nutriInfo && <span className="report-id-sub">{nutriInfo}</span>}
                        </div>

                        <span className={`report-status-badge ${statusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </div>

                      {/* ── Reason ── */}
                      <div className="report-card-reason">
                        <span className="report-label-tag">Reason</span>
                        <span className="report-reason-text">{report.reason}</span>
                      </div>

                      {/* ── Description toggle ── */}
                      <button
                        className="report-toggle-desc"
                        onClick={() => setExpandedReport(expandedReport === report._id ? null : report._id)}
                      >
                        {expandedReport === report._id ? '▲ Hide description' : '▼ Show description'}
                      </button>

                      {expandedReport === report._id && (
                        <div className="report-description-box">{report.description}</div>
                      )}

                      {/* ── Date ── */}
                      <div className="report-card-date">
                        📅 Submitted: {new Date(report.createdAt).toLocaleDateString()}
                      </div>

                      {/* ── Admin actions ── */}
                      <div className="report-admin-actions">
                        <button
                          className="report-resolve-btn"
                          onClick={() => handleResolveReport(report._id)}
                          disabled={isActing || isResolved}
                        >
                          {isActing ? <span className="report-btn-spinner" /> : '✓ Mark as Done'}
                        </button>
                        <button
                          className="report-delete-btn"
                          onClick={() => handleDeleteReport(report._id)}
                          disabled={isActing}
                        >
                          {isActing ? <span className="report-btn-spinner" /> : '🗑 Delete'}
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;