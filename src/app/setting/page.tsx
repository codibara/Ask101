'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { QuestionCircle, BoxArrowRight, CheckCircle, Check, Download, Flag } from 'react-bootstrap-icons';

import PageHeader from '@/app/component/shared/pageHeader';
import ConfirmModal from '../component/ui/confirmModal';
import Button from "@/app/component/ui/button"

export default function Post() {

  const router = useRouter();
  const errorMessage = '사용불가능한 닉네임 입니다.'

  const [userNickName, setUserNickName] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [userBirthYear, setUserBirthYear] = useState('');
  const [selectedMBTI, setSelectedMBTI] = useState({
    ei: '',
    sn: '',
    tf: '',
    jp: '',
  });
  const [selectedOccupation, setSelectedOccupation] = useState('');
  const [customOccupation, setCustomOccupation] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);

  const handleUserNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserNickName(e.target.value);
  };
  
  const handleUserBirthYear = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyNums = e.target.value.replace(/\D/g, '').slice(0, 4);
    setUserBirthYear(onlyNums);
  };

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
  
    return (
      <main className="min-h-[calc(100svh-180px)] md:h-svh  px-5 py-5 md:px-26">
        <div className='max-w-2xl mx-auto'>
          <PageHeader
            showBack={false} 
            showDropdown={false}
            title='프로필'
            />
          <div className="flex flex-col gap-8">
            {/* Nickname Input */}
            <div className='w-full flex flex-col justify-center gap-3'>
              <p className="block text-sm font-medium mb-2">
                닉네임
              </p>
              <input
                id="title"
                type="text"
                className="px-3 py-1 h-12 rounded-md bg-main text-dark-950 focus:outline-none focus:ring-1 focus:ring-main focus:text-main focus:bg-dark-950"
                onChange={handleUserNickname}
                value={userNickName}
                placeholder="닉네임을 입력하세요"
              />
              <div className='flex flex-row justify-between'>
                <p className='text-sm text-red-600'>{errorMessage}</p>
                <p className='text-sm text-right text-gray-600'>2025/05/04 가입</p>
              </div>
            </div>
            
            
            {/* Gender Inputs */}
            <div>
              <p className="block text-sm font-medium mb-2">
                성별
              </p>
              <div className="flex flex-row gap-2">
                <input
                  type="button"
                  className={`px-3 py-1 rounded-full focus:outline-none 
                    ${selectedGender === '여자' ? 'bg-gray-600' : 'bg-dark-900 text-gray-600'}
                  `}
                  name="여자"
                  value="여자"
                  onClick={() => handleGenderSelect('여자')}
                />
                <input
                  type="button"
                  className={`px-3 py-1 rounded-full focus:outline-none 
                    ${selectedGender === '남자' ? 'bg-gray-600' : 'bg-dark-900 text-gray-600'}
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
              <div className='flex flex-row gap-3'>
                <div className="flex flex-col gap-2">
                  <input
                    type="button"
                    className={`px-3 py-1 rounded-full focus:outline-none 
                      ${selectedMBTI.ei === 'E'? 'bg-gray-600' : 'bg-dark-900 text-gray-600'}
                    `}
                    name="E"
                    value="E 외향"
                    onClick={() => handleMBTISelect('ei', 'E')}
                  />
                  <input
                    type="button"
                    className={`px-3 py-1 rounded-full focus:outline-none 
                      ${selectedMBTI.ei === 'I'? 'bg-gray-600' : 'bg-dark-900 text-gray-600'}
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
                    className={`px-3 py-1 rounded-full focus:outline-none 
                      ${selectedMBTI.sn === 'S' ? 'bg-gray-600' : 'bg-dark-900 text-gray-600'}
                    `}
                    name="S"
                    value="S 감각"
                    onClick={() => handleMBTISelect('sn', 'S')}
                  />
                  <input
                    type="button"
                    className={`px-3 py-1 rounded-full focus:outline-none 
                      ${selectedMBTI.sn === 'N' ? 'bg-gray-600' : 'bg-dark-900 text-gray-600'}
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
                    className={`px-3 py-1 rounded-full focus:outline-none 
                      ${selectedMBTI.tf === 'T' ? 'bg-gray-600' : 'bg-dark-900 text-gray-600'}
                    `}
                    name="T"
                    value="T 사고"
                    onClick={() => handleMBTISelect('tf', 'T')}
                  />
                  <input
                    type="button"
                    className={`px-3 py-1 rounded-full focus:outline-none 
                      ${selectedMBTI.tf === 'F'? 'bg-gray-600' : 'bg-dark-900 text-gray-600'}
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
                    className={`px-3 py-1 rounded-full focus:outline-none
                      ${selectedMBTI.jp === 'J' ? 'bg-gray-600' : 'bg-dark-900 text-gray-600'}
                    `}
                    name="J"
                    value="J 판단"
                    onClick={() => handleMBTISelect('jp', 'J')}
                  />
                  <input
                    type="button"
                    className={`px-3 py-1 rounded-full focus:outline-none 
                      ${selectedMBTI.jp === 'P' ? 'bg-gray-600' : 'bg-dark-900 text-gray-600'}
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
              <div className='w-32 relative'>
                <input
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    className='w-full px-3 py-1 focus:outline-none rounded-full bg-dark-900 focus:ring-1 focus:ring-main focus:text-main focus:bg-dark-950 no-spinner'
                    name="출생연도"
                    value={userBirthYear}
                    onChange={handleUserBirthYear}
                />
                <p className='absolute right-3 bottom-1'>년</p>
              </div>
            </div>
            {/* Occupation Button */}
            <div className='flex flex-col gap-3 items-start'>
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
                    className={`px-3 py-1 rounded-full focus:outline-none  ${
                      selectedOccupation === job ? 'bg-gray-600' : 'bg-dark-900 text-gray-600'
                    }`}
                    value={job}
                    onClick={() =>
                      setSelectedOccupation((prev) => (prev === job ? '' : job))
                    }
                  />
                ))}
              </div>

              <input
                type="text"
                className="px-3 py-1 focus:outline-none rounded-full bg-dark-900 focus:ring-1 focus:ring-main focus:text-main focus:bg-dark-950 mr-2"
                placeholder="기타: 직접입력(10자이내)"
                value={customOccupation}
                maxLength={10}
                onChange={(e) => {
                  setCustomOccupation(e.target.value);
                  setSelectedOccupation('기타');
                }}
              />

            </div>

            {/* Submit Button */}
            {/* <button
              onClick={handleSave}
              className="bg-main py-4 px-8 rounded-xl font-semibold text-dark-950 md:ml-auto hover:cursor-pointer"
            >
              저장
            </button> */}
            <div className='w-full flex flex-row gap-2'>
                <Button
                text="로그아웃"
                beforeIcon={ <BoxArrowRight />}
                variant='secondary'
                isLink={true}
                />
                <Button
                  text="저장하기"
                  beforeIcon={<Download />}
                  onClick={handleSave}
                  variant='primary'
                  isLink={true}
                />

            </div>
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