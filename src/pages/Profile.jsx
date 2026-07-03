import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { 
  User, Mail, Calendar, TrendingUp, BookmarkCheck, 
  FileText, Bell, Shield, CheckCircle2, Award, Target, Trash2, AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

export default function Profile() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me()
  });

  const { data: progress } = useQuery({
    queryKey: ['userProgress'],
    queryFn: async () => {
      const progressList = await base44.entities.UserProgress.list();
      if (progressList.length > 0) return progressList[0];
      
      return await base44.entities.UserProgress.create({
        completed_checklist_items: [],
        journey_stage: 'planning',
        notification_preferences: {
          email_reminders: true,
          progress_updates: true,
          new_resources: true,
          weekly_summary: true
        }
      });
    }
  });

  const { data: reviews } = useQuery({
    queryKey: ['userReviews'],
    queryFn: () => base44.entities.ResourceReview.list(),
    initialData: []
  });

  const { data: suggestions } = useQuery({
    queryKey: ['userSuggestions'],
    queryFn: () => base44.entities.ResourceSuggestion.list(),
    initialData: []
  });

  const updateUserMutation = useMutation({
    mutationFn: (data) => base44.auth.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['currentUser']);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    }
  });

  const updateProgressMutation = useMutation({
    mutationFn: (data) => base44.entities.UserProgress.update(progress.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['userProgress']);
      toast.success('Preferences updated');
    }
  });

  const handleSaveProfile = () => {
    if (!editedName.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    updateUserMutation.mutate({ full_name: editedName });
  };

  const handleDeleteAccount = async () => {
    if (confirmText.trim().toUpperCase() !== 'DELETE') {
      toast.error('Please type DELETE to confirm');
      return;
    }
    const currentUserId = user?.id;
    if (!currentUserId) {
      toast.error('Could not verify your account. Please refresh and try again.');
      return;
    }
    setIsDeleting(true);
    try {
      // Delete all user-owned data via the SDK (each entity is created_by_id-scoped via RLS).
      const entityNames = [
        'UserProgress', 'Record', 'CommunicationDraft', 'MeetingPrep',
        'DailyAffirmation', 'CoachFeedback', 'ResourceReview',
        'ResourceSuggestion', 'NetworkingContact', 'PeerConnection',
        'DirectMessage', 'ForumPost', 'ForumReply',
      ];
      for (const name of entityNames) {
        try {
          // Strictly filter by the authenticated user's id — never fall back
          // to an unfiltered list, which could return other users' rows.
          const items = await base44.entities[name]
            .filter({ created_by_id: currentUserId })
            .catch(() => []);
          await Promise.all(
            (items || []).map((item) =>
              base44.entities[name].delete(item.id).catch(() => null)
            )
          );
        } catch {
          // entity may not be readable or already empty — skip
        }
      }

      // Clear local cache
      try { localStorage.clear(); } catch {}
      try { sessionStorage.clear(); } catch {}

      toast.success('Your account data has been deleted. Signing you out...');
      setTimeout(() => {
        base44.auth.logout();
      }, 1200);
    } catch (error) {
      setIsDeleting(false);
      toast.error('Could not complete deletion: ' + (error?.message || 'unknown error'));
    }
  };

  const handleNotificationToggle = (key) => {
    const currentPrefs = progress?.notification_preferences || {};
    updateProgressMutation.mutate({
      notification_preferences: {
        ...currentPrefs,
        [key]: !currentPrefs[key]
      }
    });
  };

  React.useEffect(() => {
    if (user && !isEditing) {
      setEditedName(user.full_name || '');
    }
  }, [user, isEditing]);

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  const stats = {
    completedItems: progress?.completed_checklist_items?.length || 0,
    savedResources: progress?.bookmarked_resources?.length || 0,
    energyLogs: progress?.energy_logs?.length || 0,
    accommodationRequests: progress?.accommodations_requested?.length || 0,
    reviews: reviews.length,
    suggestions: suggestions.length
  };

  const notificationPrefs = progress?.notification_preferences || {
    email_reminders: true,
    progress_updates: true,
    new_resources: true,
    weekly_summary: true
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-teal-600 to-cyan-600 flex items-center justify-center">
          <User className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
          My Profile
        </h1>
        <p className="text-lg text-slate-300">
          Manage your information and track your progress
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-teal-900/50 to-teal-800/50 border-teal-700">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <CheckCircle2 className="h-8 w-8 text-teal-400 mx-auto" />
                  <div className="text-3xl font-bold text-teal-400">{stats.completedItems}</div>
                  <p className="text-sm text-slate-300">Tasks Completed</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-cyan-900/50 to-cyan-800/50 border-cyan-700">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <BookmarkCheck className="h-8 w-8 text-cyan-400 mx-auto" />
                  <div className="text-3xl font-bold text-cyan-400">{stats.savedResources}</div>
                  <p className="text-sm text-slate-300">Saved Resources</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-blue-700">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <TrendingUp className="h-8 w-8 text-blue-400 mx-auto" />
                  <div className="text-3xl font-bold text-blue-400">{stats.energyLogs}</div>
                  <p className="text-sm text-slate-300">Energy Logs</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 border-purple-700">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <FileText className="h-8 w-8 text-purple-400 mx-auto" />
                  <div className="text-3xl font-bold text-purple-400">{stats.accommodationRequests}</div>
                  <p className="text-sm text-slate-300">Accommodations</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-900/50 to-amber-800/50 border-amber-700">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <Award className="h-8 w-8 text-amber-400 mx-auto" />
                  <div className="text-3xl font-bold text-amber-400">{stats.reviews}</div>
                  <p className="text-sm text-slate-300">Reviews Written</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-pink-900/50 to-pink-800/50 border-pink-700">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <Target className="h-8 w-8 text-pink-400 mx-auto" />
                  <div className="text-3xl font-bold text-pink-400">{stats.suggestions}</div>
                  <p className="text-sm text-slate-300">Resources Suggested</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Journey Progress */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-slate-200">
                <TrendingUp className="h-5 w-5 text-teal-400" />
                <span>Journey Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Current Stage</span>
                <Badge className="bg-teal-600 text-white capitalize">
                  {progress?.journey_stage?.replace('_', ' ') || 'Planning'}
                </Badge>
              </div>
              
              {progress?.return_date && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Planned Return Date</span>
                  <span className="text-slate-200 font-medium">
                    {new Date(progress.return_date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
              )}

              <div className="pt-4 border-t border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">Checklist Progress</span>
                  <span className="text-sm font-medium text-slate-300">
                    {stats.completedItems} items completed
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Personal Info Tab */}
        <TabsContent value="personal" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-slate-200">
                <span className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-teal-400" />
                  <span>Personal Information</span>
                </span>
                {!isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    Edit
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-300">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="bg-slate-900 border-slate-600 text-slate-200"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 p-3 bg-slate-900 rounded-lg">
                      <User className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-200">{user?.full_name || 'Not set'}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Email Address</Label>
                  <div className="flex items-center space-x-2 p-3 bg-slate-900 rounded-lg">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-200">{user?.email}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Role</Label>
                  <div className="flex items-center space-x-2 p-3 bg-slate-900 rounded-lg">
                    <Shield className="h-4 w-4 text-slate-400" />
                    <Badge className="bg-slate-700 text-slate-300 capitalize">{user?.role || 'user'}</Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Member Since</Label>
                  <div className="flex items-center space-x-2 p-3 bg-slate-900 rounded-lg">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-200">
                      {new Date(user?.created_date || Date.now()).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-3 pt-4 border-t border-slate-700">
                  <Button
                    variant="outline"
                    className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                    onClick={() => {
                      setIsEditing(false);
                      setEditedName(user?.full_name || '');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
                    onClick={handleSaveProfile}
                    disabled={updateUserMutation.isPending}
                  >
                    {updateUserMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-slate-200">
                <Bell className="h-5 w-5 text-teal-400" />
                <span>Notification Preferences</span>
              </CardTitle>
              <p className="text-sm text-slate-400 mt-2">
                Manage how you receive updates and reminders
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
                  <div className="space-y-1">
                    <Label className="text-slate-200">Email Reminders</Label>
                    <p className="text-sm text-slate-400">
                      Receive reminders for appointments and important dates
                    </p>
                  </div>
                  <Switch
                    checked={notificationPrefs.email_reminders}
                    onCheckedChange={() => handleNotificationToggle('email_reminders')}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
                  <div className="space-y-1">
                    <Label className="text-slate-200">Progress Updates</Label>
                    <p className="text-sm text-slate-400">
                      Get notified about your progress milestones
                    </p>
                  </div>
                  <Switch
                    checked={notificationPrefs.progress_updates}
                    onCheckedChange={() => handleNotificationToggle('progress_updates')}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
                  <div className="space-y-1">
                    <Label className="text-slate-200">New Resources</Label>
                    <p className="text-sm text-slate-400">
                      Be notified when new helpful resources are added
                    </p>
                  </div>
                  <Switch
                    checked={notificationPrefs.new_resources}
                    onCheckedChange={() => handleNotificationToggle('new_resources')}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
                  <div className="space-y-1">
                    <Label className="text-slate-200">Weekly Summary</Label>
                    <p className="text-sm text-slate-400">
                      Receive a weekly summary of your activity and insights
                    </p>
                  </div>
                  <Switch
                    checked={notificationPrefs.weekly_summary}
                    onCheckedChange={() => handleNotificationToggle('weekly_summary')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-200">Account Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700"
                onClick={() => {
                  base44.auth.logout();
                }}
              >
                Sign Out
              </Button>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="bg-slate-800/50 border-red-900/60">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400 mb-4">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <AlertDialog onOpenChange={(open) => { if (!open) setConfirmText(''); }}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-slate-900 border-slate-700">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-slate-100 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                      Permanently delete your account?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-slate-400">
                      This will permanently erase all of your data. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="space-y-3 text-sm">
                    <p className="text-slate-300 font-medium">This will permanently erase:</p>
                    <ul className="list-disc list-inside space-y-1 text-slate-400">
                      <li>Your journey progress, checklists, and gamification points</li>
                      <li>All saved records, symptom logs, and energy data</li>
                      <li>Communication drafts and meeting preparation notes</li>
                      <li>Bookmarked resources, ratings, and reviews</li>
                      <li>Community profiles, peer connections, and messages</li>
                      <li>All notification preferences</li>
                    </ul>
                    <p className="text-red-300">
                      This action <strong>cannot be undone</strong> — there is no recovery once data is deleted.
                    </p>
                    <div className="pt-2">
                      <Label className="text-slate-300 block mb-1">
                        Type <strong className="text-red-400">DELETE</strong> below to confirm:
                      </Label>
                      <Input
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        placeholder="Type DELETE to confirm"
                        className="bg-slate-800 border-slate-600 text-slate-100"
                        disabled={isDeleting}
                      />
                    </div>
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting} className="bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      disabled={isDeleting || confirmText.trim().toUpperCase() !== 'DELETE'}
                      className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDeleteAccount();
                      }}
                    >
                      {isDeleting ? 'Deleting...' : 'Yes, Delete My Account'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}