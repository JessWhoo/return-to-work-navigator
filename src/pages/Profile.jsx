import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { parseISO } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { useUserProgress } from '@/hooks/useUserProgress';
import { useAuth } from '@/lib/AuthContext';
import AccessibilityModeCard from '@/components/settings/AccessibilityModeCard';

export default function Profile() {
  const { isAuthenticated, isLoadingAuth } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
    enabled: !isLoadingAuth && !!isAuthenticated,
  });

  const { data: progress } = useUserProgress({
    completed_checklist_items: [],
    journey_stage: 'planning',
    notification_preferences: {
      email_reminders: true,
      progress_updates: true,
      new_resources: true,
      weekly_summary: true
    }
  });

  const { data: reviews } = useQuery({
    queryKey: ['userReviews'],
    queryFn: () => base44.entities.ResourceReview.list(),
    enabled: !isLoadingAuth && !!isAuthenticated,
    initialData: []
  });

  const { data: suggestions } = useQuery({
    queryKey: ['userSuggestions'],
    queryFn: () => base44.entities.ResourceSuggestion.list(),
    enabled: !isLoadingAuth && !!isAuthenticated,
    initialData: []
  });

  const updateUserMutation = useMutation({
    mutationFn: (data) => base44.auth.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      toast.success('Profile updated successfully');
      setIsEditing(false);
    }
  });

  const updateProgressMutation = useMutation({
    mutationFn: (data) => base44.entities.UserProgress.update(progress.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProgress'] });
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
    setIsDeleting(true);
    try {
      // Deletion is executed server-side. The backend function reads the
      // user id from the authenticated session (not the request body) and
      // deletes only rows where created_by_id matches that session user —
      // so this cannot be manipulated to touch another user's data.
      const response = await base44.functions.invoke('deleteMyAccount', {});
      if (response?.data?.error) {
        throw new Error(response.data.error);
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
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-border border-t-brand-primary"></div>
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

  const statTiles = [
    { icon: CheckCircle2, value: stats.completedItems, label: 'Tasks Completed' },
    { icon: BookmarkCheck, value: stats.savedResources, label: 'Saved Resources' },
    { icon: TrendingUp, value: stats.energyLogs, label: 'Energy Logs' },
    { icon: FileText, value: stats.accommodationRequests, label: 'Accommodations' },
    { icon: Award, value: stats.reviews, label: 'Reviews Written' },
    { icon: Target, value: stats.suggestions, label: 'Resources Suggested' },
  ];

  const notificationRows = [
    { key: 'email_reminders', label: 'Email Reminders', text: 'Receive reminders for appointments and important dates' },
    { key: 'progress_updates', label: 'Progress Updates', text: 'Get notified about your progress milestones' },
    { key: 'new_resources', label: 'New Resources', text: 'Be notified when new helpful resources are added' },
    { key: 'weekly_summary', label: 'Weekly Summary', text: 'Receive a weekly summary of your activity and insights' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-3 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-pill bg-brand-muted">
          <User className="h-10 w-10 text-brand-primary" />
        </div>
        <h2 className="font-heading text-3xl font-bold text-brand-text sm:text-4xl">
          My Profile
        </h2>
        <p className="text-brand-muted-foreground">
          Manage your information and track your progress
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="nv-tabs h-auto">
          <TabsTrigger value="overview" className="nv-tab">Overview</TabsTrigger>
          <TabsTrigger value="personal" className="nv-tab">Personal Info</TabsTrigger>
          <TabsTrigger value="preferences" className="nv-tab">Preferences</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {statTiles.map(({ icon: Icon, value, label }) => (
              <Card key={label}>
                <CardContent className="pt-6">
                  <div className="space-y-3 text-center">
                    <span className="inline-flex rounded-pill bg-brand-muted p-3 text-brand-primary">
                      <Icon className="h-6 w-6" />
                    </span>
                    <div className="font-heading text-3xl font-bold text-brand-text">{value}</div>
                    <p className="text-sm text-brand-muted-foreground">{label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Journey Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-heading text-brand-text">
                <TrendingUp className="h-5 w-5 text-brand-primary" />
                <span>Journey Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-brand-muted-foreground">Current Stage</span>
                <span className="nv-chip capitalize">
                  {progress?.journey_stage?.replace('_', ' ') || 'Planning'}
                </span>
              </div>

              {progress?.return_date && (
                <div className="flex items-center justify-between gap-3">
                  <span className="text-brand-muted-foreground">Planned Return Date</span>
                  <span className="font-semibold text-brand-text">
                    {parseISO(progress.return_date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
              )}

              <div className="border-t border-brand-border pt-4">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-sm text-brand-muted-foreground">Checklist Progress</span>
                  <span className="text-sm font-semibold text-brand-text">
                    {stats.completedItems} items completed
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Personal Info Tab */}
        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-3 font-heading text-brand-text">
                <span className="flex items-center gap-2">
                  <User className="h-5 w-5 text-brand-primary" />
                  <span>Personal Information</span>
                </span>
                {!isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-semibold text-brand-text">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="nv-input"
                    />
                  ) : (
                    <div className="flex items-center gap-2 rounded-brand bg-brand-muted p-3">
                      <User className="h-4 w-4 text-brand-muted-foreground" />
                      <span className="text-brand-text">{user?.full_name || 'Not set'}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="font-semibold text-brand-text">Email Address</Label>
                  <div className="flex items-center gap-2 rounded-brand bg-brand-muted p-3">
                    <Mail className="h-4 w-4 text-brand-muted-foreground" />
                    <span className="text-brand-text">{user?.email}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-semibold text-brand-text">Role</Label>
                  <div className="flex items-center gap-2 rounded-brand bg-brand-muted p-3">
                    <Shield className="h-4 w-4 text-brand-muted-foreground" />
                    <span className="nv-chip capitalize">{user?.role || 'user'}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-semibold text-brand-text">Member Since</Label>
                  <div className="flex items-center gap-2 rounded-brand bg-brand-muted p-3">
                    <Calendar className="h-4 w-4 text-brand-muted-foreground" />
                    <span className="text-brand-text">
                      {new Date(user?.created_date || Date.now()).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-3 border-t border-brand-border pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setIsEditing(false);
                      setEditedName(user?.full_name || '');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1"
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
          <AccessibilityModeCard />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-heading text-brand-text">
                <Bell className="h-5 w-5 text-brand-primary" />
                <span>Notification Preferences</span>
              </CardTitle>
              <p className="mt-2 text-sm text-brand-muted-foreground">
                Manage how you receive updates and reminders
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {notificationRows.map(({ key, label, text }) => (
                  <div key={key} className="flex items-center justify-between gap-4 rounded-brand bg-brand-muted p-4">
                    <div className="space-y-1">
                      <Label className="font-semibold text-brand-text">{label}</Label>
                      <p className="text-sm text-brand-muted-foreground">
                        {text}
                      </p>
                    </div>
                    <Switch
                      checked={notificationPrefs[key]}
                      onCheckedChange={() => handleNotificationToggle(key)}
                      aria-label={label}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-brand-text">Account Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  base44.auth.logout();
                }}
              >
                Sign Out
              </Button>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-heading text-brand-destructive">
                <Trash2 className="h-5 w-5" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-brand-muted-foreground">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <AlertDialog onOpenChange={(open) => { if (!open) setConfirmText(''); }}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <Trash2 className="h-4 w-4" />
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 font-heading">
                      <AlertTriangle className="h-5 w-5 text-brand-destructive" />
                      Permanently delete your account?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-brand-muted-foreground">
                      This will permanently erase all of your data. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="space-y-3 text-sm">
                    <p className="font-semibold text-brand-text">This will permanently erase:</p>
                    <ul className="list-inside list-disc space-y-1 text-brand-muted-foreground">
                      <li>Your journey progress, checklists, and gamification points</li>
                      <li>All saved records, symptom logs, and energy data</li>
                      <li>Communication drafts and meeting preparation notes</li>
                      <li>Bookmarked resources, ratings, and reviews</li>
                      <li>Community profiles, peer connections, and messages</li>
                      <li>All notification preferences</li>
                    </ul>
                    <p className="text-brand-destructive">
                      This action <strong>cannot be undone</strong> — there is no recovery once data is deleted.
                    </p>
                    <div className="pt-2">
                      <Label className="mb-1 block font-semibold text-brand-text">
                        Type <strong className="text-brand-destructive">DELETE</strong> below to confirm:
                      </Label>
                      <Input
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        placeholder="Type DELETE to confirm"
                        className="nv-input"
                        disabled={isDeleting}
                      />
                    </div>
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      disabled={isDeleting || confirmText.trim().toUpperCase() !== 'DELETE'}
                      className="nv-btn nv-btn--destructive"
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