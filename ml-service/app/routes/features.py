from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from ..models.cannibalization_engine import cannibalization_engine
from ..models.gsc_ctr_engine import gsc_ctr_engine
from ..models.patch_verifier import patch_verifier

router = APIRouter(tags=["ML Features"])

class CannibalizationRequest(BaseModel):
    domain: str
    pairs: Optional[List[Dict[str, Any]]] = None

class GSCRequest(BaseModel):
    domain: str

class VerifyPatchRequest(BaseModel):
    opportunityId: str
    patchCode: str
    targetFile: Optional[str] = "src/pages/index.tsx"

@router.post("/cannibalization")
def get_cannibalization(req: CannibalizationRequest):
    return cannibalization_engine.analyze_cannibalization(req.domain, req.pairs)

@router.post("/gsc-quick-wins")
def get_gsc_quick_wins(req: GSCRequest):
    return gsc_ctr_engine.analyze_striking_distance(req.domain)

@router.post("/verify-patch")
def verify_patch(req: VerifyPatchRequest):
    return patch_verifier.verify_patch(req.opportunityId, req.patchCode, req.targetFile)
