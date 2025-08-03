'use client';

import Dropdown from '@/app/component/ui/dropdown';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Trash3, Pencil } from 'react-bootstrap-icons';

type PageHeaderProps = {
  onEditClick?: () => void;
  onDeleteClick?: () => void;
  showDropdown?: boolean; 
  title: string;
  showBack?:boolean;
  postId?: number;
};

export default function PageHeader({ onDeleteClick, onEditClick, title, postId, showDropdown = true, showBack = true }: PageHeaderProps) {
  const router = useRouter();

  const options = [
    { icon: <Pencil />, label: '수정하기', value: 'edit' },
    { icon: <Trash3 />, label: '삭제하기', value: 'delete' },
  ];

  const handleSelect = (value: string) => {
    if (value === 'delete') {
      onDeleteClick?.();
    } else if(value === 'edit'){
      onEditClick?.();
    }
    else {
      console.log('Selected:', value);
    }
  };

  return (
    <div className="relative flex flex-row justify-between items-center mb-5">
        <p className='absolute top-1/2 left-1/2 -translate-1/2'>{title}</p>
      <div className='min-w-[40px] h-10 flex flex-row items-center'>
        {showBack && <button onClick={() => router.back()} className="flex flex-row items-center gap-1 py-1 cursor-pointer">
          <ChevronLeft />
          돌아가기
        </button>}
      </div>
      <div className='w-10 h-10 flex flex-row items-center justify-center'>
      {showDropdown && (
        <Dropdown options={options} onSelect={handleSelect} />
      )}
      </div>
    </div>
  );
}
