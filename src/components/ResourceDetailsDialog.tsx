
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Resource, Vendor } from "@/types/vendor";
import { getVendorById } from "@/data/mockVendorData";
import { useState } from "react";
import { Check, Box, Construction, Truck, HardHat, Wrench, Package, Info } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "./ui/tooltip";
import { supabase } from "@/integrations/supabase/client";

interface ResourceDetailsDialogProps {
  resource: Resource | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ResourceDetailsDialog = ({ resource, open, onOpenChange }: ResourceDetailsDialogProps) => {
  const [isRequesting, setIsRequesting] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);
  const [activeSpec, setActiveSpec] = useState<string | null>(null);

  if (!resource) return null;
  
  const vendor = getVendorById(resource.vendorId);
  
  const handleRequest = async () => {
    setIsRequesting(true);
    
    try {
      // Check if we have specifications to save
      if (resource.specifications && Object.keys(resource.specifications).length > 0) {
        // Calculate cost per specification (distribute price equally)
        const specEntries = Object.entries(resource.specifications);
        const totalSpecCount = specEntries.length;
        const costPerSpec = resource.price / totalSpecCount;
        
        for (const [specType, quantity] of specEntries) {
          // Determine the type of resource based on specification
          let resourceType = "Other";
          
          // Materials: Brick, Cement, Lumber, Steel
          if (["Brick", "Cement", "Lumber", "Steel"].includes(specType)) {
            resourceType = "Material";
          } 
          // Equipment: Crane, Drill, Forklift, Helmet, Ladder
          else if (["Crane", "Drill", "Forklift", "Helmet", "Ladder"].includes(specType)) {
            resourceType = "Equipment";
          }
          
          // Insert the resource request - storing just the specification name
          const { data, error } = await supabase
            .from('resource_requests')
            .insert({
              name: specType, // Save only the specification name
              type: resourceType, // Set the properly categorized type
              quantity: Number(quantity),
              unit: resource.unit,
              vendor_id: resource.vendorId,
              resource_id: resource.id,
              cost: costPerSpec, // Add the calculated cost per specification
              status: "Available", // Set status to "Available"
              // Optional fields left as null/default: hour_rate, day_rate, user_id
            });
            
          if (error) {
            console.error("Error saving resource request:", error);
            throw error;
          }
        }
        
        toast.success("Resource request sent to vendor", {
          description: "You'll be notified when they respond."
        });
      } else {
        // If there are no specifications, just create one resource request with the full price
        const { data, error } = await supabase
          .from('resource_requests')
          .insert({
            name: resource.title, // Use resource title when no specifications
            quantity: 1,
            unit: resource.unit,
            vendor_id: resource.vendorId,
            resource_id: resource.id,
            cost: resource.price, // Use the full resource price
            status: "Available", // Set status to "Available"
            type: resource.category, // Use the resource category as type
          });
          
        if (error) {
          console.error("Error saving resource request:", error);
          throw error;
        }
        
        toast.success("Resource request sent to vendor", {
          description: "You'll be notified when they respond."
        });
      }
      
      setHasRequested(true);
    } catch (error: any) {
      toast.error("Failed to send request", {
        description: error.message || "Please try again later."
      });
    } finally {
      setIsRequesting(false);
    }
  };

  // Helper function to get the appropriate icon for each resource type
  const getSpecificationIcon = (specType: string) => {
    switch (specType) {
      case 'Brick': return <Box className="h-4 w-4" />;
      case 'Cement': return <Package className="h-4 w-4" />;
      case 'Crane': return <Construction className="h-4 w-4" />;
      case 'Drill': return <Wrench className="h-4 w-4" />;
      case 'Forklift': return <Truck className="h-4 w-4" />;
      case 'Helmet': return <HardHat className="h-4 w-4" />;
      case 'Ladder': return <Construction className="h-4 w-4" />;
      case 'Lumber': return <Package className="h-4 w-4" />;
      case 'Steel': return <Box className="h-4 w-4" />;
      default: return <Check className="h-4 w-4" />;
    }
  };

  // Get detailed information about specifications
  const getSpecificationDetails = (specType: string) => {
    switch (specType) {
      case 'Brick':
        return {
          description: "Standard building bricks for construction",
          uses: "Walls, facades, decorative elements",
          properties: "Durable, fire resistant, thermal mass"
        };
      case 'Cement':
        return {
          description: "Binding material used in construction",
          uses: "Concrete production, mortar, grouting",
          properties: "High compressive strength, water resistant"
        };
      case 'Crane':
        return {
          description: "Heavy lifting equipment for construction sites",
          uses: "Moving materials, lifting heavy components",
          properties: "Variable height and reach capabilities"
        };
      case 'Drill':
        return {
          description: "Power tool for making holes or driving fasteners",
          uses: "Installing fixtures, creating openings, attachments",
          properties: "Variable speed, reversible, multiple drill bits"
        };
      case 'Forklift':
        return {
          description: "Powered industrial truck for lifting and moving materials",
          uses: "Loading/unloading trucks, moving palletized materials",
          properties: "Variable lift height, different load capacities"
        };
      case 'Helmet':
        return {
          description: "Personal protective equipment for head protection",
          uses: "Required safety equipment for all site personnel",
          properties: "Impact resistant, adjustable fit"
        };
      case 'Ladder':
        return {
          description: "Portable climbing device with rungs",
          uses: "Accessing elevated work areas, general height access",
          properties: "Adjustable height, folding capability"
        };
      case 'Lumber':
        return {
          description: "Processed wood used for construction",
          uses: "Framing, temporary structures, formwork",
          properties: "Various dimensions, grades, and treatments"
        };
      case 'Steel':
        return {
          description: "Structural metal alloy for construction",
          uses: "Reinforcement, structural framing, supports",
          properties: "High tensile strength, durability, recyclable"
        };
      default:
        return {
          description: "Construction resource for building projects",
          uses: "Various applications in construction",
          properties: "Specific properties depend on the material"
        };
    }
  };

  // Check if resource has specifications and ensure it's properly processed
  const hasSpecifications = () => {
    if (!resource.specifications) return false;
    
    if (typeof resource.specifications === 'object' && 
        !Array.isArray(resource.specifications) && 
        resource.specifications !== null &&
        Object.keys(resource.specifications).length > 0) {
      return true;
    }
    
    return false;
  };

  // Get specifications as an object
  const getSpecifications = () => {
    if (!resource.specifications) return {};
    
    if (typeof resource.specifications === 'object' && 
        !Array.isArray(resource.specifications) && 
        resource.specifications !== null) {
      return resource.specifications;
    }
    
    return {};
  };

  // Check if the resource has valid specifications
  const specExists = hasSpecifications();
  // Get specifications as an object
  const specifications = getSpecifications();

  // Debug log to check what's happening with specifications
  console.log("Resource specs:", resource.specifications);
  console.log("specExists:", specExists);
  console.log("specifications:", specifications);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{resource.title}</DialogTitle>
          <DialogDescription>
            <div className="flex items-center gap-2 mt-1">
              <Badge>{resource.category}</Badge>
              {resource.featured && (
                <Badge variant="secondary" className="bg-vendor text-vendor-foreground hover:bg-vendor-dark">
                  Featured
                </Badge>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4">
          <div className="flex justify-center">
            <img 
              src={resource.imageUrl}
              alt={resource.title}
              className="rounded-md object-cover h-64 w-full"
            />
          </div>
          
          <div>
            <h3 className="font-medium text-lg">Description</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {resource.description}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <h4 className="text-sm font-medium">Price</h4>
              <p className="text-base">${resource.price}/{resource.unit}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Availability</h4>
              <p className="text-sm">{resource.availability}</p>
            </div>
          </div>

          {specExists && (
            <>
              <Separator />
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-medium">Specifications</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-[200px] text-xs">Click on a specification to see detailed information</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(specifications).map(([spec, quantity]) => {
                    const details = getSpecificationDetails(spec);
                    return (
                      <Popover key={spec} onOpenChange={(open) => open ? setActiveSpec(spec) : setActiveSpec(null)}>
                        <PopoverTrigger asChild>
                          <div className={`flex items-center gap-2 p-3 rounded border cursor-pointer transition-colors ${
                            activeSpec === spec ? 'bg-vendor-light border-vendor' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                          }`}>
                            <div className="rounded-full p-1 bg-vendor/10">
                              {getSpecificationIcon(spec)}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium">{spec}</span> 
                              <span className="text-vendor-dark text-sm">{String(quantity)} units</span>
                            </div>
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-72 p-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              {getSpecificationIcon(spec)}
                              <h4 className="font-medium text-base">{spec} Specification</h4>
                            </div>
                            
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Quantity:</span>
                              <span className="font-medium">{String(quantity)} units</span>
                            </div>
                            
                            <Separator />
                            
                            <div className="space-y-2">
                              <h5 className="text-sm font-medium">Description</h5>
                              <p className="text-sm text-muted-foreground">
                                {details.description}
                              </p>
                            </div>
                            
                            <div className="space-y-2">
                              <h5 className="text-sm font-medium">Common Uses</h5>
                              <p className="text-sm text-muted-foreground">
                                {details.uses}
                              </p>
                            </div>
                            
                            <div className="space-y-2">
                              <h5 className="text-sm font-medium">Properties</h5>
                              <p className="text-sm text-muted-foreground">
                                {details.properties}
                              </p>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    );
                  })}
                </div>
              </div>
            </>
          )}
          
          {vendor && (
            <>
              <Separator />
              <div>
                <h3 className="font-medium mb-2">Vendor Information</h3>
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-vendor-light rounded-full h-8 w-8 flex items-center justify-center text-vendor font-bold">
                    {vendor.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{vendor.name}</p>
                    <p className="text-xs text-muted-foreground">{vendor.location}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{vendor.description}</p>
                
                <div className="mt-2 grid grid-cols-2 gap-y-1 text-sm">
                  <div>
                    <span className="font-medium">Contact:</span> {vendor.contactName}
                  </div>
                  <div>
                    <span className="font-medium">Rating:</span> {vendor.rating}/5
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium">Email:</span> {vendor.contactEmail}
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium">Phone:</span> {vendor.contactPhone}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button 
            className="bg-vendor hover:bg-vendor-dark"
            onClick={handleRequest}
            disabled={isRequesting || hasRequested}
          >
            {isRequesting ? (
              "Processing..."
            ) : hasRequested ? (
              <>
                <Check className="mr-1 h-4 w-4" /> Requested
              </>
            ) : (
              "Request Resource"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResourceDetailsDialog;
