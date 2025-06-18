import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Navigation } from '@/components/Navigation';
import { TrafficCone, Search, Settings, MapPin, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

const Traffic = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const trafficSignals = [
    {
      id: 'TS-001',
      location: 'Main Street & 1st Avenue',
      coordinates: '40.7128, -74.0060',
      status: 'Online',
      lastMaintenance: '2024-05-15',
      nextMaintenance: '2024-08-15',
      uptime: '99.8%',
      avgWaitTime: '45s',
      dailyTraffic: '12,500',
      issues: 0,
    },
    {
      id: 'TS-002',
      location: 'Broadway & Central Park',
      coordinates: '40.7580, -73.9855',
      status: 'Warning',
      lastMaintenance: '2024-04-20',
      nextMaintenance: '2024-07-20',
      uptime: '97.2%',
      avgWaitTime: '52s',
      dailyTraffic: '18,200',
      issues: 1,
    },
    {
      id: 'TS-003',
      location: 'Park Avenue & 42nd St',
      coordinates: '40.7505, -73.9934',
      status: 'Offline',
      lastMaintenance: '2024-03-10',
      nextMaintenance: '2024-06-16',
      uptime: '0%',
      avgWaitTime: 'N/A',
      dailyTraffic: '0',
      issues: 3,
    },
    {
      id: 'TS-004',
      location: 'Times Square & 7th Ave',
      coordinates: '40.7614, -73.9776',
      status: 'Online',
      lastMaintenance: '2024-05-30',
      nextMaintenance: '2024-08-30',
      uptime: '100%',
      avgWaitTime: '38s',
      dailyTraffic: '25,800',
      issues: 0,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Online':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Offline':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Online':
        return <CheckCircle className="h-4 w-4" />;
      case 'Warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'Offline':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Traffic Signal Monitoring</h1>
          <p className="text-gray-600">Real-time monitoring and management of city traffic infrastructure</p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by location or signal ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Configure
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              <TrafficCone className="mr-2 h-4 w-4" />
              System Status
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Signals</p>
                  <p className="text-2xl font-bold text-gray-900">1,284</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <TrafficCone className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Online</p>
                  <p className="text-2xl font-bold text-green-600">1,251</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Warnings</p>
                  <p className="text-2xl font-bold text-yellow-600">25</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Offline</p>
                  <p className="text-2xl font-bold text-red-600">8</p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Signals List */}
        <div className="space-y-4">
          {trafficSignals.map((signal) => (
            <Card key={signal.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{signal.id}</h3>
                      <Badge className={`${getStatusColor(signal.status)} flex items-center gap-1`}>
                        {getStatusIcon(signal.status)}
                        {signal.status}
                      </Badge>
                      {signal.issues > 0 && (
                        <Badge variant="destructive">
                          {signal.issues} Issues
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{signal.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Coordinates:</span>
                          <span>{signal.coordinates}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Uptime:</span>
                          <span className={signal.uptime === '100%' ? 'text-green-600 font-medium' : 
                                         signal.uptime === '0%' ? 'text-red-600 font-medium' : 'text-yellow-600 font-medium'}>
                            {signal.uptime}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>Avg Wait: {signal.avgWaitTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Daily Traffic:</span>
                          <span>{signal.dailyTraffic} vehicles</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Last Maintenance:</span>
                          <span>{signal.lastMaintenance}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 lg:items-end">
                    <div className="text-sm text-gray-600 text-right">
                      <span className="font-medium">Next Maintenance:</span>
                      <div className="text-gray-900">{signal.nextMaintenance}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        Configure
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Traffic;
