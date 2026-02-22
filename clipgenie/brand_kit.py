"""Brand-Kit management for Pro and Business plan users."""

from dataclasses import dataclass, field
from typing import Optional

from clipgenie.plans import Plan, has_feature


@dataclass
class BrandKit:
    """Holds a user's brand assets for use in generated clips."""

    font: Optional[str] = None
    primary_color: Optional[str] = None
    logo_path: Optional[str] = None
    extra: dict = field(default_factory=dict)


class BrandKitManager:
    """Manages brand-kit settings for a single account."""

    def __init__(self, plan: Plan) -> None:
        self._plan = plan
        self._kit = BrandKit()

    @property
    def plan(self) -> Plan:
        return self._plan

    def _require_brand_kit(self) -> None:
        if not has_feature(self._plan, "brand_kit"):
            raise PermissionError(
                f"Brand-Kit is not available on the {self._plan.value!r} plan. "
                "Upgrade to Pro or Business to use this feature."
            )

    def update(
        self,
        *,
        font: Optional[str] = None,
        primary_color: Optional[str] = None,
        logo_path: Optional[str] = None,
        **kwargs: object,
    ) -> BrandKit:
        """Update brand-kit settings.

        Args:
            font:          Custom font name or URL.
            primary_color: Hex colour string (e.g. ``"#FF5733"``).
            logo_path:     File path or URL to the brand logo.
            **kwargs:      Additional brand metadata stored in ``extra``.

        Returns:
            The updated :class:`BrandKit` instance.

        Raises:
            PermissionError: If the current plan does not include Brand-Kit.
        """
        self._require_brand_kit()

        if font is not None:
            self._kit.font = font
        if primary_color is not None:
            self._kit.primary_color = primary_color
        if logo_path is not None:
            self._kit.logo_path = logo_path
        if kwargs:
            self._kit.extra.update(kwargs)

        return self._kit

    def get(self) -> BrandKit:
        """Return the current brand kit.

        Raises:
            PermissionError: If the current plan does not include Brand-Kit.
        """
        self._require_brand_kit()
        return self._kit
