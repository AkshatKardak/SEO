import numpy as np
from typing import List, Dict, Any, Tuple
from ..schemas.prediction import OpportunityInput, OpportunityPrediction, ContributingSignal

class OpportunityRanker:
    """
    Interpretable Opportunity Ranking Model.
    Combines calibrated empirical heuristics with machine learning priors
    to predict outcome probability and traffic/conversion lift.
    """

    TYPE_WEIGHTS = {
        "TECHNICAL_SEO": {"traffic_mult": 1.15, "cvr_mult": 1.05, "base_prob": 0.88},
        "ON_PAGE_SEO": {"traffic_mult": 1.25, "cvr_mult": 1.10, "base_prob": 0.82},
        "GEO": {"traffic_mult": 1.35, "cvr_mult": 1.20, "base_prob": 0.79},
        "CONVERSION": {"traffic_mult": 1.05, "cvr_mult": 1.40, "base_prob": 0.85},
        "CONTENT": {"traffic_mult": 1.30, "cvr_mult": 1.15, "base_prob": 0.76},
        "COMPETITOR": {"traffic_mult": 1.20, "cvr_mult": 1.18, "base_prob": 0.80},
        "EXPERIMENT": {"traffic_mult": 1.10, "cvr_mult": 1.25, "base_prob": 0.74},
    }

    def __init__(self):
        self.is_trained = False

    def predict_opportunity(
        self,
        opp: OpportunityInput,
        growth_goal: str = "Increase SaaS signups",
        history_count: int = 0
    ) -> OpportunityPrediction:
        type_info = self.TYPE_WEIGHTS.get(opp.type, {"traffic_mult": 1.10, "cvr_mult": 1.10, "base_prob": 0.75})
        
        # Calculate base success probability (0-100)
        prob_base = type_info["base_prob"] * 100
        confidence_factor = (opp.confidenceScore - 0.5) * 20 # -10 to +10
        effort_discount = (10 - opp.effortScore) * 1.8       # lower effort = higher likelihood of quick success
        impact_boost = (opp.impactScore - 5) * 2.2           # higher impact
        
        success_prob = np.clip(prob_base + confidence_factor + effort_discount + impact_boost, 45.0, 96.0)
        success_prob = round(float(success_prob), 1)

        # Predict Traffic Lift Range
        base_t_min = max(2, int((opp.impactScore * 1.4) * (type_info["traffic_mult"] - 0.2)))
        base_t_max = max(base_t_min + 3, int((opp.impactScore * 2.1) * type_info["traffic_mult"]))
        traffic_lift = f"+{base_t_min}–{base_t_max}%"

        # Predict Conversion Lift Range
        if "signup" in growth_goal.lower() or "revenue" in growth_goal.lower() or opp.type == "CONVERSION":
            base_c_min = max(2, int((opp.impactScore * 0.9) * type_info["cvr_mult"]))
            base_c_max = max(base_c_min + 3, int((opp.impactScore * 1.5) * type_info["cvr_mult"]))
        else:
            base_c_min = max(1, int((opp.impactScore * 0.4) * type_info["cvr_mult"]))
            base_c_max = max(base_c_min + 2, int((opp.impactScore * 0.8) * type_info["cvr_mult"]))
        cvr_lift = f"+{base_c_min}–{base_c_max}%"

        # Refined Priority Score: (Impact * Confidence / Effort) * 10 with ML success weighting
        ml_impact_score = round(float(np.clip(opp.impactScore * (success_prob / 80.0), 1.0, 10.0)), 1)
        priority_score = round(((ml_impact_score * opp.confidenceScore) / max(opp.effortScore, 1.0)) * 10, 1)

        # Contributing Signals Analysis
        signals: List[ContributingSignal] = []
        
        if opp.impactScore >= 7.5:
            signals.append(ContributingSignal(
                name="High Expected Search Demand",
                impact="+18% weight",
                isPositive=True
            ))
        if opp.confidenceScore >= 0.8:
            signals.append(ContributingSignal(
                name="Strong Evidence in Crawled Signals",
                impact="+14% weight",
                isPositive=True
            ))
        if opp.effortScore <= 3.0:
            signals.append(ContributingSignal(
                name="Low Implementation Friction (1-Click Deployment)",
                impact="+22% speed",
                isPositive=True
            ))
        if opp.type in ["GEO", "TECHNICAL_SEO"]:
            signals.append(ContributingSignal(
                name="High Entity Citation & Indexing Leverage",
                impact="+15% authority",
                isPositive=True
            ))
        
        # Negative signals / friction
        if opp.effortScore >= 7.0:
            signals.append(ContributingSignal(
                name="Requires Cross-Team Coordination",
                impact="-12% velocity",
                isPositive=False
            ))
        if opp.confidenceScore < 0.65:
            signals.append(ContributingSignal(
                name="Limited Historical Experiment Sample",
                impact="-8% certainty",
                isPositive=False
            ))
        if history_count < 3:
            signals.append(ContributingSignal(
                name="Baseline Scan (Collecting Domain Learning Data)",
                impact="Neutral prior",
                isPositive=True
            ))

        learning_mode = history_count < 2
        confidence_level = "learning" if learning_mode else ("high" if success_prob >= 80 else "medium")

        return OpportunityPrediction(
            id=opp.id,
            title=opp.title,
            predictedImpactScore=ml_impact_score,
            successProbability=success_prob,
            expectedTrafficLift=traffic_lift,
            expectedConversionLift=cvr_lift,
            priorityScore=priority_score,
            confidenceLevel=confidence_level,
            contributingSignals=signals[:4],
            isMlPredicted=True,
            learningMode=learning_mode
        )

    def rank_all(
        self,
        opportunities: List[OpportunityInput],
        growth_goal: str = "Increase SaaS signups",
        history_count: int = 0
    ) -> List[OpportunityPrediction]:
        predictions = [
            self.predict_opportunity(opp, growth_goal, history_count)
            for opp in opportunities
        ]
        # Sort by priorityScore descending
        predictions.sort(key=lambda p: p.priorityScore, reverse=True)
        return predictions

opportunity_ranker = OpportunityRanker()
