interface SlackTeam {
  id: string;
  name: string;
}

export interface SlackMember {
  id: string;
  teamId: string;
  name: string;
  email: string;
  avatar?: string;
  status: 'invited' | 'onboarded' | null;
}

export interface SlackTeamMembersResponse {
  team: SlackTeam;
  members: SlackMember[];
}
