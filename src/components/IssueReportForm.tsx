
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useCreateIssue } from '@/hooks/useIssueReporting';
import { useForm } from 'react-hook-form';
import { MapPin, AlertTriangle, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface IssueFormData {
  title: string;
  description: string;
  category: 'pothole' | 'traffic_signal' | 'streetlight' | 'road_damage' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  latitude?: number;
  longitude?: number;
}

export const IssueReportForm = () => {
  const [open, setOpen] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const createIssue = useCreateIssue();

  const form = useForm<IssueFormData>({
    defaultValues: {
      title: '',
      description: '',
      category: 'other',
      priority: 'medium',
    }
  });

  const getCurrentLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          form.setValue('latitude', position.coords.latitude);
          form.setValue('longitude', position.coords.longitude);
          toast.success('Location captured successfully');
          setLocationLoading(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast.error('Failed to get location');
          setLocationLoading(false);
        }
      );
    } else {
      toast.error('Geolocation is not supported by this browser');
      setLocationLoading(false);
    }
  };

  const onSubmit = async (data: IssueFormData) => {
    try {
      await createIssue.mutateAsync({
        title: data.title,
        description: data.description,
        category: data.category,
        priority: data.priority,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        image_url: null,
        status: 'reported'
      });
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error('Error submitting issue:', error);
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
        <Button className="bg-red-600 hover:bg-red-700">
          <Plus className="mr-2 h-4 w-4" />
          Report Issue
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Report Infrastructure Issue
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issue Title*</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Brief description of the issue" 
                      {...field} 
                      required 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categoryOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {priorityOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description*</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Provide detailed information about the issue..."
                      className="min-h-[100px]"
                      {...field}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <Label>Location (Optional)</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={getCurrentLocation}
                  disabled={locationLoading}
                  className="flex-1"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  {locationLoading ? 'Getting Location...' : 'Use Current Location'}
                </Button>
              </div>
              {form.watch('latitude') && form.watch('longitude') && (
                <div className="text-sm text-green-600 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  Location captured: {form.watch('latitude')?.toFixed(6)}, {form.watch('longitude')?.toFixed(6)}
                </div>
              )}
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
                disabled={createIssue.isPending}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                {createIssue.isPending ? 'Submitting...' : 'Submit Report'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
