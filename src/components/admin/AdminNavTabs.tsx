
import { Button } from "@/components/ui/button";
import { 
  Film, 
  Tv, 
  Gamepad2, 
  Settings, 
  BarChart3, 
  Users, 
  DollarSign,
  Video,
  Repeat,
  Upload,
  List,
  Brain,
  Target
} from "lucide-react";

interface AdminNavTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminNavTabs = ({ activeTab, setActiveTab }: AdminNavTabsProps) => {
  const tabs = [
    { id: "movies", label: "Movies", icon: Film },
    { id: "series", label: "Web Series", icon: Tv },
    { id: "anime", label: "Anime", icon: Gamepad2 },
    { id: "shorts", label: "Shorts", icon: Video },
    { id: "episodes", label: "Series Episodes", icon: List },
    { id: "quiz", label: "Quiz Management", icon: Brain },
    { id: "quiz-assignment", label: "Quiz Assignment", icon: Target },
    { id: "redirect", label: "Redirect Loop", icon: Repeat },
    { id: "bulk", label: "Bulk Upload", icon: Upload },
    { id: "ads", label: "Ads Management", icon: DollarSign },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "users", label: "Users", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="border-b border-gray-700 mb-6">
      <div className="flex flex-wrap gap-2 pb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:text-white hover:bg-gray-700"
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default AdminNavTabs;
