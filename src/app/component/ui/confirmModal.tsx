'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';
import Button from './button';

type ConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  /** Can be async. If it throws or returns false, the modal stays open. */
  onConfirm?: () => void | boolean | Promise<void | boolean>;
  title?: string;
  message?: string | ReactNode;
  icon?: ReactNode;
  primaryText?: string;
  secondaryText?: string;
  /** Close when clicking the dimmed backdrop */
  backdropClosable?: boolean;
  /** Auto close after confirm resolves/returns truthy. Default: true */
  closeOnConfirm?: boolean;
  /** Visual intent hook you can use inside Button */
  variant?: 'primary' | 'secondary' | 'tertiary';
};


export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  icon,
  primaryText,
  secondaryText,
  backdropClosable = true,
  closeOnConfirm = true,
  variant = 'primary',
}: ConfirmModalProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // Mount/unmount effects
  useEffect(() => {
    if (!isOpen) return;

    // Save focus & move focus into the dialog
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const timer = setTimeout(() => {
      (firstFocusableRef.current ?? dialogRef.current)?.focus();
      document.body.style.overflow = 'hidden';
    }, 0);

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
      if (e.key === 'Tab') {
        // Simple focus trap
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKey);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
      previouslyFocused.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!backdropClosable) return;
    if (e.target === e.currentTarget) onClose();
  };

  const handleConfirm = async () => {
    if (!onConfirm) {
      onClose();
      return;
    }
    try {
      setIsConfirming(true);
      const result = await onConfirm();
      const ok = result !== false; // returning false prevents close
      if (ok && closeOnConfirm) onClose();
    } catch {
      // swallow—stay open so you can show a toast/inline error
    } finally {
      setIsConfirming(false);
    }
  };

  const labelId = 'confirm-modal-title';
  const descId = 'confirm-modal-desc';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onMouseDown={handleBackdropClick}
      aria-hidden={false}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
        aria-describedby={descId}
        tabIndex={-1}
        className="flex flex-col items-center bg-dark-950 rounded-2xl w-full max-w-md mx-4 p-2 pt-6 md:pb-6 outline-none"
      >
        {icon}
        <h2 id={labelId} className="text-base font-semibold mt-1 text-center px-4">
          {title}
        </h2>
        <div id={descId} className="mt-1 text-base text-center px-6">
          {message}
        </div>

        <div className="mt-6 flex flex-row gap-2 w-full md:max-w-[280px] px-4">
          {/* Secondary (Cancel) */}
          {secondaryText && 
            <Button
              text={secondaryText}
              onClick={onClose}
              variant="secondary"
              isLink={false}
              disabled={isConfirming}
            />
          }

          {/* Primary (Confirm) */}
          {primaryText && (
            <Button
              text={primaryText}
              variant='primary'
              isLink={false}
              onClick={handleConfirm}
              disabled={isConfirming}
            />
          )}
        </div>
      </div>
    </div>
  );
}