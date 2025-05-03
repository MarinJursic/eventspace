import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IServiceClientState } from "@/types/service.types";
import { countries } from "./ServiceLocationValues";
import ServiceMap from "./ServiceMap";

export default function LocationStep({
  service,
  setService,
}: {
  service: IServiceClientState;
  setService: React.Dispatch<React.SetStateAction<IServiceClientState>>;
}) {
  const handleLocationChange = (field: string, value: string) => {
    setService({
      ...service,
      location: {
        ...service.location,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="font-bold text-3xl pb-2">Location</h1>

      <div className="w-full h-64 overflow-hidden rounded-md border-gray-300">
        <ServiceMap service={service} setService={setService} />
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="street" className="text-base">
            Street <span className="text-red-500">*</span>
          </Label>
          <Input
            id="street"
            placeholder="Enter street name"
            value={service.location.street}
            onChange={(e) => handleLocationChange("street", e.target.value)}
            className="mt-1"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="houseNumber" className="text-base">
              House Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="houseNumber"
              type="string"
              placeholder="House number"
              value={service.location.houseNumber}
              onChange={(e) =>
                handleLocationChange("houseNumber", e.target.value)
              }
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="postalCode" className="text-base">
              Postal Code <span className="text-red-500">*</span>
            </Label>
            <Input
              id="postalCode"
              type="text"
              placeholder="Postal code"
              value={service.location.postalCode}
              onChange={(e) =>
                handleLocationChange("postalCode", e.target.value)
              }
              className="mt-1"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="city" className="text-base">
            City <span className="text-red-500">*</span>
          </Label>
          <Input
            id="city"
            placeholder="Enter city name"
            value={service.location.city}
            onChange={(e) => handleLocationChange("city", e.target.value)}
            className="mt-1"
            required
          />
        </div>

        <div>
          <Label htmlFor="country" className="text-base">
            Country <span className="text-red-500">*</span>
          </Label>
          <Select
            value={service.location.country}
            onValueChange={(value) => handleLocationChange("country", value)}
          >
            <SelectTrigger id="country" className="mt-1">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-base">Additional Address Information</Label>
          <Input
            placeholder="Apartment, suite, unit, building, floor, etc."
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
}
