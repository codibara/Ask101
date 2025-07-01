import Card from "./component/ui/card";
import LogoMobile from "./component/shared/logoMobile";
import mockPosts from "@/data/mock_posts_full.json";
import { Post } from "@/types/post";

export default function Home() {
  return (
    <div className="h-svh overflow-y-scroll bg-background">
      <main className="px-5 py-5 md:px-20">
      <LogoMobile />
        <div className="max-w-7xl mx-auto flex flex-row flex-wrap gap-4">
        {mockPosts.map((post: Post, index: number ) => (
          <Card
            key={index}
            title={post.title}
            userCategory={post.userCategory}
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
