import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({
    // baseUrl: 'https://backend.xmoveit.com/',
    baseUrl: 'http://10.10.28.71:5050/',
    // baseUrl : 'http://143.198.238.107:5050/',
    prepareHeaders: (headers) => {
        try {
            const token = JSON.parse(localStorage.getItem('token'));
            if (token) {
                headers.set('Authorization', `Bearer ${token}`)
            }
        } catch {
            localStorage.removeItem('token');
        }
        return headers
    }
})

export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: baseQuery,
    endpoints: () => ({})
})
// Active backend URL
const BACKEND_URL = 'http://10.10.28.71:5050';
// const BACKEND_URL = 'https://backend.xmoveit.com';

export const imageUrl = BACKEND_URL;

// Helper to reliably construct full image URLs
export const getFullImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const cleanBase = imageUrl.replace(/\/+$/, '');
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${cleanBase}${cleanPath}`;
};

// export const  placeImg = '../../../assets/images/avatar.png'