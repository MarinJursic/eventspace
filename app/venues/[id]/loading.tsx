// app/venues/[id]/loading.tsx
import { Loader2 } from 'lucide-react';

export default function LoadingVenueDetail() {
  // You can add a skeleton loader here for a better experience
  return (
    <div className="min-h-screen flex items-center justify-center">
       <div className="flex flex-col items-center space-y-4">
         <Loader2 className="h-12 w-12 animate-spin text-primary" />
         <p className="text-lg text-muted-foreground">Loading Venue Details...</p>
       </div>
    </div>
  );
}