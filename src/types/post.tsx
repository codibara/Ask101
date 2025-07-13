export interface Post {
    postId: number;
    title: string;
    body: string;
    userId: string;
    postDate: string;
    commentCount: number;
    viewCount: number;
    optionA: string;
    optionB: string;
  }
  
  export interface UserCategory {
    gender: string;
    mbti: string;
    age: string;
    occupation: string;
  }

  export interface Comment {
    commentId: number;
    postId: number;
    userId: string;
    comment: string;
  }

  export interface Reply {
    commentId: number;
    replyId: number;
    userId: string;
    comment: string;
  }

  export interface User{
    userId: string;
    userCategory: UserCategory;
  }
