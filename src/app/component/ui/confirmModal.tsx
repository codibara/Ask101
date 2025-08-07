'use client';

import { useEffect, ReactNode } from 'react';
import Button from './button';

type ConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  icon?: ReactNode;
  primaryText: string;
  secondaryText?: string;
};

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Title Text',
  message = 'Message Text',
  icon,
  primaryText,
  secondaryText
}: ConfirmModalProps) {
  // Close on Esc key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="flex flex-col items-center bg-dark-950 rounded-2xl w-full max-w-md mx-4 p-2 pt-6 md:pb-6">
        {icon}
        <h2 className="text-base font-semibold mt-1">{title}</h2>
        <p className="mt-1 text-base">{message}</p>
        <div className="mt-6 flex flex-row gap-2 w-full md:max-w-[280px]">
          <Button 
            text={secondaryText}
            onClick={onClose}
            variant='secondary'
            isLink={false}
          />
          
          {primaryText && 
           <Button 
            text={primaryText}
            variant='primary'
            isLink={false}
            onClick={() => {
              onConfirm();
              onClose();
            }}
            />
          }
        </div>
      </div>
    </div>
  );
}
