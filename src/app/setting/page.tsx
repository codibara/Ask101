'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { QuestionCircle, BoxArrowRight, CheckCircle, Check } from 'react-bootstrap-icons';

import PageHeader from '@/app/component/shared/pageHeader';
import ConfirmModal from '../component/ui/confirmModal';

export default function Post() {

  const router = useRouter();

  const [selectedGender, setSelectedGender] = useState('');
  const [selectedMBTI, setSelectedMBTI] = useState({
    ei: '',
    sn: '',
    tf: '',
    jp: '',
  });
  const [selectedOccupation, setSelectedOccupation] = useState('');
  const [customOccupation, setCustomOccupation] = useState('');

  const [isModalOpen, setModalOpen] = useState(false);

  const handleSave = () => {
    console.log('Saved!');
    // Add delete API logic here
    setModalOpen(true);


  };

  const handleGenderSelect = (gender: string) => {
    setSelectedGender(prev => (prev === gender ? '' : gender));
  };
  
  const handleMBTISelect = (key: keyof typeof selectedMBTI, value: string) => {
    setSelectedMBTI(prev => ({
      ...prev,
      [key]: prev[key] === value ? '' : value,
    }));
  };
  
  const handleOccupationSelect = (job: string) => {
    setSelectedOccupation(prev => (prev === job ? '' : job));
  };

    return (
      <main className="min-h-svh px-5 py-5 md:px-26">
        <div className='max-w-5xl mx-auto'>
          <PageHeader
            showBack={false} 
            showDropdown={false}
            title='프로필'
            />
          <div className="flex flex-col gap-8">
            {/* Nickname Input */}
            <div className='w-full h-[130px] flex flex-col justify-center items-center gap-4 px-4 py-2 rounded-md bg-dark-900'>
              <input
                id="title"
                type="text"
                className="text-center px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="닉네임을 입력하세요"
              />
              <p className='text-sm'>2025/05/04 가입</p>
            </div>
            
            <div className='flex flex-row gap-2'>
              <Link href='#' className='h-[46px] flex flex-row gap-1 justify-center items-center px-4 py-2 flex-1/2 rounded-xl bg-main text-dark-950'>
                <QuestionCircle /> 
                문의하기 
              </Link>
              <Link href='#' className='h-[46px] flex flex-row gap-1 justify-center items-center px-4 py-2 flex-1/2 rounded-xl bg-main text-dark-950'>
                <BoxArrowRight /> 
                로그아웃 
              </Link>
            </div>
            {/* Gender Inputs */}
            <div>
              <p className="block text-sm font-medium mb-2">
                성별
              </p>
              <div className="flex flex-row gap-2">
                <input
                  type="button"
                  className={`px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500
                    ${selectedGender === '여자' ? 'bg-gray-600' : 'bg-dark-900'}
                  `}
                  name="여자"
                  value="여자"
                  onClick={() => handleGenderSelect('여자')}
                />
                <input
                  type="button"
                  className={`px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500
                    ${selectedGender === '남자' ? 'bg-gray-600' : 'bg-dark-900'}
                  `}
                  name="남자"
                  value="남자"
                  onClick={() => handleGenderSelect('남자')}
                />
              </div>
            </div>
            {/* MBTI Inputs */}
            <div>
              <p className="block text-sm font-medium mb-2">
                MBTI
              </p>
              <div className='flex flex-row gap-2'>
                <div className="flex flex-col gap-2">
                  <input
                    type="button"
                    className={`px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500
                      ${selectedMBTI.ei === 'E'? 'bg-gray-600' : 'bg-dark-900'}
                    `}
                    name="E"
                    value="E 외향"
                    onClick={() => handleMBTISelect('ei', 'E')}
                  />
                  <input
                    type="button"
                    className={`px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500
                      ${selectedMBTI.ei === 'I'? 'bg-gray-600' : 'bg-dark-900'}
                    `}
                    name="I"
                    value="I 내향"
                    onClick={() => handleMBTISelect('ei', 'I')}
                  />
                </div>
                <div className='border border-gray-600'></div>
                <div className="flex flex-col gap-2">
                  <input
                    type="button"
                    className={`px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500
                      ${selectedMBTI.sn === 'S' ? 'bg-gray-600' : 'bg-dark-900'}
                    `}
                    name="S"
                    value="S 감각"
                    onClick={() => handleMBTISelect('sn', 'S')}
                  />
                  <input
                    type="button"
                    className={`px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500
                      ${selectedMBTI.sn === 'N' ? 'bg-gray-600' : 'bg-dark-900'}
                    `}
                    name="N"
                    value="N 직관"
                    onClick={() => handleMBTISelect('sn', 'N')}
                  />
                </div>
                <div className='border border-gray-600'></div>
                <div className="flex flex-col gap-2">
                  <input
                    type="button"
                    className={`px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500
                      ${selectedMBTI.tf === 'T' ? 'bg-gray-600' : 'bg-dark-900'}
                    `}
                    name="T"
                    value="T 사고"
                    onClick={() => handleMBTISelect('tf', 'T')}
                  />
                  <input
                    type="button"
                    className={`px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500
                      ${selectedMBTI.tf === 'F'? 'bg-gray-600' : 'bg-dark-900'}
                    `}
                    name="F"
                    value="F 감정"
                    onClick={() => handleMBTISelect('tf', 'F')}
                  />
                </div>
                <div className='border border-gray-600'></div>
                <div className="flex flex-col gap-2">
                  <input
                    type="button"
                    className={`px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500
                      ${selectedMBTI.jp === 'J' ? 'bg-gray-600' : 'bg-dark-900'}
                    `}
                    name="J"
                    value="J 판단"
                    onClick={() => handleMBTISelect('jp', 'J')}
                  />
                  <input
                    type="button"
                    className={`px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500
                      ${selectedMBTI.jp === 'P' ? 'bg-gray-600' : 'bg-dark-900'}
                    `}
                    name="P"
                    value="P 인식"
                    onClick={() => handleMBTISelect('jp', 'P')}
                  />
                </div>
              </div>
            </div>
            {/* DOB Inputs */}
            <div>
              <p className="block text-sm font-medium mb-2">
                출생연도
              </p>
              <div className='w-32 flex flex-row px-4 py-2 rounded-full bg-dark-900'>
                <input
                    type="text"
                    className='w-full flex focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500 mr-2'
                    name="남자"
                    value=""
                />
                년
              </div>
            </div>
            {/* Occupation Button */}
            <div>
              <p className="block text-sm font-medium mb-2">직업</p>
              <div className="flex flex-row gap-2 flex-wrap">
                {[
                  '중고등학생',
                  '대학/대학원생',
                  '취준생',
                  '직장인',
                  '자영업',
                  '전문직',
                ].map((job) => (
                  <input
                    key={job}
                    type="button"
                    className={`px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      selectedOccupation === job ? 'bg-gray-600' : 'bg-dark-900'
                    }`}
                    value={job}
                    onClick={() =>
                      setSelectedOccupation((prev) => (prev === job ? '' : job))
                    }
                  />
                ))}

                <div className="flex flex-row px-4 py-2 rounded-full bg-dark-900">
                  <input
                    type="text"
                    className="w-full focus:outline-none rounded-md focus:ring-2 focus:ring-blue-500 mr-2"
                    placeholder="기타: 직접입력"
                    value={customOccupation}
                    onChange={(e) => {
                      setCustomOccupation(e.target.value);
                      setSelectedOccupation('기타');
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSave}
              className="bg-main py-4 px-8 rounded-xl font-semibold text-dark-950 md:ml-auto hover:cursor-pointer"
            >
              저장
            </button>
          </div>
        </div>
        <ConfirmModal
          icon={<CheckCircle size={62} color='#B19DFF'/>}
          primaryText='확인'
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={handleSave}
          title=""
          message="저장되었습니다."
        />
      </main>
    );
  }