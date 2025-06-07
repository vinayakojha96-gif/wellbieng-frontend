'use server';

import { redirect } from 'next/navigation';

export const googleAuthAction = async () => {
    redirect(process.env.API_URL + '/api/auth/google/redirect');
};
