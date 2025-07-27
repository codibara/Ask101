import { ChatLeftText, Eye  } from 'react-bootstrap-icons';
import Pill from './pill';
import { Post } from "@/types/post";
import { mockUsers } from "@/data/mock_user_data";

import Link from 'next/link';


const Card = ({ postId, title, body, userId, postDate, commentCount, viewCount, optionA, optionB }: Post) => {
    const user = mockUsers.find((u) => u.userId === userId);
    if (!user) return null;

    const { gender, mbti, age, occupation } = user.userCategory;

    return(
        <Link href={`/post/${postId}`} className="flex flex-col bg-dark-900 rounded-xl p-3 gap-5 w-full md:max-w-[48%] border border-dark-900 hover:bg-neutral-800 active:bg-neutral-700">
        
        <div className="flex flex-col items-start gap-4">
            <div className='w-[100%]'>
                <div>
                    <h1 className="text-xl truncate text-ellipsis overflow-hidden whitespace-nowrap font-semibold mb-1.5">{title}</h1>
                </div>
                <div>
                    <Pill 
                    gender={gender}
                    mbti={mbti}
                    age={age}
                    occupation={occupation}
                    />
                </div>
            </div>
            <div className='w-[100%] flex flex-row items-center'>
                <p className="text-sm truncate text-ellipsis overflow-hidden whitespace-nowrap">{body}</p>
            </div>
        </div>
        <div className="flex flex-row justify-center gap-4">
            <div className="flex flex-col justify-center items-center w-full max-w-[290px] p-5 bg-main rounded-[10px]">
                <p className="text-[64px] text-dark-950 font-semibold leading-16 ">71</p>
                <p className="text-xs text-dark-950">{optionA}</p>
            </div>
            <div className="flex flex-col justify-center items-center w-full max-w-[290px] p-5 bg-main/50 rounded-[10px]">
                <p className="text-[64px] text-dark-950 font-semibold leading-16">28</p>
                <p className="text-xs text-dark-950">{optionB}</p>
            </div>
        </div>
        <div className="flex flex-row justify-between">
            <div className="flex flex-row gap-2">
                <p className="text-sm font-medium">{userId}</p>
                <p className="text-sm font-medium">{postDate}</p>
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