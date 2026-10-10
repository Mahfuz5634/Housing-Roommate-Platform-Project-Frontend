'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { apiClient } from '@/lib/apiClient';
import { PropertyType } from '@/types';
import { toast } from 'sonner';
import {
  Building,
  MapPin,
  Sparkles,
  Image as ImageIcon,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  Plus,
} from 'lucide-react';

const AMENITY_OPTIONS = [
  'WiFi',
  'Air Conditioning',
  'In-unit Laundry',
  'Dishwasher',
  'Gym Access',
  'Balcony',
  'Doorman',
  'Elevator',
  'Pet Friendly',
  'Free Parking',
  'EV Charger',
  'Pool',
];

const RULE_OPTIONS = [
  'No indoor smoking',
  'Quiet hours after 10 PM',
  'Pets allowed with deposit',
  'No unauthorized overnight parties',
  'Clean shared kitchen after use',
];

export default function CreatePropertyWizardPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('APARTMENT');
  const [description, setDescription] = useState('');

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('New York');
  const [area, setArea] = useState('Manhattan');
  const [totalRent, setTotalRent] = useState('');
  const [bedrooms, setBedrooms] = useState('2');
  const [bathrooms, setBathrooms] = useState('2');

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'WiFi',
    'Air Conditioning',
    'In-unit Laundry',
  ]);
  const [selectedRules, setSelectedRules] = useState<string[]>([
    'No indoor smoking',
    'Quiet hours after 10 PM',
  ]);

  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'
  );

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const toggleRule = (rule: string) => {
    setSelectedRules((prev) =>
      prev.includes(rule) ? prev.filter((r) => r !== rule) : [...prev, rule]
    );
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!title.trim() || !description.trim()) {
        toast.error('Please complete title and description');
        return;
      }
    }
    if (currentStep === 2) {
      if (!address.trim() || !totalRent) {
        toast.error('Please enter address and monthly rent');
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        title,
        propertyType,
        description,
        address,
        city,
        area,
        totalRent: Number(totalRent),
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        amenities: selectedAmenities,
        rules: selectedRules,
        images: [imageUrl],
      };

      const res = await apiClient.post('/properties', payload);
      if (res.success) {
        toast.success('Property listing created successfully!');
        router.push('/landlord/properties');
      } else {
        toast.error(res.message || 'Failed to create listing');
      }
    } catch {
      toast.error('Failed to create listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Wizard Header & Stepper */}
      <div className="space-y-4">
        <div>
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
            Listing Creation Wizard
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
            Post a New Property Listing
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Complete the 4-step wizard to list your property and begin receiving tenant applications
          </p>
        </div>

        {/* Stepper Progress Bar */}
        <div className="grid grid-cols-4 gap-2 pt-2">
          {[
            { step: 1, label: 'General Info' },
            { step: 2, label: 'Location & Rent' },
            { step: 3, label: 'Amenities & Rules' },
            { step: 4, label: 'Photos & Review' },
          ].map((item) => (
            <div key={item.step} className="space-y-1">
              <div
                className={`h-2 rounded-full transition-all ${
                  currentStep >= item.step
                    ? 'bg-amber-600 dark:bg-amber-500'
                    : 'bg-slate-200 dark:bg-slate-800'
                }`}
              />
              <span className="text-[11px] font-semibold text-slate-500 hidden sm:block">
                Step {item.step}: {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* STEP 1 */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Building className="w-5 h-5 text-amber-600" /> Step 1: General Details
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Listing Title *
                </label>
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Modern Williamsburg 3-Bed Co-Living Loft"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Property Type
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-amber-500"
                >
                  <option value="APARTMENT">Apartment</option>
                  <option value="CONDO">Condo</option>
                  <option value="HOUSE">House</option>
                  <option value="STUDIO">Studio</option>
                  <option value="VILLA">Villa</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Detailed Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Highlight natural lighting, high-speed WiFi, proximity to subway stations, and communal living perks..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-600" /> Step 2: Location & Financials
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Street Address *
                </label>
                <input
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 142 Bedford Ave"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    City *
                  </label>
                  <input
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="New York"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Neighborhood / Area
                  </label>
                  <input
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="Williamsburg"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Total Monthly Rent ($) *
                  </label>
                  <input
                    type="number"
                    required
                    value={totalRent}
                    onChange={(e) => setTotalRent(e.target.value)}
                    placeholder="2800"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Bedrooms Count
                  </label>
                  <input
                    type="number"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Bathrooms Count
                  </label>
                  <input
                    type="number"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600" /> Step 3: Amenities & House Rules
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
                  Select Included Amenities
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {AMENITY_OPTIONS.map((am) => {
                    const isSelected = selectedAmenities.includes(am);
                    return (
                      <button
                        type="button"
                        key={am}
                        onClick={() => toggleAmenity(am)}
                        className={`p-3 rounded-xl border text-xs font-medium text-left transition flex items-center justify-between ${
                          isSelected
                            ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-100 font-bold'
                            : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span>{am}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
                  Select House Rules
                </label>
                <div className="space-y-2">
                  {RULE_OPTIONS.map((rule) => {
                    const isSelected = selectedRules.includes(rule);
                    return (
                      <button
                        type="button"
                        key={rule}
                        onClick={() => toggleRule(rule)}
                        className={`w-full p-3 rounded-xl border text-xs font-medium text-left transition flex items-center justify-between ${
                          isSelected
                            ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-100 font-bold'
                            : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span>{rule}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-amber-600" /> Step 4: Photos & Review
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Primary Photo URL *
                </label>
                <input
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              {imageUrl && (
                <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <Image src={imageUrl} alt="Listing preview" fill className="object-cover" />
                </div>
              )}

              {/* Review Card */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  Listing Summary
                </h4>
                <p>
                  <span className="font-semibold">Title:</span> {title || 'Untitled'}
                </p>
                <p>
                  <span className="font-semibold">Location:</span> {address}, {city}
                </p>
                <p>
                  <span className="font-semibold">Rent:</span> ${totalRent || '0'}/month • {bedrooms} Beds, {bathrooms} Baths
                </p>
                <p>
                  <span className="font-semibold">Amenities:</span> {selectedAmenities.join(', ')}
                </p>
              </div>
            </div>
          )}

          {/* Wizard Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
            {currentStep > 1 ? (
              <Button type="button" variant="outline" onClick={handleBack} className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
            ) : (
              <div />
            )}

            {currentStep < 4 ? (
              <Button type="button" variant="primary" onClick={handleNext} className="bg-amber-600 hover:bg-amber-700 gap-2">
                Next Step <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button type="submit" variant="primary" isLoading={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 gap-2 font-bold shadow-md">
                <CheckCircle2 className="w-4 h-4" /> Publish Listing
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
