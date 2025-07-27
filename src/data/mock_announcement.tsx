import { Announcement } from '@/types/announcement';

export const mockAnouncement: Announcement[] = [
  {
    announceId: 1,
    title: '새로운 댓글이 달렸습니다',
    content: '당신의 게시물에 새로운 댓글이 달렸습니다. 확인해보세요.',
    date: '2025-07-25',
    commentCount: 2,
    viewCount: 2
  },
  {
    announceId: 2,
    title: '게시물이 인기 있어요!',
    content: '작성하신 게시물이 많은 사람들의 공감을 얻고 있어요.',
    date: '2025-07-22',
    commentCount: 2,
    viewCount: 2
  },
];
