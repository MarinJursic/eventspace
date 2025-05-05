import React, { Dispatch, SetStateAction } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IServiceClientState } from "@/types/service.types";
import { serviceTypes } from "./ServiceInfoValues";

export default function BasicInfoStep({
  service,
  setService,
}: {
  service: IServiceClientState;
  setService: Dispatch<SetStateAction<IServiceClientState>>;
}) {
  const MAX_DESCRIPTION_WORDS = 50;
  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  return (
    <div className="space-y-6">
      <h1 className="font-bold text-3xl">Basic Information</h1>

      <div>
        <Label htmlFor="name">
          Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          placeholder="Enter service name"
          value={service.name}
          onChange={(e) => setService({ ...service, name: e.target.value })}
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="description">
          Description <span className="text-red-500">*</span>
        </Label>
        <p className="text-sm text-muted-foreground mb-1 mt-1">
          Include key features, atmosphere, unique selling points, and any other
          relevant details.
        </p>
        <Textarea
          id="description"
          placeholder="Describe your service in detail"
          value={service.description}
          onChange={(e) => {
            if (countWords(e.target.value) <= MAX_DESCRIPTION_WORDS) {
              setService({ ...service, description: e.target.value });
            }
          }}
          className="mt-3 h-32 resize-none"
        />
        <p className="text-sm mt-1">
          {MAX_DESCRIPTION_WORDS - countWords(service.description ?? "")} words
          remaining
        </p>
      </div>

      <div>
        <Label htmlFor="type">
          Service Type <span className="text-red-500">*</span>
        </Label>
        <Select
          value={service.type}
          onValueChange={(value) => setService({ ...service, type: value })}
        >
          <SelectTrigger id="type" className="mt-1">
            <SelectValue placeholder="Select service type" />
          </SelectTrigger>
          <SelectContent>
            {serviceTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
