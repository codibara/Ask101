import Card from "./component/ui/card";
import { posts } from "@/data/mock_posts_full";
import { Post } from "@/types/post";

export default function Home() {

  return (
    <div className="bg-background">
      <main className="px-5 py-5 md:px-26">
        <div className="w-full flex flex-row items-center justify-center mb-5">
          <ul className="flex flex-row bg-dark-900 rounded-full">
            <li className="text-[16px] py-2 px-9 bg-gray-600 rounded-full">진행중</li>
            <li className="text-[16px] py-2 px-9">참여중</li>
            <li className="text-[16px] py-2 px-9">완료됨</li>
          </ul>
        </div>
        <div className="max-w-2xl mx-auto flex flex-row flex-wrap gap-4">
        {posts.map((post: Post, index: number ) => (
          <Card
            key={index}
            postId={post.postId}
            title={post.title}
            body={post.body}
            userId={post.userId}
            postDate={post.postDate}
            commentCount={post.commentCount}
            viewCount={post.viewCount}
            optionA={post.optionA}
            optionB={post.optionB}
          />
        ))}
        </div>
      </main>
    </div>
  );
}
