import React, { useState } from 'react';
import { Drawer } from 'vaul';
import { Check, ChevronDown } from 'lucide-react';

/**
 * Bottom sheet select control (Vaul-powered) — the app's mobile-native picker.
 * Replaces native <select> elements so Android doesn't render its dark-mode
 * system dropdown over the app's light brand theme.
 *
 * Props:
 *  - value: current value
 *  - onValueChange: (newValue) => void
 *  - options: Array<{ value: string, label: string }>
 *  - placeholder?: string
 *  - title?: string  (sheet header)
 *  - id?: string (associates a <Label htmlFor> with the trigger button)
 *  - ariaLabel?: string (accessible name when no <Label> is wired)
 *  - className?: string (applied to the trigger button)
 *  - disabled?: bool
 *  - triggerLabel?: string (override the displayed value)
 */
export default function BottomSheetSelect({
  value,
  onValueChange,
  options = [],
  placeholder = 'Select…',
  title = 'Select an option',
  id,
  ariaLabel,
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
          id={id}
          disabled={disabled}
          aria-label={ariaLabel ?? title}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={`nv-input w-full flex items-center justify-between px-3 py-2 text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        >
          <span className={selected ? 'text-brand-text font-medium truncate' : 'text-brand-muted-foreground truncate'}>
            {display}
          </span>
          <ChevronDown className="h-4 w-4 text-brand-muted-foreground flex-shrink-0 ml-2" />
        </button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[100]" />
        <Drawer.Content className="bg-brand-surface flex flex-col rounded-t-3xl mt-24 fixed bottom-0 left-0 right-0 z-[101] max-h-[85vh] focus:outline-none border-t border-brand-border">
          <div className="p-4 bg-brand-surface rounded-t-3xl flex-1 overflow-hidden flex flex-col">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-brand-border mb-4" />
            <Drawer.Title className="font-heading text-base font-bold text-brand-text text-center mb-1">
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
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        onValueChange(opt.value);
                        setOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-left transition-colors min-h-11 ${
                        isSelected
                          ? 'bg-brand-pink-soft text-brand-primary font-bold'
                          : 'hover:bg-brand-muted text-brand-text font-medium'
                      }`}
                    >
                      <span className="text-base">{opt.label}</span>
                      {isSelected && <Check className="h-5 w-5 text-brand-primary flex-shrink-0" />}
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