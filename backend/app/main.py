from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="GCET Student Portal API",
    description="Backend REST API for the GCET Student Portal prototype.",
    version="1.0.0",
)

# Specific origins allowed for local development
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# Configure CORS to allow communication with local frontend clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health", tags=["Health"])
def health_check():
    """
    Health check endpoint to verify that the backend API is up and running.
    """
    return {
        "status": "healthy",
        "service": "GCET Student Portal Backend",
        "version": "1.0.0",
    }
