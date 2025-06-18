
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { PotholeListItem } from '@/components/PotholeListItem';
import { Pothole } from '@/hooks/usePotholes';

interface PotholeListProps {
  potholes: Pothole[];
  isLoading: boolean;
}

export const PotholeList = ({ potholes, isLoading }: PotholeListProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading potholes...</span>
      </div>
    );
  }

  if (potholes.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No potholes found. Be the first to report one!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {potholes.map((pothole) => (
        <PotholeListItem key={pothole.id} pothole={pothole} />
      ))}
    </div>
  );
};
