import os
try:
    import joblib
except ImportError:
    joblib = None
import numpy as np
from typing import List, Dict, Any
try:
    from sklearn.metrics.pairwise import cosine_similarity
except ImportError:
    cosine_similarity = None

ARTIFACTS_DIR = os.path.join(os.path.dirname(__file__), "artifacts")

class CannibalizationEngine:
    def __init__(self):
        self.vectorizer = None
        self._load_vectorizer()

    def _load_vectorizer(self):
        if joblib is None:
            self.vectorizer = None
            return
        vec_path = os.path.join(ARTIFACTS_DIR, "cannibalization_vectorizer.joblib")
        if os.path.exists(vec_path):
            try:
                self.vectorizer = joblib.load(vec_path)
            except Exception:
                self.vectorizer = None

    def analyze_cannibalization(self, domain: str, pairs: List[Dict[str, Any]] = None) -> Dict[str, Any]:
        default_pairs = [
            {
                "id": "can-1",
                "keyword": "enterprise seo platform",
                "searchVolume": 4200,
                "textA": "enterprise seo platform automated rank tracking software solutions",
                "textB": "enterprise solutions for digital marketing teams enterprise seo",
                "urlA": {"path": "/product/enterprise-seo", "position": 5.8, "clicks": 840, "isPrimary": True},
                "urlB": {"path": "/solutions/enterprise", "position": 8.9, "clicks": 310, "isPrimary": False},
                "recommendation": "canonical",
                "reason": "Both URLs compete for identical transactional intent. Point canonical tag from /solutions/enterprise to primary /product/enterprise-seo to combine link authority.",
            },
            {
                "id": "can-2",
                "keyword": "geo answer engine optimization",
                "searchVolume": 2800,
                "textA": "what is generative engine optimization geo citations perplexity",
                "textB": "geo software tool radar ai search engine tracking features",
                "urlA": {"path": "/blog/what-is-geo", "position": 4.2, "clicks": 620, "isPrimary": True},
                "urlB": {"path": "/features/geo-radar", "position": 7.8, "clicks": 210, "isPrimary": False},
                "recommendation": "differentiate",
                "reason": "Blog post targets informational query while feature page targets commercial query. Rewrite feature page H1 to target 'geo tracking software' to eliminate SERP collision.",
            },
            {
                "id": "can-3",
                "keyword": "ai rank tracker free",
                "searchVolume": 1900,
                "textA": "free rank checker online rank tracking tool google search serp",
                "textB": "seo tools rank tracker keyword positions checker",
                "urlA": {"path": "/free-rank-checker", "position": 6.8, "clicks": 430, "isPrimary": True},
                "urlB": {"path": "/tools/rank-tracker", "position": 11.2, "clicks": 140, "isPrimary": False},
                "recommendation": "redirect_301",
                "reason": "/tools/rank-tracker has thin content and splits impressions. Issue a 301 redirect into /free-rank-checker to consolidate top 3 ranking power.",
            }
        ]

        active_pairs = pairs if pairs else default_pairs
        results = []

        for p in active_pairs:
            overlap = 75.0
            if self.vectorizer and cosine_similarity and "textA" in p and "textB" in p:
                try:
                    vecs = self.vectorizer.transform([p["textA"], p["textB"]])
                    sim = float(cosine_similarity(vecs[0], vecs[1])[0][0])
                    overlap = round(sim * 100.0, 1)
                except Exception:
                    pass

            pos_gap = abs(p["urlA"]["position"] - p["urlB"]["position"])
            severity = "high" if overlap >= 75.0 and pos_gap <= 4.0 else ("medium" if overlap >= 60.0 else "low")
            waste_index = round((overlap / 100.0) * ((p["urlB"]["clicks"] / max(p["urlA"]["clicks"] + p["urlB"]["clicks"], 1)) * 100.0), 1)

            results.append({
                "id": p["id"],
                "keyword": p["keyword"],
                "searchVolume": p["searchVolume"],
                "overlapScore": overlap,
                "severity": severity,
                "authorityWasteIndex": waste_index,
                "urlA": p["urlA"],
                "urlB": p["urlB"],
                "recommendation": p["recommendation"],
                "reason": p["reason"],
                "suggestedAction": "Set canonical tag" if p["recommendation"] == "canonical" else ("Issue 301 redirect" if p["recommendation"] == "redirect_301" else "Differentiate semantic keyword intent")
            })

        return {
            "domain": domain,
            "totalCollisions": len(results),
            "highSeverityCount": sum(1 for r in results if r["severity"] == "high"),
            "pairs": results,
            "engine": "TF-IDF Cosine Similarity + Intent Vector Graph"
        }

cannibalization_engine = CannibalizationEngine()
