
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, User, ArrowRight } from 'lucide-react';

export const RecentReports = () => {
  const reports = [
    {
      id: 1,
      type: 'Pothole',
      location: 'Main Street & 5th Ave',
      status: 'In Progress',
      priority: 'High',
      time: '2 hours ago',
      reporter: 'John D.',
    },
    {
      id: 2,
      type: 'Traffic Signal',
      location: 'Broadway & Oak St',
      status: 'Resolved',
      priority: 'Medium',
      time: '4 hours ago',
      reporter: 'City Inspector',
    },
    {
      id: 3,
      type: 'Road Maintenance',
      location: 'Highway 101 Bridge',
      status: 'Scheduled',
      priority: 'Low',
      time: '6 hours ago',
      reporter: 'Sarah M.',
    },
    {
      id: 4,
      type: 'Pothole',
      location: 'Elm Street',
      status: 'Pending',
      priority: 'Medium',
      time: '8 hours ago',
      reporter: 'Mike R.',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Scheduled':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Recent Activity</CardTitle>
          <Button variant="outline" size="sm">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{report.type}</h4>
                  <p className="text-sm text-gray-600 flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {report.location}
                  </p>
                  <div className="flex items-center mt-1 space-x-2">
                    <span className="text-xs text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {report.time}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      {report.reporter}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getPriorityColor(report.priority)}>
                  {report.priority}
                </Badge>
                <Badge className={getStatusColor(report.status)}>
                  {report.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
