
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Database, Loader2 } from 'lucide-react';
import { PotholeApiEndpoint } from '@/hooks/usePotholes';

interface ApiEndpointInfoProps {
  apiEndpoint: PotholeApiEndpoint;
  isLoading: boolean;
}

export const ApiEndpointInfo = ({ apiEndpoint, isLoading }: ApiEndpointInfoProps) => {
  return (
    <div className="mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Database className="h-4 w-4" />
            <span>Current API Endpoint: <strong>{apiEndpoint.replace('_', ' ')}</strong></span>
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
