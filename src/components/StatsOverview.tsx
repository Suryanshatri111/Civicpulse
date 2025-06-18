import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, TrafficCone, FileText, Users, TrendingUp, Clock } from 'lucide-react';

export const StatsOverview = () => {
  const stats = [
    {
      title: 'Active Pothole Reports',
      value: '1,247',
      change: '+12%',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Traffic Signals Online',
      value: '98.7%',
      change: '+2.1%',
      icon: TrafficCone,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Government Projects',
      value: '156',
      change: '+8',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Community Reports',
      value: '2,891',
      change: '+24%',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-white shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                  <span className="text-sm text-gray-500 ml-1">from last month</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
