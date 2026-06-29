import React, { useState } from 'react';
import { Drawer } from 'vaul';
import { Check, ChevronDown } from 'lucide-react';

/**
 * iOS-style bottom sheet select control (Vaul-powered).
 *
 * Props:
 *  - value: current value
 *  - onValueChange: (newValue) => void
 *  - options: Array<{ value: string, label: string }>
 *  - placeholder?: string
 *  - title?: string  (sheet header)
 *  - className?: string (applied to the trigger button)
 *  - disabled?: bool
 */
export default function BottomSheetSelect({
  value,
  onValueChange,
  options = [],
  placeholder = 'Select…',
  title = 'Select an option',
  className = '',
  disabled = false,
  triggerLabel,
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);
  const display = triggerLabel ?? selected?.label ?? placeholder;

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={`w-full flex items-center justify-between px-3 py-2 text-sm border-2 border-slate-300 rounded-lg bg-white text-slate-800 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        >
          <span className={selected ? 'font-medium' : 'text-slate-500'}>{display}</span>
          <ChevronDown className="h-4 w-4 text-slate-500 flex-shrink-0 ml-2" />
        </button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[100]" />
        <Drawer.Content className="bg-white flex flex-col rounded-t-2xl mt-24 fixed bottom-0 left-0 right-0 z-[101] max-h-[85vh] focus:outline-none">
          <div className="p-4 bg-white rounded-t-2xl flex-1 overflow-hidden flex flex-col">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-slate-300 mb-4" />
            <Drawer.Title className="text-base font-extrabold text-slate-900 text-center mb-1">
              {title}
            </Drawer.Title>
            <Drawer.Description className="sr-only">
              Choose one of the available options.
            </Drawer.Description>
            <div
              className="overflow-y-auto -mx-4 px-4 mt-3"
              style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
            >
              <div className="space-y-1">
                {options.map((opt) => {
                  const isSelected = opt.value === value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        onValueChange(opt.value);
                        setOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-left transition-colors ${
                        isSelected
                          ? 'bg-indigo-50 text-indigo-900 font-bold'
                          : 'hover:bg-slate-100 text-slate-800 font-medium'
                      }`}
                    >
                      <span className="text-base">{opt.label}</span>
                      {isSelected && <Check className="h-5 w-5 text-indigo-600 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}