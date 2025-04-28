
import { Resource, Vendor } from "@/types/vendor";

export const vendors: Vendor[] = [
  {
    id: "v1",
    name: "Builders Supply Co.",
    logo: "/placeholder.svg",
    description: "Leading provider of construction materials with over 20 years of industry experience.",
    contactName: "John Smith",
    contactEmail: "john@builderssupply.com",
    contactPhone: "(555) 123-4567",
    rating: 4.8,
    location: "Chicago, IL"
  },
  {
    id: "v2",
    name: "Heavy Equipment Rentals",
    logo: "/placeholder.svg",
    description: "Specialized in high-quality construction equipment rentals for projects of all sizes.",
    contactName: "Lisa Johnson",
    contactEmail: "lisa@heavyequipment.com",
    contactPhone: "(555) 234-5678",
    rating: 4.6,
    location: "Denver, CO"
  },
  {
    id: "v3",
    name: "Professional Labor Services",
    logo: "/placeholder.svg",
    description: "Providing skilled labor teams for construction projects.",
    contactName: "Michael Chen",
    contactEmail: "michael@prolabor.com",
    contactPhone: "(555) 345-6789",
    rating: 4.5,
    location: "Atlanta, GA"
  },
  {
    id: "v4",
    name: "Specialty Concrete Solutions",
    logo: "/placeholder.svg",
    description: "Experts in concrete products and services for commercial projects.",
    contactName: "Sarah Williams",
    contactEmail: "sarah@specialtyconcrete.com",
    contactPhone: "(555) 456-7890",
    rating: 4.9,
    location: "Austin, TX"
  }
];

export const resources: Resource[] = [
  {
    id: "r1",
    vendorId: "v1",
    title: "Premium Lumber Package",
    description: "High-quality pressure-treated lumber perfect for framing and structural support.",
    category: "Material",
    price: 2500.00,
    unit: "Cubic Yard",
    availability: "In stock - Ready to ship",
    imageUrl: "/placeholder.svg",
    featured: true,
    specifications: {
      "Type": "Douglas Fir",
      "Treatment": "Pressure-treated",
      "Grade": "Premium",
      "Moisture Content": "<19%"
    },
    createdAt: "2023-11-20T14:30:00Z"
  },
  {
    id: "r2",
    vendorId: "v2",
    title: "Excavator - 15 Ton",
    description: "Late-model excavator with experienced operator available for site preparation.",
    category: "Equipment",
    price: 450.00,
    unit: "Day",
    availability: "Available with 3-day notice",
    imageUrl: "/placeholder.svg",
    featured: true,
    specifications: {
      "Brand": "Caterpillar",
      "Model": "CAT 315",
      "Year": "2022",
      "Operating Weight": "15 tons",
      "Bucket Capacity": "1.3 cubic yards"
    },
    createdAt: "2023-12-05T09:15:00Z"
  },
  {
    id: "r3",
    vendorId: "v3",
    title: "Carpentry Crew",
    description: "Team of 5 experienced carpenters for framing, finishing, and detail work.",
    category: "Labor",
    price: 1200.00,
    unit: "Day",
    availability: "Available starting next week",
    imageUrl: "/placeholder.svg",
    featured: false,
    specifications: {
      "Team Size": "5 workers",
      "Experience Level": "10+ years average",
      "Specialties": "Framing, Finishing, Custom Work",
      "Languages": "English, Spanish"
    },
    createdAt: "2023-12-10T13:45:00Z"
  },
  {
    id: "r4",
    vendorId: "v4",
    title: "High-Performance Concrete Mix",
    description: "Specially formulated concrete mix for high-stress applications and faster curing times.",
    category: "Material",
    price: 195.00,
    unit: "Cubic Yard",
    availability: "3-day lead time",
    imageUrl: "/placeholder.svg",
    featured: true,
    specifications: {
      "Strength": "6,000 PSI",
      "Cure Time": "Fast (24-48 hours)",
      "Application": "Commercial/Industrial",
      "Features": "Crack-resistant, Weather-resistant"
    },
    createdAt: "2023-12-15T15:20:00Z"
  },
  {
    id: "r5",
    vendorId: "v1",
    title: "Steel Beam Package",
    description: "Commercial-grade steel I-beams for structural support.",
    category: "Material",
    price: 4200.00,
    unit: "Ton",
    availability: "2-week lead time",
    imageUrl: "/placeholder.svg",
    featured: false,
    specifications: {
      "Type": "ASTM A992",
      "Size Range": "W8x10 to W36x300",
      "Finish": "Mill finish",
      "Certification": "AISC certified"
    },
    createdAt: "2023-12-18T10:30:00Z"
  },
  {
    id: "r6",
    vendorId: "v2",
    title: "Boom Lift - 60ft",
    description: "Self-propelled boom lift for elevated work areas.",
    category: "Equipment",
    price: 350.00,
    unit: "Day",
    availability: "Available now",
    imageUrl: "/placeholder.svg",
    featured: false,
    specifications: {
      "Brand": "JLG",
      "Height": "60 feet",
      "Capacity": "500 lbs",
      "Power": "Diesel",
      "Type": "Articulating"
    },
    createdAt: "2023-12-20T16:10:00Z"
  },
  {
    id: "r7",
    vendorId: "v3",
    title: "Electrical Team",
    description: "Licensed electricians for commercial building wiring and installation.",
    category: "Labor",
    price: 1500.00,
    unit: "Day",
    availability: "Available in 1 week",
    imageUrl: "/placeholder.svg",
    featured: true,
    specifications: {
      "Team Size": "4 electricians",
      "License": "Master Electricians",
      "Specialties": "Commercial, Industrial",
      "Certifications": "NFPA, OSHA"
    },
    createdAt: "2023-12-22T11:00:00Z"
  },
  {
    id: "r8",
    vendorId: "v4",
    title: "Specialty Epoxy Flooring",
    description: "Industrial epoxy flooring installation for warehouses and factories.",
    category: "Subcontractor",
    price: 12.50,
    unit: "Square Foot",
    availability: "Scheduling for next month",
    imageUrl: "/placeholder.svg",
    featured: false,
    specifications: {
      "Type": "100% solids epoxy",
      "Thickness": "30 mil",
      "Features": "Chemical resistant, Non-slip",
      "Warranty": "10 years"
    },
    createdAt: "2023-12-25T14:15:00Z"
  }
];

// Helper function to get vendor by ID
export function getVendorById(id: string): Vendor | undefined {
  return vendors.find(vendor => vendor.id === id);
}

// Helper function to get resources by vendor ID
export function getResourcesByVendorId(vendorId: string): Resource[] {
  return resources.filter(resource => resource.vendorId === vendorId);
}

// Helper function to get a resource by ID
export function getResourceById(id: string): Resource | undefined {
  return resources.find(resource => resource.id === id);
}
