
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, MapPin, TrafficCone, FileText, BarChart3, Users, Clock, CheckCircle } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { StatsOverview } from '@/components/StatsOverview';
import { RecentReports } from '@/components/RecentReports';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Navigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Welcome back, {user?.email?.split('@')[0]}!</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Monitor potholes, traffic signals, and government projects in real-time. 
            Your dashboard for building smarter, safer communities.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/potholes">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <MapPin className="mr-2 h-5 w-5" />
                View Potholes
              </Button>
            </Link>
            <Link to="/analytics">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                <BarChart3 className="mr-2 h-5 w-5" />
                View Analytics
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="container mx-auto px-4 -mt-8 relative z-10">
        <StatsOverview />
      </div>

      {/* Main Features */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Infrastructure Dashboard</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Access real-time monitoring and reporting capabilities for critical infrastructure components.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <CardTitle>Pothole Reports</CardTitle>
                  <CardDescription>View and manage pothole reports</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Access real-time pothole reports from authenticated users with GPS coordinates and severity levels.
              </p>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-red-600 border-red-200">
                  <Clock className="h-3 w-3 mr-1" />
                  Live Data
                </Badge>
                <Link to="/potholes">
                  <Button variant="outline" size="sm">View Reports</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrafficCone className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <CardTitle>Traffic Signals</CardTitle>
                  <CardDescription>Monitor traffic signal status</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Monitor traffic signal status, performance metrics, and maintenance schedules across the network.
              </p>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-green-600 border-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Monitored
                </Badge>
                <Link to="/traffic">
                  <Button variant="outline" size="sm">Monitor Status</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle>Government Projects</CardTitle>
                  <CardDescription>Track infrastructure projects</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Track government infrastructure projects, budgets, timelines, and progress for transparency.
              </p>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-purple-600 border-purple-200">
                  <Users className="h-3 w-3 mr-1" />
                  Tracked
                </Badge>
                <Link to="/projects">
                  <Button variant="outline" size="sm">View Projects</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <RecentReports />
      </div>
    </div>
  );
};

export default Index;
