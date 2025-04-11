
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface AdsListProps {
  ads: any[];
}

const AdsList = ({ ads }: AdsListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {ads.filter(ad => ad.ad_type !== 'affiliate').map(ad => (
        <Card key={ad.id} className="bg-gray-700 border-gray-600">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-lg">{ad.name}</h3>
                <p className="text-gray-400 text-sm">{ad.ad_type} · {ad.position}</p>
              </div>
              <div className="flex">
                <Button variant="ghost" size="sm" className="text-blue-400">
                  <Edit size={16} />
                </Button>
                <Button variant="ghost" size="sm" className="text-red-400">
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div className="bg-gray-800 p-2 rounded">
                <span className="text-gray-400 block">Target:</span>
                <span className="truncate block">{ad.target_url}</span>
              </div>
              <div className="bg-gray-800 p-2 rounded">
                <span className="text-gray-400 block">Frequency:</span>
                <span className="block">{ad.display_frequency}x</span>
              </div>
            </div>
            
            {ad.content_url && (
              <div className="mt-4 bg-gray-800 rounded overflow-hidden h-24">
                <img 
                  src={ad.content_url}
                  alt={ad.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/400x100?text=Ad+Preview';
                  }}
                />
              </div>
            )}
            
            <div className="mt-4 flex justify-between text-sm text-gray-400">
              <span>Created: {format(new Date(ad.created_at), 'MMM d, yyyy')}</span>
              <span className={ad.is_active ? 'text-green-400' : 'text-red-400'}>
                {ad.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdsList;
