export interface InviteDetailsResponse {
    team: Team;
    invitee: Invitee;
    token: Token;
}

interface Team {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

interface Invitee {
    id: string;
    name: string | null;
    email: string;
    avatar: string | null;
    createdAt: string;
    updatedAt: string;
}

interface Token {
    email: string;
}
