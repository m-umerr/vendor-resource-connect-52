
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, LogOut, Edit, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AddResourceForm from "@/components/AddResourceForm";

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  unit: string;
  availability: string;
  image_url: string;
  featured: boolean;
  created_at: string;
}

const VendorDashboard = () => {
  const { user, vendor, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [resources, setResources] = useState<Resource[]>([]);
  const [isAddResourceOpen, setIsAddResourceOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/vendor");
      return;
    }
    
    fetchVendorResources();
  }, [user, navigate, vendor]);

  const fetchVendorResources = async () => {
    if (!vendor) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .eq("vendor_id", vendor.id)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setResources(data || []);
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

  const handleAddResource = async (resourceData: any) => {
    if (!vendor) {
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
      fetchVendorResources();
    } catch (error: any) {
      toast({
        title: "Error adding resource",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteResource = async (id: string) => {
    try {
      const { error } = await supabase
        .from("resources")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      setResources(resources.filter(r => r.id !== id));
      
      toast({
        title: "Resource deleted",
        description: "Your resource has been deleted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting resource",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!user || !vendor) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header onSearchChange={() => {}} />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-vendor-dark">Vendor Dashboard</h1>
            <p className="text-muted-foreground">Manage your resources and profile</p>
          </div>
          <Button variant="outline" onClick={signOut} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Welcome back</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium text-vendor-dark">{vendor.name}</p>
              <p className="text-sm text-muted-foreground mt-1">{vendor.contact_email}</p>
              <p className="text-sm text-muted-foreground">{vendor.location}</p>
              <Button 
                className="w-full mt-4"
                variant="outline"
                onClick={() => navigate("/")}
              >
                View Marketplace
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-vendor-dark">{resources.length}</p>
              <p className="text-sm text-muted-foreground">Listed resources</p>
            </CardContent>
          </Card>

          <Card className="bg-vendor-light border-vendor-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-vendor-dark">Add a Resource</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">List a new resource in the marketplace</p>
              <Button 
                className="w-full bg-vendor hover:bg-vendor-dark flex items-center gap-2"
                onClick={() => setIsAddResourceOpen(true)}
              >
                <Plus className="h-4 w-4" /> Add New Resource
              </Button>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-xl font-semibold mb-4">Your Resources</h2>
        
        {isLoading ? (
          <div className="text-center py-10">
            <p>Loading resources...</p>
          </div>
        ) : resources.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
            <h3 className="text-lg font-semibold mb-2">No resources yet</h3>
            <p className="text-muted-foreground mb-4">
              Add your first resource to get started.
            </p>
            <Button 
              onClick={() => setIsAddResourceOpen(true)}
              className="bg-vendor hover:bg-vendor-dark flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Add Resource
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {resources.map((resource) => (
                  <tr key={resource.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{resource.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{resource.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${resource.price}/{resource.unit}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{resource.availability}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-vendor-dark">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-red-500"
                        onClick={() => handleDeleteResource(resource.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 py-4 mt-10">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Vendor Resource Connect - Part of Edifice Operations Suite</p>
        </div>
      </footer>

      <AddResourceForm
        open={isAddResourceOpen}
        onOpenChange={setIsAddResourceOpen}
        onAddResource={handleAddResource}
        vendorId={vendor?.id || null}
      />
    </div>
  );
};

export default VendorDashboard;
