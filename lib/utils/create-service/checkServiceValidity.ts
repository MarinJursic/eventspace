import { IServiceClientState } from "@/types/service.types";

export default function checkServiceValidityOnStep(
  service: IServiceClientState,
  currentStep: number
): boolean {
  const serviceBasicInfoValid =
    !!service.name && !!service.description && !!service.type;
  const serviceLocationValid =
    !!service.location.city &&
    !!service.location.street &&
    !!service.location.houseNumber &&
    !!service.location.country &&
    !!service.location.postalCode;
  const serviceImagesValid = service.images.length > 0;
  const serviceServicesValid = service.features.length > 0;
  const servicePriceValid = service.price.basePrice > 0;

  switch (currentStep) {
    case 0:
      return serviceBasicInfoValid;
    case 1:
      return serviceLocationValid;
    case 3:
      return serviceImagesValid;
    case 5:
      return serviceServicesValid;
    case 8:
      return servicePriceValid;
    default:
      return true;
  }
}
