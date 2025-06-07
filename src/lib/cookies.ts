'use server';

import { cookies } from 'next/headers';

export const getToken = async () => {
    return (await cookies()).get('authToken')?.value; // Works in Server Components
};

export const clearToken = async () => {
    (await cookies()).delete('authToken');
};

export const setToken = async (token: string, expires: string) => {
    (await cookies()).set('authToken', token, { expires: new Date(expires) });
};
