import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Plus, Calendar, CheckCircle2, Clock, XCircle, AlertCircle, Edit, Trash2, MessageSquare, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function NetworkingTracker() {
  const queryClient = useQueryClient();
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const [newContact, setNewContact] = useState({
    contact_name: '',
    contact_title: '',
    contact_company: '',
    linkedin_url: '',
    initial_message: '',
    date_contacted: new Date().toISOString().split('T')[0],
    follow_up_date: '',
    tags: [],
    notes: ''
  });

  // Fetch contacts
  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ['networkingContacts'],
    queryFn: async () => {
      return await base44.entities.NetworkingContact.list('-date_contacted');
    }
  });

  // Filter contacts
  const filteredContacts = contacts.filter(contact => {
    if (filterStatus === 'all') return true;
    return contact.connection_status === filterStatus;
  });

  // Group contacts by status
  const contactsByStatus = {
    pending: contacts.filter(c => c.connection_status === 'pending').length,
    connected: contacts.filter(c => c.connection_status === 'connected').length,
    follow_up_needed: contacts.filter(c => c.connection_status === 'follow_up_needed').length,
    no_response: contacts.filter(c => c.connection_status === 'no_response').length
  };

  // Add contact mutation
  const addContactMutation = useMutation({
    mutationFn: async (data) => {
      return await base44.entities.NetworkingContact.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['networkingContacts']);
      setIsAddingContact(false);
      setNewContact({
        contact_name: '',
        contact_title: '',
        contact_company: '',
        linkedin_url: '',
        initial_message: '',
        date_contacted: new Date().toISOString().split('T')[0],
        follow_up_date: '',
        tags: [],
        notes: ''
      });
      toast.success('Contact added successfully!');
      
      base44.analytics.track({
        eventName: 'networking_contact_added',
        properties: { contact_status: data.connection_status }
      });
    }
  });

  // Update contact mutation
  const updateContactMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      return await base44.entities.NetworkingContact.update(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['networkingContacts']);
      setEditingContact(null);
      toast.success('Contact updated!');
    }
  });

  // Delete contact mutation
  const deleteContactMutation = useMutation({
    mutationFn: async (id) => {
      return await base44.entities.NetworkingContact.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['networkingContacts']);
      toast.success('Contact removed');
    }
  });

  const handleAddContact = () => {
    if (!newContact.contact_name) {
      toast.error('Please enter a contact name');
      return;
    }
    addContactMutation.mutate(newContact);
  };

  const handleUpdateStatus = (contactId, newStatus) => {
    updateContactMutation.mutate({
      id: contactId,
      data: { connection_status: newStatus }
    });
    
    base44.analytics.track({
      eventName: 'networking_contact_status_updated',
      properties: { new_status: newStatus }
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': return <CheckCircle2 className="h-4 w-4 text-green-400" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'declined': return <XCircle className="h-4 w-4 text-red-400" />;
      case 'follow_up_needed': return <AlertCircle className="h-4 w-4 text-orange-400" />;
      case 'no_response': return <Clock className="h-4 w-4 text-slate-400" />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'bg-green-600';
      case 'pending': return 'bg-yellow-600';
      case 'declined': return 'bg-red-600';
      case 'follow_up_needed': return 'bg-orange-600';
      case 'no_response': return 'bg-slate-600';
      default: return 'bg-slate-600';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-2 border-indigo-600">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-slate-200">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-indigo-400" />
            <span>Networking Outreach Tracker</span>
          </div>
          <Dialog open={isAddingContact} onOpenChange={setIsAddingContact}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-to-r from-indigo-600 to-purple-600">
                <Plus className="h-4 w-4 mr-1" />
                Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700 text-slate-200 max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Contact</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">Name *</label>
                    <Input
                      value={newContact.contact_name}
                      onChange={(e) => setNewContact({ ...newContact, contact_name: e.target.value })}
                      placeholder="Jane Smith"
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">Title</label>
                    <Input
                      value={newContact.contact_title}
                      onChange={(e) => setNewContact({ ...newContact, contact_title: e.target.value })}
                      placeholder="HR Director"
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">Company</label>
                    <Input
                      value={newContact.contact_company}
                      onChange={(e) => setNewContact({ ...newContact, contact_company: e.target.value })}
                      placeholder="Acme Corp"
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">LinkedIn URL</label>
                    <Input
                      value={newContact.linkedin_url}
                      onChange={(e) => setNewContact({ ...newContact, linkedin_url: e.target.value })}
                      placeholder="https://linkedin.com/in/..."
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Initial Message</label>
                  <Textarea
                    value={newContact.initial_message}
                    onChange={(e) => setNewContact({ ...newContact, initial_message: e.target.value })}
                    placeholder="Message sent with connection request..."
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">Date Contacted</label>
                    <Input
                      type="date"
                      value={newContact.date_contacted}
                      onChange={(e) => setNewContact({ ...newContact, date_contacted: e.target.value })}
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">Follow-up Date</label>
                    <Input
                      type="date"
                      value={newContact.follow_up_date}
                      onChange={(e) => setNewContact({ ...newContact, follow_up_date: e.target.value })}
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Notes</label>
                  <Textarea
                    value={newContact.notes}
                    onChange={(e) => setNewContact({ ...newContact, notes: e.target.value })}
                    placeholder="Additional notes..."
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                <Button onClick={handleAddContact} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600">
                  Add Contact
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-slate-800/50 rounded-lg p-3 border border-yellow-600/30">
            <p className="text-2xl font-bold text-yellow-400">{contactsByStatus.pending}</p>
            <p className="text-xs text-slate-400">Pending</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 border border-green-600/30">
            <p className="text-2xl font-bold text-green-400">{contactsByStatus.connected}</p>
            <p className="text-xs text-slate-400">Connected</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 border border-orange-600/30">
            <p className="text-2xl font-bold text-orange-400">{contactsByStatus.follow_up_needed}</p>
            <p className="text-xs text-slate-400">Follow-up Needed</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600/30">
            <p className="text-2xl font-bold text-slate-400">{contactsByStatus.no_response}</p>
            <p className="text-xs text-slate-400">No Response</p>
          </div>
        </div>

        {/* Filter */}
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Contacts ({contacts.length})</SelectItem>
            <SelectItem value="pending">Pending ({contactsByStatus.pending})</SelectItem>
            <SelectItem value="connected">Connected ({contactsByStatus.connected})</SelectItem>
            <SelectItem value="follow_up_needed">Follow-up Needed ({contactsByStatus.follow_up_needed})</SelectItem>
            <SelectItem value="no_response">No Response ({contactsByStatus.no_response})</SelectItem>
          </SelectContent>
        </Select>

        {/* Contacts List */}
        {isLoading ? (
          <p className="text-center text-slate-400 py-8">Loading contacts...</p>
        ) : filteredContacts.length === 0 ? (
          <p className="text-center text-slate-400 py-8">No contacts yet. Add your first networking contact!</p>
        ) : (
          <div className="space-y-3">
            {filteredContacts.map((contact) => (
              <div key={contact.id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-slate-200">{contact.contact_name}</h4>
                      {contact.linkedin_url && (
                        <a href={contact.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                    {(contact.contact_title || contact.contact_company) && (
                      <p className="text-sm text-slate-400">
                        {contact.contact_title}{contact.contact_title && contact.contact_company && ' at '}{contact.contact_company}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={`${getStatusColor(contact.connection_status)} text-white`}>
                      {getStatusIcon(contact.connection_status)}
                      <span className="ml-1 capitalize">{contact.connection_status.replace('_', ' ')}</span>
                    </Badge>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => deleteContactMutation.mutate(contact.id)}
                      className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {contact.initial_message && (
                  <div className="mb-2 p-2 bg-slate-800/50 rounded border border-slate-600">
                    <p className="text-xs text-slate-500 mb-1">Initial Message:</p>
                    <p className="text-sm text-slate-300">{contact.initial_message}</p>
                  </div>
                )}

                {contact.notes && (
                  <p className="text-sm text-slate-400 mb-2">{contact.notes}</p>
                )}

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center space-x-4">
                    <span>Contacted: {format(new Date(contact.date_contacted), 'MMM d, yyyy')}</span>
                    {contact.follow_up_date && (
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>Follow-up: {format(new Date(contact.follow_up_date), 'MMM d, yyyy')}</span>
                      </span>
                    )}
                  </div>
                  <Select
                    value={contact.connection_status}
                    onValueChange={(value) => handleUpdateStatus(contact.id, value)}
                  >
                    <SelectTrigger className="w-40 h-7 text-xs bg-slate-600 border-slate-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="connected">Connected</SelectItem>
                      <SelectItem value="declined">Declined</SelectItem>
                      <SelectItem value="follow_up_needed">Follow-up Needed</SelectItem>
                      <SelectItem value="no_response">No Response</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}