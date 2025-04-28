
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Resource, Vendor } from "@/types/vendor";
import { getVendorById } from "@/data/mockVendorData";
import { useState } from "react";
import { Check } from "lucide-react";

interface ResourceDetailsDialogProps {
  resource: Resource | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ResourceDetailsDialog = ({ resource, open, onOpenChange }: ResourceDetailsDialogProps) => {
  const [isRequesting, setIsRequesting] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);

  if (!resource) return null;
  
  const vendor = getVendorById(resource.vendorId);
  
  const handleRequest = () => {
    setIsRequesting(true);
    
    // Simulate API request
    setTimeout(() => {
      setIsRequesting(false);
      setHasRequested(true);
      
      toast.success("Resource request sent to vendor", {
        description: "You'll be notified when they respond."
      });
    }, 1000);
  };

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

          {resource.specifications && (
            <>
              <Separator />
              <div>
                <h3 className="font-medium mb-2">Specifications</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(resource.specifications).map(([key, value]) => (
                    <div key={key} className="text-sm">
                      <span className="font-medium">{key}:</span> {value}
                    </div>
                  ))}
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
