'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CardSkeleton } from '@/components/ui/LoadingSkeleton';
import { apiClient } from '@/lib/apiClient';
import { Property, PropertyStatus } from '@/types';
import { toast } from 'sonner';
import { Building, PlusCircle, Bed, Bath, ExternalLink, Settings2 } from 'lucide-react';

export default function LandlordPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchProperties() {
      setIsLoading(true);
      try {
        const res = await apiClient.get<Property[]>('/properties');
        if (isMounted && res.success && Array.isArray(res.data)) {
          setProperties(res.data);
        }
      } catch (err: any) {
        console.error('Could not load landlord properties', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchProperties();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleStatusChange = async (propertyId: string, newStatus: PropertyStatus) => {
    try {
      await apiClient.patch(`/properties/${propertyId}`, { status: newStatus });
      setProperties((prev) =>
        prev.map((p) => (p.id === propertyId ? { ...p, status: newStatus } : p))
      );
      toast.success(`Listing status updated to ${newStatus}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update property status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Inventory</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
            My Managed Properties
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Monitor room vacancies, adjust rental pricing, and update listing availability
          </p>
        </div>

        <Link href="/landlord/properties/create">
          <Button variant="primary" size="sm" className="bg-amber-600 hover:bg-amber-700 gap-1.5 shadow-sm font-semibold">
            <PlusCircle className="w-4 h-4" /> Add New Property
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <CardSkeleton />
        </div>
      ) : (
        <div className="space-y-4">
          {properties.map((prop) => (
            <Card key={prop.id} className="p-5 sm:p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-slate-100 shrink-0 shadow-sm">
                    <Image
                      src={prop.images && prop.images.length > 0 ? prop.images[0] : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'}
                      alt={prop.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="primary">{prop.propertyType}</Badge>
                      <Badge status={prop.status}>{prop.status}</Badge>
                      {prop.isApproved && (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          Platform Verified
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {prop.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {prop.address}, {prop.city}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1 font-medium">
                        <Bed className="w-3.5 h-3.5" /> {prop.bedrooms} Beds
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        <Bath className="w-3.5 h-3.5" /> {prop.bathrooms} Baths
                      </span>
                      <span>Rooms: {prop.rooms?.length || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 dark:border-slate-800">
                  <div className="text-right">
                    <span className="text-xl font-black text-slate-900 dark:text-slate-100">
                      {formatCurrency(prop.totalRent)}
                    </span>
                    <span className="text-[11px] text-slate-400 block">/month target rent</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link href={`/properties/${prop.id}`}>
                      <Button variant="outline" size="sm" className="gap-1 text-xs">
                        <ExternalLink className="w-3.5 h-3.5" /> Live Listing
                      </Button>
                    </Link>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        handleStatusChange(
                          prop.id,
                          prop.status === 'AVAILABLE' ? 'RENTED' : 'AVAILABLE'
                        )
                      }
                      className="text-xs"
                    >
                      {prop.status === 'AVAILABLE' ? 'Mark Rented' : 'Mark Available'}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
