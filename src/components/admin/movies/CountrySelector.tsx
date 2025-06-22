
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface CountrySelectorProps {
  selectedCountry: string;
  onCountryChange: (country: string) => void;
}

const CountrySelector = ({ selectedCountry, onCountryChange }: CountrySelectorProps) => {
  const [countries, setCountries] = useState<any[]>([]);
  const [newCountry, setNewCountry] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const { data, error } = await supabase
        .from('countries')
        .select('*')
        .order('name');

      if (error) throw error;
      setCountries(data || []);
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  const addCountry = async () => {
    if (!newCountry.trim()) {
      toast({
        title: "Error",
        description: "Please enter a country name",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('countries')
        .insert({ name: newCountry.trim() })
        .select()
        .single();

      if (error) throw error;

      setCountries([...countries, data]);
      setNewCountry("");
      setShowAddForm(false);
      
      toast({
        title: "Success",
        description: "Country added successfully",
      });
    } catch (error: any) {
      console.error('Error adding country:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add country",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="country">Country</Label>
        <div className="flex gap-2">
          <select
            id="country"
            value={selectedCountry}
            onChange={(e) => onCountryChange(e.target.value)}
            className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country.id} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>
          <Button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus size={16} />
          </Button>
        </div>
      </div>

      {showAddForm && (
        <div className="p-4 bg-gray-700 rounded-lg border border-gray-600">
          <h4 className="font-medium text-white mb-3">Add New Country</h4>
          <div className="flex gap-2">
            <Input
              value={newCountry}
              onChange={(e) => setNewCountry(e.target.value)}
              placeholder="Enter country name"
              className="flex-1 bg-gray-800 border-gray-600 text-white"
            />
            <Button onClick={addCountry} className="bg-green-600 hover:bg-green-700">
              Add
            </Button>
            <Button 
              onClick={() => {
                setShowAddForm(false);
                setNewCountry("");
              }}
              variant="outline"
            >
              <X size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CountrySelector;
