import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import React from "react";

interface FilterGroupProps {
  title: string;
  options: { id: string; label: string }[];
  selected: Set<string>;
  onChange: (id: string) => void;
  idPrefix: string;
}

const FilterGroup: React.FC<FilterGroupProps> = ({ title, options, selected, onChange, idPrefix }) => {
  return (
    <div className="mb-6">
      <h3 className="font-medium mb-3">{title}</h3>
      <div className="space-y-2">
        {options.map((opt) => (
          <div key={opt.id} className="flex items-center space-x-2">
            <Checkbox
              id={`${idPrefix}-${opt.id}`}
              checked={selected.has(opt.id)}
              onCheckedChange={() => onChange(opt.id)}
            />
            <Label htmlFor={`${idPrefix}-${opt.id}`} className="text-sm">
              {opt.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterGroup;
