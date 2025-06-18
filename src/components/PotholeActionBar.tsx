
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';
import { MapTilerReportForm } from '@/components/MapTilerReportForm';
import { PotholeApiEndpoint } from '@/hooks/usePotholes';

interface PotholeActionBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  apiEndpoint: PotholeApiEndpoint;
  onApiEndpointChange: (value: PotholeApiEndpoint) => void;
}

export const PotholeActionBar = ({ 
  searchTerm, 
  onSearchChange, 
  apiEndpoint, 
  onApiEndpointChange 
}: PotholeActionBarProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search by title or description..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="flex gap-2">
        <Select value={apiEndpoint} onValueChange={(value: PotholeApiEndpoint) => onApiEndpointChange(value)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select API Endpoint" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Potholes</SelectItem>
            <SelectItem value="recent">Recent Reports</SelectItem>
            <SelectItem value="by_severity">By Severity</SelectItem>
            <SelectItem value="by_status">By Status</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
        <MapTilerReportForm />
      </div>
    </div>
  );
};
