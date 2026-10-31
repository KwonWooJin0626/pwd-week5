
import axios from 'axios';

// Render 백엔드 주소
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/+$/, '') ||
  'https://pwd-week6-kwonwoojin.onrender.com';

// 맛집 데이터 타입
export interface Restaurant {
  id: number;
  name: string;
  category: string;
  location: string;
  priceRange?: string;
  rating: number;
  description?: string;
  recommendedMenu: string[];
  likes?: number;
  image?: string;
}

// 맛집 생성 시 전달하는 데이터 타입
export type CreateRestaurantInput = Omit<Restaurant, 'id'>;

// 서버 응답 타입
export interface ApiResponse<T> {
  data: T;
}

// Axios 인스턴스
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
});

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    console.log('API 요청:', config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API 에러:', error);
    return Promise.reject(error);
  }
);

// 맛집 API
export const restaurantAPI = {
  // 전체 맛집 목록
  getRestaurants: async (): Promise<ApiResponse<Restaurant[]>> => {
    const response = await api.get<ApiResponse<Restaurant[]>>(
      '/api/restaurants'
    );
    return response.data;
  },

  // 특정 맛집 상세
  getRestaurantById: async (
    id: number | string
  ): Promise<ApiResponse<Restaurant>> => {
    const response = await api.get<ApiResponse<Restaurant>>(
      `/api/restaurants/${encodeURIComponent(String(id))}`
    );
    return response.data;
  },

  // 인기 맛집 목록
  getPopularRestaurants: async (): Promise<ApiResponse<Restaurant[]>> => {
    const response = await api.get<ApiResponse<Restaurant[]>>(
      '/api/restaurants/popular'
    );
    return response.data;
  },

  // 새로운 맛집 등록
  createRestaurant: async (
    restaurant: CreateRestaurantInput
  ): Promise<ApiResponse<Restaurant>> => {
    const response = await api.post<ApiResponse<Restaurant>>(
      '/api/restaurants',
      restaurant
    );
    return response.data;
  },
};

export default api;
