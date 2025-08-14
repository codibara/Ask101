export interface Post {
    postId: number;
    title: string;
    content: string;
    author_id: number;
    commentCount: number;
    viewCount: number;
    option_a: string;
    option_b: string;
    votes_a: number;
    votes_b: number;
    ended_at?: string | Date;
    created_at: string | Date;
    is_end_vote?: boolean | null;
    author: User;
  }

  export interface Comment {
    id: number;
    post_id: number;
    user_id: string;
    reply: string;
    parent_reply_id: string | null;
    is_deleted: boolean;
    created_at: string | Date;
  }

  export interface Reply {
    commentId: number;
    replyId: number;
    userId: string;
    comment: string;
  }

  export interface User{
    userId?: number;
    name?: string;
    email?: string;
    display_name?: string | null;
    birth_year?: number | null;
    sex: string | null;
    mbti: string | null;
    age?: string | null;
    job: string | null;
  }
