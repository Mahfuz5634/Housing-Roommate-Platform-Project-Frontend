export type UserRole = 'ADMIN' | 'LANDLORD' | 'TENANT';

export type UserStatus = 'ACTIVE' | 'BLOCKED';

export type GenderPreference = 'MALE' | 'FEMALE' | 'ANY';

export type SleepSchedule = 'EARLY_BIRD' | 'NIGHT_OWL' | 'FLEXIBLE';

export type PropertyType = 'APARTMENT' | 'HOUSE' | 'CONDO' | 'STUDIO' | 'VILLA';

export type PropertyStatus = 'AVAILABLE' | 'RENTED' | 'MAINTENANCE' | 'UNLISTED';

export type RoomType = 'PRIVATE' | 'SHARED';

export type BookingStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export type MaintenancePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type MaintenanceStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';

export type MaintenanceCategory =
  | 'PLUMBING'
  | 'ELECTRICAL'
  | 'APPLIANCE'
  | 'STRUCTURAL'
  | 'CLEANING'
  | 'OTHER';

export interface UserProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  avatar?: string | null;
  bio?: string | null;
  address?: string | null;
  city?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RoommateProfile {
  id: string;
  userId: string;
  budgetMin: number;
  budgetMax: number;
  preferredGender: GenderPreference;
  occupation?: string | null;
  sleepSchedule: SleepSchedule;
  smoking: boolean;
  pets: boolean;
  cleanlinessScore: number;
  preferredLocations: string[];
  bio?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: User;
  matchScore?: number;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  isVerified: boolean;
  profile?: UserProfile | null;
  roommateProfile?: RoommateProfile | null;
  createdAt: string;
  updatedAt: string;
}

export interface Room {
  id: string;
  propertyId: string;
  title: string;
  roomType: RoomType;
  rentAmount: number;
  depositAmount: number;
  capacity: number;
  currentOccupancy: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Property {
  id: string;
  landlordId: string;
  title: string;
  description: string;
  propertyType: PropertyType;
  address: string;
  city: string;
  area: string;
  totalRent: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  rules: string[];
  images: string[];
  status: PropertyStatus;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  landlord?: User;
  rooms?: Room[];
  reviews?: Review[];
  _count?: {
    rooms?: number;
    reviews?: number;
    bookings?: number;
  };
}

export interface BookingRequest {
  id: string;
  tenantId: string;
  propertyId: string;
  roomId?: string | null;
  moveInDate: string;
  moveOutDate?: string | null;
  status: BookingStatus;
  totalAmount: number;
  depositAmount: number;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  tenant?: User;
  property?: Property;
  room?: Room | null;
  payment?: Payment | null;
}

export interface Payment {
  id: string;
  bookingRequestId: string;
  tenantId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  transactionId: string;
  stripeSessionId?: string | null;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  bookingRequest?: BookingRequest;
  tenant?: User;
}

export interface MaintenanceRequest {
  id: string;
  tenantId: string;
  propertyId: string;
  roomId?: string | null;
  category: MaintenanceCategory;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  title: string;
  description: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
  tenant?: User;
  property?: Property;
  room?: Room | null;
}

export interface Review {
  id: string;
  authorId: string;
  propertyId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  author?: User;
}

export interface ApiResponse<T = any> {
  statusCode: number;
  success: boolean;
  message: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage?: number;
  };
  data: T;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
}

export interface AdminAnalytics {
  metrics: {
    totalUsers: number;
    totalLandlords: number;
    totalTenants: number;
    totalProperties: number;
    totalBookings: number;
    totalRevenue: number;
    pendingMaintenanceCount: number;
  };
  charts: {
    monthlyRevenue: Array<{ month: string; revenue: number; bookings: number }>;
    propertyTypes: Array<{ name: string; value: number }>;
    bookingStatuses: Array<{ name: string; value: number }>;
  };
}
