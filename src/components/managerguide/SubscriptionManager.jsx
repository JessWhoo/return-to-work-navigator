import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, CreditCard, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
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

export default function SubscriptionManager() {
  const queryClient = useQueryClient();
  const [isCancelling, setIsCancelling] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const handleCancel = async () => {
    setIsCancelling(true);
    try {
      const response = await base44.functions.invoke('cancel-subscription', {});
      if (response?.data?.error) {
        throw new Error(response.data.error);
      }
      toast.success('Subscription canceled. You keep access until the end of your current billing cycle.');
      queryClient.invalidateQueries({ queryKey: ['premiumAccess'] });
      setShowDialog(false);
    } catch (error) {
      toast.error('Could not cancel subscription: ' + (error?.message || 'unknown error'));
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-4 sm:p-6 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-brand-primary" />
            <div>
              <Label className="font-semibold text-brand-text">Premium Subscription</Label>
              <p className="text-sm text-brand-muted-foreground">$49/month · Active</p>
            </div>
          </div>
          <span className="nv-chip nv-chip--primary">Active</span>
        </div>
        <p className="text-sm text-brand-muted-foreground">
          Billed $49 each month. Cancel anytime — you keep access until the end of your current billing cycle.
        </p>
        <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="w-full">
              Cancel Subscription
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 font-heading">
                <AlertTriangle className="h-5 w-5 text-brand-destructive" />
                Cancel your premium subscription?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-brand-muted-foreground">
                Your subscription remains active until the end of your current billing cycle, then your access to the Manager &amp; HR Guide ends.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isCancelling}>Keep Subscription</AlertDialogCancel>
              <AlertDialogAction
                disabled={isCancelling}
                className="nv-btn nv-btn--destructive"
                onClick={(e) => {
                  e.preventDefault();
                  handleCancel();
                }}
              >
                {isCancelling ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Canceling…</>
                ) : (
                  'Yes, Cancel Subscription'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}