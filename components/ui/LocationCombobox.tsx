"use client";

import * as React from "react"; // <-- Make sure this line is present and correct
import { Check, ChevronsUpDown, MapPin } from "lucide-react";
// ... the rest of your imports ...
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";


interface LocationComboboxProps {
  locations: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
}

// Your component function remains the same
export function LocationCombobox({
  locations,
  value,
  onChange,
  placeholder = "Select location...",
  className,
  inputClassName,
}: LocationComboboxProps): React.ReactElement { // <-- Optionally add explicit return type
  const [open, setOpen] = React.useState(false);
  const selectedLabel = locations.find((loc) => loc.value === value)?.label || placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* ... Rest of your component JSX ... */}
       <PopoverTrigger asChild className={className}>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full h-12 justify-between px-3 font-normal", // Adjusted padding and height
            !value && "text-muted-foreground",
            inputClassName
          )}
        >
          <div className="flex items-center truncate">
             <MapPin className="mr-2 h-4 w-4 shrink-0 opacity-50" />
             {value ? selectedLabel : placeholder}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
        <Command filter={(value, search) => {
             // Case-insensitive custom filter
             if (value.toLowerCase().includes(search.toLowerCase())) return 1;
             return 0;
           }}>
          <CommandInput placeholder="Search location..." />
          <CommandList>
              <CommandEmpty>No location found.</CommandEmpty>
              <ScrollArea className="max-h-[250px]"> {/* Limit height */}
                <CommandGroup>
                    {/* Option to clear selection */}
                     <CommandItem
                        key="clear-location"
                        value="" // Use empty string to represent clearing
                        onSelect={() => {
                        onChange(""); // Set value to empty string
                        setOpen(false);
                        }}
                     >
                        <Check
                        className={cn(
                            "mr-2 h-4 w-4",
                            value === "" ? "opacity-100" : "opacity-0"
                        )}
                        />
                        Any Location
                    </CommandItem>
                    {/* Location options */}
                    {locations.map((location) => (
                    <CommandItem
                        key={location.value}
                        value={location.label} // Filter based on label
                        onSelect={(currentValue) => {
                        // Find the corresponding value (lowercase city)
                        const selectedValue = locations.find(loc => loc.label.toLowerCase() === currentValue.toLowerCase())?.value || "";
                        onChange(selectedValue === value ? "" : selectedValue);
                        setOpen(false);
                        }}
                    >
                        <Check
                        className={cn(
                            "mr-2 h-4 w-4",
                            value === location.value ? "opacity-100" : "opacity-0"
                        )}
                        />
                        {location.label}
                    </CommandItem>
                    ))}
                </CommandGroup>
             </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}