'use client';

import { useEffect } from 'react';

import { ExclamationTriangle } from 'react-bootstrap-icons';

type ConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
};

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = '투표가 진행중일 땐 삭제가 불가합니다.',
  message = '투표가 진행중일 땐 삭제가 불가합니다.',
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
      <div className="flex flex-col items-center bg-dark-950 rounded-2xl w-full max-w-md mx-4 p-2 pt-6">
        <ExclamationTriangle size={62} color='#B19DFF'/>
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="mt-2 text-base">{message}</p>
        <div className="mt-6 flex flex-row gap-2 w-full">
          <button
            onClick={onClose}
            className="px-4 py-2 flex-1/2 rounded-xl bg-dark-900"
          >
            닫기
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 flex-1/2 rounded-xl border border-gray-400"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
