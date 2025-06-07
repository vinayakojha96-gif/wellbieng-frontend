import axios, { AxiosError } from 'axios';

import { deleteCookie, getCookie } from 'cookies-next';

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL + '/api',
});

// Add JWT to requests
apiClient.interceptors.request.use(async config => {
    const token = await getCookie('authToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    if (config.url?.includes('auth')) return config;
    if (config.url?.includes('teams')) return config;
    if (config.url?.includes('invites')) return config;
    const teamId = await getCookie('activeTeamId');
    if (teamId) config.headers['x-team-id'] = teamId;
    return config;
});

export interface ApiResponse<T> {
    statusCode: number;
    message: string;
    responseObject: T | null;
    success: boolean;
}

// Handle expired tokens
apiClient.interceptors.response.use(
    response => response,
    (error: AxiosError<ApiResponse<null>>) => {
        if (error.response) {
            if (error.request?.path?.includes('auth'))
                return Promise.resolve(error.response || error);
            if (error.response?.status === 401) {
                deleteCookie('authToken');
            }
            return Promise.resolve(error.response || error);
        }
        return Promise.reject(error);
    }
);

export default apiClient;
