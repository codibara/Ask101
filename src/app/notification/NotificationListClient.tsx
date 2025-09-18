'use client';

import { useState } from "react";
import NotificationItem from "../component/ui/notificationItem";
import PageHeader from "@/app/component/shared/pageHeader";

type NotificationType = 'reply_on_post' | 'reply_on_reply' | 'post_ended' | 'post_activity' | 'post_flagged';

interface Notification {
  id: number;
  type: NotificationType;
  postId: number;
  postTitle: string;
  actorName: string;
  isRead: boolean;
  createdAt: string;
}

interface Props {
  notifications: Notification[];
}

export default function NotificationListClient({ notifications }: Props) {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  // Filter notifications based on read status
  const filteredNotifications =
    filter === 'all'
      ? notifications
      : notifications.filter((notification) => !notification.isRead);

  // Format date to relative time
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return '방금 전';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}일 전`;

    return date.toLocaleDateString('ko-KR');
  };

  // Get notification content based on type
  const getNotificationContent = (notification: Notification) => {
    switch (notification.type) {
      case 'reply_on_post':
        return {
          category: '댓글',
          title: '새로운 댓글이 달렸습니다',
          content: `${notification.actorName}님이 당신의 게시물에 댓글을 달렸습니다.`,
        };
      case 'reply_on_reply':
        return {
          category: '답글',
          title: '당신의 댓글에 답글이 달렸습니다',
          content: `${notification.actorName}님이 당신의 댓글에 답글을 달렸습니다.`,
        };
      case 'post_ended':
        return {
          category: '종료',
          title: '투표가 완료되었습니다',
          content: '당신의 게시물 투표가 101표에 도달하여 종료되었습니다.',
        };
      case 'post_flagged':
        return {
          category: '신고',
          title: '게시물이 신고되었습니다',
          content: '작성하신 게시물이 다른 사용자에 의해 신고되었습니다. 관리자 검토 중입니다.',
        };
      case 'post_activity':
        return {
          category: '공지',
          title: '게시물이 인기 있어요!',
          content: '작성하신 게시물이 많은 사람들의 공감을 얻고 있어요.',
        };
      default:
        return {
          category: '알림',
          title: '새로운 알림',
          content: '새로운 알림이 있습니다.',
        };
    }
  };

  // Mark notification as read when clicked
  const handleNotificationClick = async (notificationId: number) => {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST',
      });
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  return (
    <main className="min-h-[calc(100svh-160px)] px-5 pb-[88px] md:px-26 md:py-5">
      <div className="max-w-2xl mx-auto">
        <PageHeader title="알림" showBack={false} showDropdown={false} />
        <div className="w-full flex flex-row items-center justify-center">
          <ul className="flex flex-row bg-dark-900 rounded-full">
            <li
              onClick={() => setFilter('all')}
              className={`cursor-pointer text-[16px] text-center w-[128px] py-2 px-9 rounded-full ${
                filter === 'all' ? 'bg-gray-600' : ''
              }`}
            >
              전체
            </li>
            <li
              onClick={() => setFilter('unread')}
              className={`cursor-pointer text-[16px] text-center w-[128px] py-2 px-9 rounded-full ${
                filter === 'unread' ? 'bg-gray-600' : ''
              }`}
            >
              읽지않음
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-4 py-4">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              {filter === 'unread' ? '읽지 않은 알림이 없습니다' : '알림이 없습니다'}
            </div>
          ) : (
            filteredNotifications.map((notification) => {
              const content = getNotificationContent(notification);
              return (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <NotificationItem
                    postId={notification.postId}
                    notiId={notification.id}
                    title={content.title}
                    category={content.category}
                    content={content.content}
                    date={formatDate(notification.createdAt)}
                    checked={notification.isRead}
                  />
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}