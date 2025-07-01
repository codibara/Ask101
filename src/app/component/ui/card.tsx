import { ChatLeftText, Eye  } from 'react-bootstrap-icons';
import Pill from './pill';
import { Post } from "@/types/post";

const Card = ({ title, userCategory, body, userId, postDate, commentCount, viewCount, optionA, optionB }: Post) => (
    <div className="flex flex-col bg-dark-900 rounded-xl p-3 gap-5 w-full md:max-w-[48%]">
        <div className="flex flex-col items-start gap-4">
            <div className='w-[100%]'>
                <div>
                    <h1 className="text-xl truncate text-ellipsis overflow-hidden whitespace-nowrap font-semibold mb-1.5">{title}</h1>
                </div>
                <div>
                    <Pill 
                    gender={userCategory.gender}
                    mbti={userCategory.mbti}
                    age={userCategory.age}
                    occupation={userCategory.occupation}
                    />
                </div>
            </div>
            <div className='w-[80%]'>
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
    </div>
);

export default Card;