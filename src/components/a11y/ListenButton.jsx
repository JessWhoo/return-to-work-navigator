import React, { useEffect, useState } from 'react';
import { Volume2, Square } from 'lucide-react';

// Floating "Listen" control: reads the visible text of the page's main content
// aloud so users can listen instead of reading.
export default function ListenButton() {
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    // Stop any narration when leaving the page.
    return () => { try { window.speechSynthesis?.cancel(); } catch {} };
  }, []);

  const stop = () => {
    try { window.speechSynthesis?.cancel(); } catch {}
    setSpeaking(false);
  };

  const start = () => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    const main = document.querySelector('main');
    const text = (main?.innerText || '').replace(/\s+/g, ' ').trim();
    if (!text) return;

    synth.cancel();
    // Long pages must be chunked — most browsers truncate very long utterances.
    const chunks = text.match(/[\s\S]{1,220}(?=\s|$)/g) || [text];
    chunks.forEach((chunk, i) => {
      const u = new SpeechSynthesisUtterance(chunk);
      u.rate = 0.95;
      if (i === chunks.length - 1) u.onend = () => setSpeaking(false);
      synth.speak(u);
    });
    setSpeaking(true);
  };

  return (
    <button
      onClick={speaking ? stop : start}
      aria-label={speaking ? 'Stop listening' : 'Listen to this page'}
      className="fixed z-40 right-4 bottom-24 lg:bottom-6 flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-violet-600 to-emerald-600 text-white font-bold shadow-lg hover:opacity-90"
    >
      {speaking ? <Square className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      <span className="text-sm">{speaking ? 'Stop' : 'Listen'}</span>
    </button>
  );
}