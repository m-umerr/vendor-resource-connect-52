
import { Resource, Vendor } from "@/types/vendor";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getVendorById } from "@/data/mockVendorData";
import { formatDistanceToNow } from "date-fns";

interface ResourceCardProps {
  resource: Resource;
  onViewDetails: (resourceId: string) => void;
}

const ResourceCard = ({ resource, onViewDetails }: ResourceCardProps) => {
  const vendor = getVendorById(resource.vendorId);

  return (
    <Card className="h-full flex flex-col transition-all hover:shadow-md">
      <div className="relative h-48 overflow-hidden">
        <img
          src={resource.imageUrl}
          alt={resource.title}
          className="w-full h-full object-cover"
        />
        {resource.featured && (
          <Badge className="absolute top-2 right-2 bg-vendor hover:bg-vendor-dark">
            Featured
          </Badge>
        )}
        <Badge className="absolute top-2 left-2">
          {resource.category}
        </Badge>
      </div>
      <CardContent className="pt-4 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg line-clamp-1">{resource.title}</h3>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
          {resource.description}
        </p>
        <div className="flex justify-between items-center mt-2">
          <div className="font-medium">
            ${resource.price}/{resource.unit}
          </div>
          {vendor && (
            <div className="text-sm text-muted-foreground">
              {vendor.name}
            </div>
          )}
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          Posted {formatDistanceToNow(new Date(resource.createdAt), { addSuffix: true })}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          variant="outline" 
          className="w-full border-vendor-border text-vendor-dark hover:bg-vendor-light hover:text-vendor-dark"
          onClick={() => onViewDetails(resource.id)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ResourceCard;
