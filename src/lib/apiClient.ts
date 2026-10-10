import Cookies from 'js-cookie';
import { ApiResponse } from '../types';

export const BASE_API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://housing-roommate-platform-project-b.vercel.app/api/v1';

class ApiClient {
  private getHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    let token: string | null = null;
    if (typeof window !== 'undefined') {
      token = Cookies.get('token') || localStorage.getItem('token');
    }

    if (token) {
      headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }

    return headers;
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    let url = endpoint.startsWith('http') ? endpoint : `${BASE_API_URL}${endpoint}`;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          searchParams.append(key, String(val));
        }
      });
      const qs = searchParams.toString();
      if (qs) url += (url.includes('?') ? '&' : '?') + qs;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
      cache: 'no-store',
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message =
        data.message ||
        (data.errorSources && data.errorSources[0]?.message) ||
        `Request failed with status ${response.status}`;
      throw new Error(message);
    }

    return data;
  }

  async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_API_URL}${endpoint}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(body || {}),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message =
        data.message ||
        (data.errorSources && data.errorSources[0]?.message) ||
        `Request failed with status ${response.status}`;
      throw new Error(message);
    }

    return data;
  }

  async patch<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_API_URL}${endpoint}`;

    const response = await fetch(url, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(body || {}),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message =
        data.message ||
        (data.errorSources && data.errorSources[0]?.message) ||
        `Request failed with status ${response.status}`;
      throw new Error(message);
    }

    return data;
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_API_URL}${endpoint}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message =
        data.message ||
        (data.errorSources && data.errorSources[0]?.message) ||
        `Request failed with status ${response.status}`;
      throw new Error(message);
    }

    return data;
  }
}

export const apiClient = new ApiClient();
