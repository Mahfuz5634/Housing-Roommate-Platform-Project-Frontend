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
import { DEMO_PROPERTIES } from '@/lib/mockData';
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
  const [isLoading, setIsLoading] = useState(false);

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

  // Filter properties in-memory
  const filteredProperties = DEMO_PROPERTIES.filter((prop) => {
    const matchCity =
      !initialCity ||
      prop.city.toLowerCase().includes(initialCity.toLowerCase()) ||
      prop.address.toLowerCase().includes(initialCity.toLowerCase());
    const matchType = !initialType || prop.propertyType === initialType;
    const matchRent = !initialMaxRent || prop.totalRent <= Number(initialMaxRent);
    return matchCity && matchType && matchRent;
  }).sort((a, b) => {
    if (initialSort === 'rentAsc') return a.totalRent - b.totalRent;
    if (initialSort === 'rentDesc') return b.totalRent - a.totalRent;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

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
            Showing {filteredProperties.length} verified listings across top cities
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
            className="text-xs sm:text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="rentAsc">Price: Low to High</option>
            <option value="rentDesc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filter Controls Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-600" /> Filter Listings
              </h3>
              {(initialCity || initialType || initialMaxRent) && (
                <button
                  onClick={handleReset}
                  className="text-xs text-rose-600 font-semibold flex items-center gap-1 hover:underline"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              )}
            </div>

            <form onSubmit={handleFilterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  City or Neighborhood
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. New York, Austin"
                    className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Property Type
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="APARTMENT">Apartment</option>
                  <option value="CONDO">Condo</option>
                  <option value="STUDIO">Studio</option>
                  <option value="HOUSE">House</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Max Monthly Rent
                </label>
                <input
                  type="number"
                  value={maxRent}
                  onChange={(e) => setMaxRent(e.target.value)}
                  placeholder="e.g. 3000"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <Button type="submit" variant="primary" className="w-full text-xs font-semibold py-2.5">
                Apply Filters
              </Button>
            </form>
          </Card>
        </div>

        {/* Properties Grid */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProperties.map((prop) => (
                <Card key={prop.id} className="group flex flex-col hover:-translate-y-1 transition duration-200">
                  <div className="relative h-56 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <Image
                      src={prop.images[0]}
                      alt={prop.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge variant="primary">{prop.propertyType}</Badge>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500 text-white shadow-sm">
                        Verified
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1 rounded-xl text-sm font-bold">
                      {formatCurrency(prop.totalRent)} <span className="text-[10px] font-normal">/mo</span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                        <MapPin className="w-3.5 h-3.5 text-blue-500" />
                        <span>{prop.address}, {prop.city}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition">
                        {prop.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                        {prop.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Bed className="w-3.5 h-3.5 text-slate-400" /> {prop.bedrooms} Beds
                        </span>
                        <span className="flex items-center gap-1">
                          <Bath className="w-3.5 h-3.5 text-slate-400" /> {prop.bathrooms} Baths
                        </span>
                      </div>
                      <Link href={`/properties/${prop.id}`}>
                        <Button variant="outline" size="sm" className="font-semibold text-blue-600">
                          View Rooms & Details →
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No properties found"
              description="No listings matched your exact search filters. Try widening your price range or clearing selected city."
              actionLabel="Clear All Filters"
              onAction={handleReset}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function PropertiesDirectoryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
      }
    >
      <PropertiesList />
    </Suspense>
  );
}
