import NotificationItem from "../component/ui/notificationItem";
import PageHeader from "@/app/component/shared/pageHeader";
import { mockNotifications } from "@/data/mock_notification_data";

export default function NotificationList() {
  return (
    <main className="min-h-svh px-5 py-5 md:px-26">
      <div className="max-w-5xl mx-auto">
        <PageHeader title="알림" showBack={false} showDropdown={false} />
        <div className="flex flex-col gap-4">
        {mockNotifications.map((notification) => (
          <NotificationItem
            key={notification.notiId}
            postId={notification.postId}
            notiId={notification.notiId}
            title={notification.title}
            category={notification.category}
            content={notification.content}
          />
        ))}
        </div>
      </div>
    </main>
  );
}
