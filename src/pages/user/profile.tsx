import { UserProfile, OrganizationProfile, useOrganization, CreateOrganization } from "@clerk/clerk-react"
import { RootLayout } from "@/components/layout/root-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { isAuthEnabled } from '@/lib/utils'
import { RegularHoursConfig } from "@/components/operating-hours/regular-hours"
import { SpecialHoursConfig } from "@/components/operating-hours/special-hours"
import { HolidayConfig } from "@/components/operating-hours/holiday-config"

// Placeholder component for when auth is disabled
const DemoProfile = () => {
  return (
    <div className="glass-panel p-6 space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Demo User Profile</h3>
        <p className="text-sm text-gray-500">This is a demo profile page. Authentication is disabled.</p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <div className="text-sm text-gray-600">demo@example.com</div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Full Name</label>
          <div className="text-sm text-gray-600">Demo User</div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Organization</label>
          <div className="text-sm text-gray-600">Demo Organization</div>
        </div>
      </div>
    </div>
  )
}

// Auth version of the profile page
function AuthProfilePage() {
  const { organization } = useOrganization();
  
  return (
    <RootLayout hideKnowledgeSearch>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="organization">Organization</TabsTrigger>
            <TabsTrigger value="operating-hours">Operating Hours</TabsTrigger>
          </TabsList>
          <TabsContent value="profile" className="space-y-6">
            <UserProfile />
          </TabsContent>
          <TabsContent value="organization" className="space-y-6">
            {organization ? <OrganizationProfile /> : <CreateOrganization />}
          </TabsContent>
          <TabsContent value="operating-hours" className="space-y-6">
            <Tabs defaultValue="regular">
              <TabsList>
                <TabsTrigger value="regular">Regular Hours</TabsTrigger>
                <TabsTrigger value="special">Special Hours</TabsTrigger>
                <TabsTrigger value="holidays">Holidays</TabsTrigger>
              </TabsList>
              
              <TabsContent value="regular">
                <RegularHoursConfig />
              </TabsContent>
              
              <TabsContent value="special">
                <SpecialHoursConfig />
              </TabsContent>
              
              <TabsContent value="holidays">
                <HolidayConfig />
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </RootLayout>
  );
}

// Non-auth version of the profile page
function NonAuthProfilePage() {
  return (
    <RootLayout hideKnowledgeSearch>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="organization">Organization</TabsTrigger>
            <TabsTrigger value="operating-hours">Operating Hours</TabsTrigger>
          </TabsList>
          <TabsContent value="profile" className="space-y-6">
            <DemoProfile />
          </TabsContent>
          <TabsContent value="organization" className="space-y-6">
            <DemoProfile />
          </TabsContent>
          <TabsContent value="operating-hours" className="space-y-6">
            <Tabs defaultValue="regular">
              <TabsList>
                <TabsTrigger value="regular">Regular Hours</TabsTrigger>
                <TabsTrigger value="special">Special Hours</TabsTrigger>
                <TabsTrigger value="holidays">Holidays</TabsTrigger>
              </TabsList>
              
              <TabsContent value="regular">
                <RegularHoursConfig />
              </TabsContent>
              
              <TabsContent value="special">
                <SpecialHoursConfig />
              </TabsContent>
              
              <TabsContent value="holidays">
                <HolidayConfig />
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </RootLayout>
  );
}

export default function ProfilePage() {
  return isAuthEnabled() ? <AuthProfilePage /> : <NonAuthProfilePage />;
} 