import { Notification } from "@/types/notification";
import Link from 'next/link';

const NotificationItem = ({ postId, notiId, title, content, category, date, checked }: Notification) => {
    const isNotice = category === "공지";

    return (
        <div className="flex flex-col gap-4">
            <Link href={`/post/${postId}`} className={`${checked ? "opacity-50" : ""} flex flex-col items-start w-full gap-1 ${isNotice ? 'bg-main' : 'bg-dark-900'} rounded-xl p-5`}>
                <div className="w-full flex flex-row justify-between">
                    <div className={`${isNotice ? 'bg-dark-950 text-main' : ' text-main border border-main'} rounded-full py-0.5 px-6 text-[10px]`}>
                        {category}
                    </div>
                    <p className={`text-[10px]  ${isNotice ? 'text-dark-950' : ''}`}>{date}</p>
                </div>
                <div className="w-11/12">
                    <p className={`text-xl truncate text-ellipsis overflow-hidden whitespace-nowrap ${isNotice ? 'text-dark-950' : ''}`}>{title}</p>
                </div>
                <div className="w-11/12">
                {content && <p className={`text-xs truncate text-ellipsis overflow-hidden whitespace-nowrap ${isNotice ? 'text-dark-950' : 'text-gray-600'}`}>{content}</p>}</div>
                
            </Link>
        </div>
    );
};


export default NotificationItem;