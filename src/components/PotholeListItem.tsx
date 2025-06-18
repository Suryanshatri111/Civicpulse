
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar } from 'lucide-react';
import { Pothole } from '@/hooks/usePotholes';

interface PotholeListItemProps {
  pothole: Pothole;
}

export const PotholeListItem = ({ pothole }: PotholeListItemProps) => {
  const getSeverityColor = (severity: string | null) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{pothole.title}</h3>
              {pothole.severity && (
                <Badge className={getSeverityColor(pothole.severity)}>
                  {pothole.severity}
                </Badge>
              )}
              <Badge className={getStatusColor(pothole.status)}>
                {pothole.status.replace('_', ' ')}
              </Badge>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              {pothole.latitude && pothole.longitude && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Lat: {pothole.latitude}, Lng: {pothole.longitude}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Reported on {new Date(pothole.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            {pothole.description && (
              <p className="text-gray-700 mt-2">{pothole.description}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              View Details
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              Update Status
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
