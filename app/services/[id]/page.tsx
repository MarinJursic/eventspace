import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getServiceById } from "@/lib/actions/serviceActions";
import ServiceDetailClient from "@/components/service/details/ServiceDetailClient";

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
export default async function ServiceDetailPage({
  params,
}: ServiceDetailParams) {
  const { id } = await params;

  // --- Fetch Data ---
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
