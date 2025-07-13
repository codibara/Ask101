import { Comment } from "@/types/post";

export const mockComments: Comment[] = [
  {
    commentId: 1,
    postId: 1,
    userId: "user10",
    comment: "와 진짜 대단하다... 나 같으면 신고함. 너무 참은 거 아닌가요?"
  },
  {
    commentId: 2,
    postId: 1,
    userId: "user9",
    comment: "윗집도 힘들겠지만 이건 선 넘은 거지. 매너라는 게 있잖아."
  },
  {
    commentId: 3,
    postId: 2,
    userId: "user7",
    comment: "이런 거 겪어봤는데 진짜 스트레스 장난 아님. 공감해요."
  },
  {
    commentId: 4,
    postId: 2,
    userId: "user2",
    comment: "사람마다 기준 다르지만 새벽 2시는 선 넘었지..."
  },
  {
    commentId: 5,
    postId: 5,
    userId: "user9",
    comment: "그 정도면 관리실에 말해도 돼요. 충분히 이유 있어요."
  },
  {
    commentId: 6,
    postId: 7,
    userId: "user8",
    comment: "처음에는 참고 넘어갔지만 결국 나는 이사했음. 평화가 최고."
  },
  {
    commentId: 7,
    postId: 5,
    userId: "user4",
    comment: "쪽지 써본 적 있는데 효과 있음. 대화 시도 추천해요."
  },
  {
    commentId: 8,
    postId: 4,
    userId: "user10",
    comment: "예전에 비슷한 경험 했는데 결국 윗집이 사과했어요."
  },
  {
    commentId: 9,
    postId: 8,
    userId: "user2",
    comment: "방음 안 되는 집 너무 힘들죠. 이해합니다."
  },
  {
    commentId: 10,
    postId: 9,
    userId: "user5",
    comment: "한 번은 직접 찾아가서 얘기했더니 좀 나아졌어요."
  }
];
