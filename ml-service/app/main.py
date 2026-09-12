from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import predictions, anomalies, forecasts

app = FastAPI(
    title="SerpoAI Machine Learning Engine",
    description="Autonomous Growth Engineering ML Service for Opportunity Ranking, Anomaly Detection & Growth Forecasting",
    version="1.0.0"
)

# Enable CORS for internal services
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predictions.router, prefix="/api/ml")
app.include_router(anomalies.router, prefix="/api/ml")
app.include_router(forecasts.router, prefix="/api/ml")

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "SerpoAI ML Service",
        "version": "1.0.0",
        "capabilities": [
            "Smart Opportunity Ranking (ICE + ML Lift)",
            "SEO Anomaly Radar (Deviation + Contributing Signals)",
            "30-Day Growth Forecasting (Autoregressive + Confidence Bands)"
        ]
    }

@app.get("/health")
def health():
    return {"status": "healthy", "service": "ml-service"}
