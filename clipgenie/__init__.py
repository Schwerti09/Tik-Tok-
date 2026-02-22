"""ClipGenie – video clip generation with plan-based feature gating."""

from clipgenie.plans import Plan, get_plan_features, has_feature
from clipgenie.clip_renderer import render_clip, RenderOptions, RenderedClip, WATERMARK_TEXT
from clipgenie.brand_kit import BrandKit, BrandKitManager
from clipgenie.team import TeamMember, TeamManager

__all__ = [
    "Plan",
    "get_plan_features",
    "has_feature",
    "render_clip",
    "RenderOptions",
    "RenderedClip",
    "WATERMARK_TEXT",
    "BrandKit",
    "BrandKitManager",
    "TeamMember",
    "TeamManager",
]
