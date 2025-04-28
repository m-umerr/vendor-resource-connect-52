import { useState, useEffect } from "react";
import { resources } from "@/data/mockVendorData";
import Header from "@/components/Header";
import ResourceCard from "@/components/ResourceCard";
import ResourceFilter from "@/components/ResourceFilter";
import ResourceDetailsDialog from "@/components/ResourceDetailsDialog";
import { Resource, type ResourceFilter as ResourceFilterType } from "@/types/vendor";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [filter, setFilter] = useState<ResourceFilterType>({
    search: "",
    category: "All",
    minPrice: null,
    maxPrice: null,
    vendorId: null,
  });
  
  const [filteredResources, setFilteredResources] = useState<Resource[]>(resources);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    let result = [...resources];

    if (filter.search) {
      const searchTerm = filter.search.toLowerCase();
      result = result.filter(
        resource => 
          resource.title.toLowerCase().includes(searchTerm) ||
          resource.description.toLowerCase().includes(searchTerm)
      );
    }

    if (filter.category && filter.category !== "All") {
      result = result.filter(resource => resource.category === filter.category);
    }

    if (filter.minPrice !== null) {
      result = result.filter(resource => resource.price >= (filter.minPrice as number));
    }
    if (filter.maxPrice !== null) {
      result = result.filter(resource => resource.price <= (filter.maxPrice as number));
    }

    if (filter.vendorId) {
      result = result.filter(resource => resource.vendorId === filter.vendorId);
    }

    setFilteredResources(result);
  }, [filter]);

  const handleSearchChange = (value: string) => {
    setFilter(prev => ({ ...prev, search: value }));
  };

  const handleFilterChange = (newFilter: ResourceFilterType) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
  };

  const handleViewDetails = (resourceId: string) => {
    const resource = resources.find(r => r.id === resourceId);
    if (resource) {
      setSelectedResource(resource);
      setIsDetailsOpen(true);
    }
  };

  const handleClearFilters = () => {
    setFilter({
      search: "",
      category: "All",
      minPrice: null,
      maxPrice: null,
      vendorId: null,
    });
    toast({
      title: "Filters cleared",
      description: "All resources are now visible."
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header onSearchChange={handleSearchChange} />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-64">
            <div className="sticky top-20">
              <h2 className="text-lg font-semibold mb-3">Filters</h2>
              <ResourceFilter 
                onFilterChange={handleFilterChange}
                currentFilter={filter}
              />
              
              {(filter.search || filter.category !== "All" || filter.minPrice !== null) && (
                <Button 
                  variant="ghost" 
                  className="mt-2 text-sm w-full"
                  onClick={handleClearFilters}
                >
                  Clear All Filters
                </Button>
              )}

              <div className="mt-6 p-4 bg-vendor-light rounded-lg border border-vendor-border">
                <h3 className="font-medium text-vendor-dark">Are you a vendor?</h3>
                <p className="text-sm mt-1 mb-3">Join our marketplace and offer your resources to construction projects.</p>
                <Button 
                  className="w-full text-sm bg-vendor hover:bg-vendor-dark"
                  onClick={() => {
                    toast({
                      title: "Vendor registration",
                      description: "Vendor registration is coming soon!"
                    });
                  }}
                >
                  Become a Vendor
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex-grow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Available Resources</h2>
              <span className="text-sm text-muted-foreground">
                {filteredResources.length} resources found
              </span>
            </div>
            
            {filteredResources.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
                <h3 className="text-lg font-semibold mb-2">No resources found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search terms.
                </p>
                <Button 
                  variant="outline"
                  onClick={handleClearFilters}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-4 mt-10">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Vendor Resource Connect - Part of Edifice Operations Suite</p>
        </div>
      </footer>

      <ResourceDetailsDialog
        resource={selectedResource}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
    </div>
  );
};

export default Index;
