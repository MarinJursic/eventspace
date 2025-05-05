import { IVenueClientState } from "@/types/venue.types";

export default function checkVenueValidityOnStep(
  venue: IVenueClientState,
  currentStep: number
): boolean {
  const venueBasicInfoValid =
    !!venue.name &&
    !!venue.description &&
    !!venue.type &&
    !!venue.seating?.seated &&
    !!venue.seating.standing;
  const venueLocationValid =
    !!venue.location.city &&
    !!venue.location.street &&
    !!venue.location.houseNumber &&
    !!venue.location.country &&
    !!venue.location.postalCode;
  const venueImagesValid = venue.images.length > 0;
  const venueServicesValid = venue.services.length > 0;
  const venuePriceValid = venue.price.basePrice > 0;

  switch (currentStep) {
    case 0:
      return venueBasicInfoValid;
    case 1:
      return venueLocationValid;
    case 3:
      return venueImagesValid;
    case 5:
      return venueServicesValid;
    case 8:
      return venuePriceValid;

    default:
      return true;
  }
}
