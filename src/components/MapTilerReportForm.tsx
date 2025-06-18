import React, { useState, useCallback, useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useCreateIssue } from '@/hooks/useIssueReporting';
import { MapPin, Camera, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Location {
  lat: number;
  lng: number;
}

interface ReportFormData {
  title: string;
  description: string;
  category: 'pothole' | 'traffic_signal' | 'streetlight' | 'road_damage' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  location: Location | null;
  image: File | null;
}

export const MapTilerReportForm = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<ReportFormData>({
    title: '',
    description: '',
    category: 'other',
    priority: 'medium',
    location: null,
    image: null
  });
  const [uploading, setUploading] = useState(false);
  const [mapTilerToken, setMapTilerToken] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const createIssue = useCreateIssue();

  useEffect(() => {
    if (!open || !mapContainer.current || !mapTilerToken) return;

    // MapTiler uses the same mapbox-gl library but with different style URLs
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${mapTilerToken}`,
      center: [-74.0060, 40.7128], // NYC
      zoom: 12
    });

    map.current.on('click', (e) => {
      const location = {
        lat: e.lngLat.lat,
        lng: e.lngLat.lng
      };
      
      setFormData(prev => ({ ...prev, location }));
      
      // Remove existing marker
      if (marker.current) {
        marker.current.remove();
      }
      
      // Add new marker
      marker.current = new mapboxgl.Marker()
        .setLngLat([e.lngLat.lng, e.lngLat.lat])
        .addTo(map.current!);
      
      toast.success('Location selected on map');
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [open, mapTilerToken]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      toast.success('Image selected for upload');
    }
  };

  const uploadToGoogleCloud = async (file: File): Promise<string> => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('filename', `reports/${Date.now()}_${file.name}`);

      const response = await fetch('/api/upload-to-gcs', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      return result.url;
    } catch (error) {
      console.error('Error uploading to Google Cloud:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.location) {
      toast.error('Please select a location on the map');
      return;
    }

    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    try {
      let imageUrl = null;
      
      if (formData.image) {
        imageUrl = await uploadToGoogleCloud(formData.image);
      }

      await createIssue.mutateAsync({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        latitude: formData.location.lat,
        longitude: formData.location.lng,
        image_url: imageUrl,
        status: 'reported'
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'other',
        priority: 'medium',
        location: null,
        image: null
      });
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      if (marker.current) {
        marker.current.remove();
      }
      
      setOpen(false);
      toast.success('Report submitted successfully!');
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error('Failed to submit report');
    }
  };

  const categoryOptions = [
    { value: 'pothole', label: 'Pothole' },
    { value: 'traffic_signal', label: 'Traffic Signal' },
    { value: 'streetlight', label: 'Street Light' },
    { value: 'road_damage', label: 'Road Damage' },
    { value: 'other', label: 'Other' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <MapPin className="mr-2 h-4 w-4" />
          Report with Maps
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            Report Infrastructure Issue with Location
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* MapTiler Token Input */}
          {!mapTilerToken && (
            <div className="space-y-2 p-4 bg-blue-50 rounded-lg">
              <Label htmlFor="maptiler-token">MapTiler API Key</Label>
              <Input
                id="maptiler-token"
                type="password"
                value={mapTilerToken}
                onChange={(e) => setMapTilerToken(e.target.value)}
                placeholder="Enter your MapTiler API key"
              />
              <p className="text-sm text-blue-600">
                Get your API key from <a href="https://maptiler.com/" target="_blank" rel="noopener noreferrer" className="underline">maptiler.com</a>
              </p>
            </div>
          )}

          {/* Map Section */}
          {mapTilerToken && (
            <div className="space-y-2">
              <Label>Select Location on Map*</Label>
              <div 
                ref={mapContainer}
                className="w-full h-[400px] border rounded-lg"
                style={{ minHeight: '400px' }}
              />
              {formData.location && (
                <p className="text-sm text-green-600">
                  Selected: {formData.location.lat.toFixed(6)}, {formData.location.lng.toFixed(6)}
                </p>
              )}
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Issue Title*</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Brief description of the issue"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category*</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    category: value as ReportFormData['category'] 
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority">Priority*</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    priority: value as ReportFormData['priority'] 
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description*</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Provide detailed information about the issue..."
                className="min-h-[100px]"
                required
              />
            </div>

            <div>
              <Label htmlFor="image">Upload Image (Optional)</Label>
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  {formData.image ? formData.image.name : 'Select Image'}
                </Button>
                {formData.image && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setFormData(prev => ({ ...prev, image: null }))}
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createIssue.isPending || uploading || !mapTilerToken}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {createIssue.isPending || uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {uploading ? 'Uploading...' : 'Submitting...'}
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Submit Report
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
