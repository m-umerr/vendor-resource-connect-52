import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const vendorFormSchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  contactName: z.string().min(2, "Contact name must be at least 2 characters."),
  contactEmail: z.string().email("Please enter a valid email address."),
  contactPhone: z.string().min(10, "Please enter a valid phone number."),
  location: z.string().min(2, "Location must be at least 2 characters."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters.")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type VendorFormValues = z.infer<typeof vendorFormSchema>;

interface VendorRegistrationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRegister?: (values: VendorFormValues) => void;
  isPage?: boolean;
}

const VendorRegistration = ({ open, onOpenChange, onRegister, isPage = false }: VendorRegistrationProps) => {
  const { signUp, isLoading } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<VendorFormValues>({
    resolver: zodResolver(vendorFormSchema),
    defaultValues: {
      name: "",
      description: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      location: "",
      password: "",
      confirmPassword: ""
    }
  });

  const handleSubmit = async (values: VendorFormValues) => {
    setIsSubmitting(true);
    
    try {
      console.log("Registration values:", values);
      
      await signUp(values.contactEmail, values.password, {
        name: values.name,
        contactName: values.contactName,
        contactPhone: values.contactPhone,
        location: values.location,
      });
      
      if (onRegister) {
        onRegister(values);
      }
      
      form.reset();
      if (!isPage) {
        onOpenChange(false);
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: error.message || "An error occurred during registration.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderForm = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your company name" {...field} />
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
              <FormLabel>Company Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe your company and services" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="contactName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Name</FormLabel>
                <FormControl>
                  <Input placeholder="Primary contact person" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="contactEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Email</FormLabel>
                <FormControl>
                  <Input placeholder="email@example.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="contactPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="City, State" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="••••••••" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input placeholder="••••••••" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {isPage ? (
          <Button type="submit" className="w-full bg-vendor hover:bg-vendor-dark" disabled={isSubmitting || isLoading}>
            {isSubmitting || isLoading ? "Registering..." : "Register"}
          </Button>
        ) : (
          <DialogFooter className="pt-4">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoading}>
              {isSubmitting || isLoading ? "Registering..." : "Register"}
            </Button>
          </DialogFooter>
        )}
      </form>
    </Form>
  );

  // For page view (not in a dialog)
  if (isPage) {
    return (
      <div className="space-y-4 max-w-md mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-vendor-dark">Vendor Registration</h2>
          <p className="text-sm text-muted-foreground">Create your vendor account to list your resources</p>
        </div>
        {renderForm()}
      </div>
    );
  }

  // For dialog view
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Register as a Vendor</DialogTitle>
          <DialogDescription>
            Fill out the form below to register your company as a vendor.
          </DialogDescription>
        </DialogHeader>
        {renderForm()}
      </DialogContent>
    </Dialog>
  );
};

export default VendorRegistration;
