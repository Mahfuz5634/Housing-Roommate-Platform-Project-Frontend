'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useAuthStore } from '@/lib/authStore';
import { apiClient } from '@/lib/apiClient';
import { toast } from 'sonner';
import { Property, Room } from '@/types';
import {
  MapPin,
  Bed,
  Bath,
  CheckCircle,
  Calendar,
  Shield,
  Star,
  Users,
  Building,
  ArrowLeft,
  DollarSign,
  AlertCircle,
} from 'lucide-react';

export default function PropertyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params?.id as string;
  const { user, isAuthenticated } = useAuthStore();

  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeImage, setActiveImage] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [moveInDate, setMoveInDate] = useState('');
  const [moveOutDate, setMoveOutDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchProperty() {
      if (!propertyId) return;
      setIsLoading(true);
      setError(null);
      try {
        const res = await apiClient.get<Property>(`/properties/${propertyId}`);
        if (isMounted) {
          if (res.success && res.data) {
            setProperty(res.data);
          } else {
            setError(res.message || 'Property not found');
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Failed to fetch property details');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchProperty();
    return () => {
      isMounted = false;
    };
  }, [propertyId]);

  const handleOpenBooking = (room: Room) => {
    if (!isAuthenticated) {
      toast.info('Please sign in as a Tenant to book a room.');
      router.push(`/login?callbackUrl=/properties/${propertyId}`);
      return;
    }
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;

    if (!moveInDate) {
      toast.error('Please select your desired move-in date.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiClient.post('/bookings', {
        propertyId: property.id,
        roomId: selectedRoom?.id,
        moveInDate: new Date(moveInDate).toISOString(),
        moveOutDate: moveOutDate ? new Date(moveOutDate).toISOString() : null,
        totalAmount: selectedRoom?.rentAmount || property.totalRent,
        depositAmount: selectedRoom?.depositAmount || property.totalRent,
        notes,
      });

      if (res.success) {
        toast.success('Booking application submitted! Landlord will review your application.');
        setIsModalOpen(false);
        router.push('/dashboard/bookings');
      } else {
        toast.error(res.message || 'Failed to submit application');
      }
    } catch (err: any) {
      toast.error(err.message || 'Booking submission error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-16 px-4 max-w-7xl mx-auto flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Loading verified property details...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen py-16 px-4 max-w-xl mx-auto text-center space-y-6">
        <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Property Not Found</h2>
        <p className="text-sm text-slate-500">{error || 'Could not find the requested property on the live database.'}</p>
        <Link href="/properties">
          <Button variant="primary">Return to Properties</Button>
        </Link>
      </div>
    );
  }

  const images = property.images && property.images.length > 0
    ? property.images
    : ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80'];

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Back button */}
      <Link href="/properties" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition">
        <ArrowLeft className="w-4 h-4" /> Back to Properties
      </Link>

      {/* Main Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="primary">{property.propertyType}</Badge>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              Verified ID & Ownership
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {property.title}
          </h1>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{property.address}, {property.area ? `${property.area}, ` : ''}{property.city}</span>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl text-right">
          <span className="text-xs text-slate-400 font-medium">Monthly Rent</span>
          <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
            {formatCurrency(property.totalRent)}
          </p>
          <span className="text-[11px] text-slate-500">Total Bedrooms: {property.bedrooms} • Bathrooms: {property.bathrooms}</span>
        </div>
      </div>

      {/* Photo Gallery */}
      <div className="space-y-3">
        <div className="relative h-80 sm:h-[450px] w-full rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-md">
          <Image
            src={images[activeImage] || images[0]}
            alt={property.title}
            fill
            className="object-cover"
          />
        </div>
        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {images.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveImage(i)}
                className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                  activeImage === i ? 'border-blue-600 ring-2 ring-blue-500/30' : 'border-transparent opacity-70'
                }`}
              >
                <Image src={img} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <Card className="p-6 sm:p-8 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">About this Home</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </Card>

          {/* Rooms Available */}
          <Card className="p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Available Rooms</h2>
              <p className="text-xs text-slate-500">Choose a specific room to apply and lock in your reservation.</p>
            </div>

            {property.rooms && property.rooms.length > 0 ? (
              <div className="space-y-4">
                {property.rooms.map((room) => (
                  <div
                    key={room.id}
                    className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/30 hover:border-blue-300 transition"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={room.isAvailable ? 'primary' : 'outline'}>
                          {room.roomType}
                        </Badge>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{room.title}</h4>
                      </div>
                      <p className="text-xs text-slate-500">
                        Deposit: {formatCurrency(room.depositAmount)} • Max Capacity: {room.capacity}
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <div className="text-right">
                        <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                          {formatCurrency(room.rentAmount)}
                        </span>
                        <span className="text-[10px] text-slate-400 block">/ month</span>
                      </div>
                      <Button
                        variant={room.isAvailable ? 'primary' : 'outline'}
                        size="sm"
                        disabled={!room.isAvailable}
                        onClick={() => handleOpenBooking(room)}
                      >
                        {room.isAvailable ? 'Apply for Room' : 'Occupied'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">Entire property rented as a single unit.</p>
            )}
          </Card>

          {/* Amenities & House Rules */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((item, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs font-medium border border-blue-100 dark:border-blue-900"
                  >
                    ✓ {item}
                  </span>
                ))}
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">House Rules</h3>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                {property.rules.map((rule, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-slate-400">•</span> {rule}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>

        {/* Sidebar: Host Info & Safety */}
        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Verified Landlord</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 flex items-center justify-center font-bold text-base">
                {property.landlord?.profile?.firstName?.charAt(0) || 'L'}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {property.landlord?.profile?.firstName} {property.landlord?.profile?.lastName}
                </h4>
                <p className="text-xs text-slate-500">{property.landlord?.email}</p>
              </div>
            </div>
            {property.landlord?.profile?.bio && (
              <p className="text-xs text-slate-500 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                &quot;{property.landlord.profile.bio}&quot;
              </p>
            )}
          </Card>

          <Card className="p-6 space-y-3 bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
              <Shield className="w-4 h-4" /> Deposit Escrow Guarantee
            </div>
            <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed">
              When approved, your holding deposit is held securely in Stripe escrow. Funds are never released to the landlord until you inspect the property on move-in day.
            </p>
          </Card>
        </div>
      </div>

      {/* Booking Application Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Apply for ${selectedRoom?.title || property.title}`}
      >
        <form onSubmit={handleConfirmBooking} className="space-y-4 mt-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Move-in Date *
            </label>
            <input
              type="date"
              required
              value={moveInDate}
              onChange={(e) => setMoveInDate(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Move-out Date (Optional)
            </label>
            <input
              type="date"
              value={moveOutDate}
              onChange={(e) => setMoveOutDate(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Intro Note to Landlord
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Introduce yourself, your occupation, and daily routine..."
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Monthly Rent:</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {formatCurrency(selectedRoom?.rentAmount || property.totalRent)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Security Deposit:</span>
              <span className="font-semibold text-emerald-600">
                {formatCurrency(selectedRoom?.depositAmount || property.totalRent)}
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Submit Application
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
