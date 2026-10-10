'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { DEMO_PROPERTIES } from '@/lib/mockData';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useAuthStore } from '@/lib/authStore';
import { apiClient } from '@/lib/apiClient';
import { toast } from 'sonner';
import { Room } from '@/types';
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

  const property =
    DEMO_PROPERTIES.find((p) => p.id === propertyId) || DEMO_PROPERTIES[0];

  const [activeImage, setActiveImage] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [moveInDate, setMoveInDate] = useState('');
  const [moveOutDate, setMoveOutDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenBooking = (room: Room) => {
    if (!isAuthenticated) {
      toast.info('Please sign in as a Tenant to book a room.');
      router.push(`/login?callbackUrl=/properties/${property.id}`);
      return;
    }
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
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
            <span>{property.address}, {property.area}, {property.city}</span>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl text-right">
          <span className="text-xs text-slate-400 font-medium">Monthly Rent</span>
          <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
            {formatCurrency(property.totalRent)}
          </p>
          <span className="text-[11px] text-slate-500">Deposit: {formatCurrency(property.totalRent)}</span>
        </div>
      </div>

      {/* Photo Gallery */}
      <div className="space-y-3">
        <div className="relative h-80 sm:h-[450px] w-full rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-md">
          <Image
            src={property.images[activeImage] || property.images[0]}
            alt={property.title}
            fill
            className="object-cover"
          />
        </div>
        {property.images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {property.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                  activeImage === i ? 'border-blue-600 scale-95' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <Image src={img} alt="Thumbnail" fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details (Left 2 columns) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Overview Stats */}
          <div className="grid grid-cols-3 gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
            <div>
              <Bed className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <span className="text-xs text-slate-400">Bedrooms</span>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{property.bedrooms}</p>
            </div>
            <div className="border-x border-slate-100 dark:border-slate-800">
              <Bath className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <span className="text-xs text-slate-400">Bathrooms</span>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{property.bathrooms}</p>
            </div>
            <div>
              <Building className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <span className="text-xs text-slate-400">Total Rooms</span>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{property.rooms?.length || 1}</p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">About This Residence</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {property.description}
            </p>
          </div>

          {/* Available Rooms Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Available Rooms & Lease Options
            </h3>
            <div className="space-y-3">
              {property.rooms && property.rooms.length > 0 ? (
                property.rooms.map((room) => (
                  <Card key={room.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">{room.title}</h4>
                        <Badge variant="outline">{room.roomType}</Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Occupancy: {room.currentOccupancy} / {room.capacity} person • Deposit: {formatCurrency(room.depositAmount)}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-right">
                        <span className="text-lg font-extrabold text-blue-600">
                          {formatCurrency(room.rentAmount)}
                        </span>
                        <span className="text-[10px] text-slate-400"> /mo</span>
                      </div>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleOpenBooking(room)}
                        className="font-semibold shadow-sm"
                      >
                        Reserve Room
                      </Button>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="p-5 text-center text-slate-500 text-sm">
                  Entire apartment is rented together at {formatCurrency(property.totalRent)} / month.
                </Card>
              )}
            </div>
          </div>

          {/* Amenities checklist */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Amenities & Features</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {property.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs font-medium text-slate-700 dark:text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* House Rules */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">House Rules</h3>
            <div className="space-y-2">
              {property.rules.map((rule) => (
                <div key={rule} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>Verified Tenant Reviews</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> 5.0
              </span>
            </h3>

            {property.reviews && property.reviews.length > 0 ? (
              property.reviews.map((rev) => (
                <Card key={rev.id} className="p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {rev.author?.profile?.firstName || 'Alex Morgan'}
                    </span>
                    <span className="text-[11px] text-slate-400">{formatDate(rev.createdAt)}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    &quot;{rev.comment}&quot;
                  </p>
                </Card>
              ))
            ) : (
              <p className="text-xs text-slate-400">No reviews yet for this new listing.</p>
            )}
          </div>
        </div>

        {/* Landlord Card & Booking Sidebar (Right 1 column) */}
        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-lg">
                👨‍💼
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Landlord: John Doe
                </h4>
                <p className="text-xs text-slate-500">Professional Property Owner</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Managing verified student and young-professional properties across New York for over 8 years.
            </p>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <p>✔ Response Rate: 99%</p>
              <p>✔ Average Response Time: Under 1 hour</p>
            </div>
          </Card>

          <Card className="p-6 bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/60 space-y-3">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-bold text-sm">
              <Shield className="w-4 h-4" /> RoommateHub Guarantee
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Your security deposit is locked in Stripe escrow and is never released until you inspect the property on move-in day.
            </p>
          </Card>
        </div>
      </div>

      {/* Booking Application Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Submit Booking Request"
        description={`Room: ${selectedRoom?.title || property.title}`}
        maxWidth="lg"
      >
        <form onSubmit={handleConfirmBooking} className="space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
            <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300">
              <span>Monthly Rent:</span>
              <span>{formatCurrency(selectedRoom?.rentAmount || property.totalRent)}</span>
            </div>
            <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300">
              <span>Security Deposit (Refundable):</span>
              <span>{formatCurrency(selectedRoom?.depositAmount || property.totalRent)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Desired Move-in Date *
              </label>
              <input
                type="date"
                required
                value={moveInDate}
                onChange={(e) => setMoveInDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Estimated Move-out Date
              </label>
              <input
                type="date"
                value={moveOutDate}
                onChange={(e) => setMoveOutDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Message or Notes for Landlord
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Introduce yourself, your occupation, and any questions regarding lease terms..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
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
