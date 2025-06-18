
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Navigation } from '@/components/Navigation';
import { FileText, Search, Calendar, DollarSign, Users, MapPin, Clock } from 'lucide-react';

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const governmentProjects = [
    {
      id: 'GP-001',
      title: 'Highway 101 Bridge Reconstruction',
      department: 'Department of Transportation',
      location: 'Highway 101, Mile Marker 45',
      budget: '$12,500,000',
      allocated: '$8,750,000',
      spent: '$6,200,000',
      progress: 72,
      status: 'In Progress',
      startDate: '2024-01-15',
      endDate: '2024-10-30',
      contractor: 'Metro Construction Inc.',
      description: 'Complete reconstruction of Highway 101 bridge including structural upgrades and safety improvements.',
    },
    {
      id: 'GP-002',
      title: 'Downtown Traffic Light Modernization',
      department: 'City Planning',
      location: 'Downtown District',
      budget: '$3,200,000',
      allocated: '$3,200,000',
      spent: '$2,880,000',
      progress: 90,
      status: 'Near Completion',
      startDate: '2024-03-01',
      endDate: '2024-07-15',
      contractor: 'Smart Traffic Solutions',
      description: 'Upgrade of 45 traffic signals with smart technology and improved timing systems.',
    },
    {
      id: 'GP-003',
      title: 'City Park Infrastructure Improvement',
      department: 'Parks & Recreation',
      location: 'Central City Park',
      budget: '$1,800,000',
      allocated: '$1,500,000',
      spent: '$750,000',
      progress: 35,
      status: 'In Progress',
      startDate: '2024-04-01',
      endDate: '2024-12-31',
      contractor: 'Green Spaces LLC',
      description: 'Comprehensive park infrastructure improvements including pathways, lighting, and recreational facilities.',
    },
    {
      id: 'GP-004',
      title: 'Water Main Replacement Project',
      department: 'Public Works',
      location: 'Residential District A',
      budget: '$8,900,000',
      allocated: '$8,900,000',
      spent: '$8,900,000',
      progress: 100,
      status: 'Completed',
      startDate: '2023-09-01',
      endDate: '2024-05-30',
      contractor: 'AquaFlow Systems',
      description: 'Replacement of aging water main infrastructure to improve water quality and reduce service interruptions.',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Near Completion':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Delayed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return 'bg-green-500';
    if (progress >= 70) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Government Project Transparency</h1>
          <p className="text-gray-600">Track public infrastructure projects, budgets, and progress in real-time</p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search projects by title, location, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Filter by Date
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <FileText className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Budget Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Projects</p>
                  <p className="text-2xl font-bold text-gray-900">156</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Budget</p>
                  <p className="text-2xl font-bold text-blue-600">$2.8B</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-green-600">89</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-purple-600">67</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects List */}
        <div className="space-y-6">
          {governmentProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl">{project.title}</CardTitle>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{project.department}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{project.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{project.startDate} - {project.endDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{project.progress}%</div>
                    <div className="text-sm text-gray-600">Complete</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-700">{project.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Project Progress</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>

                  {/* Budget Information */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Total Budget</div>
                      <div className="text-lg font-semibold text-gray-900">{project.budget}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Allocated</div>
                      <div className="text-lg font-semibold text-blue-600">{project.allocated}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Spent</div>
                      <div className="text-lg font-semibold text-green-600">{project.spent}</div>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4 border-t">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Contractor:</span> {project.contractor}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View Documents
                      </Button>
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                        Detailed Report
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

export default Projects;
