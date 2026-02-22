"""Tests for Team Access (Business plan)."""

import pytest
from clipgenie import Plan, TeamMember, TeamManager


class TestTeamManagerBusinessPlan:
    def test_add_member(self):
        mgr = TeamManager(owner_id="owner1", plan=Plan.BUSINESS)
        member = mgr.add_member("user1", "user1@example.com")
        assert isinstance(member, TeamMember)
        assert member.user_id == "user1"
        assert member.email == "user1@example.com"
        assert member.role == "member"

    def test_add_member_with_custom_role(self):
        mgr = TeamManager(owner_id="owner1", plan=Plan.BUSINESS)
        member = mgr.add_member("admin1", "admin@example.com", role="admin")
        assert member.role == "admin"

    def test_list_members_returns_all(self):
        mgr = TeamManager(owner_id="owner1", plan=Plan.BUSINESS)
        mgr.add_member("u1", "u1@example.com")
        mgr.add_member("u2", "u2@example.com")
        members = mgr.list_members()
        assert len(members) == 2
        user_ids = {m.user_id for m in members}
        assert user_ids == {"u1", "u2"}

    def test_list_members_empty_initially(self):
        mgr = TeamManager(owner_id="owner1", plan=Plan.BUSINESS)
        assert mgr.list_members() == []

    def test_remove_member(self):
        mgr = TeamManager(owner_id="owner1", plan=Plan.BUSINESS)
        mgr.add_member("u1", "u1@example.com")
        removed = mgr.remove_member("u1")
        assert removed.user_id == "u1"
        assert mgr.list_members() == []

    def test_get_member_returns_correct_member(self):
        mgr = TeamManager(owner_id="owner1", plan=Plan.BUSINESS)
        mgr.add_member("u1", "u1@example.com")
        member = mgr.get_member("u1")
        assert member is not None
        assert member.email == "u1@example.com"

    def test_get_member_returns_none_for_unknown(self):
        mgr = TeamManager(owner_id="owner1", plan=Plan.BUSINESS)
        assert mgr.get_member("unknown") is None

    def test_duplicate_member_raises_value_error(self):
        mgr = TeamManager(owner_id="owner1", plan=Plan.BUSINESS)
        mgr.add_member("u1", "u1@example.com")
        with pytest.raises(ValueError, match="already a team member"):
            mgr.add_member("u1", "other@example.com")

    def test_remove_nonexistent_member_raises_key_error(self):
        mgr = TeamManager(owner_id="owner1", plan=Plan.BUSINESS)
        with pytest.raises(KeyError):
            mgr.remove_member("ghost")

    def test_multiple_members_can_be_added(self):
        mgr = TeamManager(owner_id="owner1", plan=Plan.BUSINESS)
        for i in range(10):
            mgr.add_member(f"user{i}", f"user{i}@example.com")
        assert len(mgr.list_members()) == 10


class TestTeamManagerFreePlanBlocked:
    def test_free_add_member_raises_permission_error(self):
        mgr = TeamManager(owner_id="owner1", plan=Plan.FREE)
        with pytest.raises(PermissionError, match="Team access"):
            mgr.add_member("u1", "u1@example.com")

    def test_free_list_members_raises_permission_error(self):
        mgr = TeamManager(owner_id="owner1", plan=Plan.FREE)
        with pytest.raises(PermissionError, match="Team access"):
            mgr.list_members()

    def test_free_remove_member_raises_permission_error(self):
        mgr = TeamManager(owner_id="owner1", plan=Plan.FREE)
        with pytest.raises(PermissionError, match="Team access"):
            mgr.remove_member("u1")

    def test_free_get_member_raises_permission_error(self):
        mgr = TeamManager(owner_id="owner1", plan=Plan.FREE)
        with pytest.raises(PermissionError, match="Team access"):
            mgr.get_member("u1")

    def test_error_message_mentions_upgrade(self):
        mgr = TeamManager(owner_id="owner1", plan=Plan.FREE)
        with pytest.raises(PermissionError, match="Business"):
            mgr.add_member("u1", "u1@example.com")


class TestTeamManagerProPlanBlocked:
    def test_pro_add_member_raises_permission_error(self):
        mgr = TeamManager(owner_id="owner1", plan=Plan.PRO)
        with pytest.raises(PermissionError, match="Team access"):
            mgr.add_member("u1", "u1@example.com")
