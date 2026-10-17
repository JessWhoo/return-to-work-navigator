// Maps icon STRING names (sent from the server-side premium content module)
// back to lucide-react component references on the client. Only the icon
// names used by the Manager Guide support tips appear here — the icon
// components themselves are not premium content, just the guide text is.
import { Target, CalendarClock, HeartHandshake, MessageCircleHeart, Sliders } from 'lucide-react';

export const ICON_MAP = { Target, CalendarClock, HeartHandshake, MessageCircleHeart, Sliders };