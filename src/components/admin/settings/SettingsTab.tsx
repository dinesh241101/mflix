
import PasswordForm from "./PasswordForm";
import SiteSettingsForm from "./SiteSettingsForm";
import ContentToggleForm from "./ContentToggleForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SettingsTabProps {
  onPasswordUpdate: () => void;
  onSiteSettingsUpdate: () => void;
  onContentSettingsUpdate?: () => void;
}

const SettingsTab = ({ 
  onPasswordUpdate, 
  onSiteSettingsUpdate, 
  onContentSettingsUpdate 
}: SettingsTabProps) => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      
      <Tabs defaultValue="site" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800">
          <TabsTrigger value="site">Site Settings</TabsTrigger>
          <TabsTrigger value="content">Content Display</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="site">
          <SiteSettingsForm onSettingsUpdate={onSiteSettingsUpdate} />
        </TabsContent>
        
        <TabsContent value="content">
          <ContentToggleForm onSettingsUpdate={onContentSettingsUpdate} />
        </TabsContent>
        
        <TabsContent value="security">
          <PasswordForm onPasswordUpdate={onPasswordUpdate} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsTab;
