import { useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';

const STORAGE_KEY_PERMISSION = 'notif_permission_asked';
const STORAGE_KEY_DAILY = 'notif_daily_log_date';
const DAILY_REMINDER_HOUR = 9; // 9 AM local time

function sendNotification(title, body, url) {
  if (Notification.permission !== 'granted') return;
  const n = new Notification(title, {
    body,
    icon: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69406c752de234aafebf891d/433da2071_IMG_1196.png',
    badge: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69406c752de234aafebf891d/433da2071_IMG_1196.png',
    tag: title, // deduplicate same-title notifications
  });
  if (url) {
    n.onclick = () => {
      window.focus();
      window.location.href = url;
    };
  }
}

async function requestPermission() {
  if (!('Notification' in window)) return;
  if (Notification.permission === 'granted') return;
  if (Notification.permission === 'denied') return;
  // Only ask once per session if not yet asked
  if (sessionStorage.getItem(STORAGE_KEY_PERMISSION)) return;
  sessionStorage.setItem(STORAGE_KEY_PERMISSION, '1');
  await Notification.requestPermission();
}

async function checkMeetingReminders() {
  if (Notification.permission !== 'granted') return;
  try {
    const meetings = await base44.entities.MeetingPrep.list('-meeting_date', 50);
    if (!meetings?.length) return;

    const now = new Date();
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    for (const m of meetings) {
      if (!m.meeting_date || m.status === 'completed') continue;

      // meeting_date is a date string "YYYY-MM-DD", treat as local noon
      const meetingDate = new Date(`${m.meeting_date}T12:00:00`);
      if (meetingDate >= now && meetingDate <= in24h) {
        const hoursAway = Math.round((meetingDate - now) / (1000 * 60 * 60));
        const timeLabel = hoursAway <= 1 ? 'within the next hour' : `in about ${hoursAway} hours`;
        sendNotification(
          `📅 Upcoming Meeting: ${m.title}`,
          `Your "${m.title}" meeting is ${timeLabel}. Tap to review your prep notes.`,
          '/MeetingPrep'
        );
      }
    }
  } catch {
    // silently ignore errors — notifications are best-effort
  }
}

function checkDailyLogReminder() {
  if (Notification.permission !== 'granted') return;

  const today = new Date().toDateString();
  const lastSent = localStorage.getItem(STORAGE_KEY_DAILY);
  if (lastSent === today) return; // already sent today

  const now = new Date();
  if (now.getHours() >= DAILY_REMINDER_HOUR) {
    localStorage.setItem(STORAGE_KEY_DAILY, today);
    sendNotification(
      '💚 Daily Check-In Reminder',
      "Don't forget to log your energy levels and any symptoms today. It only takes a moment!",
      '/EnergyManagement'
    );
  }
}

export default function NotificationManager() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    if (!('Notification' in window)) return;

    // Request permission, then run checks
    requestPermission().then(() => {
      checkMeetingReminders();
      checkDailyLogReminder();
    });

    // Re-check meeting reminders every 30 minutes
    const meetingInterval = setInterval(checkMeetingReminders, 30 * 60 * 1000);
    // Re-check daily log reminder every 15 minutes (catches the 9am window)
    const dailyInterval = setInterval(checkDailyLogReminder, 15 * 60 * 1000);

    return () => {
      clearInterval(meetingInterval);
      clearInterval(dailyInterval);
    };
  }, []);

  return null; // purely behavioral, no UI
}