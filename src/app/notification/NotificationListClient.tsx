'use client';

import { useState } from "react";
import NotificationItem from "../component/ui/notificationItem";
import PageHeader from "@/app/component/shared/pageHeader";

type NotificationType = 'reply_on_post' | 'reply_on_reply' | 'post_ended' | 'post_activity' | 'announcement';

interface Notification {
  id: number;
  type: NotificationType;
  postId?: number;
  announceId?: number;
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

  // Format date to relative time in Korean
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();

    // Reset time to midnight for accurate day comparison
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const notificationDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const diffInMs = today.getTime() - notificationDate.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return '오늘';
    if (diffInDays === 1) return '1일 전';
    if (diffInDays < 30) return `${diffInDays}일 전`;

    // For dates older than 30 days, show the actual date
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
      case 'post_activity':
        return {
          category: '공지',
          title: '게시물이 인기 있어요!',
          content: '작성하신 게시물이 많은 사람들의 공감을 얻고 있어요.',
        };
      case 'announcement':
        return {
          category: '공지',
          title: notification.postTitle,
          content: '새로운 공지사항이 등록되었습니다.',
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
  const handleNotificationClick = async (notificationId: number, announceId?: number) => {
    try {
      // If it's an announcement notification, mark the announcement as read
      if (announceId) {
        await fetch(`/api/announcements/${announceId}/read`, {
          method: 'POST',
        });
      } else {
        // Otherwise mark the regular notification as read
        await fetch(`/api/notifications/${notificationId}/read`, {
          method: 'POST',
        });
      }
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
                  onClick={() => handleNotificationClick(notification.id, notification.announceId)}
                >
                  <NotificationItem
                    postId={notification.postId || 0}
                    announceId={notification.announceId}
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