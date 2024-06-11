import axios from 'axios';

const api = axios.create({
  baseURL: 'https://highking.cloud/api',
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

interface UserResponse {
  status: number;
  message: string;
  data: {
    user_uid: string;
    verified_status_uuid: string;
    role: string;
    email: string;
    username: string;
    image_url: string;
    phone_number: string;
    domicile_address: string;
    created_at: string;
    updated_at: string;
  }[];
}

export const getCurrentUser = (): Promise<{ data: UserResponse }> => api.get('/partners/get-current-user');
export const updateProfile = (partner_uid: string, data: { username?: string; phone_number?: string; domicile_address?: string }) => api.put(`/partners/update/${partner_uid}`, data);
export const logout = () => api.get('/partners/logout');  

export const updateProfileImage = (partner_uid: string, image: File) => {
  const formData = new FormData();
  formData.append('image', image);

  return api.put(`/partners/update/photo/${partner_uid}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
