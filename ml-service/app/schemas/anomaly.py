from pydantic import BaseModel, Field
from typing import List, Optional

class MetricDataPoint(BaseModel):
    timestamp: str
    value: float

class AnomalyDetectRequest(BaseModel):
    domain: str
    metricName: str  # e.g., "organic_traffic", "impressions", "ctr", "average_rank", "core_web_vitals"
    history: List[MetricDataPoint]
    currentValue: float
    contextSignals: Optional[List[str]] = []

class AnomalyItem(BaseModel):
    metric: str
    isAnomaly: bool
    severity: str  # "critical" | "warning" | "info" | "normal"
    expectedValue: float
    actualValue: float
    percentageChange: float
    confidence: float
    likelyContributors: List[str]
    investigationAction: str

class AnomalyDetectResponse(BaseModel):
    domain: str
    anomaliesFound: int
    anomalies: List[AnomalyItem]
    scanTimestamp: str
    learningMode: bool = False
