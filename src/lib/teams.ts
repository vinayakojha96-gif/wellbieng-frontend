import { cookies } from 'next/headers';
import { getUser } from './auth';

export const getTeamId = async () => {
    const cookie = await cookies();
    const cookieTeam = cookie.get('activeTeamId')?.value;
    if (cookieTeam) return cookieTeam;
    const user = await getUser();
    return user?.teams[0].id || '';
};

export const setTeamId = async (teamId: string) => {
    (await cookies()).set('activeTeamId', teamId);
};
