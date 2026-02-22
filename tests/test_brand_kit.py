"""Tests for the Brand-Kit feature (Pro and Business plans)."""

import pytest
from clipgenie import Plan, BrandKit, BrandKitManager


class TestBrandKitProPlan:
    def test_pro_can_set_font(self):
        mgr = BrandKitManager(Plan.PRO)
        kit = mgr.update(font="Roboto")
        assert kit.font == "Roboto"

    def test_pro_can_set_primary_color(self):
        mgr = BrandKitManager(Plan.PRO)
        kit = mgr.update(primary_color="#FF5733")
        assert kit.primary_color == "#FF5733"

    def test_pro_can_set_logo_path(self):
        mgr = BrandKitManager(Plan.PRO)
        kit = mgr.update(logo_path="/assets/logo.png")
        assert kit.logo_path == "/assets/logo.png"

    def test_pro_update_all_fields(self):
        mgr = BrandKitManager(Plan.PRO)
        kit = mgr.update(font="Montserrat", primary_color="#123456", logo_path="/logo.svg")
        assert kit.font == "Montserrat"
        assert kit.primary_color == "#123456"
        assert kit.logo_path == "/logo.svg"

    def test_pro_get_returns_brand_kit(self):
        mgr = BrandKitManager(Plan.PRO)
        mgr.update(font="Arial")
        kit = mgr.get()
        assert isinstance(kit, BrandKit)
        assert kit.font == "Arial"

    def test_pro_extra_kwargs_stored(self):
        mgr = BrandKitManager(Plan.PRO)
        mgr.update(secondary_color="#AABBCC")
        kit = mgr.get()
        assert kit.extra["secondary_color"] == "#AABBCC"


class TestBrandKitBusinessPlan:
    def test_business_can_update_brand_kit(self):
        mgr = BrandKitManager(Plan.BUSINESS)
        kit = mgr.update(font="Open Sans", primary_color="#000000", logo_path="/b.png")
        assert kit.font == "Open Sans"

    def test_business_get_returns_kit(self):
        mgr = BrandKitManager(Plan.BUSINESS)
        mgr.update(font="Lato")
        assert mgr.get().font == "Lato"


class TestBrandKitFreePlanBlocked:
    def test_free_update_raises_permission_error(self):
        mgr = BrandKitManager(Plan.FREE)
        with pytest.raises(PermissionError, match="Brand-Kit"):
            mgr.update(font="Comic Sans")

    def test_free_get_raises_permission_error(self):
        mgr = BrandKitManager(Plan.FREE)
        with pytest.raises(PermissionError, match="Brand-Kit"):
            mgr.get()

    def test_error_message_mentions_upgrade(self):
        mgr = BrandKitManager(Plan.FREE)
        with pytest.raises(PermissionError, match="Upgrade"):
            mgr.update(font="Arial")
