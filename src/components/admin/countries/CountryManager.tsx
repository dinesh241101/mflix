
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

const CountryManager = () => {
  const [countries, setCountries] = useState<any[]>([]);
  const [newCountry, setNewCountry] = useState("");
  const [loading, setLoading] = useState(false);

  const predefinedCountries = [
    "United States", "India", "United Kingdom", "Canada", "Australia",
    "Germany", "France", "Japan", "South Korea", "China", "Brazil",
    "Mexico", "Spain", "Italy", "Russia", "Turkey", "Thailand",
    "Philippines", "Indonesia", "Malaysia", "Singapore", "Hong Kong",
    "Taiwan", "Vietnam", "Pakistan", "Bangladesh", "Sri Lanka",
    "Nepal", "Myanmar", "Cambodia", "Laos", "Afghanistan", "Iran",
    "Iraq", "Israel", "Jordan", "Lebanon", "Syria", "Saudi Arabia",
    "UAE", "Qatar", "Kuwait", "Bahrain", "Oman", "Yemen", "Egypt",
    "Libya", "Tunisia", "Algeria", "Morocco", "Sudan", "Ethiopia",
    "Kenya", "Uganda", "Tanzania", "Rwanda", "Ghana", "Nigeria",
    "South Africa", "Botswana", "Zambia", "Zimbabwe", "Madagascar"
  ];

  useEffect(() => {
    fetchCountries();
    initializePredefinedCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      // @ts-ignore - countries table exists but types need to be regenerated
      const { data, error } = await supabase
        .from('countries')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setCountries(data || []);
    } catch (error: any) {
      console.error("Error fetching countries:", error);
    }
  };

  const initializePredefinedCountries = async () => {
    try {
      // @ts-ignore - countries table exists but types need to be regenerated
      const { data: existingCountries } = await supabase
        .from('countries')
        .select('name');

      const existingNames = existingCountries?.map((c: any) => c.name) || [];
      const newCountries = predefinedCountries
        .filter(country => !existingNames.includes(country))
        .map(country => ({ name: country }));

      if (newCountries.length > 0) {
        // @ts-ignore - countries table exists but types need to be regenerated
        await supabase.from('countries').insert(newCountries);
        fetchCountries();
      }
    } catch (error: any) {
      console.error("Error initializing countries:", error);
    }
  };

  const handleAddCountry = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCountry.trim()) return;

    try {
      setLoading(true);
      
      // @ts-ignore - countries table exists but types need to be regenerated
      const { error } = await supabase
        .from('countries')
        .insert({ name: newCountry.trim() });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Country added successfully!",
      });

      setNewCountry("");
      fetchCountries();

    } catch (error: any) {
      console.error("Error adding country:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add country",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCountry = async (id: string) => {
    try {
      // @ts-ignore - countries table exists but types need to be regenerated
      const { error } = await supabase
        .from('countries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Country deleted successfully",
      });

      fetchCountries();

    } catch (error: any) {
      console.error("Error deleting country:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete country",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Countries Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleAddCountry} className="flex gap-2">
          <Input
            value={newCountry}
            onChange={(e) => setNewCountry(e.target.value)}
            placeholder="Add new country..."
            className="bg-gray-700 border-gray-600"
          />
          <Button type="submit" disabled={loading}>
            <Plus size={16} />
          </Button>
        </form>

        <div className="max-h-60 overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {countries.map((country) => (
              <div 
                key={country.id} 
                className="flex items-center justify-between bg-gray-700 p-2 rounded"
              >
                <span className="text-sm">{country.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-red-400"
                  onClick={() => handleDeleteCountry(country.id)}
                >
                  <Trash2 size={12} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CountryManager;
