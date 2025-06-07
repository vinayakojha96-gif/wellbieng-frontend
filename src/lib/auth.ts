import { User } from '@/context/auth-context';
import apiClient, { ApiResponse } from '@/services/api-client';

export const getUser = async () => {
    const user = await apiClient.get<ApiResponse<User>>('/auth/me');
    return user.data.responseObject;
};
