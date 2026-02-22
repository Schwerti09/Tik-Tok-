"""Tests for Free-tier watermark behaviour in clip rendering."""

import pytest
from clipgenie import Plan, RenderOptions, RenderedClip, WATERMARK_TEXT, render_clip


def _make_options(**kwargs) -> RenderOptions:
    defaults = {"title": "My Clip", "duration_seconds": 15.0}
    defaults.update(kwargs)
    return RenderOptions(**defaults)


class TestWatermarkFreePlan:
    def test_free_clip_has_watermark(self):
        clip = render_clip(_make_options(), Plan.FREE)
        assert clip.watermark == WATERMARK_TEXT

    def test_watermark_text_is_clipgenie(self):
        assert WATERMARK_TEXT == "ClipGenie"

    def test_free_clip_watermark_is_not_none(self):
        clip = render_clip(_make_options(), Plan.FREE)
        assert clip.watermark is not None

    def test_free_clip_metadata_records_plan(self):
        clip = render_clip(_make_options(), Plan.FREE)
        assert clip.metadata["plan"] == "free"

    def test_free_clip_preserves_title_and_duration(self):
        clip = render_clip(_make_options(title="Test", duration_seconds=30.0), Plan.FREE)
        assert clip.title == "Test"
        assert clip.duration_seconds == 30.0


class TestNoWatermarkOnPaidPlans:
    def test_pro_clip_has_no_watermark(self):
        clip = render_clip(_make_options(), Plan.PRO)
        assert clip.watermark is None

    def test_business_clip_has_no_watermark(self):
        clip = render_clip(_make_options(), Plan.BUSINESS)
        assert clip.watermark is None

    def test_pro_metadata_records_plan(self):
        clip = render_clip(_make_options(), Plan.PRO)
        assert clip.metadata["plan"] == "pro"

    def test_business_metadata_records_plan(self):
        clip = render_clip(_make_options(), Plan.BUSINESS)
        assert clip.metadata["plan"] == "business"
