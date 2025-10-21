import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  MessageSquare,
  Search,
  Eye,
  Trash2,
  Mail,
  Phone,
  Building,
  Calendar,
  FileQuestion,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  location: string | null;
  subject: string | null;
  message: string;
  status: string | null;
  submitted_at: string;
  updated_at: string;
}

export default function InquiriesAdmin() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setInquiries(data || []);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      toast.error('Failed to fetch inquiries');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInquiries();

    // Set up real-time subscriptions
    const inquiriesChannel = supabase
      .channel('inquiries-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'inquiries' }, () => {
        fetchInquiries();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(inquiriesChannel);
    };
  }, [fetchInquiries]);

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = 
      inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || inquiry.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = async (inquiryId: string, newStatus: string) => {
    setStatusUpdateLoading(true);
    try {
      const { error } = await supabase
        .from('inquiries')
        .update({ status: newStatus })
        .eq('id', inquiryId);

      if (error) throw error;
      toast.success('Status updated successfully');
      await fetchInquiries();
      
      // Update selected inquiry if viewing
      if (selectedInquiry?.id === inquiryId) {
        setSelectedInquiry({ ...selectedInquiry, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedInquiry) return;

    try {
      const { error } = await supabase
        .from('inquiries')
        .delete()
        .eq('id', selectedInquiry.id);

      if (error) throw error;

      toast.success('Inquiry deleted successfully');
      setSelectedInquiry(null);
      setViewDialogOpen(false);
      await fetchInquiries();
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      toast.error('Failed to delete inquiry');
    }
  };

  const getStatusBadge = (status: string | null) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      'new': 'default',
      'in-progress': 'secondary',
      'resolved': 'outline',
      'closed': 'destructive',
    };

    return (
      <Badge 
        variant={variants[status || 'new']}
        className="text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200"
      >
        {status || 'new'}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-48"></div>
          <div className="h-40 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Inquiries Management - Admin Dashboard</title>
        <meta name="description" content="Manage customer inquiries and contact requests." />
      </Helmet>

      <div className="p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Inquiries Management</h1>
            <p className="text-slate-600 mt-1">
              Review and respond to customer inquiries
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-900">{filteredInquiries.length}</div>
              <div className="text-sm text-slate-500">Total Inquiries</div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, company, location, or message..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Inquiries Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50/50 border-b border-slate-200">
              <CardTitle className="text-slate-900">Inquiries ({filteredInquiries.length})</CardTitle>
              <CardDescription className="text-slate-600">
                All customer inquiries and contact requests
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50">
                      <TableHead className="text-slate-700 font-semibold">Contact</TableHead>
                      <TableHead className="text-slate-700 font-semibold">Company</TableHead>
                      <TableHead className="text-slate-700 font-semibold">Location</TableHead>
                      <TableHead className="text-slate-700 font-semibold">Subject</TableHead>
                      <TableHead className="text-slate-700 font-semibold">Status</TableHead>
                      <TableHead className="text-slate-700 font-semibold">Submitted</TableHead>
                      <TableHead className="text-right text-slate-700 font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInquiries.map((inquiry, index) => (
                      <motion.tr
                        key={inquiry.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                        className="hover:bg-slate-50/50 border-b border-slate-100"
                      >
                        <TableCell className="py-4">
                          <div>
                            <div className="font-semibold text-slate-900">{inquiry.name}</div>
                            <div className="flex items-center gap-1 text-sm text-slate-600 mt-1">
                              <Mail className="h-3 w-3" />
                              {inquiry.email}
                            </div>
                            {inquiry.phone && (
                              <div className="flex items-center gap-1 text-sm text-slate-600 mt-1">
                                <Phone className="h-3 w-3" />
                                {inquiry.phone}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          {inquiry.company ? (
                            <div className="flex items-center gap-1">
                              <Building className="h-3 w-3 text-slate-500" />
                              <span className="text-slate-700">{inquiry.company}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="py-4">
                          {inquiry.location ? (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-slate-500" />
                              <span className="text-slate-700">{inquiry.location}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="max-w-xs truncate">
                            {inquiry.subject ? (
                              <span className="text-slate-700">{inquiry.subject}</span>
                            ) : (
                              <span className="text-slate-400 italic">No subject</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-4">{getStatusBadge(inquiry.status)}</TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-1 text-sm text-slate-600">
                            <Calendar className="h-3 w-3" />
                            {new Date(inquiry.submitted_at).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell className="text-right py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:bg-slate-100 text-slate-500 hover:text-slate-700"
                              onClick={() => {
                                setSelectedInquiry(inquiry);
                                setViewDialogOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="hover:bg-red-50 text-slate-500 hover:text-red-600"
                                  onClick={() => setSelectedInquiry(inquiry)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl p-6">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Inquiry</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete the inquiry from "{inquiry.name}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel onClick={() => setSelectedInquiry(null)}>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    onClick={handleDelete}
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>

                {filteredInquiries.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No inquiries found matching your criteria</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* View Inquiry Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl p-6">
            <DialogHeader>
              <DialogTitle>Inquiry Details</DialogTitle>
              <DialogDescription>
                Review inquiry details and update status
              </DialogDescription>
            </DialogHeader>

            {selectedInquiry && (
              <div className="space-y-6">
                {/* Status and Actions */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Label className="font-medium">Status:</Label>
                      <Select
                        value={selectedInquiry.status || 'new'}
                        onValueChange={(value) => handleStatusUpdate(selectedInquiry.id, value)}
                        disabled={statusUpdateLoading}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      Submitted {new Date(selectedInquiry.submitted_at).toLocaleString()}
                    </Badge>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                  <Label className="font-medium text-lg mb-3 block">Contact Information</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label className="font-medium">Name</Label>
                      <p className="text-muted-foreground">{selectedInquiry.name}</p>
                    </div>
                    <div>
                      <Label className="font-medium">Email</Label>
                      <p className="text-muted-foreground">
                        <a href={`mailto:${selectedInquiry.email}`} className="underline hover:text-primary">
                          {selectedInquiry.email}
                        </a>
                      </p>
                    </div>
                    {selectedInquiry.phone && (
                      <div>
                        <Label className="font-medium">Phone</Label>
                        <p className="text-muted-foreground">
                          <a href={`tel:${selectedInquiry.phone}`} className="underline hover:text-primary">
                            {selectedInquiry.phone}
                          </a>
                        </p>
                      </div>
                    )}
                    {selectedInquiry.company && (
                      <div>
                        <Label className="font-medium">Company</Label>
                        <p className="text-muted-foreground">{selectedInquiry.company}</p>
                      </div>
                    )}
                    {selectedInquiry.location && (
                      <div>
                        <Label className="font-medium">Location</Label>
                        <p className="text-muted-foreground">{selectedInquiry.location}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Subject */}
                {selectedInquiry.subject && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                    <Label className="font-medium flex items-center gap-2 mb-2">
                      <FileQuestion className="h-4 w-4" />
                      Subject
                    </Label>
                    <p className="text-muted-foreground">{selectedInquiry.subject}</p>
                  </div>
                )}

                {/* Message */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                  <Label className="font-medium mb-3 block">Message</Label>
                  <p className="text-muted-foreground whitespace-pre-wrap text-sm leading-relaxed">
                    {selectedInquiry.message}
                  </p>
                </div>

                {/* Quick Actions */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                  <Label className="font-medium mb-3 block">Quick Actions</Label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      onClick={() => window.location.href = `mailto:${selectedInquiry.email}`}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Reply via Email
                    </Button>
                    {selectedInquiry.phone && (
                      <Button
                        variant="outline"
                        onClick={() => window.location.href = `tel:${selectedInquiry.phone}`}
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
