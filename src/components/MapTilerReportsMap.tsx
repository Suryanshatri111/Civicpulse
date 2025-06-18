
import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIssues } from '@/hooks/useIssueReporting';
import { MapPin, Navigation, Layers, Filter } from 'lucide-react';

export const MapTilerReportsMap = () => {
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [mapTilerToken, setMapTilerToken] = useState('');
  const { data: issues, isLoading } = useIssues();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  const filteredIssues = issues?.filter(issue => 
    filterCategory === 'all' || issue.category === filterCategory
  ) || [];

  useEffect(() => {
    if (!mapContainer.current || !mapTilerToken) return;

    // MapTiler uses the same mapbox-gl library but with different style URLs
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${mapTilerToken}`,
      center: [-74.0060, 40.7128], // NYC
      zoom: 12
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [mapTilerToken]);

  useEffect(() => {
    if (!map.current || !filteredIssues.length) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add new markers
    filteredIssues.forEach(issue => {
      if (!issue.latitude || !issue.longitude) return;

      const markerColor = getMarkerColor(issue.status);
      
      const marker = new mapboxgl.Marker({ color: markerColor })
        .setLngLat([Number(issue.longitude), Number(issue.latitude)])
        .addTo(map.current!);

      marker.getElement().addEventListener('click', () => {
        setSelectedIssue(issue);
      });

      markers.current.push(marker);
    });
  }, [filteredIssues]);

  const getMarkerColor = (status: string) => {
    switch (status) {
      case 'resolved': return '#22c55e';
      case 'in_progress': return '#3b82f6';
      case 'acknowledged': return '#8b5cf6';
      default: return '#ef4444';
    }
  };

  const centerOnUserLocation = () => {
    if (!map.current || !navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = [position.coords.longitude, position.coords.latitude];
        map.current!.setCenter(userLocation as [number, number]);
        map.current!.setZoom(15);
      },
      (error) => {
        console.error('Error getting user location:', error);
      }
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'acknowledged': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Reports Map View
            </CardTitle>
            <div className="flex gap-2">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="pothole">Potholes</SelectItem>
                  <SelectItem value="traffic_signal">Traffic Signals</SelectItem>
                  <SelectItem value="streetlight">Street Lights</SelectItem>
                  <SelectItem value="road_damage">Road Damage</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm" variant="outline" onClick={centerOnUserLocation}>
                <Navigation className="h-4 w-4 mr-1" />
                My Location
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!mapTilerToken ? (
            <div className="space-y-4 p-6 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold">MapTiler Token Required</h3>
              <Input
                type="password"
                value={mapTilerToken}
                onChange={(e) => setMapTilerToken(e.target.value)}
                placeholder="Enter your MapTiler API key"
              />
              <p className="text-sm text-blue-600">
                Get your token from <a href="https://maptiler.com/" target="_blank" rel="noopener noreferrer" className="underline">maptiler.com</a>
              </p>
            </div>
          ) : (
            <div 
              ref={mapContainer}
              className="w-full h-[500px] rounded-lg"
              style={{ minHeight: '500px' }}
            />
          )}
        </CardContent>
      </Card>

      {selectedIssue && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Selected Report Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold">{selectedIssue.title}</h3>
                <Badge className={getPriorityColor(selectedIssue.priority)}>
                  {selectedIssue.priority}
                </Badge>
                <Badge className={getStatusColor(selectedIssue.status)}>
                  {selectedIssue.status.replace('_', ' ')}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Category:</strong> {selectedIssue.category.replace('_', ' ')}
                </div>
                <div>
                  <strong>Reported:</strong> {new Date(selectedIssue.created_at).toLocaleDateString()}
                </div>
                <div>
                  <strong>Location:</strong> {selectedIssue.latitude?.toFixed(6)}, {selectedIssue.longitude?.toFixed(6)}
                </div>
                <div>
                  <strong>ID:</strong> {selectedIssue.id.slice(0, 8)}...
                </div>
              </div>
              
              {selectedIssue.description && (
                <div>
                  <strong>Description:</strong>
                  <p className="mt-1 text-gray-700">{selectedIssue.description}</p>
                </div>
              )}
              
              {selectedIssue.image_url && (
                <div>
                  <strong>Attached Image:</strong>
                  <img 
                    src={selectedIssue.image_url} 
                    alt="Issue" 
                    className="mt-2 max-w-xs rounded-lg border"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
