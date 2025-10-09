'use client';

import Dropdown from '@/app/component/ui/dropdown';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Trash3, Pencil } from 'react-bootstrap-icons';

type PageHeaderProps = {
  onEditClick?: () => void | undefined;
  onDeleteClick?: () => void | undefined;
  isButtonDisabled?: boolean;
  showDropdown?: boolean; 
  title: string;
  showBack?: boolean;
  postId?: number;
};

export default function PageHeader({ onDeleteClick, onEditClick, title, showDropdown = true, showBack = true, isButtonDisabled = false}: PageHeaderProps) {
  const router = useRouter();

  const options = [
    { icon: <Pencil />, label: '수정하기', value: 'edit', disabled: isButtonDisabled  },
    { icon: <Trash3 />, label: '삭제하기', value: 'delete', disabled: isButtonDisabled },
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
    <div className="relative flex flex-row justify-between items-center mb-2">
      <p className='absolute top-1/2 left-1/2 -translate-1/2'>{title}</p>
      <div className='min-w-[40px] h-10 flex flex-row items-center'>
        {showBack && 
          <button 
            onClick={() => {
              window.history.back();
              setTimeout(() => window.location.reload(), 150);
            }}
            className="flex flex-row items-center gap-1 py-1 cursor-pointer hover:bg-">
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
