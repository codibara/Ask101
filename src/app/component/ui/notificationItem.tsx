import { Notification } from "@/types/notification";
import Link from 'next/link';

const NotificationItem = ({ postId, notiId, title, content, category }: Notification) => {
    return (
        <div className="flex flex-col gap-4">
            <Link href={`/post/${postId}`} className="flex flex-col items-start w-full gap-1 bg-dark-900 rounded-xl p-3">
                <div className="bg-main rounded-full py-1 px-3 text-[10px] text-dark-950">{category}</div>
                <p>{title}</p>
                {content && <p className="text-sm text-gray-600">{content}</p>}
            </Link>
        </div>
    )

}

export default NotificationItem;