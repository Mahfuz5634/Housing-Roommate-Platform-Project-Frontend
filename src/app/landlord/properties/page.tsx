'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { DEMO_PROPERTIES } from '@/lib/mockData';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { apiClient } from '@/lib/apiClient';
import { Property, PropertyStatus } from '@/types';
import { toast } from 'sonner';
import { Building, PlusCircle, Bed, Bath, ExternalLink, Settings2 } from 'lucide-react';

export default function LandlordPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>(DEMO_PROPERTIES);

  const handleStatusChange = async (propertyId: string, newStatus: PropertyStatus) => {
    try {
      await apiClient.patch(`/properties/${propertyId}`, { status: newStatus });
      setProperties((prev) =>
        prev.map((p) => (p.id === propertyId ? { ...p, status: newStatus } : p))
      );
      toast.success(`Listing status updated to ${newStatus}`);
    } catch {
      toast.error('Failed to update property status');
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

      <div className="space-y-4">
        {properties.map((prop) => (
          <Card key={prop.id} className="p-5 sm:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-slate-100 shrink-0 shadow-sm">
                  <Image
                    src={prop.images[0]}
                    alt={prop.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{prop.propertyType}</Badge>
                    <Badge status={prop.status}>{prop.status}</Badge>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {prop.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {prop.address}, {prop.area}, {prop.city}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400 pt-1">
                    <span className="font-semibold text-amber-600 dark:text-amber-400">
                      {formatCurrency(prop.totalRent)}/mo
                    </span>
                    <span>• {prop.bedrooms} Bed, {prop.bathrooms} Bath</span>
                    <span>• {prop.rooms?.length || 1} Rooms</span>
                  </div>
                </div>
              </div>

              {/* Status Toggle & Details */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 border-t md:border-t-0 pt-3 md:pt-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Status:</span>
                  <select
                    value={prop.status}
                    onChange={(e) => handleStatusChange(prop.id, e.target.value as PropertyStatus)}
                    className="text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="RENTED">RENTED</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                  </select>
                </div>

                <Link href={`/properties/${prop.id}`}>
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                    <ExternalLink className="w-3.5 h-3.5" /> View Public Page
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
