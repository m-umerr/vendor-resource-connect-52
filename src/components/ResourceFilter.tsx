
import { useState } from "react";
import { ResourceCategory, type ResourceFilter as ResourceFilterType } from "@/types/vendor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface ResourceFilterProps {
  onFilterChange: (filter: ResourceFilterType) => void;
  currentFilter: ResourceFilterType;
}

const ResourceFilter = ({ onFilterChange, currentFilter }: ResourceFilterProps) => {
  const [priceRange, setPriceRange] = useState<number[]>([
    currentFilter.minPrice || 0, 
    currentFilter.maxPrice || 5000
  ]);

  const categories: Array<ResourceCategory | "All"> = [
    "All",
    "Material",
    "Equipment",
    "Labor",
    "Subcontractor",
    "Other"
  ];

  const handleCategoryChange = (value: string) => {
    onFilterChange({
      ...currentFilter,
      category: value as ResourceCategory | "All"
    });
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
    onFilterChange({
      ...currentFilter,
      minPrice: value[0],
      maxPrice: value[1]
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="space-y-4">
        <div>
          <Label htmlFor="category-filter">Resource Category</Label>
          <Select 
            value={currentFilter.category}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger id="category-filter" className="w-full">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <Label>Price Range</Label>
            <span className="text-sm text-muted-foreground">
              ${priceRange[0]} - ${priceRange[1]}
            </span>
          </div>
          <Slider
            defaultValue={priceRange}
            min={0}
            max={5000}
            step={50}
            onValueChange={handlePriceChange}
            className="mt-2"
          />
        </div>
      </div>
    </div>
  );
};

export default ResourceFilter;
