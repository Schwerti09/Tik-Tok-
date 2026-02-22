"""Team-access management for Business-plan accounts."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict, List, Optional

from clipgenie.plans import Plan, has_feature, get_plan_features


@dataclass
class TeamMember:
    """Represents a member of a business-plan team."""

    user_id: str
    email: str
    role: str = "member"


class TeamManager:
    """Manages the set of users that share a Business-plan account.

    Args:
        owner_id: The user ID of the account owner.
        plan:     The subscription plan for this account.
    """

    def __init__(self, owner_id: str, plan: Plan) -> None:
        self._owner_id = owner_id
        self._plan = plan
        self._members: Dict[str, TeamMember] = {}

    @property
    def plan(self) -> Plan:
        return self._plan

    @property
    def owner_id(self) -> str:
        return self._owner_id

    def _require_team_access(self) -> None:
        if not has_feature(self._plan, "team_access"):
            raise PermissionError(
                f"Team access is not available on the {self._plan.value!r} plan. "
                "Upgrade to Business to use this feature."
            )

    def _check_member_limit(self) -> None:
        max_members = get_plan_features(self._plan)["max_team_members"]
        if max_members is not None and len(self._members) >= max_members:
            raise ValueError(
                f"Team member limit of {max_members} reached for the "
                f"{self._plan.value!r} plan."
            )

    def add_member(
        self, user_id: str, email: str, role: str = "member"
    ) -> TeamMember:
        """Add a new member to the team.

        Args:
            user_id: Unique identifier for the user being added.
            email:   Email address of the new member.
            role:    Role within the team (default: ``"member"``).

        Returns:
            The newly created :class:`TeamMember`.

        Raises:
            PermissionError: If team access is not included in the current plan.
            ValueError:      If the member already exists or the limit is exceeded.
        """
        self._require_team_access()
        self._check_member_limit()

        if user_id in self._members:
            raise ValueError(f"User {user_id!r} is already a team member.")

        member = TeamMember(user_id=user_id, email=email, role=role)
        self._members[user_id] = member
        return member

    def remove_member(self, user_id: str) -> TeamMember:
        """Remove a member from the team.

        Args:
            user_id: The ID of the member to remove.

        Returns:
            The removed :class:`TeamMember`.

        Raises:
            PermissionError: If team access is not included in the current plan.
            KeyError:        If the user ID is not found in the team.
        """
        self._require_team_access()

        if user_id not in self._members:
            raise KeyError(f"User {user_id!r} is not a team member.")

        return self._members.pop(user_id)

    def list_members(self) -> List[TeamMember]:
        """Return all current team members.

        Raises:
            PermissionError: If team access is not included in the current plan.
        """
        self._require_team_access()
        return list(self._members.values())

    def get_member(self, user_id: str) -> Optional[TeamMember]:
        """Look up a team member by user ID.

        Raises:
            PermissionError: If team access is not included in the current plan.
        """
        self._require_team_access()
        return self._members.get(user_id)
