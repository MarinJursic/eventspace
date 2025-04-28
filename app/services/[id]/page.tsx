// app/services/[id]/page.tsx
// NO "use client"

import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, AlertTriangle } from 'lucide-react';

// Import Server Actions for Services
import { getServiceById } from '@/lib/actions/serviceActions'; // Adjust path

// Import the Client Component Wrapper
import ServiceDetailClient from '@/components/service/details/ServiceDetailClient'; // Adjust path

// Import UI components
import { Button } from '@/components/ui/button';
import AnimatedSection from '@/components/ui/AnimatedSection';

// Define Params type
type ServiceDetailParams = { params: Promise<{ id: string }> };

// --- Loading Component ---
function LoadingState() {
   return (
       <div className="min-h-[70vh] flex items-center justify-center">
         <Loader2 className="h-12 w-12 animate-spin text-primary" />
       </div>
   );
}

// --- Server Component ---
export default async function ServiceDetailPage({ params }: ServiceDetailParams) {
  const { id } = await params;

   // --- Basic ID Validation ---
   if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) { // Example validation
       console.error("Invalid Service ID format:", id);
       return (
            <div className="min-h-screen flex flex-col">
                <main className="flex-grow pt-8 pb-16 bg-gradient-to-b from-white via-secondary/10 to-white">
                    <div className="container mx-auto px-4 flex flex-col items-center justify-center min-h-[60vh] text-center">
                        <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
                        <h2 className="text-2xl font-semibold mb-2 text-destructive">Invalid Service ID</h2>
                        <p className="text-muted-foreground mb-6">The provided service ID format is incorrect.</p>
                        <Button asChild variant="outline">
                            <Link href="/services"><ArrowLeft className="mr-2 h-4 w-4" />Back to Services</Link>
                        </Button>
                    </div>
                </main>
            </div>
       );
   }

  // --- Fetch Data ---
  // getServiceById now includes reviews
  const serviceData = await getServiceById(id);

  // --- Handle Not Found ---
  if (!serviceData) {
    notFound(); // Render the not-found page
  }

  // --- Render Client Wrapper ---
  return (
    <Suspense fallback={<LoadingState />}>
      <ServiceDetailClient service={serviceData} />
    </Suspense>

  );
}