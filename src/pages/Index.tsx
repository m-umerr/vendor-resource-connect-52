
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import ResourceCard from "@/components/ResourceCard";
import ResourceFilter from "@/components/ResourceFilter";
import ResourceDetailsDialog from "@/components/ResourceDetailsDialog";
import { Resource, type ResourceFilter as ResourceFilterType } from "@/types/vendor";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle } from "lucide-react";
import VendorRegistration from "@/components/VendorRegistration";
import AddResourceForm from "@/components/AddResourceForm";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { toast } = useToast();
  const { user, vendor } = useAuth();
  const [filter, setFilter] = useState<ResourceFilterType>({
    search: "",
    category: "All",
    minPrice: null,
    maxPrice: null,
    vendorId: null,
  });
  
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isVendorDialogOpen, setIsVendorDialogOpen] = useState(false);
  const [isAddResourceOpen, setIsAddResourceOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("resources")
        .select(`
          *,
          vendors:vendor_id (
            id, name, contact_name, contact_email, contact_phone, location, rating
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Convert from Supabase format to our app's format
      const formattedResources = data.map(item => ({
        id: item.id,
        vendorId: item.vendor_id,
        title: item.title,
        description: item.description,
        category: item.category as any,
        price: item.price,
        unit: item.unit as any,
        availability: item.availability,
        imageUrl: item.image_url || 'https://placehold.co/600x400?text=Resource',
        featured: item.featured,
        specifications: item.specifications,
        createdAt: item.created_at,
        vendor: item.vendors
      }));

      setResources(formattedResources);
      setFilteredResources(formattedResources);
    } catch (error: any) {
      console.error("Error fetching resources:", error);
      toast({
        title: "Error loading resources",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
  }, [filter, resources]);

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

  const handleAddResource = async (resourceData: any) => {
    if (!vendor) {
      toast({
        title: "Error",
        description: "You need to register as a vendor first.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase.from("resources").insert({
        vendor_id: vendor.id,
        title: resourceData.title,
        description: resourceData.description,
        category: resourceData.category,
        price: resourceData.price,
        unit: resourceData.unit,
        availability: resourceData.availability,
        image_url: resourceData.imageUrl || 'https://placehold.co/600x400?text=Resource',
        featured: false
      }).select();

      if (error) {
        throw error;
      }
      
      toast({
        title: "Resource added",
        description: "Your resource has been added successfully.",
      });

      // Refresh resources
      fetchResources();
    } catch (error: any) {
      toast({
        title: "Error adding resource",
        description: error.message,
        variant: "destructive",
      });
    }
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
                
                {user ? (
                  <Button 
                    className="w-full text-sm bg-vendor hover:bg-vendor-dark"
                    onClick={() => navigate("/vendor/dashboard")}
                  >
                    {vendor ? "Manage Vendor Account" : "Complete Vendor Registration"}
                  </Button>
                ) : (
                  <Button 
                    className="w-full text-sm bg-vendor hover:bg-vendor-dark"
                    onClick={() => navigate("/vendor")}
                  >
                    Become a Vendor
                  </Button>
                )}

                {vendor && (
                  <Button 
                    className="w-full text-sm mt-2 flex items-center gap-2"
                    onClick={() => setIsAddResourceOpen(true)}
                  >
                    <PlusCircle className="h-4 w-4" />
                    Add New Resource
                  </Button>
                )}
              </div>

              {vendor && (
                <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                  <h3 className="font-medium text-vendor-dark">Your Vendor Profile</h3>
                  <p className="text-sm font-semibold mt-2">{vendor.name}</p>
                  <p className="text-xs text-muted-foreground">{vendor.location}</p>
                  <p className="text-xs mt-2">
                    Contact: {vendor.contact_name} ({vendor.contact_email})
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full text-xs mt-3"
                    onClick={() => {
                      setFilter(prev => ({
                        ...prev,
                        vendorId: vendor.id
                      }));
                    }}
                  >
                    View Your Resources
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-grow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Available Resources</h2>
              <span className="text-sm text-muted-foreground">
                {filteredResources.length} resources found
              </span>
            </div>
            
            {isLoading ? (
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
                <p>Loading resources...</p>
              </div>
            ) : filteredResources.length === 0 ? (
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

      <VendorRegistration
        open={isVendorDialogOpen}
        onOpenChange={setIsVendorDialogOpen}
      />

      <AddResourceForm
        open={isAddResourceOpen}
        onOpenChange={setIsAddResourceOpen}
        onAddResource={handleAddResource}
        vendorId={vendor?.id || null}
      />
    </div>
  );
};

export default Index;
