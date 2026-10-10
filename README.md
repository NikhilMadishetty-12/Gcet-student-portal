# GCET Student Portal

A modern, student-first portal prototype for GCET engineered to provide fast, reliable access to attendance tracking, timetables, academic results, fee status, announcements, college events, study notes, and achievements.

---

## Architecture & Technology Stack

The project follows a decoupled client-server architecture with a shared backend serving multiple clients:

- **Web Frontend:** React + Vite (JavaScript, local dev on port 5173)
- **Mobile Frontend:** React Native (planned)
- **Backend:** Python + FastAPI (REST API, business logic, attendance rules, port 8000)
- **Database:** PostgreSQL (relational storage with synthetic/demo student data)
- **Version Control:** Git & GitHub

> **Architecture Principle:** Frontends *never* connect directly to PostgreSQL. All data queries and business calculations are managed centrally through the FastAPI backend.

---

## Repository Structure

```text
Gcet-student-portal/
├── .gitignore               # Excludes secrets, virtual environments, caches, build artifacts
├── README.md                # Project documentation and quickstart instructions
├── backend/                 # FastAPI REST backend service
│   ├── app/
│   │   ├── __init__.py      # Backend package marker
│   │   └── main.py          # FastAPI application entrypoint with health check & CORS
│   ├── .env.example         # Safe environment variable template (placeholders only)
│   └── requirements.txt     # Minimal Python dependencies (FastAPI, Uvicorn)
├── frontend/                # React Web client (Vite)
│   ├── src/
│   │   ├── App.jsx          # Welcome page with backend connection indicator
│   │   ├── App.css          # Portal UI styling, glassmorphism & responsive layouts
│   │   ├── index.css        # Global CSS design tokens and theme variables
│   │   └── main.jsx         # React application entrypoint
│   ├── index.html           # HTML shell with Google Fonts & metadata
│   ├── package.json         # Frontend dependencies and NPM scripts
│   └── vite.config.js       # Vite build configuration (Port 5173)
├── mobile/                  # React Native Mobile client (planned for subsequent phase)
├── database/                # Database migrations and seed scripts (planned)
└── docs/                    # Architecture, PRD, TRD, DB schema, and API specs
```

---

## Local Development — Running the Backend

### 1. Prerequisites
- Python 3.10+ installed

### 2. Navigate to the Backend Directory
```powershell
cd backend
```

### 3. (Optional but recommended) Create and Activate a Virtual Environment
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

### 4. Install Dependencies
```powershell
pip install -r requirements.txt
```

### 5. Configure Environment Variables
Copy the placeholder environment file:
```powershell
cp .env.example .env
```

### 6. Start the Backend Server
Run Uvicorn with auto-reload:
```powershell
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

---

## Testing the Backend

Once the server is running:

- **Health Check Endpoint:**
  Open [http://127.0.0.1:8000/api/health](http://127.0.0.1:8000/api/health) in your browser or test via curl / PowerShell:
  ```powershell
  curl http://127.0.0.1:8000/api/health
  ```
  Expected Response:
  ```json
  {
    "status": "healthy",
    "service": "GCET Student Portal Backend",
    "version": "1.0.0"
  }
  ```

- **Interactive API Documentation (Swagger UI):**
  Open [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) in your browser to inspect and test the interactive API specification.

---

## Local Development — Running the Frontend

### 1. Prerequisites
- Node.js 18+ (tested with Node v24+)
- npm 9+ (comes with Node.js)

### 2. Navigate to the Frontend Directory
```powershell
cd frontend
```

### 3. Install Dependencies
```powershell
npm install
```

### 4. Start the Vite Development Server
```powershell
npm run dev
```

The portal client will start on `http://localhost:5173`.

### 5. Verify Frontend & Backend Integration
1. Ensure the FastAPI backend server is running on `http://127.0.0.1:8000`.
2. Open [http://localhost:5173](http://localhost:5173) in your web browser.
3. The GCET Student Portal welcome page will automatically send a request to `GET http://127.0.0.1:8000/api/health`.
4. The status indicator will display **"Backend connected"** in green once communication is established.
5. If the backend is not running, the card will display an informative error state with troubleshooting guidance and a **Check Connection** button to retry.

### 6. Building for Production
To generate an optimized static production bundle:
```powershell
npm run build
```
The output files will be compiled to `frontend/dist/`.
