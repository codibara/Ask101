import Card from "@/app/component/ui/card";
import { posts } from "@/data/mock_posts_full";
import { Post } from "@/types/post";
import PageHeader from "../component/shared/pageHeader";

export default function MyPost() {

  
  return (
    <div className="bg-background">
      <main className="min-h-svh px-5 py-5 md:px-20">
        <div className="max-w-5xl mx-auto">
          <PageHeader title="내 게시물" showBack={false} showDropdown={false} />
          <div className="max-w-5xl mx-auto flex flex-row flex-wrap gap-4 mt-5">
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
        </div>
      </main>
    </div>
  );
}