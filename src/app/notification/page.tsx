'use client';

import { useState } from "react";

import NotificationItem from "../component/ui/notificationItem";
import PageHeader from "@/app/component/shared/pageHeader";

import { mockNotifications } from "@/data/mock_notification_data";

export default function NotificationList() {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications =
    filter === 'all'
      ? mockNotifications
      : mockNotifications.filter((notification) => !notification.checked);

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
          {filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification.notiId}
              postId={notification.postId}
              notiId={notification.notiId}
              title={notification.title}
              category={notification.category}
              content={notification.content}
              date={notification.date}
              checked={notification.checked}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
