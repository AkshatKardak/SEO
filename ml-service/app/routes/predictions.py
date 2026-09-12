from fastapi import APIRouter, HTTPException
from ..schemas.prediction import OpportunityRankRequest, OpportunityRankResponse
from ..models.opportunity_ranker import opportunity_ranker

router = APIRouter(prefix="/predictions", tags=["Predictions"])

@router.post("/rank-opportunities", response_model=OpportunityRankResponse)
def rank_opportunities(payload: OpportunityRankRequest):
    """
    Ranks growth opportunities using ML-calibrated success probability,
    predicting traffic/conversion lift and extracting contributing signals.
    """
    try:
        ranked = opportunity_ranker.rank_all(
            opportunities=payload.opportunities,
            growth_goal=payload.growthGoal or "Increase SaaS signups",
            history_count=payload.historicalExperimentCount or 0
        )
        return OpportunityRankResponse(
            domain=payload.domain,
            rankedOpportunities=ranked,
            totalEvaluated=len(ranked),
            modelVersion="v1.2-ensemble",
            learningMode=payload.historicalExperimentCount < 2
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ML Opportunity ranking failed: {str(e)}")
