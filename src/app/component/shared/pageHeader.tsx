'use client';

import Dropdown from '@/app/component/ui/dropdown';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Trash3, Pencil } from 'react-bootstrap-icons';

type PageHeaderProps = {
  onDeleteClick?: () => void;
  showDropdown?: boolean; 
  title: string;
  showBack?:boolean
};

export default function PageHeader({ onDeleteClick, title, showDropdown = true, showBack = true }: PageHeaderProps) {
  const router = useRouter();

  const options = [
    { icon: <Pencil />, label: '수정하기', value: 'edit' },
    { icon: <Trash3 />, label: '삭제하기', value: 'delete' },
  ];

  const handleSelect = (value: string) => {
    if (value === 'delete') {
      onDeleteClick?.();
    } else {
      console.log('Selected:', value);
    }
  };

  return (
    <div className="flex flex-row justify-between items-center">
      <div className='h-10'>
        {showBack && <button onClick={() => router.back()} className="flex flex-row items-center gap-1 py-1">
          <ChevronLeft />
          돌아가기
        </button>}
      </div>
      <p>{title}</p>
      <div className='w-10 h-10 flex flex-row items-center justify-center'>
      {showDropdown && (
        <Dropdown options={options} onSelect={handleSelect} />
      )}
      </div>
    </div>
  );
}
