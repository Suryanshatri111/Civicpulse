
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useIssues, useUpdateIssue } from '@/hooks/useIssueReporting';
import { MapPin, Calendar, User, Search, Filter, AlertTriangle, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const IssuesList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const { data: issues, isLoading, error } = useIssues();
  const updateIssue = useUpdateIssue();
  const { user } = useAuth();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'acknowledged':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'pothole':
        return '🕳️';
      case 'traffic_signal':
        return '🚦';
      case 'streetlight':
        return '💡';
      case 'road_damage':
        return '🛣️';
      default:
        return '⚠️';
    }
  };

  const handleStatusUpdate = async (issueId: string, newStatus: string) => {
    try {
      await updateIssue.mutateAsync({
        id: issueId,
        updates: { status: newStatus as any }
      });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const filteredIssues = issues?.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || issue.status === filterStatus;
    return matchesSearch && matchesStatus;
  }) || [];

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-red-600">Error loading issues. Please try again.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search issues..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="reported">Reported</option>
          <option value="acknowledged">Acknowledged</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Issues List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading issues...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredIssues.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No issues found. Be the first to report one!</p>
              </CardContent>
            </Card>
          ) : (
            filteredIssues.map((issue) => (
              <Card key={issue.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{getCategoryIcon(issue.category)}</span>
                        <h3 className="text-lg font-semibold text-gray-900">{issue.title}</h3>
                        <Badge className={getPriorityColor(issue.priority)}>
                          {issue.priority}
                        </Badge>
                        <Badge className={getStatusColor(issue.status)}>
                          {issue.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Reported on {new Date(issue.created_at).toLocaleDateString()}</span>
                        </div>
                        {issue.latitude && issue.longitude && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>Location: {issue.latitude.toFixed(6)}, {issue.longitude.toFixed(6)}</span>
                          </div>
                        )}
                      </div>
                      
                      {issue.description && (
                        <p className="text-gray-700 mb-3">{issue.description}</p>
                      )}
                      
                      <div className="text-xs text-gray-500 capitalize">
                        Category: {issue.category.replace('_', ' ')}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 min-w-[120px]">
                      {user && (
                        <>
                          {issue.status === 'reported' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate(issue.id, 'acknowledged')}
                              disabled={updateIssue.isPending}
                            >
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Acknowledge
                            </Button>
                          )}
                          {issue.status === 'acknowledged' && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(issue.id, 'in_progress')}
                              disabled={updateIssue.isPending}
                            >
                              <Clock className="mr-1 h-3 w-3" />
                              Start Work
                            </Button>
                          )}
                          {issue.status === 'in_progress' && (
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleStatusUpdate(issue.id, 'resolved')}
                              disabled={updateIssue.isPending}
                            >
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Mark Resolved
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};
