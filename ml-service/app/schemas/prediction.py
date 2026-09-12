from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class OpportunityInput(BaseModel):
    id: Optional[str] = None
    title: str
    type: str
    impactScore: float = Field(default=5.0, ge=1.0, le=10.0)
    effortScore: float = Field(default=5.0, ge=1.0, le=10.0)
    confidenceScore: float = Field(default=0.7, ge=0.0, le=1.0)
    pageType: Optional[str] = "landing"
    currentRank: Optional[float] = None
    searchVolume: Optional[float] = None
    impressions: Optional[float] = None
    clicks: Optional[float] = None
    historicalConversionRate: Optional[float] = None
    competitorCoverageScore: Optional[float] = 0.5
    contentDepthScore: Optional[float] = 0.6
    technicalSeverity: Optional[float] = 0.4

class ContributingSignal(BaseModel):
    name: str
    impact: str
    isPositive: bool

class OpportunityPrediction(BaseModel):
    id: Optional[str] = None
    title: str
    predictedImpactScore: float
    successProbability: float  # 0 - 100 percentage
    expectedTrafficLift: str   # e.g., "+8-15%"
    expectedConversionLift: str # e.g., "+3-7%"
    priorityScore: float
    confidenceLevel: str       # "high" | "medium" | "low" | "learning"
    contributingSignals: List[ContributingSignal]
    isMlPredicted: bool = True
    learningMode: bool = False

class OpportunityRankRequest(BaseModel):
    domain: str
    growthGoal: Optional[str] = "Increase SaaS signups"
    opportunities: List[OpportunityInput]
    historicalExperimentCount: Optional[int] = 0

class OpportunityRankResponse(BaseModel):
    domain: str
    rankedOpportunities: List[OpportunityPrediction]
    totalEvaluated: int
    modelVersion: str = "v1.2-ensemble"
    learningMode: bool = False
