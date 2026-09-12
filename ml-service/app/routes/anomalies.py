from fastapi import APIRouter, HTTPException
from ..schemas.anomaly import AnomalyDetectRequest, AnomalyDetectResponse
from ..models.anomaly_detector import anomaly_detector

router = APIRouter(prefix="/anomalies", tags=["Anomalies"])

@router.post("/detect", response_model=AnomalyDetectResponse)
def detect_anomalies(payload: AnomalyDetectRequest):
    """
    Detects statistical anomalies across traffic, CTR, impressions, and rankings
    with likely contributing factors.
    """
    try:
        res = anomaly_detector.detect(
            domain=payload.domain,
            metric_name=payload.metricName,
            history=payload.history,
            current_val=payload.currentValue,
            context_signals=payload.contextSignals
        )
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Anomaly detection failed: {str(e)}")
