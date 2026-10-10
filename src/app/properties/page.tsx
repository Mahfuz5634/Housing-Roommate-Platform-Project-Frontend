'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CardSkeleton } from '@/components/ui/LoadingSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { apiClient } from '@/lib/apiClient';
import { formatCurrency } from '@/lib/utils';
import { Property, PropertyType } from '@/types';
import {
  Search,
  Filter,
  MapPin,
  Bed,
  Bath,
  ArrowUpDown,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

function PropertiesList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read URL query params
  const initialCity = searchParams.get('city') || '';
  const initialType = searchParams.get('propertyType') || '';
  const initialSort = searchParams.get('sort') || 'newest';
  const initialMaxRent = searchParams.get('maxRent') || '';

  const [city, setCity] = useState(initialCity);
  const [propertyType, setPropertyType] = useState(initialType);
  const [sort, setSort] = useState(initialSort);
  const [maxRent, setMaxRent] = useState(initialMaxRent);

  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sync state changes with URL query parameters
  const updateUrlParams = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, val]) => {
      if (val) {
        params.set(key, val);
      } else {
        params.delete(key);
      }
    });
    router.replace(`/properties?${params.toString()}`);
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrlParams({
      city,
      propertyType,
      sort,
      maxRent,
    });
  };

  const handleReset = () => {
    setCity('');
    setPropertyType('');
    setSort('newest');
    setMaxRent('');
    router.replace('/properties');
  };

  // Fetch live properties from API
  useEffect(() => {
    let isMounted = true;
    async function fetchProperties() {
      setIsLoading(true);
      setError(null);
      try {
        const queryParams: Record<string, string> = {};
        if (initialCity) queryParams.city = initialCity;
        if (initialType) queryParams.propertyType = initialType;
        if (initialMaxRent) queryParams.maxRent = initialMaxRent;
        if (initialSort === 'rentAsc') {
          queryParams.sortBy = 'totalRent';
          queryParams.sortOrder = 'asc';
        } else if (initialSort === 'rentDesc') {
          queryParams.sortBy = 'totalRent';
          queryParams.sortOrder = 'desc';
        }

        const res = await apiClient.get<Property[]>('/properties', queryParams);
        if (isMounted) {
          if (res.success && Array.isArray(res.data)) {
            setProperties(res.data);
          } else {
            setProperties([]);
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Failed to connect to live properties API');
          setProperties([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchProperties();

    return () => {
      isMounted = false;
    };
  }, [initialCity, initialType, initialSort, initialMaxRent]);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Verified Urban Housing
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
            Explore Property Listings
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isLoading
              ? 'Loading live properties from database...'
              : `Showing ${properties.length} live verified listing${properties.length === 1 ? '' : 's'}`}
          </p>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              updateUrlParams({ sort: e.target.value });
            }}
            className="text-xs font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="rentAsc">Rent: Low to High</option>
            <option value="rentDesc">Rent: High to Low</option>
          </select>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl shadow-sm border border-slate-200/80 dark:border-slate-800">
        <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* City / Location Input */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              City / Location
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="New York, Austin..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>

          {/* Property Type Dropdown */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Property Type
            </label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-blue-500 transition cursor-pointer"
            >
              <option value="">All Types</option>
              <option value="APARTMENT">Apartment</option>
              <option value="CONDO">Condo</option>
              <option value="STUDIO">Studio</option>
              <option value="HOUSE">House</option>
            </select>
          </div>

          {/* Max Rent Input */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Max Rent ($)
            </label>
            <input
              type="number"
              value={maxRent}
              onChange={(e) => setMaxRent(e.target.value)}
              placeholder="e.g. 2500"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          {/* Submit Button */}
          <div className="flex items-end">
            <Button type="submit" variant="primary" className="w-full gap-1.5 py-2 text-xs font-semibold rounded-xl">
              <Filter className="w-3.5 h-3.5" /> Apply Filters
            </Button>
          </div>

          {/* Reset Button */}
          <div className="flex items-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="w-full gap-1.5 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </Button>
          </div>
        </form>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* Grid of Listings */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[...Array(6)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <EmptyState
          title="No Properties Found"
          description="We couldn't find any live properties matching your filter criteria. Try resetting your search."
          actionLabel="Reset Search Filters"
          onAction={handleReset}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {properties.map((prop) => (
            <Card
              key={prop.id}
              className="group flex flex-col h-full hover:-translate-y-1 hover:shadow-xl transition-all duration-200 overflow-hidden"
            >
              <div className="relative h-60 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <Image
                  src={
                    prop.images && prop.images.length > 0
                      ? prop.images[0]
                      : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={prop.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge variant="primary">{prop.propertyType}</Badge>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500 text-white shadow-sm">
                    Verified
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 bg-slate-900/85 backdrop-blur-sm text-white px-3 py-1 rounded-xl text-sm font-bold shadow-md">
                  {formatCurrency(prop.totalRent)}{' '}
                  <span className="text-[10px] font-normal text-slate-300">/mo</span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span className="truncate">
                      {prop.address}, {prop.city}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition line-clamp-1">
                    {prop.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                    {prop.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 font-medium">
                      <Bed className="w-3.5 h-3.5 text-slate-400" /> {prop.bedrooms} Beds
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <Bath className="w-3.5 h-3.5 text-slate-400" /> {prop.bathrooms} Baths
                    </span>
                  </div>
                  <Link href={`/properties/${prop.id}`}>
                    <Button
                      variant="primary"
                      size="sm"
                      className="rounded-xl px-3 py-1 text-xs font-semibold shadow-xs"
                    >
                      View Space →
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen py-10 px-4 max-w-7xl mx-auto">Loading properties...</div>}>
      <PropertiesList />
    </Suspense>
  );
}
