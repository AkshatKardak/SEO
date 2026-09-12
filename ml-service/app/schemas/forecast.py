from pydantic import BaseModel, Field
from typing import List, Optional

class HistoricalPoint(BaseModel):
    date: str
    value: float

class ForecastPoint(BaseModel):
    date: str
    predicted: float
    lowerBound: float
    upperBound: float

class GrowthForecastRequest(BaseModel):
    domain: str
    metricName: str  # "organic_traffic" | "keyword_visibility" | "conversions" | "ai_visibility"
    historicalData: List[HistoricalPoint]
    forecastDays: int = Field(default=30, ge=7, le=90)
    confidenceInterval: float = Field(default=0.95, ge=0.8, le=0.99)

class GrowthForecastResponse(BaseModel):
    domain: str
    metricName: str
    currentValue: float
    forecastDays: int
    projectedRangeMin: float
    projectedRangeMax: float
    projectedGrowthPercent: float
    confidenceScore: float
    historicalPoints: List[HistoricalPoint]
    forecastPoints: List[ForecastPoint]
    topGrowthDrivers: List[str]
    modelUsed: str
    learningMode: bool = False
