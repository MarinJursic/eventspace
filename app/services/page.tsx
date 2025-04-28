// app/services/page.tsx

import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// Import Server Actions for Services
import { getAllServices, getDbServiceTypes, getDbServiceCities } from '@/lib/actions/serviceActions';

import ServiceListClient from '@/components/service/details/ServiceListClient';

interface ServicesPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// --- Loading Component ---
function LoadingState() {
   return (
       <div className="min-h-screen flex items-center justify-center">
         <Loader2 className="h-12 w-12 animate-spin text-primary" />
         <span className="ml-4 text-lg text-muted-foreground">Loading Services...</span>
       </div>
   );
}

// --- Server Component ---
export default async function ServicesPage({ searchParams }: ServicesPageProps) {

     // --- Fetch initial data ---
     const [
        initialServicesData,
        serviceTypeData,
        serviceCityData
    ] = await Promise.all([
        getAllServices((await searchParams)),
        getDbServiceTypes(),
        getDbServiceCities()
    ]);

    const initialServices = Array.isArray(initialServicesData) ? initialServicesData : [];
    const allServiceTypes = Array.isArray(serviceTypeData) ? serviceTypeData : [];
    const allServiceCities = Array.isArray(serviceCityData) ? serviceCityData : [];

    return (
        // Render the Client Component Wrapper within Suspense
        <Suspense fallback={<LoadingState />}>
            <ServiceListClient
                initialServices={initialServices}
                allServiceTypes={allServiceTypes}
                allServiceCities={allServiceCities}
            />
        </Suspense>
    );
}