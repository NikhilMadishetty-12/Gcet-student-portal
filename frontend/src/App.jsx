import { useState, useEffect } from 'react';
import './App.css';

// Base backend health check URL
const BACKEND_HEALTH_URL = 'http://127.0.0.1:8000/api/health';

function App() {
  // Connection states: 'loading' | 'connected' | 'error'
  const [connectionStatus, setConnectionStatus] = useState('loading');
  const [healthData, setHealthData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [lastChecked, setLastChecked] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  // Function to execute the health check HTTP request
  const fetchHealth = async () => {
    try {
      const response = await fetch(BACKEND_HEALTH_URL, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText || 'Backend returned an error'}`);
      }

      const data = await response.json();

      if (data && data.status === 'healthy') {
        setHealthData(data);
        setConnectionStatus('connected');
        setErrorMessage('');
      } else {
        throw new Error('Backend response did not match expected healthy status.');
      }
    } catch (err) {
      setHealthData(null);
      setConnectionStatus('error');
      setErrorMessage(
        err.message || 'Unable to reach the FastAPI backend server at http://127.0.0.1:8000/api/health'
      );
    } finally {
      setLastChecked(new Date().toLocaleTimeString());
      setIsChecking(false);
    }
  };

  // Manual trigger via "Check Connection" button
  const handleManualCheck = () => {
    setIsChecking(true);
    setConnectionStatus('loading');
    setErrorMessage('');
    fetchHealth();
  };

  // Initial connection check on page load
  useEffect(() => {
    let isMounted = true;

    fetch(BACKEND_HEALTH_URL, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText || 'Backend returned an error'}`);
        }
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        if (data && data.status === 'healthy') {
          setHealthData(data);
          setConnectionStatus('connected');
        } else {
          throw new Error('Backend response did not match expected healthy status.');
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setHealthData(null);
        setConnectionStatus('error');
        setErrorMessage(
          err.message || 'Unable to reach the FastAPI backend server at http://127.0.0.1:8000/api/health'
        );
      })
      .finally(() => {
        if (!isMounted) return;
        setLastChecked(new Date().toLocaleTimeString());
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="portal-container" id="gcet-portal-root">
      {/* Top Navigation Bar */}
      <header className="portal-header" id="portal-header">
        <div className="portal-header-inner">
          <div className="portal-brand">
            <div className="brand-badge" aria-label="College Crest">
              <span>GCET</span>
            </div>
            <div className="brand-titles">
              <span className="brand-name">GCET Student Portal</span>
              <span className="brand-tagline">Geethanjali College of Engineering and Technology</span>
            </div>
          </div>

          <div className="header-status-pill" id="header-connection-pill">
            {connectionStatus === 'loading' && (
              <span className="pill pill-warning">
                <span className="dot dot-pulsing dot-warning"></span>
                <span>Connecting...</span>
              </span>
            )}
            {connectionStatus === 'connected' && (
              <span className="pill pill-success">
                <span className="dot dot-success"></span>
                <span>Backend connected</span>
              </span>
            )}
            {connectionStatus === 'error' && (
              <span className="pill pill-error">
                <span className="dot dot-error"></span>
                <span>Backend offline</span>
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="portal-main">
        {/* Hero Section */}
        <section className="hero-section" id="hero-section">
          <div className="hero-pill-badge">
            <span className="badge-icon">🏛️</span>
            <span>Autonomous Institution • Hyderabad, Telangana</span>
          </div>

          <h1 className="hero-title" id="portal-main-title">
            GCET Student Portal
          </h1>

          <p className="hero-description" id="portal-description">
            A modern, student-first digital campus platform engineered for fast, reliable access to
            attendance monitoring, dynamic class timetables, academic grades, fee status, and campus circulars.
          </p>

          {/* Backend Connection Status Card */}
          <div
            className={`connection-card status-${connectionStatus}`}
            id="backend-status-card"
            role="region"
            aria-live="polite"
          >
            <div className="card-header">
              <div className="card-header-title">
                <span className="indicator-icon">
                  {connectionStatus === 'loading' && '⏳'}
                  {connectionStatus === 'connected' && '✅'}
                  {connectionStatus === 'error' && '⚠️'}
                </span>
                <h3>Backend Connection Status</h3>
              </div>
              <button
                id="check-backend-button"
                className="btn-refresh"
                onClick={handleManualCheck}
                disabled={isChecking}
                aria-label="Refresh backend connection check"
              >
                {isChecking ? 'Checking...' : 'Check Connection'}
              </button>
            </div>

            <div className="card-body">
              {/* LOADING STATE */}
              {connectionStatus === 'loading' && (
                <div className="status-display state-loading" id="status-loading">
                  <div className="spinner" aria-hidden="true"></div>
                  <div className="status-text-group">
                    <h4 className="status-headline">Checking backend connection...</h4>
                    <p className="status-subtext">
                      Attempting to communicate with the FastAPI server at{' '}
                      <code>{BACKEND_HEALTH_URL}</code>
                    </p>
                  </div>
                </div>
              )}

              {/* CONNECTED STATE */}
              {connectionStatus === 'connected' && (
                <div className="status-display state-connected" id="status-connected">
                  <div className="status-success-banner">
                    <span className="live-dot-glow"></span>
                    <h4 className="status-headline" id="backend-connected-label">
                      Backend connected
                    </h4>
                  </div>
                  <p className="status-subtext">
                    The React frontend has successfully established communication with the FastAPI REST API.
                  </p>

                  {healthData && (
                    <div className="metadata-grid" id="backend-metadata">
                      <div className="meta-item">
                        <span className="meta-label">Service</span>
                        <span className="meta-value">{healthData.service}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">API Version</span>
                        <span className="meta-value">v{healthData.version}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Status</span>
                        <span className="meta-value meta-status-pill">{healthData.status}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Endpoint</span>
                        <span className="meta-value code-font">{BACKEND_HEALTH_URL}</span>
                      </div>
                    </div>
                  )}

                  {lastChecked && (
                    <div className="last-verified">
                      Verified at: <strong>{lastChecked}</strong>
                    </div>
                  )}
                </div>
              )}

              {/* ERROR STATE */}
              {connectionStatus === 'error' && (
                <div className="status-display state-error" id="status-error">
                  <div className="status-error-banner">
                    <span className="error-icon-dot">✕</span>
                    <h4 className="status-headline">Backend Connection Failed</h4>
                  </div>
                  <p className="error-description">
                    {errorMessage || 'Unable to connect to the backend API server.'}
                  </p>

                  <div className="troubleshooting-box">
                    <p className="troubleshooting-title">Quick Troubleshooting Guide:</p>
                    <ol className="troubleshooting-steps">
                      <li>
                        Confirm the FastAPI server is running in a terminal:
                        <pre><code>python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000</code></pre>
                      </li>
                      <li>
                        Verify the endpoint directly in your browser:{' '}
                        <a href={BACKEND_HEALTH_URL} target="_blank" rel="noreferrer">
                          {BACKEND_HEALTH_URL}
                        </a>
                      </li>
                      <li>Check that backend CORS allows <code>http://localhost:5173</code>.</li>
                    </ol>
                  </div>

                  {lastChecked && (
                    <div className="last-verified">
                      Last attempted check: <strong>{lastChecked}</strong>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Prototype Roadmap & Upcoming Modules (Synthetic/Demo Previews) */}
        <section className="modules-section" id="modules-preview-section">
          <div className="section-header">
            <span className="section-tag">Architecture & Modules</span>
            <h2 className="section-title">Planned Student Services</h2>
            <p className="section-subtitle">
              Phase 1 establishes the client-server foundation. Subsequent phases will integrate
              PostgreSQL storage, authentication, and comprehensive academic tools.
            </p>
          </div>

          <div className="modules-grid">
            <div className="module-card">
              <div className="module-icon">📊</div>
              <h3 className="module-name">Attendance Engine</h3>
              <p className="module-desc">
                Real-time tracking of subject-wise attendance with automatic 75% threshold alerts and
                shortage warnings.
              </p>
              <span className="module-status-badge">Phase 2: Database</span>
            </div>

            <div className="module-card">
              <div className="module-icon">🗓️</div>
              <h3 className="module-name">Timetable & Schedule</h3>
              <p className="module-desc">
                Interactive daily lecture schedule, laboratory slot allocations, and faculty room mappings.
              </p>
              <span className="module-status-badge">Phase 2: Database</span>
            </div>

            <div className="module-card">
              <div className="module-icon">🎓</div>
              <h3 className="module-name">Academic Results & CGPA</h3>
              <p className="module-desc">
                Semester-wise grade sheets, cumulative SGPA/CGPA analytics, and backlog status verification.
              </p>
              <span className="module-status-badge">Phase 3: Logic</span>
            </div>

            <div className="module-card">
              <div className="module-icon">📢</div>
              <h3 className="module-name">Campus Circulars</h3>
              <p className="module-desc">
                Official college announcements, examination notifications, holiday circulars, and event registrations.
              </p>
              <span className="module-status-badge">Phase 3: Logic</span>
            </div>

            <div className="module-card">
              <div className="module-icon">💳</div>
              <h3 className="module-name">Fee Management</h3>
              <p className="module-desc">
                Tuition and examination fee breakdowns, pending dues tracking, and payment receipt archives.
              </p>
              <span className="module-status-badge">Phase 4: Integrations</span>
            </div>

            <div className="module-card">
              <div className="module-icon">📱</div>
              <h3 className="module-name">Mobile Companion</h3>
              <p className="module-desc">
                Cross-platform React Native app for Android and iOS sharing the unified FastAPI backend.
              </p>
              <span className="module-status-badge">Phase 5: Mobile</span>
            </div>
          </div>
        </section>

        {/* Decoupled System Architecture Visualizer */}
        <section className="architecture-section" id="architecture-section">
          <div className="arch-card">
            <h3 className="arch-card-title">Approved Architecture Overview</h3>
            <div className="arch-flow">
              <div className="arch-node arch-active">
                <span className="node-badge">Web</span>
                <strong>React + Vite</strong>
                <span className="node-desc">Client Frontend (Port 5173)</span>
              </div>
              <div className="arch-connector">
                <span className="connector-label">REST API (CORS)</span>
                <span className="connector-arrow">⇄</span>
              </div>
              <div className="arch-node arch-active">
                <span className="node-badge">Backend</span>
                <strong>Python FastAPI</strong>
                <span className="node-desc">REST Server (Port 8000)</span>
              </div>
              <div className="arch-connector">
                <span className="connector-label">Planned</span>
                <span className="connector-arrow">⇄</span>
              </div>
              <div className="arch-node arch-future">
                <span className="node-badge node-future">Upcoming</span>
                <strong>PostgreSQL</strong>
                <span className="node-desc">Relational Database</span>
              </div>
            </div>
            <p className="arch-note">
              <strong>Architecture Principle:</strong> Frontends never connect directly to the database.
              All business logic, security policies, and queries are centrally mediated through the FastAPI backend.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="portal-footer" id="portal-footer">
        <div className="footer-content">
          <p className="footer-copyright">
            © 2026 Geethanjali College of Engineering and Technology — GCET Student Portal Prototype.
          </p>
          <div className="footer-links">
            <a
              href="http://127.0.0.1:8000/docs"
              target="_blank"
              rel="noreferrer"
              className="footer-link"
              id="api-docs-link"
            >
              Interactive API Docs (Swagger) ↗
            </a>
            <span className="footer-sep">•</span>
            <span className="footer-tag">Phase 1B: Frontend Foundation</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
