import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResourceCategory, ResourceUnit } from "@/types/vendor";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

// Define resource specification types
interface ResourceSpecItem {
  name: string;
  quantity: number;
}

const resourceSpecifications = [
  "Brick",
  "Cement",
  "Crane",
  "Drill",
  "Forklift",
  "Helmet",
  "Ladder",
  "Lumber",
  "Steel"
];

const resourceFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  category: z.enum(["Material", "Equipment", "Labor", "Subcontractor", "Other"]),
  price: z.coerce.number().min(0, "Price must be a positive number."),
  unit: z.enum(["Each", "Hour", "Day", "Week", "Month", "Square Foot", "Cubic Yard", "Ton"]),
  availability: z.string().min(2, "Please specify availability."),
  imageUrl: z.string().url("Please enter a valid URL for the image.").optional().or(z.literal("")),
});

type ResourceFormValues = z.infer<typeof resourceFormSchema>;

interface AddResourceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddResource: (resource: ResourceFormValues & { specifications?: Record<string, number> }) => void;
  vendorId: string | null;
}

const AddResourceForm = ({ open, onOpenChange, onAddResource, vendorId }: AddResourceFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSpecs, setSelectedSpecs] = useState<Record<string, boolean>>({});
  const [specQuantities, setSpecQuantities] = useState<Record<string, number>>({});
  const [specErrors, setSpecErrors] = useState<Record<string, string>>({});

  const form = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "Material",
      price: 0,
      unit: "Each",
      availability: "In stock",
      imageUrl: "",
    }
  });

  const handleSpecChange = (spec: string, checked: boolean) => {
    setSelectedSpecs({
      ...selectedSpecs,
      [spec]: checked
    });

    // Clear error if unchecked
    if (!checked && specErrors[spec]) {
      const newErrors = { ...specErrors };
      delete newErrors[spec];
      setSpecErrors(newErrors);
    }
  };

  const handleQuantityChange = (spec: string, value: string) => {
    const quantity = parseInt(value);
    setSpecQuantities({
      ...specQuantities,
      [spec]: isNaN(quantity) ? 0 : quantity
    });

    // Clear error if valid
    if (quantity > 0 && specErrors[spec]) {
      const newErrors = { ...specErrors };
      delete newErrors[spec];
      setSpecErrors(newErrors);
    }
  };

  const validateSpecifications = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    Object.entries(selectedSpecs).forEach(([spec, isSelected]) => {
      if (isSelected) {
        const quantity = specQuantities[spec] || 0;
        if (quantity <= 0) {
          newErrors[spec] = "Quantity required";
          isValid = false;
        }
      }
    });

    setSpecErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (values: ResourceFormValues) => {
    if (!vendorId) {
      toast({
        title: "Error",
        description: "You need to register as a vendor first.",
        variant: "destructive"
      });
      return;
    }

    if (!validateSpecifications()) {
      toast({
        title: "Validation Error",
        description: "Please provide quantities for all selected specifications.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create specifications object with only selected items
      const specifications: Record<string, number> = {};
      Object.entries(selectedSpecs).forEach(([spec, isSelected]) => {
        if (isSelected && specQuantities[spec] > 0) {
          specifications[spec] = specQuantities[spec];
        }
      });

      // Pass the resource data to the parent component
      onAddResource({
        ...values,
        specifications
      });
      
      toast({
        title: "Resource added successfully!",
        description: "Your resource has been added to the marketplace."
      });
      
      form.reset();
      setSelectedSpecs({});
      setSpecQuantities({});
      setSpecErrors({});
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Failed to add resource",
        description: "There was a problem adding your resource. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories: ResourceCategory[] = ["Material", "Equipment", "Labor", "Subcontractor", "Other"];
  const units: ResourceUnit[] = ["Each", "Hour", "Day", "Week", "Month", "Square Foot", "Cubic Yard", "Ton"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Resource</DialogTitle>
          <DialogDescription>
            Fill out the form below to add a new resource to the marketplace.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Resource title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your resource" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {units.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0.00" 
                        {...field} 
                        onChange={(e) => field.onChange(e.target.valueAsNumber)} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="availability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Availability</FormLabel>
                    <FormControl>
                      <Input placeholder="In stock, 2-3 days, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div>
              <FormLabel>Specifications</FormLabel>
              <div className="border rounded-md p-4 mt-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {resourceSpecifications.map((spec) => (
                    <div key={spec} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Checkbox 
                          id={`spec-${spec}`} 
                          checked={selectedSpecs[spec] || false}
                          onCheckedChange={(checked) => 
                            handleSpecChange(spec, checked === true)
                          }
                        />
                        <label 
                          htmlFor={`spec-${spec}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {spec}
                        </label>
                      </div>
                      
                      {selectedSpecs[spec] && (
                        <div className="ml-6">
                          <Input
                            type="number"
                            min="1"
                            placeholder="Quantity"
                            value={specQuantities[spec] || ""}
                            onChange={(e) => handleQuantityChange(spec, e.target.value)}
                            className="h-8 w-24"
                          />
                          {specErrors[spec] && (
                            <p className="text-sm font-medium text-destructive mt-1">
                              {specErrors[spec]}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <DialogFooter className="pt-4">
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Resource"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddResourceForm;
