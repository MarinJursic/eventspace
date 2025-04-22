import React from 'react';
import { useRouter } from 'next/navigation';
import { MockService } from '@/lib/mockServices';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Info, Calendar, Check, Building, MapPin, AlertCircle } from 'lucide-react';
import ServiceHelpBox from './ServiceHelpBox';

// Helper function (can be moved to utils)
const formatDisplayPrice = (amount: number, model?: 'hour' | 'day' | 'week'): string => {
    const base = `$${amount.toLocaleString()}`;
    switch (model) {
        case 'hour': return `${base} / hour*`;
        case 'day': return `${base} / event day`;
        case 'week': return `${base} / week`;
        default: return base;
    }
};

interface ServiceBookingSidebarProps {
    servicePrice: MockService['price'];
    calculatedTotalPrice: number;
    isMultiDay: boolean;
    hasVenue: boolean;
    selectedVenueDates: string[];
    selectedServiceDays: Set<string>;
    availableDaysForSelection: string[]; // Use the simplified array from parent
    isDaySelectionValid: boolean;
    onAddToBooking: () => void;
    onToggleDay: (day: string) => void;
    onToggleAllDays: () => void;
    onFindVenue: () => void;
    onAddExternalVenue: () => void;
}

const ServiceBookingSidebar: React.FC<ServiceBookingSidebarProps> = ({
    servicePrice,
    calculatedTotalPrice,
    isMultiDay,
    hasVenue,
    selectedVenueDates,
    selectedServiceDays,
    availableDaysForSelection, // Use the simplified version passed down
    isDaySelectionValid,
    onAddToBooking,
    onToggleDay,
    onToggleAllDays,
    onFindVenue,
    onAddExternalVenue,
}) => {
    return (
        <div className="sticky top-24 space-y-5">
            {/* Main Booking Card */}
            <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
                <h3 className="font-display text-xl font-semibold mb-4"> Add to Your Event </h3>

                {/* Base Price Display */}
                <div className="mb-4 pb-4 border-b">
                    <span className="text-sm text-muted-foreground block mb-1">Base price</span>
                    <p className="font-display text-3xl font-bold tracking-tight">
                        {formatDisplayPrice(servicePrice.basePrice, servicePrice.model)}
                    </p>
                    {servicePrice.model === 'day' && <p className="text-xs text-muted-foreground mt-1">Per day the service is required</p>}
                    {servicePrice.model === 'hour' && <p className="text-xs text-muted-foreground mt-1">*Base hourly rate. Actual cost depends on usage/details.</p>}
                    {servicePrice.model === 'week' && <p className="text-xs text-muted-foreground mt-1">Weekly rate</p>}
                </div>

                {/* Dynamic Selection Summary */}
                <div className="text-sm text-muted-foreground mb-5 min-h-[40px]">
                    {hasVenue ? (
                        isMultiDay ? (
                            selectedServiceDays.size > 0
                                ? `Service selected for ${selectedServiceDays.size} day${selectedServiceDays.size !== 1 ? 's' : ''}.`
                                : `Select the required day(s) for this service below.`
                        ) : (`Service for your event on ${selectedVenueDates[0]}.`)
                    ) : ("Select or add a venue to proceed.")}
                </div>

                {/* Total Price Display */}
                <div className="mb-6 pt-4 border-t">
                    <div className="flex justify-between items-baseline">
                        <span className="font-semibold">Estimated Total:</span>
                        <span className="font-bold text-2xl">${calculatedTotalPrice.toLocaleString()}</span>
                    </div>
                    {/* Clarification */}
                    {servicePrice.model === 'day' && isMultiDay && selectedServiceDays.size > 0 && (
                        <p className="text-xs text-muted-foreground mt-1 text-right"> Based on ${servicePrice.basePrice.toLocaleString()}/day × {selectedServiceDays.size} day(s) selected </p>
                    )}
                    {/* ... other clarifications ... */}
                    {!(servicePrice.model === 'day' && isMultiDay && selectedServiceDays.size > 0) && !(servicePrice.model === 'hour') && (<p className="text-xs text-muted-foreground mt-1 text-right"> Based on standard rate/package </p>)}
                </div>

                {/* Day Selection */}
                {isMultiDay && hasVenue && (
                    <div className="mb-6 space-y-4 pt-4 border-t">
                        <h4 className="font-medium text-sm">Select required day(s):</h4>
                        {/* All Available Days Toggle */}
                        {availableDaysForSelection.length > 1 && (
                            <div
                                className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-colors ${availableDaysForSelection.every(day => selectedServiceDays.has(day)) ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/50"}`}
                                onClick={onToggleAllDays}
                                role="checkbox"
                                aria-checked={availableDaysForSelection.every(day => selectedServiceDays.has(day))}
                            >
                                <div className="flex items-center">
                                    <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center shrink-0 ${availableDaysForSelection.every(day => selectedServiceDays.has(day)) ? "border-primary bg-primary" : "border-muted-foreground"}`}>
                                        {availableDaysForSelection.every(day => selectedServiceDays.has(day)) && <Check className="w-3 h-3 text-primary-foreground" />}
                                    </div>
                                    <span className="text-sm font-medium">All {availableDaysForSelection.length} Days</span>
                                </div>
                            </div>
                        )}
                        {/* Individual Day Toggles */}
                        <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-2">
                            {selectedVenueDates.map((day, index) => {
                                const isSelected = selectedServiceDays.has(day);
                                // Simplified: Assumes all venue dates are available for selection per parent logic
                                const isAvailable = availableDaysForSelection.includes(day); // Should always be true based on parent logic
                                return (
                                    <div
                                        key={index}
                                        className={`flex items-center justify-between p-2 rounded-md border cursor-pointer transition-all ${!isAvailable ? "opacity-50 cursor-not-allowed bg-muted/50 border-dashed" : // Keep style for future complex rules
                                                isSelected ? "border-primary/50 bg-primary/5" : "border-transparent hover:bg-muted/70"
                                            }`}
                                        onClick={isAvailable ? () => onToggleDay(day) : undefined}
                                        role="checkbox"
                                        aria-checked={isSelected}
                                        aria-disabled={!isAvailable}
                                    >
                                        <div className="flex items-center">
                                            <div className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center shrink-0 ${!isAvailable ? "border-muted" : isSelected ? "border-primary bg-primary" : "border-muted-foreground"}`}>
                                                {isSelected && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
                                            </div>
                                            <div className="flex items-center">
                                                <Calendar className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                                                <span className={`text-sm ${!isAvailable ? 'text-muted-foreground line-through' : ''}`}>{day}</span>
                                            </div>
                                        </div>
                                        {/* No "Not Available" badge needed with simplified logic */}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                {hasVenue ? (
                    <Button
                        className="w-full"
                        size="lg"
                        onClick={onAddToBooking}
                        disabled={isMultiDay && !isDaySelectionValid}
                    >
                        {isMultiDay && !isDaySelectionValid ? "Select Day(s) First" : "Add to Booking"}
                    </Button>
                ) : (
                    <div className="space-y-3 border-t pt-5">
                        <p className="text-sm font-medium text-center mb-2">Choose your venue first:</p>
                        <Button className="w-full" size="lg" variant="default" onClick={onFindVenue}>
                            <Building className="mr-2 h-5 w-5" /> Find a Venue
                        </Button>
                        <p className="text-center text-xs text-muted-foreground">or</p>
                        <Button variant="outline" className="w-full" size="lg" onClick={onAddExternalVenue}>
                            <MapPin className="mr-2 h-5 w-5" /> Add External Venue
                        </Button>
                    </div>
                )}
                <p className="text-xs text-center text-muted-foreground mt-3"> Finalize details in your booking overview. </p>
            </div>

            {/* Help Box Component */}
            <ServiceHelpBox />

        </div>
    );
};

export default ServiceBookingSidebar;