import { getAnnounceById } from "@/lib/announceService";
import PageHeader from '@/app/component/shared/pageHeader';

export default async function PostDetail({
  params,
}: {
  params: Promise<{ announceId: string }>;
}) {
  // ✅ Await params
  const { announceId } = await params;
  const announce = await getAnnounceById(parseInt(announceId, 10));

  if (!announce) {
    return <div className="p-10 text-red-500">Post not found</div>;
  }

  const { title, content, date } = announce;

  return (
    <main className="min-h-[calc(100svh-160px)] px-5 pb-[88px] md:px-26 md:py-5">
      <div className="max-w-2xl mx-auto">
        <PageHeader title="공지" showDropdown={false} />
        <div className="flex flex-col items-start gap-4 my-5">
          <div className="w-full">
            <h1 className="text-2xl font-bold mb-1.5">{title}</h1>
            <p className="text-sm">{date}</p>
          </div>
          <p className="text-base">{content}</p>
        </div>
      </div>
    </main>
  );
}
