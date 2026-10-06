import { useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';

export default function GoogleAdsSignupTracking() {
    const { user } = useAuth();
    useEffect(() => {
        if (typeof window === 'undefined' || !user || !user.id) return;
        // brand-new signup, not a returning login: created_date within the
        // delayed OTP/resend window (Google/social signups are near-instant)
        const createdDate = String(user.created_date || '');
        const createdDateUtc = /(?:Z|[+-]\d{2}:?\d{2})$/.test(createdDate)
            ? createdDate
            : createdDate + 'Z';
        const createdAtMs = Date.parse(createdDateUtc);
        const isNewSignup = Number.isFinite(createdAtMs) &&
            Date.now() - createdAtMs < 24 * 60 * 60 * 1000;
        const key = '_aw_signup_fired_AW-18498327009/S70UCKihzJMdEOGj2PRE_' + user.id;
        if (!isNewSignup || localStorage.getItem(key)) return;
        // gtag may not exist yet (an older useEffect bootstrap runs after
        // this child effect), so retry briefly rather than skipping for good
        let tries = 0;
        const fire = () => {
            if (!window.gtag) { if (tries++ < 20) setTimeout(fire, 250); return; }
            // re-check inside the callback: a remount can start a second
            // retry loop that also passed the guard before gtag existed
            if (localStorage.getItem(key)) return;
            localStorage.setItem(key, '1');
            window.gtag('event', 'conversion', {
                send_to: 'AW-18498327009/S70UCKihzJMdEOGj2PRE',
                transaction_id: user.id,
            });
        };
        fire();
    }, [user]);
    return null;
}