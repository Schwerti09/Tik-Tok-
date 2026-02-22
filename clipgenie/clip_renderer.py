"""Clip rendering with optional ClipGenie watermark for the Free plan."""

from dataclasses import dataclass, field
from typing import Optional

from clipgenie.plans import Plan, has_feature

WATERMARK_TEXT = "ClipGenie"


@dataclass
class RenderOptions:
    """Options controlling how a clip is rendered."""

    title: str
    duration_seconds: float
    # Brand-kit fields populated by the Pro/Business renderer
    font: Optional[str] = None
    primary_color: Optional[str] = None
    logo_path: Optional[str] = None


@dataclass
class RenderedClip:
    """Represents the result of a rendered clip."""

    title: str
    duration_seconds: float
    watermark: Optional[str] = None
    font: Optional[str] = None
    primary_color: Optional[str] = None
    logo_path: Optional[str] = None
    metadata: dict = field(default_factory=dict)


def render_clip(options: RenderOptions, plan: Plan) -> RenderedClip:
    """Render a clip, adding a watermark for Free-tier users.

    Args:
        options: Rendering options (title, duration, optional brand settings).
        plan:    The user's subscription plan.

    Returns:
        A :class:`RenderedClip` containing the rendered result.  Free-tier
        clips always include the ``ClipGenie`` watermark text.
    """
    watermark = WATERMARK_TEXT if has_feature(plan, "watermark") else None

    clip = RenderedClip(
        title=options.title,
        duration_seconds=options.duration_seconds,
        watermark=watermark,
        font=options.font,
        primary_color=options.primary_color,
        logo_path=options.logo_path,
    )

    clip.metadata["plan"] = plan.value
    return clip
