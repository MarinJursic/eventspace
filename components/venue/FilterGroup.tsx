// components/venue/FilterGroup.tsx
"use client"; // Add if using hooks, though this one might not need it directly

import { Checkbox } from "@/components/ui/checkbox"; // Adjust path
import { Label } from "@/components/ui/label"; // Adjust path
import React from "react";

interface FilterOption {
  id: string; // This should be the value used for filtering (e.g., "parking", "wifi", "ballroom", "medium")
  label: string; // This is the displayed text
}

interface FilterGroupProps {
  title: string;
  options: FilterOption[]; // Expects an array of objects with id and label
  selected: Set<string>; // The Set containing the selected IDs
  onChange: (id: string) => void; // Callback function when checkbox changes
  idPrefix: string; // Used to create unique HTML IDs
}

const FilterGroup: React.FC<FilterGroupProps> = ({
    title,
    options = [], // Default to empty array
    selected,
    onChange,
    idPrefix
}) => {
  return (
    <div className="mb-5"> {/* Use consistent spacing */}
      <h3 className="font-medium text-sm mb-2">{title}</h3> {/* Consistent heading style */}
      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-2"> {/* Consistent spacing and scroll */}
        {options.map((opt) => (
          <div key={opt.id} className="flex items-center space-x-2">
            <Checkbox
              // Generate a unique ID for the checkbox and label association
              id={`${idPrefix}-${opt.id}`}
              // Check if the option's ID exists in the selected Set
              checked={selected.has(opt.id)}
              // Call the onChange handler passed from the parent, providing the option's ID
              onCheckedChange={() => onChange(opt.id)} // Correct: Call onChange with opt.id
              aria-labelledby={`${idPrefix}-${opt.id}-label`} // Improve accessibility
            />
            <Label
              htmlFor={`${idPrefix}-${opt.id}`}
              id={`${idPrefix}-${opt.id}-label`} // Corresponding ID for aria-labelledby
              className="text-sm font-normal cursor-pointer select-none truncate" // Allow clicking label, prevent text selection, truncate long labels
            >
              {opt.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterGroup;