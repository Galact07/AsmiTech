import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  Briefcase, 
  Users, 
  MessageSquare, 
  BookOpen, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DashboardStats {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  pendingApplications: number;
  totalInquiries: number;
  newInquiries: number;
}

interface RecentActivity {
  id: string;
  type: 'job' | 'application' | 'inquiry' | 'case_study';
  title: string;
  time: string;
  status?: string;
}

const statCards = [
  {
    title: 'Total Jobs',
    key: 'totalJobs' as keyof DashboardStats,
    activeKey: 'activeJobs' as keyof DashboardStats,
    icon: Briefcase,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    title: 'Applications',
    key: 'totalApplications' as keyof DashboardStats,
    activeKey: 'pendingApplications' as keyof DashboardStats,
    icon: Users,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    title: 'Inquiries',
    key: 'totalInquiries' as keyof DashboardStats,
    activeKey: 'newInquiries' as keyof DashboardStats,
    icon: MessageSquare,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
    totalInquiries: 0,
    newInquiries: 0,
  });
  
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch stats in parallel
        const [
          jobsResult,
          applicationsResult,
          inquiriesResult,
        ] = await Promise.all([
          supabase.from('jobs').select('status'),
          supabase.from('applications').select('status'),
          supabase.from('inquiries').select('status'),
        ]);

        // Calculate stats
        const jobs = jobsResult.data || [];
        const applications = applicationsResult.data || [];
        const inquiries = inquiriesResult.data || [];

        setStats({
          totalJobs: jobs.length,
          activeJobs: jobs.filter(j => j.status === 'active').length,
          totalApplications: applications.length,
          pendingApplications: applications.filter(a => a.status === 'pending').length,
          totalInquiries: inquiries.length,
          newInquiries: inquiries.filter(i => i.status === 'new').length,
        });

        // Fetch recent activity
        const [recentJobs, recentApplications, recentInquiries] = await Promise.all([
          supabase.from('jobs').select('id, title, created_at').order('created_at', { ascending: false }).limit(3),
          supabase.from('applications').select('id, candidate_name, submitted_at, status').order('submitted_at', { ascending: false }).limit(3),
          supabase.from('inquiries').select('id, name, submitted_at, status').order('submitted_at', { ascending: false }).limit(3),
        ]);

        const activity: RecentActivity[] = [
          ...(recentJobs.data || []).map(item => ({
            id: item.id,
            type: 'job' as const,
            title: `New job posted: ${item.title}`,
            time: new Date(item.created_at).toISOString(),
          })),
          ...(recentApplications.data || []).map(item => ({
            id: item.id,
            type: 'application' as const,
            title: `Application from ${item.candidate_name}`,
            time: item.submitted_at ? new Date(item.submitted_at).toISOString() : new Date().toISOString(),
            status: item.status,
          })),
          ...(recentInquiries.data || []).map(item => ({
            id: item.id,
            type: 'inquiry' as const,
            title: `New inquiry from ${item.name}`,
            time: new Date(item.submitted_at).toLocaleDateString(),
            status: item.status,
          })),
        ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 8);

        setRecentActivity(activity);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Set up real-time subscriptions
    const channels = [
      supabase.channel('jobs-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'jobs' }, fetchDashboardData),
      supabase.channel('applications-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'applications' }, fetchDashboardData),
      supabase.channel('inquiries-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'inquiries' }, fetchDashboardData),
    ];

    channels.forEach(channel => channel.subscribe());

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'job': return Briefcase;
      case 'application': return Users;
      case 'inquiry': return MessageSquare;
      case 'case_study': return BookOpen;
      default: return Clock;
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'new': return 'bg-green-100 text-green-800 border-green-200';
        case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'published': return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'resolved': return 'bg-gray-100 text-gray-800 border-gray-200';
        case 'closed': return 'bg-red-100 text-red-800 border-red-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    };

    return (
      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-20"></div>
                <div className="h-6 bg-muted rounded w-16"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - ASMI BV</title>
        <meta name="description" content="Administrative dashboard for ASMI BV management." />
      </Helmet>

      <div className="p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening with your business.
            </p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            const total = stats[card.key];
            const active = stats[card.activeKey];
            
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {card.title}
                    </CardTitle>
                    <div className={`p-2 rounded-lg ${card.bgColor}`}>
                      <Icon className={`h-4 w-4 ${card.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{total}</div>
                    <p className="text-xs text-muted-foreground">
                      {active} active
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Latest updates across your admin portal
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentActivity.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No recent activity to display</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => {
                    const Icon = getActivityIcon(activity.type);
                    return (
                      <motion.div
                        key={`${activity.type}-${activity.id}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.05 }}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <div className="p-2 rounded-full bg-slate-100">
                          <Icon className="h-4 w-4 text-slate-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {activity.title}
                            {getStatusBadge(activity.status)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {activity.time}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
}