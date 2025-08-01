import { Post } from "@/types/post";

export const posts: Post[] = [
  {
    postId: 1,
    title: "아르바이트생인데 사장이 자꾸 카톡해요",
    body: "며칠 전부터 계속 고민하고 있는 게 있어요. 저는 지금 알바를 하고 있는 중인데, 사장님이 자꾸 개인적인 카톡을 보내세요. 처음에는 업무 관련 이야기였는데, 점점 일 외적인 이야기를 자주 보내시고, 새벽에도 카톡이 와요. 단순한 안부 인사부터 요즘 뭐 하냐, 밥은 먹었냐는 얘기까지. 계속 이런 연락을 받다 보니 불편하고 부담스러워서 출근이 스트레스입니다.",
    userId: "user4",
    postDate: "2025-04-21",
    commentCount: 18,
    viewCount: 113,
    optionA: "퇴사한다",
    optionB: "말 안 한다"
  },
  {
    postId: 2,
    title: "자취방 윗집이 새벽마다 청소기 돌려요",
    body: "최근에 자취를 시작한 1인입니다. 그런데 윗집에서 매일 밤 2시쯤 청소기 소리가 납니다. 처음엔 착각인가 싶었는데, 몇 주째 계속 같은 시간에 반복되다 보니 이제는 확실합니다. 귀마개도 써보고, 음악도 틀어봤지만 효과가 없습니다. 이대로 참는 게 맞는지 고민이 많습니다.",
    userId: "user5",
    postDate: "2025-04-20",
    commentCount: 15,
    viewCount: 70,
    optionA: "참는다",
    optionB: "포기한다"
  },
  {
    postId: 3,
    title: "헤어진 남친이 친구한테 연락했대요",
    body: "최근에 연애를 끝낸 후 친구들과 더 자주 연락하며 지내고 있는데, 그중 한 명이 갑자기 너무 자주 연락을 합니다. 처음엔 위로해주는 거라 생각했는데, 점점 사적인 감정이 있는 것 같다는 느낌이 들어요. 저는 아직 마음의 정리가 안 됐고, 그 친구에게 감정은 없어요. 관계가 어색해질까봐 거리를 두기도 어렵고요. 이런 상황에서 어떻게 말해야 할지 모르겠습니다.",
    userId: "user6",
    postDate: "2025-04-19",
    commentCount: 17,
    viewCount: 207,
    optionA: "부모님 선물",
    optionB: "말 안 한다"
  },
  {
    postId: 4,
    title: "요즘 자꾸 현실도피만 하게 돼요",
    body: "해야 할 일들이 산더미처럼 쌓여 있는데, 자꾸 현실 도피하게 됩니다. 유튜브나 넷플릭스를 틀고 멍하니 보내는 시간이 많아졌어요. 그러고 나면 죄책감이 몰려오고, 자존감도 떨어집니다. 친구들과의 연락도 줄고, 밖에 나가는 것도 귀찮아졌어요. 이런 내가 너무 나태해진 건 아닐까 싶어서 더 우울해져요.",
    userId: "user7",
    postDate: "2025-04-18",
    commentCount: 7,
    viewCount: 190,
    optionA: "퇴사한다",
    optionB: "말 안 한다"
  },
  {
    postId: 5,
    title: "면접 끝나고 연락 안 오는 건 탈락일까?",
    body: "며칠 전에 중요한 면접을 봤는데 아직까지 연락이 오지 않아요. 회사에선 결과는 개별 연락한다고 했는데, 기다리는 시간이 너무 괴롭습니다. 탈락이라면 빨리 말해줬으면 좋겠고, 가능성이 있다면 희망을 놓고 싶지 않아요. 자꾸 핸드폰만 확인하게 되고 다른 일에 집중이 안 됩니다. 이런 상황 너무 힘들어요.",
    userId: "user8",
    postDate: "2025-04-17",
    commentCount: 7,
    viewCount: 100,
    optionA: "참는다",
    optionB: "그만둔다"
  },
  {
    postId: 6,
    title: "지금 퇴사하면 너무 무책임할까?",
    body: "요즘 회사 생활이 너무 힘듭니다. 매일 야근에 주말 출근까지 이어지니 몸과 마음이 지쳐가요. 계속 이렇게 버티다가는 번아웃이 올 것 같아요. 하지만 내가 그만두면 팀에 피해가 갈 것 같아서 쉽게 결정을 못 하겠어요. 그만두고 쉬고 싶은 마음이 너무 간절합니다.",
    userId: "user9",
    postDate: "2025-04-16",
    commentCount: 20,
    viewCount: 100,
    optionA: "참는다",
    optionB: "그만둔다"
  },
  {
    postId: 7,
    title: "매일 편의점 도시락 먹는 거 괜찮을까요?",
    body: "요즘 식사 준비가 너무 귀찮아서 매일 편의점 도시락으로 끼니를 때우고 있어요. 간편하고 저렴해서 좋긴 한데, 건강에 안 좋을까봐 걱정됩니다. 영양이 부족할까봐 종합 비타민도 먹고 있는데 괜찮은 걸까요? 가끔은 직접 요리해야겠다는 생각도 들지만 실행은 어렵네요. 여러분도 이런 경험 있으신가요?",
    userId: "user10",
    postDate: "2025-04-15",
    commentCount: 16,
    viewCount: 187,
    optionA: "참는다",
    optionB: "내가 사고 싶은 거"
  },
  {
    postId: 8,
    title: "이불 밖은 위험한 계절이 왔다",
    body: "날씨가 추워지면서 밖에 나가기가 너무 싫어요. 집에만 있자니 답답하고, 나가자니 귀찮고. 하루종일 이불 속에서 뒹굴거리다 보면 시간만 허비한 느낌이 듭니다. 그래도 이 시간이 소중하게 느껴지기도 하고, 혼란스럽네요. 이런 계절 여러분은 어떻게 보내시나요?",
    userId: "user1",
    postDate: "2025-04-14",
    commentCount: 14,
    viewCount: 183,
    optionA: "참는다",
    optionB: "손절한다"
  },
  {
    postId: 9,
    title: "소개팅 후 연락 끊김, 이유가 뭘까요?",
    body: "최근에 소개팅을 했는데, 만나고 나서 연락이 끊겼어요. 분위기도 괜찮았고 대화도 잘 통해서 기대했는데, 갑자기 연락이 없어졌습니다. 혹시 내가 뭔가 실수했나 계속 생각하게 되네요. 답답하고 자존감도 떨어져요. 다음부터는 어떻게 행동해야 할지 모르겠어요.",
    userId: "user2",
    postDate: "2025-04-13",
    commentCount: 5,
    viewCount: 139,
    optionA: "기다려본다",
    optionB: "말 안 한다"
  },
  {
    postId: 10,
    title: "카페 알바생인데 손님 때문에 우울해요",
    body: "요즘 카페 알바하면서 유독 까다로운 손님들 때문에 스트레스를 많이 받고 있어요. 음료 하나로 한참을 따지거나, 작은 일에도 큰소리치는 사람들이 종종 있거든요. 매번 웃으며 넘기려 해도 마음이 많이 지칩니다. 알바 끝나면 진이 빠진 느낌이에요. 어떻게 마음을 다잡아야 할까요?",
    userId: "user3",
    postDate: "2025-04-12",
    commentCount: 13,
    viewCount: 60,
    optionA: "부모님 선물",
    optionB: "손절한다"
  }
];
