
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const vendorLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters.")
});

type VendorLoginValues = z.infer<typeof vendorLoginSchema>;

const VendorLogin = () => {
  const { signIn, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<VendorLoginValues>({
    resolver: zodResolver(vendorLoginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const handleSubmit = async (values: VendorLoginValues) => {
    setIsSubmitting(true);
    
    try {
      await signIn(values.email, values.password);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-vendor-dark">Vendor Login</h2>
        <p className="text-sm text-muted-foreground">Sign in to access your vendor account</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="email@example.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
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
          
          <Button type="submit" className="w-full bg-vendor hover:bg-vendor-dark" disabled={isSubmitting || isLoading}>
            {isSubmitting || isLoading ? "Logging in..." : "Login"}
          </Button>
          
          <div className="text-center text-sm">
            <p className="text-muted-foreground">
              Don't have an account?{" "}
              <a href="#" onClick={(e) => {
                e.preventDefault();
                document.querySelector('[data-value="register"]')?.dispatchEvent(
                  new MouseEvent('click', { bubbles: true })
                );
              }} className="text-vendor hover:underline">
                Register now
              </a>
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default VendorLogin;
