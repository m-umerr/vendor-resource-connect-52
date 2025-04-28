
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center max-w-md mx-auto p-8 bg-white rounded-lg shadow">
        <h1 className="text-6xl font-bold text-vendor mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">This resource couldn't be found</p>
        <p className="text-muted-foreground mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button 
          asChild 
          className="bg-vendor hover:bg-vendor-dark"
        >
          <a href="/">Return to Marketplace</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
