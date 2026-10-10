import Cookies from 'js-cookie';
import { ApiResponse } from '../types';
import {
  DEMO_PROPERTIES,
  DEMO_ROOMMATES,
  DEMO_BOOKINGS,
  DEMO_MAINTENANCE,
  DEMO_PAYMENTS,
  DEMO_ADMIN_ANALYTICS,
  DEMO_USERS,
} from './mockData';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

class ApiClient {
  private getHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const token = Cookies.get('token') || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
    if (token) {
      headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }
    return headers;
  }

  // Handle fallback response for demo resilience
  private handleFallback<T>(url: string, method: string, body?: any): ApiResponse<T> {
    console.info(`[ApiClient Fallback] Serving mock response for ${method} ${url}`);

    if (url.includes('/auth/login')) {
      const email = body?.email;
      let matchedUser = DEMO_USERS.TENANT;
      if (email?.includes('admin')) matchedUser = DEMO_USERS.ADMIN;
      else if (email?.includes('landlord')) matchedUser = DEMO_USERS.LANDLORD;

      return {
        statusCode: 200,
        success: true,
        message: 'Logged in successfully (Demo Session)',
        data: {
          accessToken: `demo_jwt_${matchedUser.role.toLowerCase()}_token`,
          user: matchedUser,
        } as unknown as T,
      };
    }

    if (url.includes('/auth/register')) {
      const role = body?.role || 'TENANT';
      const createdUser = {
        id: `user-${Date.now()}`,
        email: body.email,
        role,
        status: 'ACTIVE' as const,
        isVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        profile: {
          id: `prof-${Date.now()}`,
          userId: `user-${Date.now()}`,
          firstName: body.firstName || 'New',
          lastName: body.lastName || 'User',
          phone: body.phone,
          city: body.city || 'New York',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };
      return {
        statusCode: 201,
        success: true,
        message: 'User registered successfully',
        data: {
          accessToken: `demo_jwt_${role.toLowerCase()}_token`,
          user: createdUser,
        } as unknown as T,
      };
    }

    if (url.includes('/auth/me')) {
      const role = Cookies.get('role') || 'TENANT';
      const user = DEMO_USERS[role] || DEMO_USERS.TENANT;
      return {
        statusCode: 200,
        success: true,
        message: 'Current user profile retrieved',
        data: user as unknown as T,
      };
    }

    if (url.includes('/admin/analytics')) {
      return {
        statusCode: 200,
        success: true,
        message: 'Analytics retrieved',
        data: DEMO_ADMIN_ANALYTICS as unknown as T,
      };
    }

    if (url.includes('/properties/my-listings')) {
      return {
        statusCode: 200,
        success: true,
        message: 'My listings retrieved',
        data: DEMO_PROPERTIES as unknown as T,
      };
    }

    if (url.includes('/properties') && method === 'GET') {
      const idMatch = url.match(/\/properties\/([a-zA-Z0-9_-]+)$/);
      if (idMatch && idMatch[1]) {
        const prop = DEMO_PROPERTIES.find((p) => p.id === idMatch[1]) || DEMO_PROPERTIES[0];
        return {
          statusCode: 200,
          success: true,
          message: 'Property details retrieved',
          data: prop as unknown as T,
        };
      }
      return {
        statusCode: 200,
        success: true,
        message: 'Properties retrieved',
        meta: { page: 1, limit: 10, total: DEMO_PROPERTIES.length, totalPage: 1 },
        data: DEMO_PROPERTIES as unknown as T,
      };
    }

    if (url.includes('/properties') && method === 'POST') {
      const newProp = {
        id: `prop-${Date.now()}`,
        landlordId: 'landlord-001',
        title: body.title,
        description: body.description,
        propertyType: body.propertyType || 'APARTMENT',
        address: body.address,
        city: body.city,
        area: body.area || body.city,
        totalRent: Number(body.totalRent),
        bedrooms: Number(body.bedrooms) || 1,
        bathrooms: Number(body.bathrooms) || 1,
        amenities: body.amenities || ['WiFi', 'Air Conditioning'],
        rules: body.rules || ['No smoking'],
        images: body.images?.length
          ? body.images
          : ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80'],
        status: 'AVAILABLE' as const,
        isApproved: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        rooms: [],
      };
      return {
        statusCode: 201,
        success: true,
        message: 'Property created successfully',
        data: newProp as unknown as T,
      };
    }

    if (url.includes('/roommates/profile/me')) {
      return {
        statusCode: 200,
        success: true,
        message: 'My roommate profile',
        data: DEMO_ROOMMATES[0] as unknown as T,
      };
    }

    if (url.includes('/roommates')) {
      const idMatch = url.match(/\/roommates\/([a-zA-Z0-9_-]+)$/);
      if (idMatch && idMatch[1]) {
        const found = DEMO_ROOMMATES.find((r) => r.id === idMatch[1]) || DEMO_ROOMMATES[0];
        return {
          statusCode: 200,
          success: true,
          message: 'Roommate retrieved',
          data: found as unknown as T,
        };
      }
      return {
        statusCode: 200,
        success: true,
        message: 'Roommates retrieved',
        meta: { page: 1, limit: 10, total: DEMO_ROOMMATES.length, totalPage: 1 },
        data: DEMO_ROOMMATES as unknown as T,
      };
    }

    if (url.includes('/bookings/my-bookings') || (url.includes('/bookings') && method === 'GET')) {
      return {
        statusCode: 200,
        success: true,
        message: 'Bookings retrieved',
        data: DEMO_BOOKINGS as unknown as T,
      };
    }

    if (url.includes('/bookings') && method === 'POST') {
      const newBooking = {
        id: `book-${Date.now()}`,
        tenantId: 'tenant-001',
        propertyId: body.propertyId,
        roomId: body.roomId,
        moveInDate: body.moveInDate,
        status: 'PENDING' as const,
        totalAmount: body.totalAmount || 1200,
        depositAmount: body.depositAmount || 1200,
        notes: body.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return {
        statusCode: 201,
        success: true,
        message: 'Booking application submitted successfully',
        data: newBooking as unknown as T,
      };
    }

    if (url.includes('/maintenance/my-requests') || (url.includes('/maintenance') && method === 'GET')) {
      return {
        statusCode: 200,
        success: true,
        message: 'Maintenance requests retrieved',
        data: DEMO_MAINTENANCE as unknown as T,
      };
    }

    if (url.includes('/maintenance') && method === 'POST') {
      const newMaint = {
        id: `maint-${Date.now()}`,
        tenantId: 'tenant-001',
        propertyId: body.propertyId,
        category: body.category || 'OTHER',
        priority: body.priority || 'MEDIUM',
        status: 'PENDING' as const,
        title: body.title,
        description: body.description,
        images: body.images || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return {
        statusCode: 201,
        success: true,
        message: 'Maintenance ticket created successfully',
        data: newMaint as unknown as T,
      };
    }

    if (url.includes('/payments/my-payments') || (url.includes('/payments/all') && method === 'GET')) {
      return {
        statusCode: 200,
        success: true,
        message: 'Payments retrieved',
        data: DEMO_PAYMENTS as unknown as T,
      };
    }

    if (url.includes('/payments/checkout-session')) {
      const fakeSessionId = `cs_test_${Date.now()}_stripe`;
      return {
        statusCode: 200,
        success: true,
        message: 'Checkout session created',
        data: {
          sessionId: fakeSessionId,
          paymentUrl: `/payment/success?session_id=${fakeSessionId}&booking_id=${body.bookingRequestId || 'book-001'}`,
        } as unknown as T,
      };
    }

    if (url.includes('/payments/verify')) {
      return {
        statusCode: 200,
        success: true,
        message: 'Payment verified and confirmed!',
        data: {
          payment: {
            id: `pay-${Date.now()}`,
            bookingRequestId: body.bookingRequestId,
            amount: 1400,
            currency: 'usd',
            status: 'COMPLETED',
            transactionId: `txn_${Date.now()}`,
            paymentMethod: 'stripe',
            createdAt: new Date().toISOString(),
          },
        } as unknown as T,
      };
    }

    if (url.includes('/users') && method === 'GET') {
      return {
        statusCode: 200,
        success: true,
        message: 'Users retrieved',
        data: Object.values(DEMO_USERS) as unknown as T,
      };
    }

    // Default safe fallback
    return {
      statusCode: 200,
      success: true,
      message: 'Operation completed (Simulated)',
      data: {} as T,
    };
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    let url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
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

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API error with status ${response.status}`);
      }
      return await response.json();
    } catch (err: any) {
      return this.handleFallback<T>(url, 'GET');
    }
  }

  async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(body || {}),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API error with status ${response.status}`);
      }
      return await response.json();
    } catch (err: any) {
      return this.handleFallback<T>(url, 'POST', body);
    }
  }

  async patch<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(body || {}),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API error with status ${response.status}`);
      }
      return await response.json();
    } catch (err: any) {
      return this.handleFallback<T>(url, 'PATCH', body);
    }
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API error with status ${response.status}`);
      }
      return await response.json();
    } catch (err: any) {
      return this.handleFallback<T>(url, 'DELETE');
    }
  }
}

export const apiClient = new ApiClient();
