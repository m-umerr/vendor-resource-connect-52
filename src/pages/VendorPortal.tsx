
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import VendorRegistration from "@/components/VendorRegistration";
import VendorLogin from "@/components/VendorLogin";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const VendorPortal = () => {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const navigate = useNavigate();
  const { user, vendor } = useAuth();
  
  useEffect(() => {
    // Redirect to dashboard if already logged in
    if (user && vendor) {
      navigate("/vendor/dashboard");
    }
  }, [user, vendor, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header onSearchChange={() => {}} />
      
      <main className="container mx-auto px-4 py-12 flex-grow">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-vendor-dark">Vendor Portal</h1>
            <p className="text-muted-foreground mt-2">
              Join our marketplace to offer your construction resources
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="info">About</TabsTrigger>
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="info" className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-vendor-dark">Become a Vendor</h2>
                  <p>
                    Join the Edifice Operations Suite marketplace as a vendor to showcase your 
                    construction materials, equipment, and services to construction project managers.
                  </p>
                  
                  <h3 className="text-lg font-medium">Benefits</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Connect directly with construction project managers</li>
                    <li>Showcase your products and services</li>
                    <li>Manage your resources and availability</li>
                    <li>Receive direct inquiries and orders</li>
                  </ul>
                  
                  <h3 className="text-lg font-medium">How It Works</h3>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>Create your vendor account</li>
                    <li>Add your company information and credentials</li>
                    <li>List your resources and materials</li>
                    <li>Start receiving inquiries from project managers</li>
                  </ol>
                  
                  <div className="pt-4 flex gap-4 justify-center">
                    <button 
                      onClick={() => navigate("/")}
                      className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors"
                    >
                      Back to Marketplace
                    </button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="login">
                <VendorLogin />
              </TabsContent>
              
              <TabsContent value="register">
                <VendorRegistration 
                  open={isRegisterOpen} 
                  onOpenChange={setIsRegisterOpen} 
                  isPage={true}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-4 mt-10">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Vendor Resource Connect - Part of Edifice Operations Suite</p>
        </div>
      </footer>
    </div>
  );
};

export default VendorPortal;
