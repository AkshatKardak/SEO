from fastapi import APIRouter, HTTPException
from ..schemas.forecast import GrowthForecastRequest, GrowthForecastResponse
from ..models.traffic_forecaster import traffic_forecaster

router = APIRouter(prefix="/forecasts", tags=["Forecasts"])

@router.post("/growth", response_model=GrowthForecastResponse)
def forecast_growth(payload: GrowthForecastRequest):
    """
    Computes time-series growth projection and 95% confidence intervals
    for organic traffic, keyword visibility, and conversions.
    """
    try:
        res = traffic_forecaster.forecast(
            domain=payload.domain,
            metric_name=payload.metricName,
            historical_data=payload.historicalData,
            forecast_days=payload.forecastDays,
            confidence_interval=payload.confidenceInterval
        )
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Growth forecasting failed: {str(e)}")
