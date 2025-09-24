import { ChatLeftText, Eye  } from 'react-bootstrap-icons';
import Pill from './pill';
import { Post } from "@/types/post";

import Link from 'next/link';

const Card = ({ postId, title, content, is_end_vote, created_at, commentCount, viewCount, option_a, option_b, votes_a, votes_b, author, userVoteChoice }: Post) => {

    const { sex, mbti, age, job, display_name } = author;

    const isAWinning = (votes_a ?? 0) >= (votes_b ?? 0);
    const isBWinning = (votes_b ?? 0) >= (votes_a ?? 0);


    return(
        <Link href={`/post/${postId}`} className="flex flex-col bg-dark-900 rounded-xl p-3 gap-5 w-full border border-dark-900 hover:bg-neutral-800 active:bg-neutral-700">
        
        <div className="flex flex-col gap-4">
            <div className='w-[100%]'>
                <div>
                    <h1 className="text-xl truncate text-ellipsis overflow-hidden whitespace-nowrap font-semibold mb-2">
                        {is_end_vote && <span className="text-xs py-1 px-2 text-dark-950 bg-main rounded-sm mr-2 align-middle">투표종료</span>}
                        {title}
                    </h1>
                </div>
                <div>
                    <Pill 
                        sex={sex}
                        mbti={mbti}
                        age={age}
                        job={job}
                    />
                </div>
            </div>
            {content && 
                <div className='w-[100%] flex flex-row items-center'>
                    <p className="text-sm truncate text-ellipsis overflow-hidden whitespace-nowrap">{content}</p>
                </div>
            }
        </div>
        <div className="flex flex-row justify-center gap-4">
            <div className={`flex flex-col justify-center items-center w-full max-w-[290px] p-5 border-2 ${userVoteChoice == 'A' ? 'border-white' : 'border-transparent '} ${isAWinning ? 'bg-main' : 'bg-main-shade'} rounded-[10px] cursor-pointer`}>
                <p className="text-[64px] text-dark-950 font-semibold leading-16 ">{votes_a}</p>
                <p className="text-xs text-dark-950">{option_a}</p>
            </div>
            <div className={`flex flex-col justify-center items-center w-full max-w-[290px] p-5 border-2 ${userVoteChoice == 'B' ? 'border-white' : 'border-transparent '} ${isBWinning ? 'bg-main' : 'bg-main-shade'} rounded-[10px] cursor-pointer`}>
                <p className="text-[64px] text-dark-950 font-semibold leading-16">{votes_b}</p>
                <p className="text-xs text-dark-950">{option_b}</p>
            </div>
        </div>
        <div className="flex flex-row justify-between">
            <div className="flex flex-row gap-2">
                <p className="text-sm font-medium">{display_name}</p>
                <p className="text-sm font-medium">
            {created_at instanceof Date ? created_at.toLocaleDateString() : String(created_at)}
          </p>
            </div>
            <div className="flex flex-row gap-2">
                <div className="flex flex-row items-center gap-1">
                    <ChatLeftText size={16} />
                    <p className="text-xs font-medium">{commentCount}</p>
                </div>
                <div className="flex flex-row items-center gap-1">
                    <Eye size={16} />
                    <p className="text-xs font-medium">{viewCount}</p>
                </div>
            </div>
        </div>
    </Link>
    )
    
    
};

export default Card;