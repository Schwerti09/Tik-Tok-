"""Plan definitions and tier management for ClipGenie."""

from enum import Enum


class Plan(str, Enum):
    FREE = "free"
    PRO = "pro"
    BUSINESS = "business"


PLAN_FEATURES = {
    Plan.FREE: {
        "watermark": True,
        "brand_kit": False,
        "team_access": False,
        "max_team_members": 0,
    },
    Plan.PRO: {
        "watermark": False,
        "brand_kit": True,
        "team_access": False,
        "max_team_members": 0,
    },
    Plan.BUSINESS: {
        "watermark": False,
        "brand_kit": True,
        "team_access": True,
        "max_team_members": None,  # unlimited
    },
}


def get_plan_features(plan: Plan) -> dict:
    """Return the feature set for a given plan."""
    return PLAN_FEATURES[plan]


def has_feature(plan: Plan, feature: str) -> bool:
    """Check whether a plan includes a specific feature."""
    return bool(PLAN_FEATURES[plan].get(feature, False))
