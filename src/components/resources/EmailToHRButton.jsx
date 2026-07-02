import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Send } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';

/**
 * Share button that opens Gmail's compose window with a prefilled email
 * so the user can send a resource directly to their manager or HR rep.
 *
 * Props:
 * - resourceName: string (required) — title of the resource
 * - resourceUrl: string (required) — link to the resource
 * - resourceDescription?: string — short summary included in the email body
 * - resourceOrg?: string — organization/source
 * - size?: 'sm' | 'default' — button size (default: 'sm')
 * - variant?: shadcn Button variant (default: 'outline')
 * - className?: string — extra classes for the trigger button
 * - label?: string — button label (default: 'Share via Gmail')
 */
export default function EmailToHRButton({
  resourceName,
  resourceUrl,
  resourceDescription = '',
  resourceOrg = '',
  size = 'sm',
  variant = 'outline',
  className = '',
  label = 'Share via Gmail',
}) {
  const [open, setOpen] = useState(false);
  const [recipient, setRecipient] = useState('manager'); // 'manager' | 'hr' | 'custom'
  const [toEmail, setToEmail] = useState('');
  const [subject, setSubject] = useState(`Resource you may find helpful: ${resourceName}`);
  const [message, setMessage] = useState(
    `Hi,\n\nI wanted to share this resource with you that I found helpful as I navigate my return to work:\n\n${resourceName}${resourceOrg ? ` (${resourceOrg})` : ''}\n${resourceUrl}${resourceDescription ? `\n\n${resourceDescription}` : ''}\n\nI'd appreciate the chance to discuss it with you when you have a moment.\n\nThank you,`
  );

  const handleSend = () => {
    if (!toEmail.trim()) {
      toast.error('Please enter a recipient email address');
      return;
    }

    // Build Gmail web compose URL — opens in a new tab, prefilled.
    const params = new URLSearchParams({
      view: 'cm',
      fs: '1',
      to: toEmail.trim(),
      su: subject,
      body: message,
    });
    const gmailUrl = `https://mail.google.com/mail/?${params.toString()}`;
    window.open(gmailUrl, '_blank', 'noopener,noreferrer');

    // Track the share event.
    try {
      base44.analytics.track({
        eventName: 'resource_shared_via_gmail',
        properties: {
          resource_name: resourceName,
          resource_url: resourceUrl,
          recipient_type: recipient,
        }
      });
    } catch { /* analytics is best-effort */ }

    toast.success('Gmail opened with your email ready to send');
    setOpen(false);
  };

  const handleRecipientPreset = (value) => {
    setRecipient(value);
    if (value === 'manager') {
      setSubject(`Resource you may find helpful: ${resourceName}`);
    } else if (value === 'hr') {
      setSubject(`Sharing a return-to-work resource: ${resourceName}`);
      setMessage(
        `Hello,\n\nAs I plan my return to work, I came across this resource that I believe would be helpful for our conversations around accommodations and support:\n\n${resourceName}${resourceOrg ? ` (${resourceOrg})` : ''}\n${resourceUrl}${resourceDescription ? `\n\n${resourceDescription}` : ''}\n\nI'd welcome the opportunity to discuss it further.\n\nThank you,`
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={className}
          onClick={(e) => e.stopPropagation()}
        >
          <Mail className="h-4 w-4 mr-2" />
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-rose-600" />
            Share this resource
          </DialogTitle>
          <DialogDescription>
            Send "{resourceName}" directly to your manager or HR representative. Gmail will open in a new tab with your message ready to review and send.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Recipient type quick-select */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Sending to</Label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'manager', label: 'My Manager' },
                { value: 'hr', label: 'HR Representative' },
                { value: 'custom', label: 'Someone Else' },
              ].map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleRecipientPreset(opt.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all ${
                    recipient === opt.value
                      ? 'bg-rose-500 text-white border-rose-500'
                      : 'bg-white text-slate-700 border-slate-300 hover:border-rose-400'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="to-email" className="text-sm font-semibold">
              Recipient email
            </Label>
            <Input
              id="to-email"
              type="email"
              placeholder="name@company.com"
              value={toEmail}
              onChange={(e) => setToEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject" className="text-sm font-semibold">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-semibold">Message</Label>
            <Textarea
              id="message"
              rows={8}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="text-sm font-mono"
            />
            <p className="text-xs text-slate-600">
              You can edit this message before sending. Gmail will let you review it before it goes out.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white"
          >
            <Send className="h-4 w-4 mr-2" />
            Open in Gmail
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}