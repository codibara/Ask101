export interface Post {
    title: string;
    userCategory: UserCategory;
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