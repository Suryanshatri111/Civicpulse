
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Navigation } from '@/components/Navigation';
import { usePotholes, PotholeApiEndpoint } from '@/hooks/usePotholes';
import { MapTilerReportsMap } from '@/components/MapTilerReportsMap';
import { PotholeStatsCards } from '@/components/PotholeStatsCards';
import { PotholeActionBar } from '@/components/PotholeActionBar';
import { ApiEndpointInfo } from '@/components/ApiEndpointInfo';
import { PotholeList } from '@/components/PotholeList';
import { Map, List } from 'lucide-react';

const Potholes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [apiEndpoint, setApiEndpoint] = useState<PotholeApiEndpoint>('all');
  const { data: potholes, isLoading, error } = usePotholes(apiEndpoint);

  const filteredPotholes = potholes?.filter(pothole =>
    pothole.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pothole.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-600">Error loading potholes. Please try again.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pothole Detection & Reporting</h1>
          <p className="text-gray-600">Monitor and manage pothole reports across the city infrastructure with interactive maps</p>
        </div>

        <PotholeActionBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          apiEndpoint={apiEndpoint}
          onApiEndpointChange={setApiEndpoint}
        />

        <ApiEndpointInfo apiEndpoint={apiEndpoint} isLoading={isLoading} />

        <PotholeStatsCards potholes={potholes} />

        <Tabs defaultValue="map" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="map" className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              Map View
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              List View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="map">
            <MapTilerReportsMap />
          </TabsContent>

          <TabsContent value="list">
            <PotholeList potholes={filteredPotholes} isLoading={isLoading} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Potholes;
