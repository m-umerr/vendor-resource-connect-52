
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  onSearchChange: (value: string) => void;
}

const Header = ({ onSearchChange }: HeaderProps) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-vendor-dark">Vendor Resource Connect</h1>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search resources..."
            className="pl-8"
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
